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
	TEST_EMAIL_TOKEN?: string;
	DELETE_PASSWORD?: string;
};

type GeoSuggestion = {
	label: string;
	country: string;
	region?: string;
	district?: string;
	locality?: string;
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
	region?: unknown;
	district?: unknown;
	province?: unknown;
	city?: unknown;
};

const DEFAULT_COUNTRY = "Japan";
const DEFAULT_REGION = "Tokyo";
const DEFAULT_DISTRICT = "Itabashi";
const PINNED_ROTATION_SECONDS = 600;

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

function verifyDeletePassword(request: Request, env: RuntimeEnv): Response | null {
	const expected = (env.DELETE_PASSWORD || "").trim();
	if (!expected) {
		return json({ error: "server delete password is not configured" }, 500);
	}

	const provided = (request.headers.get("x-delete-password") || "").trim();
	if (!provided || provided !== expected) {
		return json({ error: "invalid delete password" }, 403);
	}

	return null;
}

const reverseGeoCache = new Map<string, GeoSuggestion | null>();
const pointGeoCache = new Map<string, { lat: number; lon: number } | null>();
const countryIso3Cache = new Map<string, string | null>();
const geoBoundaryLayerCache = new Map<string, BoundaryFeature[] | null>();

function reverseCacheKey(lat: number, lng: number): string {
	return `${lat.toFixed(4)}|${lng.toFixed(4)}`;
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

type BoundaryGeometry =
	| { type: "Polygon"; coordinates: number[][][] }
	| { type: "MultiPolygon"; coordinates: number[][][][] };

type BoundaryFeature = {
	name: string;
	geometry: BoundaryGeometry;
};

function pointInRing(lat: number, lng: number, ring: number[][]): boolean {
	let inside = false;
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
		const xi = Number(ring[i]?.[0]);
		const yi = Number(ring[i]?.[1]);
		const xj = Number(ring[j]?.[0]);
		const yj = Number(ring[j]?.[1]);
		if (!Number.isFinite(xi) || !Number.isFinite(yi) || !Number.isFinite(xj) || !Number.isFinite(yj)) {
			continue;
		}
		const intersects =
			yi > lat !== yj > lat &&
			lng < ((xj - xi) * (lat - yi)) / (yj - yi + Number.EPSILON) + xi;
		if (intersects) inside = !inside;
	}
	return inside;
}

function pointInPolygon(lat: number, lng: number, coordinates: number[][][]): boolean {
	if (!Array.isArray(coordinates) || !coordinates.length) return false;
	if (!pointInRing(lat, lng, coordinates[0] ?? [])) return false;
	for (let i = 1; i < coordinates.length; i += 1) {
		if (pointInRing(lat, lng, coordinates[i] ?? [])) return false;
	}
	return true;
}

function pointInBoundaryGeometry(lat: number, lng: number, geometry: BoundaryGeometry): boolean {
	if (geometry.type === "Polygon") {
		return pointInPolygon(lat, lng, geometry.coordinates);
	}
	for (const polygon of geometry.coordinates) {
		if (pointInPolygon(lat, lng, polygon)) return true;
	}
	return false;
}

function pickBoundaryName(properties: Record<string, unknown> | null | undefined): string {
	if (!properties || typeof properties !== "object") return "";
	const keys = [
		"shapeName",
		"name",
		"shapeType",
		"NAME_1",
		"NAME_2",
		"NAME_3",
		"ADM1_EN",
		"ADM2_EN",
	];
	for (const key of keys) {
		const value = properties[key];
		if (typeof value === "string" && value.trim()) return value.trim();
	}
	for (const value of Object.values(properties)) {
		if (typeof value === "string" && value.trim() && !/^[A-Z0-9_-]{2,32}$/.test(value.trim())) {
			return value.trim();
		}
	}
	return "";
}

