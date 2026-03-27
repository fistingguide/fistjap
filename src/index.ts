import {
	renderAdminPage,
	renderDashboardPage,
	renderLeaderboardPage,
	type ProfileRecord,
} from "./renderHtml";
import { seedProfiles } from "./seedProfiles";
import { EmailMessage } from "cloudflare:email";

type RuntimeEnv = Env & {
	ADMIN_NOTIFICATION_EMAIL?: string;
	ADMIN_NOTIFICATION_FROM?: string;
	SEND_EMAIL?: SendEmail;
};

type GeoSuggestion = {
	label: string;
	country: string;
	city?: string;
};

type ProfilePayload = {
	name?: unknown;
	handle?: unknown;
	bio?: unknown;
	profileUrl?: unknown;
	avatar?: unknown;
	sexualOrientation?: unknown;
	followersCount?: unknown;
	country?: unknown;
	city?: unknown;
};

function toText(value: unknown, fallback = ""): string {
	return typeof value === "string" ? value.trim() : fallback;
}

function toFollowers(value: unknown): number {
	const parsed = Number(value);
	if (!Number.isFinite(parsed) || parsed < 0) {
		return 20;
	}
	return Math.floor(parsed);
}

function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"content-type": "application/json; charset=UTF-8",
		},
	});
}

function badRequest(message: string): Response {
	return new Response(message, { status: 400 });
}

async function queryGeoSuggestions(
	type: "country" | "city",
	keyword: string,
	countryHint: string,
): Promise<GeoSuggestion[]> {
	if (!keyword.trim()) {
		return [];
	}

	const query = type === "city" && countryHint.trim() ? `${keyword}, ${countryHint}` : keyword;
	const params = new URLSearchParams({
		format: "jsonv2",
		addressdetails: "1",
		limit: type === "country" ? "8" : "10",
		q: query,
	});
	if (type === "country") {
		params.set("featuretype", "country");
	}

	const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
		headers: {
			"accept-language": "en",
		},
	});
	if (!res.ok) {
		return [];
	}

	const raw = (await res.json()) as Array<{
		display_name?: string;
		address?: Record<string, string | undefined>;
	}>;

	if (type === "country") {
		const dedup = new Map<string, GeoSuggestion>();
		for (const item of raw ?? []) {
			const country = item.address?.country?.trim() ?? "";
			if (!country || dedup.has(country.toLowerCase())) continue;
			dedup.set(country.toLowerCase(), {
				country,
				label: item.display_name?.trim() || country,
			});
		}
		return Array.from(dedup.values());
	}

	const dedup = new Map<string, GeoSuggestion>();
	for (const item of raw ?? []) {
		const city =
			item.address?.city?.trim() ||
			item.address?.town?.trim() ||
			item.address?.village?.trim() ||
			item.address?.municipality?.trim() ||
			item.address?.county?.trim() ||
			"";
		const country = item.address?.country?.trim() ?? "";
		if (!city) continue;
		const key = `${city}|${country}`.toLowerCase();
		if (dedup.has(key)) continue;
		dedup.set(key, {
			city,
			country,
			label: country ? `${city}, ${country}` : city,
		});
	}
	return Array.from(dedup.values());
}

async function ensureSeeded(db: D1Database): Promise<void> {
	const row = await db.prepare("SELECT COUNT(*) AS total FROM profiles").first<{ total: number | string }>();
	const total = Number(row?.total ?? 0);
	if (total > 0) {
		return;
	}

	const statements = seedProfiles
		.filter((item) => item.handle.trim().length > 0)
		.map((item) =>
			db
				.prepare(
					`INSERT OR IGNORE INTO profiles (
						name, handle, bio, profile_url, avatar, sexual_orientation, followers_count, country, city
					) VALUES (?, ?, ?, ?, ?, 'Gay', 20, 'Japan', 'Tokyo')`,
				)
				.bind(item.name, item.handle, item.bio, item.profileUrl, item.avatar),
		);

	if (statements.length > 0) {
		await db.batch(statements);
	}
}

