import {
	renderAdminPage,
	renderAboutPage,
	renderDashboardPage,
	renderLeaderboardPage,
	type ProfileRecord,
	renderWikiArticlePage,
	renderWikiPage,
	type WikiArticleRecord,
} from "./renderHtml";
import { seedProfiles } from "./seedProfiles";

type RuntimeEnv = Env & {
	ADMIN_NOTIFICATION_EMAIL?: string;
	RESEND_API_KEY?: string;
	RESEND_FROM?: string;
};

type GeoSuggestion = {
	label: string;
	country: string;
	province?: string;
	city?: string;
	lat?: number;
	lng?: number;
	type?: "country" | "city";
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
	province?: unknown;
	city?: unknown;
};

const DEFAULT_COUNTRY = "Japan";
const DEFAULT_PROVINCE = "Tokyo";
const DEFAULT_CITY = "Itabashi";

type WikiPayload = {
	title?: unknown;
	content?: unknown;
	author?: unknown;
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

const reverseGeoCache = new Map<string, GeoSuggestion | null>();

function reverseCacheKey(lat: number, lng: number): string {
	return `${lat.toFixed(4)}|${lng.toFixed(4)}`;
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function proxyTextAsset(url: string, contentType: string): Promise<Response> {
	const res = await fetch(url, {
		headers: {
			"user-agent": "fistjap-worker/1.0",
		},
	});
	if (!res.ok) {
		return new Response("asset fetch failed", { status: 502 });
	}
	const text = await res.text();
	return new Response(text, {
		headers: {
			"content-type": contentType,
			"cache-control": "public, max-age=86400",
		},
	});
}

function isPostcodeLike(value: string): boolean {
	return /^[0-9]{4,10}$/.test(value.trim());
}

function pickMajorCity(cityRaw: string, displayParts: string[]): string {
	const city = cityRaw.trim();
	if (!city) return "";
	if (!/district/i.test(city)) return city;
	const idx = displayParts.findIndex((part) => part.toLowerCase() === city.toLowerCase());
	if (idx >= 0 && idx + 1 < displayParts.length) {
		const next = displayParts[idx + 1].trim();
		if (next && !isPostcodeLike(next)) return next;
	}
	return city;
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
		lat?: string;
		lon?: string;
	}>;

	if (type === "country") {
		const dedup = new Map<string, GeoSuggestion>();
		for (const item of raw ?? []) {
			const country = item.address?.country?.trim() ?? "";
			if (!country || dedup.has(country.toLowerCase())) continue;
			dedup.set(country.toLowerCase(), {
				country,
				label: item.display_name?.trim() || country,
				lat: Number(item.lat ?? "0") || undefined,
				lng: Number(item.lon ?? "0") || undefined,
				type: "country",
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
		const province =
			item.address?.state?.trim() ||
			item.address?.province?.trim() ||
			item.address?.region?.trim() ||
			"";
		const country = item.address?.country?.trim() ?? "";
		if (!city) continue;
		const key = `${city}|${province}|${country}`.toLowerCase();
		if (dedup.has(key)) continue;
		dedup.set(key, {
			city,
			province,
			country,
			label: [city, province, country].filter(Boolean).join(", "),
			lat: Number(item.lat ?? "0") || undefined,
			lng: Number(item.lon ?? "0") || undefined,
			type: "city",
		});
	}
	return Array.from(dedup.values());
}

async function queryGeoPoint(query: string): Promise<{ lat: number; lon: number } | null> {
	const q = query.trim();
	if (!q) return null;

	if (q.toLowerCase() === "itabashi, tokyo, japan") {
		return { lat: 35.7512, lon: 139.7093 };
	}

	try {
		const params = new URLSearchParams({
			name: q,
			count: "1",
			language: "en",
		});
		const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`);
		if (res.ok) {
			const data = (await res.json()) as { results?: Array<{ latitude?: number; longitude?: number }> };
			const first = Array.isArray(data.results) ? data.results[0] : undefined;
			if (first) {
				const lat = Number(first.latitude);
				const lon = Number(first.longitude);
				if (Number.isFinite(lat) && Number.isFinite(lon)) {
					return { lat, lon };
				}
			}
		}
	} catch {
		// continue fallback
	}

	try {
		const params = new URLSearchParams({
			format: "jsonv2",
			limit: "1",
			q,
		});
		const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
			headers: { "accept-language": "en" },
		});
		if (res.ok) {
			const data = (await res.json()) as Array<{ lat?: string; lon?: string }>;
			const first = Array.isArray(data) && data.length ? data[0] : null;
			if (first) {
				const lat = Number(first.lat);
				const lon = Number(first.lon);
				if (Number.isFinite(lat) && Number.isFinite(lon)) {
					return { lat, lon };
				}
			}
		}
	} catch {
		return null;
	}

	return null;
}

async function queryGeoReverse(lat: number, lng: number): Promise<GeoSuggestion | null> {
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
		return null;
	}

	const key = reverseCacheKey(lat, lng);
	if (reverseGeoCache.has(key)) {
		return reverseGeoCache.get(key) ?? null;
	}

	const params = new URLSearchParams({
		format: "jsonv2",
		addressdetails: "1",
		zoom: "14",
		lat: String(lat),
		lon: String(lng),
	});

	let res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
		headers: {
			"accept-language": "en",
			"user-agent": "fistjap-worker/1.0",
		},
	});
	if (res.status === 429 || res.status === 503) {
		await sleep(700);
		res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
			headers: {
				"accept-language": "en",
				"user-agent": "fistjap-worker/1.0",
			},
		});
	}
	if (!res.ok) {
		reverseGeoCache.set(key, null);
		return null;
	}

	const raw = (await res.json()) as {
		display_name?: string;
		address?: Record<string, string | undefined>;
		error?: string;
	};

	if (raw?.error) {
		reverseGeoCache.set(key, null);
		return null;
	}

	const display = String(raw.display_name ?? "").trim();
	const displayParts = display
		.split(",")
		.map((part) => part.trim())
		.filter(Boolean);

	const country = raw.address?.country?.trim() || displayParts[displayParts.length - 1] || "";
	const province =
		raw.address?.state?.trim() ||
		raw.address?.province?.trim() ||
		raw.address?.region?.trim() ||
		raw.address?.state_district?.trim() ||
		"";
	const cityBase =
		raw.address?.city?.trim() ||
		raw.address?.town?.trim() ||
		raw.address?.village?.trim() ||
		raw.address?.municipality?.trim() ||
		raw.address?.hamlet?.trim() ||
		raw.address?.suburb?.trim() ||
		raw.address?.city_district?.trim() ||
		raw.address?.district?.trim() ||
		raw.address?.locality?.trim() ||
		displayParts[0] ||
		"";
	const county = raw.address?.county?.trim() || "";
	const cityRaw = county && cityBase && /city$/i.test(cityBase) && county.toLowerCase() !== cityBase.toLowerCase() ? county : cityBase || county;
	const city = pickMajorCity(cityRaw, displayParts);
	if (!country && !province && !city) {
		reverseGeoCache.set(key, null);
		return null;
	}

	const result: GeoSuggestion = {
		country: country || "Unknown",
		province: province || "Unknown",
		city,
		label: raw.display_name?.trim() || [city, province, country].filter(Boolean).join(", "),
		lat,
		lng,
		type: city ? "city" : "country",
	};
	reverseGeoCache.set(key, result);
	return result;
}

async function queryGeoReverseFallback(lat: number, lng: number): Promise<GeoSuggestion | null> {
	try {
		const params = new URLSearchParams({
			latitude: String(lat),
			longitude: String(lng),
			language: "en",
			count: "1",
		});
		const res = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?${params.toString()}`);
		if (!res.ok) return null;

		const raw = (await res.json()) as {
			results?: Array<{
				name?: string;
				admin1?: string;
				country?: string;
			}>;
		};
		const item = Array.isArray(raw.results) ? raw.results[0] : undefined;
		if (!item) return null;

		const country = String(item.country ?? "").trim();
		const province = String(item.admin1 ?? "").trim();
		const city = String(item.name ?? item.admin1 ?? "").trim();
		if (country || city) {
			return {
				country: country || "Unknown",
				province: province || "Unknown",
				city,
				label: [city, province, country].filter(Boolean).join(", "),
				lat,
				lng,
				type: city ? "city" : "country",
			};
		}
	} catch {
		// try next fallback
	}

	try {
		const params = new URLSearchParams({
			latitude: String(lat),
			longitude: String(lng),
			localityLanguage: "en",
		});
		const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?${params.toString()}`);
		if (!res.ok) return null;

		const raw = (await res.json()) as {
			countryName?: string;
			city?: string;
			locality?: string;
			principalSubdivision?: string;
		};
		const country = String(raw.countryName ?? "").trim();
		const province = String(raw.principalSubdivision ?? "").trim();
		const city =
			String(raw.city ?? "").trim() ||
			String(raw.locality ?? "").trim() ||
			String(raw.principalSubdivision ?? "").trim();
		if (!country && !city) return null;

		return {
			country: country || "Unknown",
			province: province || "Unknown",
			city,
			label: [city, province, country].filter(Boolean).join(", "),
			lat,
			lng,
			type: city ? "city" : "country",
		};
	} catch {
		return null;
	}
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
						name, handle, bio, profile_url, avatar, sexual_orientation, followers_count, country, province, city
					) VALUES (?, ?, ?, ?, ?, 'Gay', 20, ?, ?, ?)`,
				)
				.bind(item.name, item.handle, item.bio, item.profileUrl, item.avatar, DEFAULT_COUNTRY, DEFAULT_PROVINCE, DEFAULT_CITY),
		);

	if (statements.length > 0) {
		await db.batch(statements);
	}
}

async function ensureWikiSeeded(db: D1Database): Promise<void> {
	try {
		const row = await db.prepare("SELECT COUNT(*) AS total FROM wiki_articles").first<{ total: number | string }>();
		const total = Number(row?.total ?? 0);
		if (total > 0) {
			return;
		}

		await db
			.batch([
				db.prepare("INSERT INTO wiki_articles (title, content, author) VALUES (?, ?, ?)").bind("For Test 1", "for test", "fistingguide"),
				db.prepare("INSERT INTO wiki_articles (title, content, author) VALUES (?, ?, ?)").bind("For Test 2", "for test", "fistingguide"),
				db.prepare("INSERT INTO wiki_articles (title, content, author) VALUES (?, ?, ?)").bind("For Test 3", "for test", "fistingguide"),
			]);
	} catch (error) {
		console.warn("wiki seed skipped", error);
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
		SELECT id, name, handle, bio, profile_url, avatar, sexual_orientation, followers_count, country, province, city, created_at
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

async function queryWikiArticles(db: D1Database): Promise<WikiArticleRecord[]> {
	const { results } = await db
		.prepare(
			`SELECT id, title, content, author, created_at, updated_at
			 FROM wiki_articles
			 ORDER BY id ASC`,
		)
		.all<WikiArticleRecord>();
	return results ?? [];
}

async function queryWikiArticleById(db: D1Database, id: number): Promise<WikiArticleRecord | null> {
	const row = await db
		.prepare(
			`SELECT id, title, content, author, created_at, updated_at
			 FROM wiki_articles
			 WHERE id = ?`,
		)
		.bind(id)
		.first<WikiArticleRecord>();
	return row ?? null;
}

function normalizeWikiPayload(payload: WikiPayload) {
	const title = toText(payload.title);
	if (!title) {
		throw new Error("title is required");
	}
	return {
		title,
		content: toText(payload.content, "for test") || "for test",
		author: toText(payload.author, "fistingguide") || "fistingguide",
	};
}

function formatOperationSummary(action: "CREATE" | "UPDATE" | "DELETE", row: Record<string, unknown>): string {
	return [
		`Action: ${action}`,
		`ID: ${String(row.id ?? "")}`,
		`Name: ${String(row.name ?? "")}`,
		`Handle: ${String(row.handle ?? "")}`,
		`Country: ${String(row.country ?? "")}`,
		`Province: ${String(row.province ?? "")}`,
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
	const apiKey = (env.RESEND_API_KEY || "").trim();
	if (!apiKey) {
		return;
	}

	const to = (env.ADMIN_NOTIFICATION_EMAIL || "fistingguide@proton.me").trim();
	if (!to) {
		return;
	}

	const from = (env.RESEND_FROM || "").trim();
	if (!from) {
		return;
	}

	const subject = `[Admin Notice] ${action} profile #${String(row.id ?? "")}`;
	const text = formatOperationSummary(action, row);

	try {
		const res = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"content-type": "application/json",
			},
			body: JSON.stringify({
				from,
				to: [to],
				subject,
				text,
			}),
		});
		if (!res.ok) {
			const err = await res.text();
			console.error("resend send failed", res.status, err);
		}
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
		country: toText(payload.country, DEFAULT_COUNTRY) || DEFAULT_COUNTRY,
		province: toText(payload.province, DEFAULT_PROVINCE) || DEFAULT_PROVINCE,
		city: toText(payload.city, DEFAULT_CITY) || DEFAULT_CITY,
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
		const wikiIdMatch = pathname.match(/^\/api\/wiki\/(\d+)$/);
		const wikiArticlePageMatch = pathname.match(/^\/wiki\/article\/(\d+)$/);

		if (
			pathname === "/" ||
			pathname === "/admin" ||
			pathname === "/dashboard" ||
			pathname === "/about" ||
			pathname === "/wiki" ||
			pathname.startsWith("/api/profiles") ||
			pathname.startsWith("/api/wiki")
		) {
			await ensureSeeded(env.DB);
			await ensureWikiSeeded(env.DB);
		}

		if (method === "GET" && pathname === "/assets/leaflet.css") {
			return proxyTextAsset("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", "text/css; charset=UTF-8");
		}

		if (method === "GET" && pathname === "/assets/leaflet.js") {
			return proxyTextAsset("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", "application/javascript; charset=UTF-8");
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

		if (method === "GET" && pathname === "/about") {
			return new Response(renderAboutPage(), {
				headers: { "content-type": "text/html; charset=UTF-8" },
			});
		}

		if (method === "GET" && pathname === "/wiki") {
			return new Response(renderWikiPage(), {
				headers: { "content-type": "text/html; charset=UTF-8" },
			});
		}

		if (method === "GET" && wikiArticlePageMatch) {
			const id = Number(wikiArticlePageMatch[1]);
			const row = await queryWikiArticleById(env.DB, id);
			if (!row) {
				return new Response("Not Found", { status: 404 });
			}
			return new Response(renderWikiArticlePage(row), {
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

		if (method === "GET" && pathname === "/api/geo/reverse") {
			const lat = Number(url.searchParams.get("lat") || "");
			const lng = Number(url.searchParams.get("lng") || "");
			if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
				return badRequest("lat and lng are required numbers");
			}
			const result = await queryGeoReverse(lat, lng);
			return json({ result });
		}

		if (method === "GET" && pathname === "/api/geo/point") {
			const q = (url.searchParams.get("q") || "").trim();
			if (!q) return badRequest("q is required");
			const point = await queryGeoPoint(q);
			return json({ point });
		}

		if (method === "GET" && pathname === "/api/wiki") {
			const rows = await queryWikiArticles(env.DB);
			return json({ results: rows });
		}

		if (method === "POST" && pathname === "/api/wiki") {
			let payload: WikiPayload;
			try {
				payload = (await request.json()) as WikiPayload;
			} catch {
				return badRequest("invalid json");
			}

			let input: { title: string; content: string; author: string };
			try {
				input = normalizeWikiPayload(payload);
			} catch (error) {
				return badRequest((error as Error).message);
			}

			await env.DB
				.prepare("INSERT INTO wiki_articles (title, content, author) VALUES (?, ?, ?)")
				.bind(input.title, input.content, input.author)
				.run();
			return json({ ok: true }, 201);
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
						name, handle, bio, profile_url, avatar, sexual_orientation, followers_count, country, province, city
					) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
						input.province,
						input.city,
					)
					.run();
			} catch (error) {
				return json({ error: (error as Error).message }, 409);
			}

			const inserted = await env.DB
				.prepare(
					`SELECT id, name, handle, country, province, city, followers_count
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
						 SET name = ?, handle = ?, bio = ?, profile_url = ?, avatar = ?, sexual_orientation = ?, followers_count = ?, country = ?, province = ?, city = ?
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
							input.province,
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
						`SELECT id, name, handle, country, province, city, followers_count
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
						`SELECT id, name, handle, country, province, city, followers_count
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

		if (wikiIdMatch) {
			const id = Number(wikiIdMatch[1]);

			if (method === "GET") {
				const row = await queryWikiArticleById(env.DB, id);
				if (!row) {
					return json({ error: "not found" }, 404);
				}
				return json({ result: row });
			}

			if (method === "PUT" || method === "PATCH") {
				let payload: WikiPayload;
				try {
					payload = (await request.json()) as WikiPayload;
				} catch {
					return badRequest("invalid json");
				}

				let input: { title: string; content: string; author: string };
				try {
					input = normalizeWikiPayload(payload);
				} catch (error) {
					return badRequest((error as Error).message);
				}

				const result = await env.DB
					.prepare("UPDATE wiki_articles SET title = ?, content = ?, author = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
					.bind(input.title, input.content, input.author, id)
					.run();
				if ((result.meta.changes ?? 0) === 0) {
					return json({ error: "not found" }, 404);
				}
				return json({ ok: true });
			}

			if (method === "DELETE") {
				const result = await env.DB.prepare("DELETE FROM wiki_articles WHERE id = ?").bind(id).run();
				if ((result.meta.changes ?? 0) === 0) {
					return json({ error: "not found" }, 404);
				}
				return json({ ok: true });
			}
		}

		return new Response("Not Found", { status: 404 });
	},
} satisfies ExportedHandler<RuntimeEnv>;
