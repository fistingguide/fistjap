import {
	renderAdminPage,
	renderLeaderboardPage,
	type ProfileRecord,
} from "./renderHtml";
import { seedProfiles } from "./seedProfiles";

type ProfilePayload = {
	name?: unknown;
	handle?: unknown;
	bio?: unknown;
	profileUrl?: unknown;
	avatar?: unknown;
	sexualOrientation?: unknown;
	followersCount?: unknown;
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
						`INSERT OR IGNORE INTO profiles (name, handle, bio, profile_url, avatar, sexual_orientation, followers_count)
						 VALUES (?, ?, ?, ?, ?, 'Gay', 20)`,
					)
					.bind(item.name, item.handle, item.bio, item.profileUrl, item.avatar),
			);

	if (statements.length > 0) {
		await db.batch(statements);
	}
}

async function queryProfiles(db: D1Database, keyword: string): Promise<ProfileRecord[]> {
	const baseSql = `
		SELECT id, name, handle, bio, profile_url, avatar, sexual_orientation, followers_count, created_at
		FROM profiles
	`;

	if (!keyword) {
		const { results } = await db
			.prepare(`${baseSql} ORDER BY followers_count DESC, id ASC`)
			.all<ProfileRecord>();
		return results ?? [];
	}

	const like = `%${keyword}%`;
	const { results } = await db
		.prepare(
			`${baseSql}
			 WHERE name LIKE ? OR handle LIKE ? OR bio LIKE ?
			 ORDER BY followers_count DESC, id ASC`,
		)
		.bind(like, like, like)
		.all<ProfileRecord>();

	return results ?? [];
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
	async fetch(request, env) {
		const url = new URL(request.url);
		const { pathname } = url;
		const method = request.method.toUpperCase();
		const idMatch = pathname.match(/^\/api\/profiles\/(\d+)$/);

		if (pathname === "/" || pathname === "/admin" || pathname.startsWith("/api/profiles")) {
			await ensureSeeded(env.DB);
		}

		if (method === "GET" && pathname === "/") {
			const rows = await queryProfiles(env.DB, "");
			return new Response(renderLeaderboardPage(rows), {
				headers: { "content-type": "text/html; charset=UTF-8" },
			});
		}

		if (method === "GET" && pathname === "/admin") {
			return new Response(renderAdminPage(), {
				headers: { "content-type": "text/html; charset=UTF-8" },
			});
		}

		if (method === "GET" && pathname === "/api/profiles") {
			const keyword = url.searchParams.get("keyword")?.trim() ?? "";
			const rows = await queryProfiles(env.DB, keyword);
			return json({ results: rows });
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
					`INSERT INTO profiles (name, handle, bio, profile_url, avatar, sexual_orientation, followers_count)
					 VALUES (?, ?, ?, ?, ?, ?, ?)`,
				)
					.bind(
						input.name,
						input.handle,
						input.bio,
						input.profileUrl,
						input.avatar,
						input.sexualOrientation,
						input.followersCount,
					)
					.run();
			} catch (error) {
				return json({ error: (error as Error).message }, 409);
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
						 SET name = ?, handle = ?, bio = ?, profile_url = ?, avatar = ?, sexual_orientation = ?, followers_count = ?
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
							id,
						)
						.run();

					if ((result.meta.changes ?? 0) === 0) {
						return json({ error: "not found" }, 404);
					}
				} catch (error) {
					return json({ error: (error as Error).message }, 409);
				}

				return json({ ok: true });
			}

			if (method === "DELETE") {
				const result = await env.DB.prepare("DELETE FROM profiles WHERE id = ?").bind(id).run();
				if ((result.meta.changes ?? 0) === 0) {
					return json({ error: "not found" }, 404);
				}
				return json({ ok: true });
			}
		}

		return new Response("Not Found", { status: 404 });
	},
} satisfies ExportedHandler<Env>;