async function queryProfiles(
	db: D1Database,
	params: {
		keyword?: string;
		country?: string;
		handle?: string;
	},
): Promise<ProfileRecord[]> {
	const conditions: string[] = [];
	const binds: string[] = [];
	const keyword = params.keyword?.trim() ?? "";
	const country = params.country?.trim() ?? "";
	const handle = params.handle?.trim() ?? "";

	if (keyword) {
		const like = `%${keyword}%`;
		conditions.push("(name LIKE ? OR handle LIKE ? OR bio LIKE ?)");
		binds.push(like, like, like);
	}

	if (country) {
		conditions.push("country = ?");
		binds.push(country);
	}

	if (handle) {
		conditions.push("handle = ?");
		binds.push(handle);
	}

	const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
	const sql = `
		SELECT id, name, handle, bio, profile_url, avatar, sexual_orientation, followers_count, country, city, created_at
		FROM profiles
		${whereClause}
		ORDER BY followers_count DESC, id ASC
	`;
	const stmt = binds.length > 0 ? db.prepare(sql).bind(...binds) : db.prepare(sql);
	const { results } = await stmt.all<ProfileRecord>();
	return results ?? [];
}

async function queryCountries(db: D1Database): Promise<string[]> {
	const { results } = await db
		.prepare(
			`SELECT DISTINCT country
			 FROM profiles
			 WHERE country IS NOT NULL AND TRIM(country) <> ''
			 ORDER BY country ASC`,
		)
		.all<{ country: string }>();
	return (results ?? []).map((item) => item.country);
}

function formatOperationSummary(action: "CREATE" | "UPDATE" | "DELETE", row: Record<string, unknown>): string {
	return [
		`Action: ${action}`,
		`ID: ${String(row.id ?? "")}`,
		`Name: ${String(row.name ?? "")}`,
		`Handle: ${String(row.handle ?? "")}`,
		`Country: ${String(row.country ?? "")}`,
		`City: ${String(row.city ?? "")}`,
		`Fans: ${String(row.followers_count ?? "")}`,
		`Time: ${new Date().toISOString()}`,
	].join("\n");
}

async function sendAdminNotification(
	env: RuntimeEnv,
	action: "CREATE" | "UPDATE" | "DELETE",
	row: Record<string, unknown>,
): Promise<void> {
	if (!env.SEND_EMAIL) {
		return;
	}

	const to = (env.ADMIN_NOTIFICATION_EMAIL || "fistingguide@proton.me").trim();
	if (!to) {
		return;
	}

	const from = (env.ADMIN_NOTIFICATION_FROM || "noreply@notice.local").trim();
	const subject = `[Admin Notice] ${action} profile #${String(row.id ?? "")}`;
	const body = [
		`Subject: ${subject}`,
		"Content-Type: text/plain; charset=UTF-8",
		"",
		formatOperationSummary(action, row),
	].join("\n");

	try {
		await env.SEND_EMAIL.send(new EmailMessage(from, to, body));
	} catch (error) {
		console.error("send admin notification failed", error);
	}
}

function normalizePayload(payload: ProfilePayload) {
	const handle = toText(payload.handle);
	if (!handle) {
		throw new Error("handle is required");
	}

	return {
		name: toText(payload.name),
		handle,
		bio: toText(payload.bio),
		profileUrl: toText(payload.profileUrl),
		avatar: toText(payload.avatar),
		sexualOrientation: toText(payload.sexualOrientation, "Gay") || "Gay",
		followersCount: toFollowers(payload.followersCount),
		country: toText(payload.country, "Japan") || "Japan",
		city: toText(payload.city, "Tokyo") || "Tokyo",
	};
}

async function parsePayload(request: Request): Promise<ProfilePayload> {
	try {
		return (await request.json()) as ProfilePayload;
	} catch {
		throw new Error("invalid json");
	}
}