async function lookupIso3FromIso2(countryCode2: string): Promise<string | null> {
	const code = countryCode2.trim().toUpperCase();
	if (!/^[A-Z]{2}$/.test(code)) return null;
	if (countryIso3Cache.has(code)) return countryIso3Cache.get(code) ?? null;
	try {
		const res = await fetch(`https://restcountries.com/v3.1/alpha/${encodeURIComponent(code)}?fields=cca3`);
		if (!res.ok) {
			countryIso3Cache.set(code, null);
			return null;
		}
		const raw = (await res.json()) as Array<{ cca3?: string }> | { cca3?: string };
		const value = Array.isArray(raw) ? raw[0]?.cca3 : raw?.cca3;
		const iso3 = typeof value === "string" ? value.trim().toUpperCase() : "";
		const normalized = /^[A-Z]{3}$/.test(iso3) ? iso3 : null;
		countryIso3Cache.set(code, normalized);
		return normalized;
	} catch {
		countryIso3Cache.set(code, null);
		return null;
	}
}

async function fetchGeoBoundaryLayer(iso3: string, adm: "ADM1" | "ADM2"): Promise<BoundaryFeature[] | null> {
	const key = `${iso3}|${adm}`;
	if (geoBoundaryLayerCache.has(key)) return geoBoundaryLayerCache.get(key) ?? null;

	try {
		const metaRes = await fetch(`https://www.geoboundaries.org/api/current/gbOpen/${iso3}/${adm}/`);
		if (!metaRes.ok) {
			geoBoundaryLayerCache.set(key, null);
			return null;
		}
		const meta = (await metaRes.json()) as { simplifiedGeometryGeoJSON?: string; gjDownloadURL?: string };
		const url = String(meta?.simplifiedGeometryGeoJSON || meta?.gjDownloadURL || "").trim();
		if (!url) {
			geoBoundaryLayerCache.set(key, null);
			return null;
		}

		const geoRes = await fetch(url);
		if (!geoRes.ok) {
			geoBoundaryLayerCache.set(key, null);
			return null;
		}
		const geo = (await geoRes.json()) as {
			features?: Array<{
				properties?: Record<string, unknown>;
				geometry?: { type?: string; coordinates?: unknown };
			}>;
		};
		const features: BoundaryFeature[] = [];
		for (const feature of geo.features ?? []) {
			const type = feature.geometry?.type;
			const coords = feature.geometry?.coordinates;
			if (type !== "Polygon" && type !== "MultiPolygon") continue;
			if (!coords) continue;
			const name = pickBoundaryName(feature.properties);
			if (!name) continue;
			features.push({
				name,
				geometry:
					type === "Polygon"
						? { type: "Polygon", coordinates: coords as number[][][] }
						: { type: "MultiPolygon", coordinates: coords as number[][][][] },
			});
		}
		geoBoundaryLayerCache.set(key, features);
		return features;
	} catch {
		geoBoundaryLayerCache.set(key, null);
		return null;
	}
}