export default {
	async fetch(request, env: RuntimeEnv) {
		const url = new URL(request.url);
		const { pathname } = url;
		const method = request.method.toUpperCase();
		const idMatch = pathname.match(/^\/api\/profiles\/(\d+)$/);

		if (pathname === "/" || pathname === "/admin" || pathname === "/dashboard" || pathname.startsWith("/api/profiles")) {
			await ensureSeeded(env.DB);
		}

		if (method === "GET" && pathname === "/") {
			const rows = await queryProfiles(env.DB, {});
			return new Response(renderLeaderboardPage(rows), {
				headers: { "content-type": "text/html; charset=UTF-8" },
			});
		}

		if (method === "GET" && pathname === "/admin") {
			return new Response(renderAdminPage(), {
				headers: { "content-type": "text/html; charset=UTF-8" },
			});
		}

		if (method === "GET" && pathname === "/dashboard") {
			return new Response(renderDashboardPage(), {
				headers: { "content-type": "text/html; charset=UTF-8" },
			});
		}

		if (method === "GET" && pathname === "/api/profiles") {
			const keyword = url.searchParams.get("keyword")?.trim() ?? "";
			const country = url.searchParams.get("country")?.trim() ?? "";
			const handle = url.searchParams.get("handle")?.trim() ?? "";
			const rows = await queryProfiles(env.DB, { keyword, country, handle });
			return json({ results: rows });
		}

		if (method === "GET" && pathname === "/api/countries") {
			const countries = await queryCountries(env.DB);
			return json({ results: countries });
		}

		if (method === "GET" && pathname === "/api/geo/suggest") {
			const type = (url.searchParams.get("type") || "").trim();
			const keyword = (url.searchParams.get("q") || "").trim();
			const country = (url.searchParams.get("country") || "").trim();
			if (type !== "country" && type !== "city") {
				return badRequest("type must be country or city");
			}
			const results = await queryGeoSuggestions(type, keyword, country);
			return json({ results });
		}

		if (method === "POST" && pathname === "/api/profiles") {
			let payload: ProfilePayload;
			try {
				payload = await parsePayload(request);
			} catch (error) {
				return badRequest((error as Error).message);
			}

			let input;
			try {
				input = normalizePayload(payload);
			} catch (error) {
				return badRequest((error as Error).message);
			}

			try {
				await env.DB.prepare(
					`INSERT INTO profiles (
						name, handle, bio, profile_url, avatar, sexual_orientation, followers_count, country, city
					) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				)
					.bind(
						input.name,
						input.handle,
						input.bio,
						input.profileUrl,
						input.avatar,
						input.sexualOrientation,
						input.followersCount,
						input.country,
						input.city,
					)
					.run();
			} catch (error) {
				return json({ error: (error as Error).message }, 409);
			}

			const inserted = await env.DB
				.prepare(
					`SELECT id, name, handle, country, city, followers_count
					 FROM profiles
					 WHERE handle = ?`,
				)
				.bind(input.handle)
				.first<Record<string, unknown>>();
			if (inserted) {
				void sendAdminNotification(env, "CREATE", inserted);
			}

			return json({ ok: true }, 201);
		}

		if (idMatch) {
			const id = Number(idMatch[1]);

			if (method === "PUT" || method === "PATCH") {
				let payload: ProfilePayload;
				try {
					payload = await parsePayload(request);
				} catch (error) {
					return badRequest((error as Error).message);
				}

				let input;
				try {
					input = normalizePayload(payload);
				} catch (error) {
					return badRequest((error as Error).message);
				}

				try {
					const result = await env.DB.prepare(
						`UPDATE profiles
						 SET name = ?, handle = ?, bio = ?, profile_url = ?, avatar = ?, sexual_orientation = ?, followers_count = ?, country = ?, city = ?
						 WHERE id = ?`,
					)
						.bind(
							input.name,
							input.handle,
							input.bio,
							input.profileUrl,
							input.avatar,
							input.sexualOrientation,
							input.followersCount,
							input.country,
							input.city,
							id,
						)
						.run();

					if ((result.meta.changes ?? 0) === 0) {
						return json({ error: "not found" }, 404);
					}
				} catch (error) {
					return json({ error: (error as Error).message }, 409);
				}

				const updated = await env.DB
					.prepare(
						`SELECT id, name, handle, country, city, followers_count
						 FROM profiles
						 WHERE id = ?`,
					)
					.bind(id)
					.first<Record<string, unknown>>();
				if (updated) {
					void sendAdminNotification(env, "UPDATE", updated);
				}

				return json({ ok: true });
			}

			if (method === "DELETE") {
				const deletedRow = await env.DB
					.prepare(
						`SELECT id, name, handle, country, city, followers_count
						 FROM profiles
						 WHERE id = ?`,
					)
					.bind(id)
					.first<Record<string, unknown>>();

				const result = await env.DB.prepare("DELETE FROM profiles WHERE id = ?").bind(id).run();
				if ((result.meta.changes ?? 0) === 0) {
					return json({ error: "not found" }, 404);
				}
				if (deletedRow) {
					void sendAdminNotification(env, "DELETE", deletedRow);
				}
				return json({ ok: true });
			}
		}

		return new Response("Not Found", { status: 404 });
	},
} satisfies ExportedHandler<RuntimeEnv>;