async function resolveBoundaryHierarchy(
	lat: number,
	lng: number,
	countryCode2: string,
): Promise<{ adm1?: string; adm2?: string } | null> {
	const iso3 = await lookupIso3FromIso2(countryCode2);
	if (!iso3) return null;

	const [adm1Layer, adm2Layer] = await Promise.all([
		fetchGeoBoundaryLayer(iso3, "ADM1"),
		fetchGeoBoundaryLayer(iso3, "ADM2"),
	]);

	const findHit = (features: BoundaryFeature[] | null): string => {
		if (!features?.length) return "";
		for (const feature of features) {
			if (pointInBoundaryGeometry(lat, lng, feature.geometry)) return feature.name;
		}
		return "";
	};

	const adm1 = findHit(adm1Layer);
	const adm2 = findHit(adm2Layer);
	if (!adm1 && !adm2) return null;
	return { adm1: adm1 || undefined, adm2: adm2 || undefined };
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

function isPostalPart(value: string): boolean {
	return /^[0-9]{4,10}$/.test(value.trim());
}

function isMinorAdminName(value: string): boolean {
	const lower = value.toLowerCase();
	return (
		lower.includes("district") ||
		lower.includes("sub-district") ||
		lower.includes("subdistrict") ||
		lower.includes("county") ||
		lower.includes("ward") ||
		lower.includes("borough") ||
		lower.includes("township")
	);
}

function pickDisplayCityNearProvince(displayParts: string[], province: string, country: string): string {
	if (!displayParts.length) return "";
	const countryLower = country.toLowerCase();
	const provinceLower = province.toLowerCase();
	const countryIdx = displayParts.findIndex((part) => part.toLowerCase() === countryLower);
	const provinceIdx = displayParts.findIndex((part) => part.toLowerCase() === provinceLower);
	const stopIdx = provinceIdx >= 0 ? provinceIdx : countryIdx;
	if (stopIdx <= 0) return "";
	for (let i = stopIdx - 1; i >= 0; i -= 1) {
		const part = displayParts[i].trim();
		if (!part || isPostalPart(part)) continue;
		return part;
	}
	return "";
}

function chooseDistrictValue(candidateA: string, candidateB: string, region: string): string {
	const a = candidateA.trim();
	const b = candidateB.trim();
	const r = region.trim().toLowerCase();
	const lowerA = a.toLowerCase();
	const lowerB = b.toLowerCase();
	const isTooGranular = (value: string): boolean =>
		value.includes("sub-district") ||
		value.includes("subdistrict") ||
		value.includes("village") ||
		value.includes("hamlet") ||
		value.includes("neighbourhood") ||
		value.includes("neighborhood") ||
		value.includes("residential") ||
		value.includes("quarter") ||
		value.includes("street");
	const validA = a && lowerA !== r;
	const validB = b && lowerB !== r;

	// Prefer broader city-level names when A is too granular.
	if (validA && isTooGranular(lowerA) && validB) return b;
	// Prefer broader city-level names when A is district-level but B is city-like.
	if (
		validA &&
		lowerA.includes("district") &&
		validB &&
		!lowerB.includes("district") &&
		!lowerB.includes("county")
	) {
		return b;
	}

	if (validA) return a;
	if (validB) return b;
	return a || b || "Unknown";
}

function looksWeakGeoName(value: string): boolean {
	const v = value.trim().toLowerCase();
	if (!v || v === "unknown") return true;
	return (
		v.includes("sub-district") ||
		v.includes("subdistrict") ||
		v.includes("village") ||
		v.includes("hamlet") ||
		v.includes("neighbourhood") ||
		v.includes("neighborhood") ||
		v.includes("residential") ||
		v.includes("quarter") ||
		v.includes("street")
	);
}

function pickPreferredRegion(geoRegion: string, boundaryRegion: string): string {
	const g = geoRegion.trim();
	const b = boundaryRegion.trim();
	if (g && g.toLowerCase() !== "unknown") return g;
	if (b) return b;
	return g || b || "Unknown";
}

function pickPreferredDistrict(geoDistrict: string, boundaryDistrict: string): string {
	const g = geoDistrict.trim();
	const b = boundaryDistrict.trim();
	if (!g || g.toLowerCase() === "unknown") return b || g || "Unknown";
	if (!looksWeakGeoName(g)) return g;
	return b || g || "Unknown";
}

function pickDistrictFromDisplayParts(displayParts: string[], region: string, country: string): string {
	if (!displayParts.length) return "";
	const regionLower = region.trim().toLowerCase();
	const countryLower = country.trim().toLowerCase();
	const regionIdx = displayParts.findIndex((part) => part.trim().toLowerCase() === regionLower);
	const stopIdx = regionIdx >= 0 ? regionIdx : displayParts.length - 1;
	for (let i = stopIdx - 1; i >= 0; i -= 1) {
		const part = displayParts[i]?.trim() ?? "";
		if (!part) continue;
		const lower = part.toLowerCase();
		if (lower === regionLower || lower === countryLower) continue;
		if (isPostalPart(part)) continue;
		return part;
	}
	return "";
}

function pickPromotedCityFromDisplay(
	displayParts: string[],
	currentDistrict: string,
	region: string,
	country: string,
): string {
	if (!displayParts.length) return "";
	const districtLower = currentDistrict.trim().toLowerCase();
	const regionLower = region.trim().toLowerCase();
	const countryLower = country.trim().toLowerCase();
	const regionIdx = displayParts.findIndex((part) => part.trim().toLowerCase() === regionLower);
	const stopIdx = regionIdx >= 0 ? regionIdx : displayParts.length - 1;
	const isAdminToken = (value: string): boolean =>
		/(district|county|borough|ward|sub-district|subdistrict)$/i.test(value.trim());

	for (let i = 0; i < stopIdx; i += 1) {
		const part = displayParts[i]?.trim() ?? "";
		if (!part) continue;
		const next = displayParts[i + 1]?.trim() ?? "";
		const afterNext = displayParts[i + 2]?.trim() ?? "";
		const partLower = part.toLowerCase();
		const nextLower = next.toLowerCase();
		if (isAdminToken(part) && next && !isPostalPart(next) && nextLower !== regionLower && nextLower !== countryLower) {
			return next;
		}
		if (
			districtLower &&
			partLower === districtLower &&
			next &&
			isAdminToken(next) &&
			afterNext &&
			!isPostalPart(afterNext)
		) {
			const afterNextLower = afterNext.toLowerCase();
			if (afterNextLower !== regionLower && afterNextLower !== countryLower) {
				return afterNext;
			}
		}
	}
	return "";
}

function tokenBeforeCountry(displayParts: string[], country: string): string {
	if (!displayParts.length) return "";
	const countryLower = country.trim().toLowerCase();
	const countryIdx = displayParts.findIndex((part) => part.trim().toLowerCase() === countryLower);
	if (countryIdx > 0) return displayParts[countryIdx - 1]?.trim() ?? "";
	return displayParts.length >= 2 ? displayParts[displayParts.length - 2]?.trim() ?? "" : "";
}

function shouldKeepSpecificDistrict(
	districtRaw: string,
	geoDistrict: string,
	displayParts: string[],
	region: string,
	country: string,
): boolean {
	const raw = districtRaw.trim();
	const geo = geoDistrict.trim();
	if (!raw || !geo) return false;
	const rawLower = raw.toLowerCase();
	if (!/(district|county|borough|ward|sub-district|subdistrict)/i.test(raw)) return false;
	const broadToken = tokenBeforeCountry(displayParts, country).toLowerCase();
	const geoLower = geo.toLowerCase();
	const regionLower = region.trim().toLowerCase();
	if (!broadToken || broadToken === country.trim().toLowerCase()) return false;
	// If geoDistrict collapses to broad country-adjacent token, keep finer raw district.
	if (geoLower === broadToken && rawLower !== geoLower && rawLower !== regionLower) {
		return true;
	}
	return false;
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
		const district =
			item.address?.county?.trim() ||
			item.address?.city?.trim() ||
			item.address?.municipality?.trim() ||
			item.address?.city_district?.trim() ||
			item.address?.district?.trim() ||
			item.address?.town?.trim() ||
			item.address?.village?.trim() ||
			"";
		const region =
			item.address?.state?.trim() ||
			item.address?.province?.trim() ||
			item.address?.region?.trim() ||
			"";
		const country = item.address?.country?.trim() ?? "";
		if (!district) continue;
		const key = `${district}|${region}|${country}`.toLowerCase();
		if (dedup.has(key)) continue;
		dedup.set(key, {
			district,
			region,
			country,
			label: [district, region, country].filter(Boolean).join(", "),
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
	const cacheKey = q.toLowerCase();
	if (pointGeoCache.has(cacheKey)) {
		return pointGeoCache.get(cacheKey) ?? null;
	}

	if (q.toLowerCase() === "itabashi, tokyo, japan") {
		const point = { lat: 35.7512, lon: 139.7093 };
		pointGeoCache.set(cacheKey, point);
		return point;
	}

	const parts = q
		.split(",")
		.map((part) => part.trim())
		.filter(Boolean);
	const queryCandidates = new Set<string>([q]);
	if (parts.length >= 2) {
		queryCandidates.add(parts.slice(0, 2).join(", "));
		queryCandidates.add([parts[0], parts[parts.length - 1]].join(", "));
	}
	if (parts.length >= 3) {
		queryCandidates.add([parts[0], parts[1], parts[parts.length - 1]].join(", "));
	}
	if (parts.length >= 1) {
		queryCandidates.add(parts[0]);
	}

	const openMeteoLookup = async (name: string): Promise<{ lat: number; lon: number } | null> => {
		try {
			const params = new URLSearchParams({
				name,
				count: "1",
				language: "en",
			});
			const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`);
			if (!res.ok) return null;
			const data = (await res.json()) as { results?: Array<{ latitude?: number; longitude?: number }> };
			const first = Array.isArray(data.results) ? data.results[0] : undefined;
			if (!first) return null;
			const lat = Number(first.latitude);
			const lon = Number(first.longitude);
			if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
			return { lat, lon };
		} catch {
			return null;
		}
	};

	const nominatimLookup = async (name: string): Promise<{ lat: number; lon: number } | null> => {
		const params = new URLSearchParams({
			format: "jsonv2",
			limit: "1",
			q: name,
		});
		let res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
			headers: {
				"accept-language": "en",
				"user-agent": "fistjap-worker/1.0",
			},
		});
		if (res.status === 429 || res.status === 503) {
			await sleep(700);
			res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
				headers: {
					"accept-language": "en",
					"user-agent": "fistjap-worker/1.0",
				},
			});
		}
		if (!res.ok) return null;
		const data = (await res.json()) as Array<{ lat?: string; lon?: string }>;
		const first = Array.isArray(data) && data.length ? data[0] : null;
		if (!first) return null;
		const lat = Number(first.lat);
		const lon = Number(first.lon);
		if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
		return { lat, lon };
	};

	for (const name of queryCandidates) {
		const point = (await openMeteoLookup(name)) ?? (await nominatimLookup(name));
		if (point) {
			pointGeoCache.set(cacheKey, point);
			return point;
		}
	}

	pointGeoCache.set(cacheKey, null);
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
	const countryCode2 = String(raw.address?.country_code ?? "").trim().toUpperCase();
	const boundaryHierarchy = countryCode2 ? await resolveBoundaryHierarchy(lat, lng, countryCode2) : null;

	const country = raw.address?.country?.trim() || displayParts[displayParts.length - 1] || "";
	const locality =
		raw.address?.village?.trim() ||
		raw.address?.hamlet?.trim() ||
		raw.address?.quarter?.trim() ||
		raw.address?.neighbourhood?.trim() ||
		raw.address?.residential?.trim() ||
		"";
	const districtRaw =
		raw.address?.city_district?.trim() ||
		raw.address?.district?.trim() ||
		raw.address?.suburb?.trim() ||
		raw.address?.borough?.trim() ||
		raw.address?.county?.trim() ||
		"";
	const adminCityRaw =
		raw.address?.city?.trim() ||
		raw.address?.municipality?.trim() ||
		raw.address?.town?.trim() ||
		raw.address?.village?.trim() ||
		raw.address?.county?.trim() ||
		"";
	const provinceRaw =
		raw.address?.state?.trim() ||
		raw.address?.province?.trim() ||
		raw.address?.region?.trim() ||
		raw.address?.state_district?.trim() ||
		"";
	const displayCity = pickDisplayCityNearProvince(displayParts, provinceRaw || adminCityRaw, country);
	const normalizedAdminCity =
		adminCityRaw && isMinorAdminName(adminCityRaw) && displayCity ? displayCity : adminCityRaw || displayCity;
	const districtName = pickMajorCity(normalizedAdminCity || districtRaw || displayParts[0] || "", displayParts);
	const geoRegion = provinceRaw || (!isMinorAdminName(adminCityRaw) ? adminCityRaw : "") || "Unknown";
	const region = pickPreferredRegion(geoRegion, boundaryHierarchy?.adm1 ?? "");
	// Prefer district/city_district level first, then city-level fallback; avoid repeating region name.
	let geoDistrict = chooseDistrictValue(districtRaw, districtName, region);
	if (shouldKeepSpecificDistrict(districtRaw, geoDistrict, displayParts, region, country)) {
		geoDistrict = districtRaw;
	}
	let effectiveDistrict = pickPreferredDistrict(geoDistrict, boundaryHierarchy?.adm2 ?? "");
	const promotedCity = pickPromotedCityFromDisplay(displayParts, effectiveDistrict, region, country);
	if (promotedCity) {
		effectiveDistrict = promotedCity;
	}
	if (effectiveDistrict.trim().toLowerCase() === region.trim().toLowerCase()) {
		const displayDistrict = pickDistrictFromDisplayParts(displayParts, region, country);
		if (displayDistrict) {
			effectiveDistrict = displayDistrict;
		}
	}
	if (effectiveDistrict.trim().toLowerCase() === region.trim().toLowerCase()) {
		effectiveDistrict = "Unknown";
	}

	if (!country && !region && !districtName) {
		reverseGeoCache.set(key, null);
		return null;
	}

	const result: GeoSuggestion = {
		country: country || "Unknown",
		region: region || "Unknown",
		district: effectiveDistrict || "Unknown",
		locality: locality || undefined,
		label:
			raw.display_name?.trim() ||
			[effectiveDistrict || districtName, region, country].filter(Boolean).join(", "),
		lat,
		lng,
		type: districtName ? "city" : "country",
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
		const region = String(item.admin1 ?? "").trim();
		const district = String(item.name ?? item.admin1 ?? "").trim();
		if (country || district) {
			const resolvedRegion = region || district || "Unknown";
			return {
				country: country || "Unknown",
				region: resolvedRegion,
				district: district || "Unknown",
				label: [district, resolvedRegion, country].filter(Boolean).join(", "),
				lat,
				lng,
				type: district ? "city" : "country",
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
		const region = String(raw.principalSubdivision ?? "").trim();
		const district =
			String(raw.city ?? "").trim() ||
			String(raw.locality ?? "").trim() ||
			String(raw.principalSubdivision ?? "").trim();
		if (!country && !district) return null;
		const resolvedRegion = region || district || "Unknown";

		return {
			country: country || "Unknown",
			region: resolvedRegion,
			district: district || "Unknown",
			label: [district, resolvedRegion, country].filter(Boolean).join(", "),
			lat,
			lng,
			type: district ? "city" : "country",
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
				.bind(item.name, item.handle, item.bio, item.profileUrl, item.avatar, DEFAULT_COUNTRY, DEFAULT_REGION, DEFAULT_DISTRICT),
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
		SELECT id, name, handle, bio, profile_url, avatar, sexual_orientation, followers_count, country,
			province AS region, city AS district, created_at
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

function formatOperationSummary(
	action: "CREATE" | "UPDATE" | "DELETE",
	row: Record<string, unknown>,
	operatorIp: string,
): string {
	return [
		`Action: ${action}`,
		`ID: ${String(row.id ?? "")}`,
		`Name: ${String(row.name ?? "")}`,
		`Operator IP: ${operatorIp || "unknown"}`,
		`Handle: ${String(row.handle ?? "")}`,
		`Profile URL: ${String(row.profile_url ?? "")}`,
		`Avatar URL: ${String(row.avatar ?? "")}`,
		`Country: ${String(row.country ?? "")}`,
		`Region: ${String(row.region ?? row.province ?? "")}`,
		`District: ${String(row.district ?? row.city ?? "")}`,
		`Fans: ${String(row.followers_count ?? "")}`,
		`Time: ${new Date().toISOString()}`,
	].join("\n");
}

async function sendAdminNotification(
	env: RuntimeEnv,
	action: "CREATE" | "UPDATE" | "DELETE",
	row: Record<string, unknown>,
	operatorIp: string,
): Promise<void> {
	const apiKey = (env.RESEND_API_KEY || "").trim();
	if (!apiKey) {
		return;
	}

	const to = (env.ADMIN_NOTIFICATION_EMAIL || "fistingguide@proton.me").trim();
	if (!to) {
		return;
	}

	const from = (env.RESEND_FROM || "FistingGuide <onboarding@resend.dev>").trim();

	const subject = `[Admin Notice] ${action} profile #${String(row.id ?? "")}`;
	const text = formatOperationSummary(action, row, operatorIp);

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

function computePinnedIndex(poolSize: number, nowUnixSeconds: number): { slot: number; index: number; nextSwitchAt: string } {
	const slot = Math.floor(nowUnixSeconds / PINNED_ROTATION_SECONDS);
	const index = slot % poolSize;
	const nextSwitchAt = new Date((slot + 1) * PINNED_ROTATION_SECONDS * 1000).toISOString();
	return { slot, index, nextSwitchAt };
}

async function queryPinnedProfile(
	db: D1Database,
	params: {
		country?: string;
	},
): Promise<{ result: ProfileRecord | null; poolSize: number; slot: number | null; nextSwitchAt: string | null }> {
	const country = params.country?.trim() ?? "";
	const rows = await queryProfiles(db, { country });
	const poolSize = rows.length;
	if (poolSize === 0) {
		return { result: null, poolSize: 0, slot: null, nextSwitchAt: null };
	}

	const nowUnixSeconds = Math.floor(Date.now() / 1000);
	const { slot, index, nextSwitchAt } = computePinnedIndex(poolSize, nowUnixSeconds);
	return {
		result: rows[index] ?? null,
		poolSize,
		slot,
		nextSwitchAt,
	};
}

async function sendTestNotification(env: RuntimeEnv, triggerIp: string): Promise<{ ok: boolean; error?: string }> {
	const apiKey = (env.RESEND_API_KEY || "").trim();
	if (!apiKey) return { ok: false, error: "RESEND_API_KEY is missing" };

	const to = (env.ADMIN_NOTIFICATION_EMAIL || "fistingguide@proton.me").trim();
	if (!to) return { ok: false, error: "ADMIN_NOTIFICATION_EMAIL is missing" };

	const from = (env.RESEND_FROM || "FistingGuide <onboarding@resend.dev>").trim();

	const subject = "[Admin Notice] TEST email";
	const text = [
		"This is a test email from /api/test-email.",
		`Time: ${new Date().toISOString()}`,
		`Target: ${to}`,
		`Trigger IP: ${triggerIp || "unknown"}`,
	].join("\n");

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
			console.error("resend test send failed", res.status, err);
			return { ok: false, error: `resend failed: ${res.status}` };
		}
		return { ok: true };
	} catch (error) {
		console.error("send test notification failed", error);
		return { ok: false, error: "send failed" };
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
		region: toText(payload.region, toText(payload.province, DEFAULT_REGION)) || DEFAULT_REGION,
		district: toText(payload.district, toText(payload.city, DEFAULT_DISTRICT)) || DEFAULT_DISTRICT,
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
	async fetch(request, env: RuntimeEnv, ctx: ExecutionContext) {
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

		if (method === "GET" && pathname === "/api/profiles/pinned") {
			const country = url.searchParams.get("country")?.trim() ?? "";
			const pinned = await queryPinnedProfile(env.DB, { country });
			return json(pinned);
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

		if (method === "GET" && pathname === "/api/test-email") {
			const expectedToken = (env.TEST_EMAIL_TOKEN || "").trim();
			if (!expectedToken) {
				return json({ error: "TEST_EMAIL_TOKEN is not configured" }, 500);
			}
			const providedToken = (url.searchParams.get("token") || "").trim();
			if (!providedToken || providedToken !== expectedToken) {
				return json({ error: "unauthorized" }, 401);
			}
			const triggerIp = request.headers.get("CF-Connecting-IP") || "";
			const result = await sendTestNotification(env, triggerIp);
			if (!result.ok) {
				return json({ ok: false, error: result.error || "send failed" }, 502);
			}
			return json({ ok: true, to: (env.ADMIN_NOTIFICATION_EMAIL || "fistingguide@proton.me").trim() });
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
			const operatorIp = request.headers.get("CF-Connecting-IP") || "";
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
						input.region,
						input.district,
					)
					.run();
			} catch (error) {
				return json({ error: (error as Error).message }, 409);
			}

			const inserted = await env.DB
				.prepare(
					`SELECT id, name, handle, profile_url, avatar, country, province AS region, city AS district, followers_count
					 FROM profiles
					 WHERE handle = ?`,
				)
				.bind(input.handle)
				.first<Record<string, unknown>>();
			if (inserted) {
				ctx.waitUntil(sendAdminNotification(env, "CREATE", inserted, operatorIp));
			}

			return json({ ok: true }, 201);
		}

		if (idMatch) {
			const id = Number(idMatch[1]);

			if (method === "PUT" || method === "PATCH") {
				const operatorIp = request.headers.get("CF-Connecting-IP") || "";
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
							input.region,
							input.district,
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
						`SELECT id, name, handle, profile_url, avatar, country, province AS region, city AS district, followers_count
						 FROM profiles
						 WHERE id = ?`,
					)
					.bind(id)
					.first<Record<string, unknown>>();
				if (updated) {
					ctx.waitUntil(sendAdminNotification(env, "UPDATE", updated, operatorIp));
				}

				return json({ ok: true });
			}

			if (method === "DELETE") {
				const authError = verifyDeletePassword(request, env);
				if (authError) return authError;

				const operatorIp = request.headers.get("CF-Connecting-IP") || "";
				const deletedRow = await env.DB
					.prepare(
						`SELECT id, name, handle, profile_url, avatar, country, province AS region, city AS district, followers_count
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
					ctx.waitUntil(sendAdminNotification(env, "DELETE", deletedRow, operatorIp));
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
				const authError = verifyDeletePassword(request, env);
				if (authError) return authError;

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
