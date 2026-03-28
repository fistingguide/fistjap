export type ProfileRecord = {
	id: number;
	name: string;
	handle: string;
	bio: string;
	profile_url: string;
	avatar: string;
	sexual_orientation: string;
	followers_count: number;
	country: string;
	region: string;
	district: string;
	province?: string;
	city?: string;
	created_at: string;
};

export type WikiArticleRecord = {
	id: number;
	title: string;
	content: string;
	author: string;
	created_at: string;
	updated_at: string;
};

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function renderLeaderboardRows(rows: ProfileRecord[]): string {
	if (rows.length === 0) {
		return '<li class="empty">No data yet. Add records in the admin panel.</li>';
	}

	return rows
		.map((row, index) => {
			const rank = index + 1;
			const rankClass = rank <= 3 ? "top-rank" : "normal-rank";
			const safeName = escapeHtml(row.name || "Unnamed");
			const safeHandle = escapeHtml(row.handle || "");
			const safeOrientation = escapeHtml(row.sexual_orientation || "Gay");
			const safeUrl = escapeHtml(row.profile_url || "#");
			const safeBio = escapeHtml(row.bio || "No bio");
			const safeAvatar = escapeHtml(row.avatar || "");
			const safeRegion = escapeHtml((row.region || row.province) || "Tokyo");
			const safeCountry = escapeHtml(row.country || "Japan");
			const safeDistrict = escapeHtml((row.district || row.city) || "Itabashi");
			const avatarEl = safeAvatar
				? `<img class="avatar" src="${safeAvatar}" alt="${safeName}" referrerpolicy="no-referrer" loading="lazy" />`
				: `<div class="avatar placeholder">N/A</div>`;

			return `
				<li class="leaderboard-item">
					<div class="card-top">
						<div class="rank ${rankClass}">#${rank}</div>
						<div class="badges">
							<div class="badge">Orientation ${safeOrientation}</div>
							<div class="badge">Fans ${row.followers_count}</div>
						</div>
					</div>
					<div class="identity">
						${avatarEl}
						<div>
							<a class="name-link" href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeName}</a>
							<div class="handle">${safeHandle}</div>
						</div>
					</div>
					<div class="badge">${safeDistrict} / ${safeRegion} / ${safeCountry}</div>
					<div class="bio">${safeBio}</div>
				</li>
			`;
		})
		.join("");
}

export function renderLeaderboardPage(rows: ProfileRecord[]): string {
	const serializedRows = JSON.stringify(rows).replaceAll("<", "\\u003c").replaceAll("</", "<\\/");
	return `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Creator Ranking</title>
		<style>
			:root {
				color-scheme: dark;
				--bg: #000000;
				--card: #16181C;
				--text: #E7E9EA;
				--muted: #71767B;
				--line: #2F3336;
				--top: #1D9BF0;
				--primary: #1D9BF0;
			}
			* { box-sizing: border-box; }
			body {
				margin: 0;
				font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
				background: var(--bg);
				color: var(--text);
				min-height: 100vh;
				padding: 20px;
			}
			.panel {
				width: 80vw;
				max-width: 80vw;
				display: grid;
				gap: 14px;
				margin: 0 auto;
			}
			.header {
				padding: 26px 24px;
				background: var(--card);
				color: var(--text);
				border: 1px solid var(--line);
				border-radius: 14px;
				box-shadow: 0 8px 20px rgba(15, 20, 25, 0.08);
			}
			.header h1 { margin: 0; font-size: 30px; }
			.header-main {
				display: flex;
				justify-content: space-between;
				align-items: center;
				gap: 12px;
			}
			.header-left {
				display: grid;
				gap: 8px;
				min-width: 0;
				flex: 1;
			}
			.header-title-row {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				gap: 12px;
				flex-wrap: nowrap;
			}
			.header-right {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				gap: 12px;
				flex: 1;
				min-width: 0;
				flex-wrap: nowrap;
			}
			.header-filter {
				display: flex;
				align-items: center;
				min-width: 200px;
			}
			.header-filter select {
				font: inherit;
				border: 1px solid var(--line);
				background: #16181C;
				color: var(--text);
				padding: 0 12px;
				border-radius: 10px;
				height: 46px;
				width: 200px;
			}
			.top-nav {
				display: flex;
				flex-wrap: nowrap;
				gap: 12px;
				justify-content: flex-end;
			}
			.nav-btn {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				text-decoration: none;
				padding: 0 24px;
				height: 46px;
				border-radius: 18px;
				color: #FFFFFF;
				font-size: 16px;
				font-weight: 600;
				white-space: nowrap;
			}
			.nav-btn.secondary { background: #71767B; }
			.nav-btn.primary { background: #1D9BF0; }
			.nav-btn:hover { filter: brightness(1.03); }
			.nav-btn.active { box-shadow: 0 6px 14px rgba(29, 155, 240, 0.28); }
			.mobile-nav-row { display: none; width: 100%; }
			.mobile-nav {
				width: 100%;
				height: 42px;
				border: 1px solid var(--line);
				border-radius: 10px;
				background: #0F1419;
				color: var(--text);
				padding: 0 12px;
				font: inherit;
			}
			@media (max-width: 720px) {
				body { font-size: 14px; }
				.top-nav { display: none; }
				.mobile-nav-row { display: block; }
				.header-main { flex-direction: column; align-items: flex-start; }
				.header-left { width: 100%; }
				.header-title-row { width: 100%; }
				.header-right { width: 100%; justify-content: flex-start; flex-wrap: wrap; }
				.header-filter { width: 100%; min-width: 0; }
				.header-filter select { width: 100%; height: 42px; }
			}
			.age-gate-overlay {
				position: fixed;
				inset: 0;
				display: none;
				align-items: center;
				justify-content: center;
				background: rgba(15, 20, 25, 0.72);
				z-index: 9999;
				padding: 16px;
			}
			.age-gate-box {
				background: #16181C;
				border-radius: 14px;
				padding: 18px;
				max-width: 420px;
				width: 100%;
				text-align: center;
				border: 1px solid var(--line);
			}
			.age-gate-actions { display: flex; gap: 10px; justify-content: center; margin-top: 12px; }
			.age-btn {
				border: none;
				border-radius: 10px;
				padding: 9px 14px;
				cursor: pointer;
				font: inherit;
				color: #FFFFFF;
			}
			.age-btn.yes { background: var(--primary); }
			.age-btn.no { background: #71767B; }
			.list {
				margin: 0;
				padding: 0;
				list-style: none;
				display: grid;
				grid-template-columns: repeat(5, minmax(0, 1fr));
				gap: 14px;
			}
			.leaderboard-item {
				display: grid;
				gap: 12px;
				padding: 16px;
				border: 1px solid var(--line);
				border-radius: 16px;
				background: linear-gradient(180deg, #16181C 0%, #111418 100%);
				min-height: 280px;
				align-content: start;
				transition: transform 0.15s ease, box-shadow 0.15s ease;
			}
			.leaderboard-item:hover {
				transform: translateY(-2px);
				box-shadow: 0 10px 24px rgba(15, 20, 25, 0.09);
			}
			.card-top { display: flex; justify-content: space-between; align-items: center; }
			.rank { font-size: 17px; font-weight: 800; color: var(--muted); }
			.top-rank { color: var(--top); }
			.badges { display: flex; gap: 6px; align-items: center; }
			.badge {
				font-size: 11px;
				color: var(--muted);
				background: #1D2733;
				padding: 4px 8px;
				border-radius: 999px;
				width: fit-content;
			}
			.identity {
				display: grid;
				grid-template-columns: 72px 1fr;
				gap: 12px;
				align-items: center;
			}
			.avatar {
				width: 72px;
				height: 72px;
				border-radius: 50%;
				object-fit: cover;
				border: 1px solid var(--line);
				background: #0F1419;
			}
			.placeholder { display: grid; place-items: center; font-size: 11px; color: var(--muted); }
			.name-link { font-size: 21px; font-weight: 700; color: var(--text); text-decoration: none; }
			.name-link:hover { color: var(--primary); text-decoration: underline; }
			.handle { margin-top: 5px; color: var(--muted); font-size: 14px; }
			.bio {
				font-size: 13px;
				color: var(--text);
				line-height: 1.55;
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 4;
				-webkit-box-orient: vertical;
			}
			.empty {
				grid-column: 1 / -1;
				padding: 28px 16px;
				text-align: center;
				border: 1px dashed var(--line);
				border-radius: 12px;
				color: var(--muted);
			}
			@media (max-width: 1280px) { .list { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
			@media (max-width: 980px) { .list { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
			@media (max-width: 720px) {
				.header h1 { font-size: 22px; }
				.list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
				.panel { width: 100%; max-width: 100%; }
			}
			@media (max-width: 460px) { .list { grid-template-columns: 1fr; } }
		</style>
	</head>
	<body>
		<div class="age-gate-overlay" id="ageGate">
			<div class="age-gate-box">
				<h2>Age Confirmation</h2>
				<p>You must be 18+ to enter this site. Are you 18 years old or above?</p>
				<div class="age-gate-actions">
					<button class="age-btn yes" id="ageYes">Yes, I am 18+</button>
					<button class="age-btn no" id="ageNo">No</button>
				</div>
			</div>
		</div>
		<section class="panel">
			<header class="header">
				<div class="header-main">
					<div class="header-left">
						<div class="header-title-row">
							<h1>Ranking Page</h1>
						</div>
					</div>
					<div class="header-right">
						<div class="header-filter">
							<select id="rankCountryFilter" aria-label="Country (Region)">
								<option value="">All</option>
							</select>
						</div>
						<nav class="top-nav">
							<a class="nav-btn primary active" href="/">Ranking Page</a>
							<a class="nav-btn secondary" href="/admin">Add new</a>
							<a class="nav-btn secondary" href="/dashboard">Star Map</a>
							<a class="nav-btn secondary" href="/wiki">Fisting Wiki</a>
							<a class="nav-btn secondary" href="/about">About</a>
						</nav>
						<div class="mobile-nav-row">
							<select class="mobile-nav" aria-label="Page Navigation" onchange="if(this.value){window.location.href=this.value;}">
								<option value="/" selected>Ranking Page</option>
								<option value="/admin">Add new</option>
								<option value="/dashboard">Star Map</option>
								<option value="/wiki">Fisting Wiki</option>
								<option value="/about">About</option>
							</select>
						</div>
					</div>
				</div>
			</header>
			<ol class="list">
				${renderLeaderboardRows(rows)}
			</ol>
		</section>
		<script>
			(function () {
				const initialRows = ${serializedRows};
				const listEl = document.querySelector('.list');
				const countrySelect = document.getElementById('rankCountryFilter');

				function esc(v) {
					return String(v || '')
						.replace(/&/g, '&amp;')
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;')
						.replace(/"/g, '&quot;')
						.replace(/'/g, '&#39;');
				}

				function renderRows(rows) {
					if (!listEl) return;
					if (!rows.length) {
						listEl.innerHTML = '<li class="empty">No data yet. Add records in the admin panel.</li>';
						return;
					}
					listEl.innerHTML = rows.map(function (row, index) {
						const rank = index + 1;
						const rankClass = rank <= 3 ? 'top-rank' : 'normal-rank';
						const safeName = esc(row.name || 'Unnamed');
						const safeHandle = esc(row.handle || '');
						const safeOrientation = esc(row.sexual_orientation || 'Gay');
						const safeUrl = esc(row.profile_url || '#');
						const safeBio = esc(row.bio || 'No bio');
						const safeAvatar = esc(row.avatar || '');
						const safeRegion = esc((row.region || row.province) || 'Tokyo');
						const safeCountry = esc(row.country || 'Japan');
						const safeDistrict = esc((row.district || row.city) || 'Itabashi');
						const avatarEl = safeAvatar
							? '<img class="avatar" src="' + safeAvatar + '" alt="' + safeName + '" referrerpolicy="no-referrer" loading="lazy" />'
							: '<div class="avatar placeholder">N/A</div>';
						return '' +
							'<li class="leaderboard-item">' +
								'<div class="card-top">' +
									'<div class="rank ' + rankClass + '">#' + rank + '</div>' +
									'<div class="badges">' +
										'<div class="badge">Orientation ' + safeOrientation + '</div>' +
										'<div class="badge">Fans ' + row.followers_count + '</div>' +
									'</div>' +
								'</div>' +
								'<div class="identity">' +
									avatarEl +
									'<div>' +
										'<a class="name-link" href="' + safeUrl + '" target="_blank" rel="noopener noreferrer">' + safeName + '</a>' +
										'<div class="handle">' + safeHandle + '</div>' +
									'</div>' +
								'</div>' +
								'<div class="badge">' + safeDistrict + ' / ' + safeRegion + ' / ' + safeCountry + '</div>' +
								'<div class="bio">' + safeBio + '</div>' +
							'</li>';
					}).join('');
				}

				async function loadCountries() {
					if (!countrySelect) return;
					const set = new Set();
					initialRows.forEach(function (row) {
						if (row && row.country) set.add(String(row.country));
					});
					const res = await fetch('/api/countries');
					if (res.ok) {
						const data = await res.json();
						(Array.isArray(data.results) ? data.results : []).forEach(function (item) {
							if (item) set.add(String(item));
						});
					}
					countrySelect.innerHTML = '<option value="">All</option>' +
						Array.from(set).sort().map(function (item) {
							return '<option value="' + esc(item) + '">' + esc(item) + '</option>';
						}).join('');
				}

				async function filterByCountry() {
					if (!countrySelect) return;
					const country = countrySelect.value.trim();
					const query = country ? ('?country=' + encodeURIComponent(country)) : '';
					const res = await fetch('/api/profiles' + query);
					if (!res.ok) return;
					const data = await res.json();
					const rows = Array.isArray(data.results) ? data.results : [];
					renderRows(rows);
				}

				if (countrySelect) {
					countrySelect.addEventListener('change', filterByCountry);
				}
				loadCountries();

				const key = 'age_verified_18_v1';
				const overlay = document.getElementById('ageGate');
				const yesBtn = document.getElementById('ageYes');
				const noBtn = document.getElementById('ageNo');
				if (!overlay || !yesBtn || !noBtn) return;

				const verified = localStorage.getItem(key) === 'yes';
				if (!verified) {
					overlay.style.display = 'flex';
				}

				yesBtn.addEventListener('click', function () {
					localStorage.setItem(key, 'yes');
					overlay.style.display = 'none';
				});

				noBtn.addEventListener('click', function () {
					document.body.innerHTML = '<div style="padding:24px;font-family:Segoe UI,sans-serif;">Access denied. This website is for adults 18+ only.</div>';
				});
			})();
		</script>
	</body>
</html>
`;
}

export function renderAdminPage(): string {
	return `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Database Admin Panel</title>
		<link rel="stylesheet" href="/assets/leaflet.css" />
		<style>
			:root {
				--bg: #000000;
				--card: #16181C;
				--line: #2F3336;
				--text: #E7E9EA;
				--muted: #71767B;
				--primary: #1D9BF0;
				--danger: #F4212E;
			}
			* { box-sizing: border-box; }
			body {
				margin: 0;
				font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
				background: var(--bg);
				color: var(--text);
				padding: 20px;
			}
			.wrap { width: 80vw; max-width: 80vw; margin: 0 auto; display: grid; gap: 16px; }
			.card {
				background: var(--card);
				border: 1px solid var(--line);
				border-radius: 16px;
				padding: 16px;
				box-shadow: 0 8px 24px rgba(15, 20, 25, 0.08);
			}
			h1 { margin: 0; font-size: 28px; }
			.sub { color: var(--muted); margin-bottom: 0; }
			.toolbar { display: grid; grid-template-columns: 1fr auto auto; gap: 8px; align-items: center; }
			.head {
				display: flex;
				justify-content: space-between;
				align-items: center;
				gap: 10px;
			}
			.top-nav {
				display: flex;
				flex-wrap: wrap;
				gap: 12px;
				justify-content: flex-end;
			}
			.nav-btn {
				display: inline-flex;
				align-items: center;
				text-decoration: none;
				background: #71767B;
				color: #FFFFFF;
				padding: 12px 24px;
				border-radius: 18px;
				font-size: 16px;
				font-weight: 600;
			}
			.nav-btn.primary { background: #1D9BF0; }
			.nav-btn.active { box-shadow: 0 6px 14px rgba(29, 155, 240, 0.28); }
			.mobile-nav-row { display: none; width: 100%; }
			.mobile-nav {
				width: 100%;
				height: 42px;
				border: 1px solid var(--line);
				border-radius: 10px;
				background: #0F1419;
				color: var(--text);
				padding: 0 12px;
				font: inherit;
			}
			.age-gate-overlay {
				position: fixed;
				inset: 0;
				display: none;
				align-items: center;
				justify-content: center;
				background: rgba(15, 20, 25, 0.72);
				z-index: 9999;
				padding: 16px;
			}
			.age-gate-box {
				background: #16181C;
				border-radius: 14px;
				padding: 18px;
				max-width: 420px;
				width: 100%;
				text-align: center;
				border: 1px solid var(--line);
			}
			.age-gate-actions { display: flex; gap: 10px; justify-content: center; margin-top: 12px; }
			.age-btn {
				border: none;
				border-radius: 10px;
				padding: 9px 14px;
				cursor: pointer;
				font: inherit;
				color: #FFFFFF;
			}
			.age-btn.yes { background: var(--primary); }
			.age-btn.no { background: #71767B; }
			input, textarea, button, select {
				font: inherit;
				padding: 10px 12px;
				border-radius: 10px;
				border: 1px solid var(--line);
				background: #0F1419;
				color: var(--text);
			}
			input::placeholder, textarea::placeholder { color: var(--muted); }
			input:focus, textarea:focus, select:focus {
				outline: none;
				border-color: var(--primary);
				box-shadow: 0 0 0 2px rgba(29, 155, 240, 0.22);
			}
			textarea { min-height: 70px; resize: vertical; }
			button { cursor: pointer; border: none; background: var(--primary); color: #FFFFFF; }
			button.secondary { background: #71767B; }
			button.danger { background: var(--danger); }
			button[disabled] { opacity: 0.55; cursor: not-allowed; }
			.form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
			.field { display: grid; gap: 6px; }
			.field label { font-size: 12px; color: var(--muted); font-weight: 600; }
			.form .full { grid-column: 1 / -1; }
			.avatar-preview-wrap {
				display: flex;
				align-items: center;
				gap: 10px;
				padding: 8px 0;
			}
			.avatar-preview {
				width: 64px;
				height: 64px;
				border-radius: 50%;
				object-fit: cover;
				border: 1px solid var(--line);
				background: #0F1419;
			}
			.avatar-preview-note { color: var(--muted); font-size: 12px; }
			.actions { display: flex; gap: 8px; }
			.status { color: var(--muted); font-size: 13px; }
			.location-selected { color: var(--muted); font-size: 12px; }
			.location-meta {
				display: grid;
				grid-template-columns: repeat(3, minmax(0, 1fr));
				gap: 10px;
			}
			.location-meta .field { margin-top: 2px; }
			.location-meta input[readonly] {
				background: #111418;
				color: var(--text);
			}
			.location-search-wrap { position: relative; width: 100%; }
			#locationSearch { width: 100%; }
			.location-dropdown {
				position: absolute;
				top: calc(100% + 4px);
				left: 0;
				right: 0;
				background: #16181C;
				border: 1px solid var(--line);
				border-radius: 10px;
				max-height: 240px;
				overflow-y: auto;
				z-index: 20;
				display: none;
				padding: 4px;
			}
			.location-dropdown.show { display: block; }
			.location-option {
				width: 100%;
				text-align: left;
				background: transparent;
				border: none;
				color: var(--text);
				padding: 10px 10px;
				border-radius: 8px;
				cursor: pointer;
			}
			.location-option:hover { background: #0F1419; }
			.location-option .sub {
				display: block;
				margin-top: 2px;
				font-size: 12px;
				color: var(--muted);
			}
			.location-preview {
				width: 100%;
				height: 280px;
				border: 1px solid var(--line);
				border-radius: 10px;
				overflow: hidden;
				background: #0F1419;
			}
			.map-pin {
				width: 18px;
				height: 18px;
				border-radius: 50%;
				background: #1D9BF0;
				border: 2px solid #FFFFFF;
				box-shadow: 0 0 0 1px rgba(15, 20, 25, 0.5);
			}
			datalist { display: none; }
			@media (max-width: 900px) {
				body { font-size: 14px; }
				.head { flex-direction: column; align-items: flex-start; }
				.top-nav { display: none; }
				.mobile-nav-row { display: block; }
				.toolbar { grid-template-columns: 1fr; }
				.form { grid-template-columns: 1fr; }
				.location-meta { grid-template-columns: 1fr; }
				.wrap { width: 100%; max-width: 100%; }
			}
		</style>
	</head>
	<body>
		<div class="age-gate-overlay" id="ageGate">
			<div class="age-gate-box">
				<h2>Age Confirmation</h2>
				<p>You must be 18+ to enter this site. Are you 18 years old or above?</p>
				<div class="age-gate-actions">
					<button class="age-btn yes" id="ageYes">Yes, I am 18+</button>
					<button class="age-btn no" id="ageNo">No</button>
				</div>
			</div>
		</div>
		<div class="wrap">
			<section class="card">
				<div class="head">
					<div>
						<h1>Add new</h1>
					</div>
					<nav class="top-nav">
						<a class="nav-btn" href="/">Ranking Page</a>
						<a class="nav-btn primary active" href="/admin">Add new</a>
						<a class="nav-btn" href="/dashboard">Star Map</a>
						<a class="nav-btn" href="/wiki">Fisting Wiki</a>
						<a class="nav-btn" href="/about">About</a>
					</nav>
					<div class="mobile-nav-row">
						<select class="mobile-nav" aria-label="Page Navigation" onchange="if(this.value){window.location.href=this.value;}">
							<option value="/">Ranking Page</option>
							<option value="/admin" selected>Add new</option>
							<option value="/dashboard">Star Map</option>
							<option value="/wiki">Fisting Wiki</option>
							<option value="/about">About</option>
						</select>
					</div>
				</div>
			</section>

			<section class="card">
				<div class="toolbar">
					<input id="handleSearch" list="handleSuggestions" placeholder="Search by X handle (supports partial match, e.g. @tak)" />
					<datalist id="handleSuggestions"></datalist>
					<button id="searchBtn">Search</button>
					<button id="resetBtn" class="secondary">Reset</button>
				</div>
			</section>

			<section class="card">
				<form id="profileForm" class="form">
					<input type="hidden" id="id" />
					<div class="field">
						<label for="name">Display Name</label>
						<input id="name" placeholder="Display name" />
					</div>
					<div class="field">
						<label for="handle">X Handle</label>
						<input id="handle" placeholder="Handle (e.g. @demo)" required />
					</div>
					<div class="field">
						<label for="orientation">Orientation</label>
						<input id="orientation" value="Gay" placeholder="Orientation" />
					</div>
					<div class="field">
						<label for="followers">Fans Count</label>
						<input id="followers" type="number" min="0" value="20" placeholder="Fans count" />
					</div>
					<div class="field full">
						<label for="locationSearch">District / Region / Country (Region)</label>
						<div class="location-search-wrap">
						<input id="locationSearch" list="locationSuggestions" placeholder="Search country (region) or city (map search)" value="Itabashi, Tokyo, Japan" autocomplete="off" />
							<div id="locationDropdown" class="location-dropdown"></div>
						</div>
						<datalist id="locationSuggestions"></datalist>
						<input id="country" type="hidden" value="Japan" />
						<input id="region" type="hidden" value="Tokyo" />
						<input id="district" type="hidden" value="Itabashi" />
						<div class="location-selected" id="locationSelected">Selected: Itabashi / Tokyo / Japan</div>
					</div>
					<div class="field full">
						<label>Location Map Preview</label>
						<div id="locationPreview" class="location-preview"></div>
					</div>
					<div class="field full">
						<label for="profileUrl">Profile URL</label>
						<input id="profileUrl" placeholder="Profile URL" />
					</div>
					<div class="field full">
						<label for="avatar">Avatar URL</label>
						<input id="avatar" placeholder="Avatar URL" />
					</div>
					<div class="field full">
						<label>Avatar Preview</label>
						<div class="avatar-preview-wrap">
							<img id="avatarPreview" class="avatar-preview" src="" alt="Avatar preview" />
							<div class="avatar-preview-note" id="avatarPreviewNote">No avatar URL</div>
						</div>
					</div>
					<div class="field full">
						<label for="bio">Bio</label>
						<textarea id="bio" placeholder="Bio"></textarea>
					</div>
					<div class="full actions">
						<button type="submit" id="submitBtn">Create</button>
						<button type="button" id="deleteBtn" class="danger" disabled>Delete Current</button>
						<button type="button" id="cancelEditBtn" class="secondary">Cancel Edit</button>
					</div>
				</form>
				<p class="status" id="status">Ready</p>
			</section>
		</div>

		<script src="/assets/leaflet.js"></script>
		<script>
			let currentRows = [];
			let editingId = null;
			let locationCandidates = [];
			let locationDebounce = null;
			let locationMap = null;
			let locationMarker = null;
			let reverseRequestSeq = 0;

			const els = {
				handleSearch: document.getElementById('handleSearch'),
				handleSuggestions: document.getElementById('handleSuggestions'),
				locationSearch: document.getElementById('locationSearch'),
				locationSuggestions: document.getElementById('locationSuggestions'),
				locationDropdown: document.getElementById('locationDropdown'),
				locationSelected: document.getElementById('locationSelected'),
				locationPreview: document.getElementById('locationPreview'),
				searchBtn: document.getElementById('searchBtn'),
				resetBtn: document.getElementById('resetBtn'),
				status: document.getElementById('status'),
				form: document.getElementById('profileForm'),
				id: document.getElementById('id'),
				name: document.getElementById('name'),
				handle: document.getElementById('handle'),
				bio: document.getElementById('bio'),
				profileUrl: document.getElementById('profileUrl'),
				avatar: document.getElementById('avatar'),
				avatarPreview: document.getElementById('avatarPreview'),
				avatarPreviewNote: document.getElementById('avatarPreviewNote'),
				orientation: document.getElementById('orientation'),
				followers: document.getElementById('followers'),
				country: document.getElementById('country'),
				region: document.getElementById('region'),
				district: document.getElementById('district'),
				submitBtn: document.getElementById('submitBtn'),
				deleteBtn: document.getElementById('deleteBtn'),
				cancelEditBtn: document.getElementById('cancelEditBtn')
			};

			function esc(v) {
				return String(v || '')
					.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
					.replace(/"/g, '&quot;')
					.replace(/'/g, '&#39;');
			}

			function setStatus(text) {
				els.status.textContent = text;
			}

			function showSuccessDialog(message) {
				window.alert(message);
			}

			function updateAvatarPreview() {
				const url = String(els.avatar.value || '').trim();
				if (!url) {
					els.avatarPreview.removeAttribute('src');
					els.avatarPreviewNote.textContent = 'No avatar URL';
					return;
				}
				els.avatarPreview.src = url;
				els.avatarPreviewNote.textContent = 'Previewing avatar from URL';
			}

			function buildLocationLabel(item) {
				const district = String(item.district || '').trim();
				const region = String(item.region || '').trim();
				const country = String(item.country || '').trim();
				const normDistrict = district && district.toLowerCase() !== 'unknown' ? district : '';
				const normRegion = region && region.toLowerCase() !== 'unknown' ? region : '';
				const normCountry = country && country.toLowerCase() !== 'unknown' ? country : '';
				if (normDistrict && normRegion && normDistrict.toLowerCase() === normRegion.toLowerCase()) {
					if (normCountry) return normRegion + ', ' + normCountry;
					return normRegion;
				}
				if (normDistrict && normRegion && normCountry) return normDistrict + ', ' + normRegion + ', ' + normCountry;
				if (normDistrict && normCountry) return normDistrict + ', ' + normCountry;
				if (normRegion && normCountry) return normRegion + ', ' + normCountry;
				if (normCountry) return normCountry;
				if (normRegion) return normRegion;
				if (normDistrict) return normDistrict;
				return item.label || '';
			}

			function normalizeReverseResult(raw) {
				if (!raw || typeof raw !== 'object') return null;
				const address = raw.address && typeof raw.address === 'object' ? raw.address : {};
				const display = String(raw.display_name || raw.label || '').trim();
				const displayParts = display.split(',').map(function (part) { return String(part || '').trim(); }).filter(Boolean);
				const countryName =
					String(address.country || '').trim() ||
					String(raw.country || '').trim() ||
					String(raw.countryName || '').trim() ||
					'';
				const region =
					String(address.state || '').trim() ||
					String(address.province || '').trim() ||
					String(address.region || '').trim() ||
					String(address.state_district || '').trim() ||
					String(raw.admin1 || '').trim() ||
					String(raw.region || '').trim() ||
					'';
				const districtBase =
					String(address.city || '').trim() ||
					String(address.town || '').trim() ||
					String(address.village || '').trim() ||
					String(address.municipality || '').trim() ||
					String(raw.name || '').trim() ||
					String(raw.district || '').trim() ||
					'';
				const county = String(address.county || '').trim();
				let districtRaw = districtBase;
				if (county && districtBase && /city$/i.test(districtBase) && county.toLowerCase() !== districtBase.toLowerCase()) {
					districtRaw = county;
				} else if (!districtBase && county) {
					districtRaw = county;
				}
				let district = districtRaw;
				if (/district/i.test(districtRaw)) {
					const idx = displayParts.findIndex(function (part) {
						return part.toLowerCase() === districtRaw.toLowerCase();
					});
					if (idx >= 0 && idx + 1 < displayParts.length) {
						const next = displayParts[idx + 1];
						if (!/^[0-9]{4,10}$/.test(next)) district = next;
					}
				}
				const label = display;
				const country = countryName || String(address.country_code || '').trim().toUpperCase() || '';
				if (!district && !region && !country) return null;
				return {
					district: district || '',
					region: region || '',
					country: country || '',
					label: label || [district, region, country].filter(Boolean).join(', ')
				};
			}

			function inferDistrictFromLabel(label, country) {
				const text = String(label || '').trim();
				if (!text) return '';
				const parts = text.split(',').map(function (p) { return p.trim(); }).filter(Boolean);
				if (!parts.length) return '';
				if (parts.length === 1) return parts[0];
				const c = String(country || '').trim().toLowerCase();
				const first = parts[0];
				const last = parts[parts.length - 1].toLowerCase();
				if (c && last === c) return first;
				return first;
			}

			function inferRegionFromLabel(label, district, country) {
				const text = String(label || '').trim();
				if (!text) return '';
				const parts = text.split(',').map(function (p) { return p.trim(); }).filter(Boolean);
				if (!parts.length) return '';
				const districtLower = String(district || '').trim().toLowerCase();
				const countryLower = String(country || '').trim().toLowerCase();
				for (let i = parts.length - 1; i >= 0; i -= 1) {
					const part = parts[i];
					const lower = part.toLowerCase();
					if (!part) continue;
					if (countryLower && lower === countryLower) continue;
					if (districtLower && lower === districtLower) continue;
					if (/^[0-9]{4,10}$/.test(part)) continue;
					return part;
				}
				return '';
			}

			function ensureLocationMap() {
				if (locationMap || !window.L || !els.locationPreview) return;
				locationMap = L.map(els.locationPreview).setView([35.7512, 139.7093], 10);
				L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					maxZoom: 18,
					attribution: '&copy; OpenStreetMap contributors'
				}).addTo(locationMap);
				const pinIcon = L.divIcon({
					className: '',
					html: '<div class="map-pin"></div>',
					iconSize: [18, 18],
					iconAnchor: [9, 9]
				});
				locationMarker = L.marker([35.7512, 139.7093], { draggable: true, icon: pinIcon }).addTo(locationMap);
				locationMarker.on('dragend', function () {
					const latlng = locationMarker.getLatLng();
					reverseLookupAndApply(latlng.lat, latlng.lng);
				});
				locationMap.on('click', function (event) {
					const latlng = event.latlng;
					reverseLookupAndApply(latlng.lat, latlng.lng);
				});
				setTimeout(function () { locationMap.invalidateSize(); }, 0);
			}

			async function reverseLookupAndApply(lat, lng) {
				ensureLocationMap();
				const requestSeq = ++reverseRequestSeq;
				if (locationMarker) {
					locationMarker.setLatLng([lat, lng]);
				}
				if (locationMap) {
					locationMap.panTo([lat, lng]);
				}
				try {
					setStatus('Resolving location...');
					const res = await fetch('/api/geo/reverse?lat=' + encodeURIComponent(String(lat)) + '&lng=' + encodeURIComponent(String(lng)));
					if (requestSeq !== reverseRequestSeq) return;
					const data = await res.json();
					const result = data && data.result ? data.result : null;
					const effective = result;
					if (!effective) {
						setStatus('No location match for this point, keeping previous location');
						return;
					}
					const hasCountry = String(effective.country || '').trim().length > 0;
					const hasRegion = String(effective.region || '').trim().length > 0;
					const hasDistrict = String(effective.district || '').trim().length > 0;
					if (!hasCountry && !hasRegion && !hasDistrict) {
						setStatus('No location match for this point, keeping previous location');
						return;
					}
					applyLocationChoice({
						country: effective.country || '',
						region: effective.region || '',
						district: effective.district || '',
						label: effective.label || '',
						lat: Number(effective.lat || lat),
						lng: Number(effective.lng || lng)
					});
					setStatus('Location selected from map');
				} catch {
					if (requestSeq !== reverseRequestSeq) return;
					setStatus('Reverse location lookup failed');
				}
			}

			function renderLocationPreview(lat, lng) {
				if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
				ensureLocationMap();
				if (locationMarker) {
					locationMarker.setLatLng([lat, lng]);
				}
				if (locationMap) {
					locationMap.setView([lat, lng], 6);
				}
			}

			function renderLocationSuggestions(items) {
				els.locationSuggestions.innerHTML = items.map(function (item) {
					const label = buildLocationLabel(item);
					return '<option value="' + esc(label) + '" label="' + esc(item.label || label) + '"></option>';
				}).join('');
				if (!items.length) {
					els.locationDropdown.classList.remove('show');
					els.locationDropdown.style.display = 'none';
					els.locationDropdown.innerHTML = '';
					return;
				}
				els.locationDropdown.innerHTML = items.map(function (item, idx) {
					const label = buildLocationLabel(item);
					const sub = item.district ? ('District / ' + (item.region || '-') + ' / ' + (item.country || '-')) : 'Country (Region)';
					return '<button type="button" class="location-option" data-index="' + idx + '">' +
						esc(label) + '<span class="sub">' + esc(sub) + '</span></button>';
				}).join('');
				els.locationDropdown.classList.add('show');
				els.locationDropdown.style.display = 'block';
			}

			function applyLocationChoice(item) {
				if (!item) return;
				const nextCountry = String(item.country || '').trim() || 'Unknown';
				const nextDistrictRaw = String(item.district || '').trim();
				const inferredDistrict = inferDistrictFromLabel(item.label, nextCountry);
				const nextDistrict = nextDistrictRaw || inferredDistrict || 'Unknown';
				const nextRegionRaw = String(item.region || '').trim();
				const inferredRegion = inferRegionFromLabel(item.label, nextDistrict, nextCountry);
				const nextRegion =
					(nextRegionRaw && nextRegionRaw.toLowerCase() !== 'unknown' ? nextRegionRaw : '') ||
					inferredRegion ||
					nextDistrict ||
					'Unknown';
				els.country.value = nextCountry;
				els.region.value = nextRegion;
				els.district.value = nextDistrict;
				els.locationSearch.value = buildLocationLabel({ country: nextCountry, region: nextRegion, district: nextDistrict, label: '' });
				els.locationSelected.textContent = 'Selected: ' + nextDistrict + ' / ' + nextRegion + ' / ' + nextCountry;
				renderLocationPreview(Number(item.lat), Number(item.lng));
				els.locationDropdown.classList.remove('show');
				els.locationDropdown.style.display = 'none';
			}

			async function fetchLocationSuggestions(keyword) {
				if (!keyword) {
					locationCandidates = [];
					renderLocationSuggestions([]);
					return;
				}
				try {
					const [districtRes, countryRes] = await Promise.all([
						fetch('/api/geo/suggest?type=city&q=' + encodeURIComponent(keyword) + '&country='),
						fetch('/api/geo/suggest?type=country&q=' + encodeURIComponent(keyword))
					]);
					const districtData = districtRes.ok ? await districtRes.json() : { results: [] };
					const countryData = countryRes.ok ? await countryRes.json() : { results: [] };
					const districtItems = (Array.isArray(districtData.results) ? districtData.results : []).map(function (item) {
						return {
							country: item.country || '',
							region: item.region || '',
							district: item.district || '',
							label: item.label || '',
							lat: Number(item.lat),
							lng: Number(item.lng)
						};
					});
					const countryItems = (Array.isArray(countryData.results) ? countryData.results : []).map(function (item) {
						return {
							country: item.country || '',
							region: '',
							district: '',
							label: item.label || '',
							lat: Number(item.lat),
							lng: Number(item.lng)
						};
					});
					const dedup = new Map();
					districtItems.concat(countryItems).forEach(function (item) {
						const key = buildLocationLabel(item).toLowerCase();
						if (!key || dedup.has(key)) return;
						dedup.set(key, item);
					});
					locationCandidates = Array.from(dedup.values()).slice(0, 15);
					renderLocationSuggestions(locationCandidates);
				} catch {
					setStatus('Location map search failed');
				}
			}

			function scheduleLocationSearch() {
				if (locationDebounce) clearTimeout(locationDebounce);
				locationDebounce = setTimeout(function () {
					fetchLocationSuggestions(els.locationSearch.value.trim());
				}, 250);
			}

			function applyLocationFromInput() {
				const input = String(els.locationSearch.value || '').trim().toLowerCase();
				if (!input) {
					els.locationDropdown.classList.remove('show');
					els.locationDropdown.style.display = 'none';
					return;
				}
				const found = locationCandidates.find(function (item) {
					const label = buildLocationLabel(item).toLowerCase();
					return label === input || String(item.label || '').toLowerCase() === input;
				}) || locationCandidates.find(function (item) {
					return buildLocationLabel(item).toLowerCase().includes(input);
				});
				if (found) {
					applyLocationChoice(found);
				}
			}

			function setEditingState(isEditing) {
				els.submitBtn.textContent = isEditing ? 'Save Changes' : 'Create';
				els.deleteBtn.disabled = !isEditing;
			}

			async function refreshLocationPreviewByValue() {
				const district = String(els.district.value || '').trim();
				const region = String(els.region.value || '').trim();
				const country = String(els.country.value || '').trim();
				const keyword = district || region || country;
				if (!keyword) {
					renderLocationPreview(NaN, NaN);
					return;
				}
				try {
					const type = district ? 'city' : 'country';
					const hint = region || country;
					const url = '/api/geo/suggest?type=' + type + '&q=' + encodeURIComponent(keyword) + '&country=' + encodeURIComponent(hint);
					const res = await fetch(url);
					const data = await res.json();
					const rows = Array.isArray(data.results) ? data.results : [];
					const hit = rows[0];
					if (hit) {
						renderLocationPreview(Number(hit.lat), Number(hit.lng));
					} else {
						renderLocationPreview(NaN, NaN);
					}
				} catch {
					renderLocationPreview(NaN, NaN);
				}
			}

			function resetForm() {
				editingId = null;
				els.id.value = '';
				els.name.value = '';
				els.handle.value = '';
				els.bio.value = '';
				els.profileUrl.value = '';
				els.avatar.value = '';
				els.orientation.value = 'Gay';
				els.followers.value = '20';
				els.country.value = 'Japan';
				els.region.value = 'Tokyo';
				els.district.value = 'Itabashi';
				els.locationSearch.value = 'Itabashi, Tokyo, Japan';
				els.locationSelected.textContent = 'Selected: Itabashi / Tokyo / Japan';
				renderLocationPreview(35.7512, 139.7093);
				updateAvatarPreview();
				setEditingState(false);
			}

			function fillForm(row) {
				editingId = row.id;
				els.id.value = String(row.id);
				els.name.value = row.name || '';
				els.handle.value = row.handle || '';
				els.bio.value = row.bio || '';
				els.profileUrl.value = row.profile_url || '';
				els.avatar.value = row.avatar || '';
				els.orientation.value = row.sexual_orientation || 'Gay';
				els.followers.value = String(row.followers_count || 0);
				els.country.value = row.country || 'Japan';
				els.region.value = (row.region || row.province) || 'Tokyo';
				els.district.value = (row.district || row.city) || 'Itabashi';
				els.locationSearch.value = [els.district.value, els.region.value, els.country.value].filter(Boolean).join(', ');
				els.locationSelected.textContent = 'Selected: ' + els.district.value + ' / ' + els.region.value + ' / ' + els.country.value;
				refreshLocationPreviewByValue();
				updateAvatarPreview();
				setEditingState(true);
			}

			function renderSuggestions(rows) {
				els.handleSuggestions.innerHTML = rows.map(function (row) {
					const label = (row.name || 'Unnamed') + ' | ' + ((row.district || row.city) || 'Itabashi') + '/' + ((row.region || row.province) || 'Tokyo') + '/' + (row.country || 'Japan');
					return '<option value="' + esc(row.handle) + '" label="' + esc(label) + '"></option>';
				}).join('');
			}

			function selectByHandle(handle) {
				const target = currentRows.find(function (row) {
					return String(row.handle || '').toLowerCase() === String(handle || '').toLowerCase();
				});
				if (!target) {
					setStatus('No exact handle match. You can create a new record.');
					resetForm();
					els.handle.value = handle || '';
					return;
				}
				fillForm(target);
				setStatus('Selected ID ' + target.id + '. You can edit or delete it.');
			}

			async function loadSuggestions() {
				const keyword = els.handleSearch.value.trim();
				if (!keyword) {
					currentRows = [];
					renderSuggestions([]);
					resetForm();
					setStatus('Enter a handle to search.');
					return;
				}

				const query = '?keyword=' + encodeURIComponent(keyword);
				const res = await fetch('/api/profiles' + query);
				const data = await res.json();
				const rows = Array.isArray(data.results) ? data.results : [];
				currentRows = rows.filter(function (row) {
					return String(row.handle || '').toLowerCase().includes(keyword.toLowerCase());
				}).slice(0, 20);
				renderSuggestions(currentRows);
				setStatus('Matched ' + currentRows.length + ' handles');
				selectByHandle(keyword);
			}


			function collectPayload() {
				return {
					name: els.name.value,
					handle: els.handle.value,
					bio: els.bio.value,
					profileUrl: els.profileUrl.value,
					avatar: els.avatar.value,
					sexualOrientation: els.orientation.value,
					followersCount: Number(els.followers.value || '0'),
					region: els.region.value || 'Tokyo',
					country: els.country.value || 'Japan',
					district: els.district.value || 'Itabashi'
				};
			}

			async function submitForm(event) {
				event.preventDefault();
				if (!els.handle.value.trim()) {
					setStatus('Handle is required');
					return;
				}

				const payload = collectPayload();
				const isUpdate = Boolean(editingId);
				const method = isUpdate ? 'PUT' : 'POST';
				const url = isUpdate ? '/api/profiles/' + editingId : '/api/profiles';

				setStatus('Submitting...');
				const res = await fetch(url, {
					method,
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(payload)
				});

				if (!res.ok) {
					const msg = await res.text();
					setStatus('Submit failed: ' + msg);
					return;
				}

				setStatus(isUpdate ? 'Updated successfully' : 'Created successfully');
				showSuccessDialog(isUpdate ? 'Profile updated successfully.' : 'Profile created successfully.');
				resetForm();
				els.handleSearch.value = payload.handle;
				await loadSuggestions();
			}

			function sleep(ms) {
				return new Promise(function (resolve) { setTimeout(resolve, ms); });
			}

			async function handleDelete() {
				if (!editingId) {
					setStatus('Please select a handle first.');
					return;
				}
				alert('High-risk action: deletion will be available after 10 seconds. Verify the ID again.');
				for (let i = 10; i >= 1; i -= 1) {
					setStatus('Delete cooldown: ' + i + 's before confirming ID ' + editingId);
					await sleep(1000);
				}
				if (!confirm('10 seconds passed. Delete ID ' + editingId + '?')) return;

				setStatus('Deleting...');
				const res = await fetch('/api/profiles/' + editingId, { method: 'DELETE' });
				if (!res.ok) {
					const msg = await res.text();
					setStatus('Delete failed: ' + msg);
					return;
				}
				setStatus('Deleted successfully');
				showSuccessDialog('Profile deleted successfully.');
				const prev = els.handleSearch.value;
				resetForm();
				els.handleSearch.value = prev;
				await loadSuggestions();
			}

			els.form.addEventListener('submit', submitForm);
			els.searchBtn.addEventListener('click', loadSuggestions);
			els.handleSearch.addEventListener('input', loadSuggestions);
			els.handleSearch.addEventListener('change', function () {
				selectByHandle(els.handleSearch.value.trim());
			});
			els.locationSearch.addEventListener('input', scheduleLocationSearch);
			els.locationSearch.addEventListener('change', function () {
				applyLocationFromInput();
				scheduleLocationSearch();
			});
			els.locationSearch.addEventListener('focus', function () {
				if (locationCandidates.length) {
					renderLocationSuggestions(locationCandidates);
				}
			});
			els.locationSearch.addEventListener('blur', function () {
				setTimeout(function () {
					els.locationDropdown.classList.remove('show');
					els.locationDropdown.style.display = 'none';
				}, 150);
			});
			els.locationDropdown.addEventListener('click', function (event) {
				const target = event.target.closest('.location-option');
				if (!target) return;
				const idx = Number(target.getAttribute('data-index'));
				if (!Number.isFinite(idx)) return;
				const picked = locationCandidates[idx];
				if (picked) applyLocationChoice(picked);
			});
			els.avatar.addEventListener('input', updateAvatarPreview);
			els.avatarPreview.addEventListener('error', function () {
				els.avatarPreviewNote.textContent = 'Image failed to load';
			});
			els.deleteBtn.addEventListener('click', handleDelete);
			els.resetBtn.addEventListener('click', function () {
				els.handleSearch.value = '';
				renderSuggestions([]);
				renderLocationSuggestions([]);
				locationCandidates = [];
				els.locationDropdown.classList.remove('show');
				els.locationDropdown.style.display = 'none';
				resetForm();
				setStatus('Ready');
			});
			els.cancelEditBtn.addEventListener('click', resetForm);

			updateAvatarPreview();
			renderLocationPreview(35.7512, 139.7093);
			setStatus('Enter a handle to search.');
		</script>
		<script>
			(function () {
				const key = 'age_verified_18_v1';
				const overlay = document.getElementById('ageGate');
				const yesBtn = document.getElementById('ageYes');
				const noBtn = document.getElementById('ageNo');
				if (!overlay || !yesBtn || !noBtn) return;

				const verified = localStorage.getItem(key) === 'yes';
				if (!verified) {
					overlay.style.display = 'flex';
				}

				yesBtn.addEventListener('click', function () {
					localStorage.setItem(key, 'yes');
					overlay.style.display = 'none';
				});

				noBtn.addEventListener('click', function () {
					document.body.innerHTML = '<div style="padding:24px;font-family:Segoe UI,sans-serif;">Access denied. This website is for adults 18+ only.</div>';
				});
			})();
		</script>
	</body>
</html>
`;
}

export function renderDashboardPage(): string {
	return `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Data Dashboard</title>
		<link rel="stylesheet" href="/assets/leaflet.css" />
		<style>
			:root {
				--bg: #000000;
				--card: #16181C;
				--line: #2F3336;
				--text: #E7E9EA;
				--muted: #71767B;
				--primary: #1D9BF0;
			}
			* { box-sizing: border-box; }
			body {
				margin: 0;
				font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
				background: var(--bg);
				color: var(--text);
				padding: 20px;
			}
			.wrap { width: 80vw; max-width: 80vw; margin: 0 auto; display: grid; gap: 14px; }
			.card {
				background: var(--card);
				border: 1px solid var(--line);
				border-radius: 14px;
				padding: 14px;
				box-shadow: 0 8px 20px rgba(15, 20, 25, 0.08);
			}
			h1 { margin: 0; }
			p { margin: 0; color: var(--muted); }
			.head {
				display: flex;
				justify-content: space-between;
				align-items: center;
				gap: 10px;
			}
			.head-meta { display: grid; gap: 6px; }
			.top-nav {
				display: flex;
				flex-wrap: wrap;
				gap: 12px;
				justify-content: flex-end;
			}
			.nav-btn {
				display: inline-flex;
				align-items: center;
				text-decoration: none;
				background: #71767B;
				color: #FFFFFF;
				padding: 12px 24px;
				border-radius: 18px;
				font-size: 16px;
				font-weight: 600;
			}
			.nav-btn.primary { background: #1D9BF0; }
			.nav-btn.active { box-shadow: 0 6px 14px rgba(29, 155, 240, 0.28); }
			.mobile-nav-row { display: none; width: 100%; }
			.mobile-nav {
				width: 100%;
				height: 42px;
				border: 1px solid var(--line);
				border-radius: 10px;
				background: #0F1419;
				color: var(--text);
				padding: 0 12px;
				font: inherit;
			}
			.toolbar {
				display: grid;
				grid-template-columns: minmax(220px, 1fr) minmax(220px, 1fr) minmax(220px, 1fr);
				gap: 10px;
				align-items: center;
			}
			button, select {
				font: inherit;
				padding: 9px 12px;
				border: 1px solid var(--line);
				border-radius: 10px;
				background: #0F1419;
				color: var(--text);
			}
			select:focus {
				outline: none;
				border-color: var(--primary);
				box-shadow: 0 0 0 2px rgba(29, 155, 240, 0.22);
			}
			button { cursor: pointer; background: var(--primary); color: #FFFFFF; border: none; }
			.toolbar select, .toolbar button, .toolbar #status { height: 44px; }
			#status {
				display: flex;
				align-items: center;
				justify-content: center;
				border: 1px solid var(--line);
				border-radius: 10px;
				background: #0F1419;
				color: var(--muted);
				font-weight: 600;
				padding: 0 10px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.age-gate-overlay {
				position: fixed;
				inset: 0;
				display: none;
				align-items: center;
				justify-content: center;
				background: rgba(15, 20, 25, 0.72);
				z-index: 9999;
				padding: 16px;
			}
			.age-gate-box {
				background: #16181C;
				border-radius: 14px;
				padding: 18px;
				max-width: 420px;
				width: 100%;
				text-align: center;
				border: 1px solid var(--line);
			}
			.age-gate-actions { display: flex; gap: 10px; justify-content: center; margin-top: 12px; }
			.age-btn {
				border: none;
				border-radius: 10px;
				padding: 9px 14px;
				cursor: pointer;
				font: inherit;
				color: #FFFFFF;
			}
			.age-btn.yes { background: var(--primary); }
			.age-btn.no { background: #71767B; }
			table { width: 100%; border-collapse: collapse; table-layout: fixed; }
			th, td {
				border-bottom: 1px solid var(--line);
				padding: 8px;
				text-align: left;
				font-size: 14px;
				overflow-wrap: anywhere;
				word-break: break-word;
			}
			#map { width: 100%; height: 480px; border-radius: 12px; overflow: hidden; }
			@media (max-width: 900px) {
				body { font-size: 14px; }
				.head { flex-direction: column; align-items: flex-start; }
				.top-nav { display: none; }
				.mobile-nav-row { display: block; }
				.toolbar { grid-template-columns: 1fr; }
				#map { height: 360px; }
				.wrap { width: 100%; max-width: 100%; }
				th, td { font-size: 12px; padding: 7px 6px; }
			}
		</style>
	</head>
	<body>
		<div class="age-gate-overlay" id="ageGate">
			<div class="age-gate-box">
				<h2>Age Confirmation</h2>
				<p>You must be 18+ to enter this site. Are you 18 years old or above?</p>
				<div class="age-gate-actions">
					<button class="age-btn yes" id="ageYes">Yes, I am 18+</button>
					<button class="age-btn no" id="ageNo">No</button>
				</div>
			</div>
		</div>
		<div class="wrap">
			<section class="card">
				<div class="head">
					<div class="head-meta">
						<h1>Star Map</h1>
					</div>
					<nav class="top-nav">
						<a class="nav-btn" href="/">Ranking Page</a>
						<a class="nav-btn" href="/admin">Add new</a>
						<a class="nav-btn primary active" href="/dashboard">Star Map</a>
						<a class="nav-btn" href="/wiki">Fisting Wiki</a>
						<a class="nav-btn" href="/about">About</a>
					</nav>
					<div class="mobile-nav-row">
						<select class="mobile-nav" aria-label="Page Navigation" onchange="if(this.value){window.location.href=this.value;}">
							<option value="/">Ranking Page</option>
							<option value="/admin">Add new</option>
							<option value="/dashboard" selected>Star Map</option>
							<option value="/wiki">Fisting Wiki</option>
							<option value="/about">About</option>
						</select>
					</div>
				</div>
			</section>

			<section class="card toolbar">
				<select id="countryFilter"><option value="">All Countries (Regions)</option></select>
				<button id="reloadBtn">Reload Data</button>
				<div id="status">Ready</div>
			</section>

			<section class="card"><div id="map"></div></section>

			<section class="card">
				<table>
					<thead><tr><th>Rank</th><th>Name</th><th>Handle</th><th>District / Region / Country</th><th>Fans</th></tr></thead>
					<tbody id="rows"></tbody>
				</table>
			</section>
		</div>

		<script src="/assets/leaflet.js"></script>
		<script>
			const statusEl = document.getElementById('status');
			const countryFilterEl = document.getElementById('countryFilter');
			const rowsEl = document.getElementById('rows');
			const geoCache = new Map();
			const map = L.map('map').setView([35.6812, 139.7671], 5);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 18,
				attribution: '&copy; OpenStreetMap contributors'
			}).addTo(map);
			const markerLayer = L.layerGroup().addTo(map);

			function setStatus(text) { statusEl.textContent = text; }
			function formatNum(value) { return Number(value || 0).toLocaleString(); }

			async function loadCountries() {
				const res = await fetch('/api/countries');
				const data = await res.json();
				const countries = Array.isArray(data.results) ? data.results : [];
				countryFilterEl.innerHTML = '<option value="">All Countries (Regions)</option>';
				countries.forEach(function (item) {
					const opt = document.createElement('option');
					opt.value = item;
					opt.textContent = item;
					countryFilterEl.appendChild(opt);
				});
			}

			function renderTable(rows) {
				if (!rows.length) {
					rowsEl.innerHTML = '<tr><td colspan="5">No data</td></tr>';
					return;
				}
				rowsEl.innerHTML = rows.map(function (row, idx) {
					return '<tr>' +
						'<td>#' + (idx + 1) + '</td>' +
						'<td>' + (row.name || 'Unnamed') + '</td>' +
						'<td>' + (row.handle || '') + '</td>' +
						'<td>' + ((row.district || row.city) || 'Itabashi') + ' / ' + ((row.region || row.province) || 'Tokyo') + ' / ' + (row.country || 'Japan') + '</td>' +
						'<td>' + formatNum(row.followers_count) + '</td>' +
					'</tr>';
				}).join('');
			}

			async function geocode(district, region, country) {
				const key = (district + '|' + region + '|' + country).toLowerCase();
				if (geoCache.has(key)) return geoCache.get(key);
				const q = encodeURIComponent([district, region, country].filter(Boolean).join(', '));
				try {
					const res = await fetch('/api/geo/point?q=' + q);
					const data = await res.json();
					const point = data && data.point ? data.point : null;
					const normalized = point && Number.isFinite(Number(point.lat)) && Number.isFinite(Number(point.lon))
						? { lat: Number(point.lat), lon: Number(point.lon) }
						: null;
					if (normalized) {
						geoCache.set(key, normalized);
					}
					return normalized;
				} catch {
					return null;
				}
			}

			async function drawMap(rows) {
				markerLayer.clearLayers();
				const bounds = [];
				const pointUsage = new Map();
				for (const row of rows) {
					const district = (row.district || row.city) || 'Itabashi';
					const region = (row.region || row.province) || 'Tokyo';
					const country = row.country || 'Japan';
					try {
						const point = await geocode(district, region, country);
						if (!point) continue;
						const key = point.lat.toFixed(5) + '|' + point.lon.toFixed(5);
						const used = pointUsage.get(key) || 0;
						pointUsage.set(key, used + 1);
						let lat = point.lat;
						let lon = point.lon;
						if (used > 0) {
							const angle = (used * 55) * Math.PI / 180;
							const r = 0.008 + used * 0.0015;
							lat = point.lat + Math.sin(angle) * r;
							lon = point.lon + Math.cos(angle) * r;
						}
						bounds.push([lat, lon]);
						L.circleMarker([lat, lon], {
							radius: 6,
							color: '#ffffff',
							weight: 2,
							fillColor: '#1D9BF0',
							fillOpacity: 0.9
						})
							.bindPopup('<strong>' + (row.name || 'Unnamed') + '</strong><br/>' + (row.handle || '') + '<br/>' + district + ' / ' + region + ' / ' + country + '<br/>Fans: ' + formatNum(row.followers_count))
							.addTo(markerLayer);
					} catch {
						// ignore single geocoding failure
					}
				}
				if (bounds.length) {
					map.fitBounds(bounds, { padding: [30, 30] });
				} else {
					const fallback = [35.7512, 139.7093];
					L.circleMarker(fallback, {
						radius: 6,
						color: '#ffffff',
						weight: 2,
						fillColor: '#1D9BF0',
						fillOpacity: 0.9
					}).bindPopup('Itabashi / Tokyo / Japan').addTo(markerLayer);
					map.setView(fallback, 10);
				}
			}

			async function loadData() {
				setStatus('Loading dashboard data...');
				const params = new URLSearchParams();
				if (countryFilterEl.value) params.set('country', countryFilterEl.value);
				const query = params.toString() ? '?' + params.toString() : '';
				const res = await fetch('/api/profiles' + query);
				const data = await res.json();
				const rows = Array.isArray(data.results) ? data.results : [];
				renderTable(rows);
				await drawMap(rows);
				setStatus('Loaded ' + rows.length + ' profiles');
			}

			document.getElementById('reloadBtn').addEventListener('click', loadData);
			countryFilterEl.addEventListener('change', loadData);

			(async function init() {
				await loadCountries();
				await loadData();
			})();
		</script>
		<script>
			(function () {
				const key = 'age_verified_18_v1';
				const overlay = document.getElementById('ageGate');
				const yesBtn = document.getElementById('ageYes');
				const noBtn = document.getElementById('ageNo');
				if (!overlay || !yesBtn || !noBtn) return;

				const verified = localStorage.getItem(key) === 'yes';
				if (!verified) {
					overlay.style.display = 'flex';
				}

				yesBtn.addEventListener('click', function () {
					localStorage.setItem(key, 'yes');
					overlay.style.display = 'none';
				});

				noBtn.addEventListener('click', function () {
					document.body.innerHTML = '<div style="padding:24px;font-family:Segoe UI,sans-serif;">Access denied. This website is for adults 18+ only.</div>';
				});
			})();
		</script>
	</body>
</html>
`;
}

export function renderAboutPage(): string {
	return `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>About</title>
		<style>
			:root {
				--bg: #000000;
				--card: #16181C;
				--line: #2F3336;
				--text: #E7E9EA;
				--muted: #71767B;
				--primary: #1D9BF0;
			}
			* { box-sizing: border-box; }
			body {
				margin: 0;
				font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
				background: var(--bg);
				color: var(--text);
				padding: 20px;
			}
			.wrap { width: 80vw; max-width: 80vw; margin: 0 auto; display: grid; gap: 14px; }
			.card {
				background: var(--card);
				border: 1px solid var(--line);
				border-radius: 14px;
				padding: 16px;
				box-shadow: 0 8px 20px rgba(15, 20, 25, 0.08);
			}
			.head {
				display: flex;
				justify-content: space-between;
				align-items: center;
				gap: 10px;
			}
			.head h1 { margin: 0; }
			.top-nav {
				display: flex;
				flex-wrap: wrap;
				gap: 12px;
				justify-content: flex-end;
			}
			.nav-btn {
				display: inline-flex;
				align-items: center;
				text-decoration: none;
				background: #71767B;
				color: #FFFFFF;
				padding: 12px 24px;
				border-radius: 18px;
				font-size: 16px;
				font-weight: 600;
			}
			.nav-btn.primary { background: #1D9BF0; }
			.nav-btn.active { box-shadow: 0 6px 14px rgba(29, 155, 240, 0.28); }
			.mobile-nav-row { display: none; width: 100%; }
			.mobile-nav {
				width: 100%;
				height: 42px;
				border: 1px solid var(--line);
				border-radius: 10px;
				background: #0F1419;
				color: var(--text);
				padding: 0 12px;
				font: inherit;
			}
			.content {
				white-space: pre-wrap;
				line-height: 1.65;
				font-size: 15px;
			}
			.age-gate-overlay {
				position: fixed;
				inset: 0;
				display: none;
				align-items: center;
				justify-content: center;
				background: rgba(15, 20, 25, 0.72);
				z-index: 9999;
				padding: 16px;
			}
			.age-gate-box {
				background: #16181C;
				border-radius: 14px;
				padding: 18px;
				max-width: 420px;
				width: 100%;
				text-align: center;
				border: 1px solid var(--line);
			}
			.age-gate-actions { display: flex; gap: 10px; justify-content: center; margin-top: 12px; }
			.age-btn {
				border: none;
				border-radius: 10px;
				padding: 9px 14px;
				cursor: pointer;
				font: inherit;
				color: #FFFFFF;
			}
			.age-btn.yes { background: var(--primary); }
			.age-btn.no { background: #71767B; }
			@media (max-width: 700px) {
				body { font-size: 14px; }
				.head { flex-direction: column; align-items: flex-start; }
				.top-nav { display: none; }
				.mobile-nav-row { display: block; }
				.wrap { width: 100%; max-width: 100%; }
			}
		</style>
	</head>
	<body>
		<div class="age-gate-overlay" id="ageGate">
			<div class="age-gate-box">
				<h2>Age Confirmation</h2>
				<p>You must be 18+ to enter this site. Are you 18 years old or above?</p>
				<div class="age-gate-actions">
					<button class="age-btn yes" id="ageYes">Yes, I am 18+</button>
					<button class="age-btn no" id="ageNo">No</button>
				</div>
			</div>
		</div>

		<div class="wrap">
			<section class="card head">
				<h1>About</h1>
				<nav class="top-nav">
					<a class="nav-btn" href="/">Ranking Page</a>
					<a class="nav-btn" href="/admin">Add new</a>
					<a class="nav-btn" href="/dashboard">Star Map</a>
					<a class="nav-btn" href="/wiki">Fisting Wiki</a>
					<a class="nav-btn primary active" href="/about">About</a>
				</nav>
				<div class="mobile-nav-row">
					<select class="mobile-nav" aria-label="Page Navigation" onchange="if(this.value){window.location.href=this.value;}">
						<option value="/">Ranking Page</option>
						<option value="/admin">Add new</option>
						<option value="/dashboard">Star Map</option>
						<option value="/wiki">Fisting Wiki</option>
						<option value="/about" selected>About</option>
					</select>
				</div>
			</section>

			<section class="card">
				<div class="content">Hello,I'm a fisting enthusiast and I recently built a simple navigation website to help people quickly discover creators and accounts in the community.The goal of this site is to make it easier for people to find creators, explore new content, and connect with others who share the same interests.If you have any suggestions, feedback, or would like to collaborate on improving the project, feel free to reach out.You can contact me on X: @fistingguide Or by email: fistingguide@proton.meIf you prefer not to appear on the website, just let me know and I will remove your listing.Thank you and I hope this project can help the community grow.

</div>
			</section>
		</div>

		<script>
			(function () {
				const key = 'age_verified_18_v1';
				const overlay = document.getElementById('ageGate');
				const yesBtn = document.getElementById('ageYes');
				const noBtn = document.getElementById('ageNo');
				if (!overlay || !yesBtn || !noBtn) return;

				const verified = localStorage.getItem(key) === 'yes';
				if (!verified) {
					overlay.style.display = 'flex';
				}

				yesBtn.addEventListener('click', function () {
					localStorage.setItem(key, 'yes');
					overlay.style.display = 'none';
				});

				noBtn.addEventListener('click', function () {
					document.body.innerHTML = '<div style="padding:24px;font-family:Segoe UI,sans-serif;">Access denied. This website is for adults 18+ only.</div>';
				});
			})();
		</script>
	</body>
</html>
`;
}

export function renderWikiPage(): string {
	return `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Fisting Wiki</title>
		<style>
			:root {
				--bg: #000000;
				--card: #16181C;
				--line: #2F3336;
				--text: #E7E9EA;
				--muted: #71767B;
				--primary: #1D9BF0;
				--danger: #F4212E;
			}
			* { box-sizing: border-box; }
			body {
				margin: 0;
				font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
				background: var(--bg);
				color: var(--text);
				padding: 20px;
			}
			.wrap { width: 80vw; max-width: 80vw; margin: 0 auto; display: grid; gap: 14px; }
			.card {
				background: var(--card);
				border: 1px solid var(--line);
				border-radius: 14px;
				padding: 16px;
				box-shadow: 0 8px 20px rgba(15, 20, 25, 0.08);
			}
			.head {
				display: flex;
				justify-content: space-between;
				align-items: center;
				gap: 12px;
			}
			.head h1 { margin: 0; font-size: 34px; }
			.head p { margin: 0; color: var(--muted); }
			.top-nav { display: flex; flex-wrap: wrap; gap: 12px; justify-content: flex-end; }
			.nav-btn {
				display: inline-flex;
				align-items: center;
				text-decoration: none;
				background: #71767B;
				color: #FFFFFF;
				padding: 12px 24px;
				border-radius: 18px;
				font-size: 16px;
				font-weight: 600;
			}
			.nav-btn.primary { background: var(--primary); }
			.nav-btn.active { box-shadow: 0 6px 14px rgba(29, 155, 240, 0.28); }
			.mobile-nav-row { display: none; width: 100%; }
			.mobile-nav {
				width: 100%;
				height: 42px;
				border: 1px solid var(--line);
				border-radius: 10px;
				background: #0F1419;
				color: var(--text);
				padding: 0 12px;
				font: inherit;
			}
			.compose {
				display: grid;
				grid-template-columns: 1.1fr 1fr;
				gap: 12px;
				align-items: start;
			}
			.form { display: grid; gap: 10px; }
			.field { display: grid; gap: 6px; }
			.field label { font-size: 12px; color: var(--muted); font-weight: 600; }
			input, textarea, button {
				font: inherit;
				padding: 10px 12px;
				border-radius: 10px;
				border: 1px solid var(--line);
				background: #0F1419;
				color: var(--text);
			}
			input::placeholder, textarea::placeholder { color: var(--muted); }
			input:focus, textarea:focus {
				outline: none;
				border-color: var(--primary);
				box-shadow: 0 0 0 2px rgba(29, 155, 240, 0.22);
			}
			textarea { min-height: 100px; resize: vertical; }
			button { cursor: pointer; border: none; color: #FFFFFF; background: var(--primary); }
			button.secondary { background: #71767B; }
			button.danger { background: var(--danger); }
			.actions { display: flex; gap: 8px; flex-wrap: wrap; }
			.status { font-size: 13px; color: var(--muted); }
			.tips {
				background: #0F1419;
				border: 1px solid var(--line);
				border-radius: 12px;
				padding: 12px;
				color: var(--muted);
				font-size: 14px;
				line-height: 1.6;
			}
			.blog-grid {
				display: grid;
				grid-template-columns: repeat(3, minmax(0, 1fr));
				gap: 12px;
			}
			.post-card {
				border: 1px solid var(--line);
				border-radius: 12px;
				padding: 12px;
				background: #16181C;
				display: grid;
				gap: 10px;
				align-content: start;
				min-height: 220px;
			}
			.post-title {
				margin: 0;
				font-size: 20px;
				line-height: 1.3;
				color: var(--text);
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			.post-meta { font-size: 12px; color: var(--muted); }
			.post-body {
				font-size: 14px;
				line-height: 1.6;
				color: #E7E9EA;
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 5;
				-webkit-box-orient: vertical;
			}
			.post-actions { display: flex; gap: 8px; margin-top: auto; }
			.post-actions button {
				padding: 8px 10px;
				font-size: 13px;
				border-radius: 9px;
			}
			.post-actions .danger { background: var(--danger); }
			.post-link {
				text-decoration: none;
				color: inherit;
				display: grid;
				gap: 10px;
			}
			.post-link:hover .post-title { text-decoration: underline; }
			.empty {
				grid-column: 1 / -1;
				border: 1px dashed var(--line);
				border-radius: 12px;
				padding: 20px;
				text-align: center;
				color: var(--muted);
			}
			.age-gate-overlay {
				position: fixed;
				inset: 0;
				display: none;
				align-items: center;
				justify-content: center;
				background: rgba(15, 20, 25, 0.72);
				z-index: 9999;
				padding: 16px;
			}
			.age-gate-box {
				background: var(--bg);
				border-radius: 14px;
				padding: 18px;
				max-width: 420px;
				width: 100%;
				text-align: center;
				border: 1px solid var(--line);
			}
			.age-gate-actions { display: flex; gap: 10px; justify-content: center; margin-top: 12px; }
			.age-btn {
				border: none;
				border-radius: 10px;
				padding: 9px 14px;
				cursor: pointer;
				font: inherit;
				color: #FFFFFF;
			}
			.age-btn.yes { background: var(--primary); }
			.age-btn.no { background: #71767B; }
			@media (max-width: 1000px) { .blog-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
			@media (max-width: 840px) {
				body { font-size: 14px; }
				.top-nav { display: none; }
				.mobile-nav-row { display: block; }
				.head { flex-direction: column; align-items: flex-start; }
				.compose { grid-template-columns: 1fr; }
				.blog-grid { grid-template-columns: 1fr; }
				.wrap { width: 100%; max-width: 100%; }
			}
		</style>
	</head>
	<body>
		<div class="age-gate-overlay" id="ageGate">
			<div class="age-gate-box">
				<h2>Age Confirmation</h2>
				<p>You must be 18+ to enter this site. Are you 18 years old or above?</p>
				<div class="age-gate-actions">
					<button class="age-btn yes" id="ageYes">Yes, I am 18+</button>
					<button class="age-btn no" id="ageNo">No</button>
				</div>
			</div>
		</div>

		<div class="wrap">
			<section class="card">
				<div class="head">
					<div>
						<h1>Fisting Wiki</h1>
					</div>
					<nav class="top-nav">
						<a class="nav-btn" href="/">Ranking Page</a>
						<a class="nav-btn" href="/admin">Add new</a>
						<a class="nav-btn" href="/dashboard">Star Map</a>
						<a class="nav-btn primary active" href="/wiki">Fisting Wiki</a>
						<a class="nav-btn" href="/about">About</a>
					</nav>
					<div class="mobile-nav-row">
						<select class="mobile-nav" aria-label="Page Navigation" onchange="if(this.value){window.location.href=this.value;}">
							<option value="/">Ranking Page</option>
							<option value="/admin">Add new</option>
							<option value="/dashboard">Star Map</option>
							<option value="/wiki" selected>Fisting Wiki</option>
							<option value="/about">About</option>
						</select>
					</div>
				</div>
			</section>

			<section class="card">
				<div class="compose">
					<form id="wikiForm" class="form">
						<input type="hidden" id="articleId" />
						<div class="field">
							<label for="author">Author</label>
							<input id="author" placeholder="Author name" value="fistingguide" />
						</div>
						<div class="field">
							<label for="title">Title</label>
							<input id="title" placeholder="Article title" />
						</div>
						<div class="field">
							<label for="content">Content</label>
							<textarea id="content" placeholder="for test"></textarea>
						</div>
						<div class="actions">
							<button type="submit" id="submitBtn">Create</button>
							<button type="button" id="deleteBtn" class="danger" disabled>Delete</button>
							<button type="button" id="resetBtn" class="secondary">Reset</button>
						</div>
					</form>
					<div class="tips">
						<strong>Blog Mode</strong><br />
						1. Create a post with title + content.<br />
						2. Click <code>Read</code> for full article view.<br />
						3. Click <code>Edit</code> to load post into editor.<br />
						4. Click <code>Delete</code> to remove a post.
					</div>
				</div>
				<p class="status" id="status">Ready</p>
			</section>

			<section class="card">
				<div id="rows" class="blog-grid"></div>
			</section>
		</div>

		<script>
			let currentRows = [];
			let editingId = null;

			const els = {
				form: document.getElementById('wikiForm'),
				articleId: document.getElementById('articleId'),
				author: document.getElementById('author'),
				title: document.getElementById('title'),
				content: document.getElementById('content'),
				submitBtn: document.getElementById('submitBtn'),
				deleteBtn: document.getElementById('deleteBtn'),
				resetBtn: document.getElementById('resetBtn'),
				rows: document.getElementById('rows'),
				status: document.getElementById('status')
			};

			function esc(v) {
				return String(v || '')
					.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
					.replace(/"/g, '&quot;')
					.replace(/'/g, '&#39;');
			}

			function setStatus(text) {
				els.status.textContent = text;
			}

			function resetForm() {
				editingId = null;
				els.articleId.value = '';
				els.author.value = 'fistingguide';
				els.title.value = '';
				els.content.value = 'for test';
				els.submitBtn.textContent = 'Create';
				els.deleteBtn.disabled = true;
			}

			function fillForm(row) {
				editingId = row.id;
				els.articleId.value = String(row.id);
				els.author.value = row.author || 'fistingguide';
				els.title.value = row.title || '';
				els.content.value = row.content || '';
				els.submitBtn.textContent = 'Save Changes';
				els.deleteBtn.disabled = false;
			}

			function renderRows() {
				if (!currentRows.length) {
					els.rows.innerHTML = '<div class="empty">No articles yet.</div>';
					return;
				}

				els.rows.innerHTML = currentRows.map(function (row) {
					return '<article class="post-card">' +
						'<a class="post-link" href="/wiki/article/' + row.id + '">' +
							'<h3 class="post-title">' + esc(row.title) + '</h3>' +
							'<div class="post-meta">By ' + esc(row.author || 'fistingguide') + ' �� ID #' + row.id + ' �� Updated ' + esc(row.updated_at || row.created_at || '') + '</div>' +
							'<div class="post-body">' + esc(row.content || '') + '</div>' +
						'</a>' +
						'<div class="post-actions">' +
							'<button data-action="edit" data-id="' + row.id + '">Edit</button>' +
							'<button class="danger" data-action="delete" data-id="' + row.id + '">Delete</button>' +
						'</div>' +
					'</article>';
				}).join('');
			}

			async function loadRows() {
				setStatus('Loading...');
				const res = await fetch('/api/wiki');
				const data = await res.json();
				currentRows = Array.isArray(data.results) ? data.results : [];
				renderRows();
				setStatus('Total ' + currentRows.length + ' articles');
			}

			async function submitForm(event) {
				event.preventDefault();
				const title = els.title.value.trim();
				if (!title) {
					setStatus('Title is required');
					return;
				}
				const author = els.author.value.trim() || 'fistingguide';

				const payload = {
					author: author,
					title: title,
					content: (els.content.value || 'for test')
				};
				const method = editingId ? 'PUT' : 'POST';
				const url = editingId ? '/api/wiki/' + editingId : '/api/wiki';

				const res = await fetch(url, {
					method: method,
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(payload)
				});
				if (!res.ok) {
					setStatus('Save failed');
					return;
				}

				window.alert(editingId ? 'Article updated successfully.' : 'Article created successfully.');
				resetForm();
				await loadRows();
			}

			async function deleteCurrent() {
				if (!editingId) return;
				if (!confirm('Delete article #' + editingId + '?')) return;

				const res = await fetch('/api/wiki/' + editingId, { method: 'DELETE' });
				if (!res.ok) {
					setStatus('Delete failed');
					return;
				}

				window.alert('Article deleted successfully.');
				resetForm();
				await loadRows();
			}

			async function deleteById(id) {
				if (!confirm('Delete article #' + id + '?')) return;
				const res = await fetch('/api/wiki/' + id, { method: 'DELETE' });
				if (!res.ok) {
					setStatus('Delete failed');
					return;
				}
				window.alert('Article deleted successfully.');
				if (editingId === id) {
					resetForm();
				}
				await loadRows();
			}

			els.form.addEventListener('submit', submitForm);
			els.deleteBtn.addEventListener('click', deleteCurrent);
			els.resetBtn.addEventListener('click', resetForm);
			els.rows.addEventListener('click', function (event) {
				const target = event.target;
				if (!(target instanceof HTMLElement)) return;
				const action = target.dataset.action;
				const id = Number(target.dataset.id || '0');
				if (!id || !action) return;
				const row = currentRows.find(function (item) { return item.id === id; });
				if (!row) return;
				if (action === 'edit') fillForm(row);
				if (action === 'delete') deleteById(id);
			});

			resetForm();
			loadRows();
		</script>

		<script>
			(function () {
				const key = 'age_verified_18_v1';
				const overlay = document.getElementById('ageGate');
				const yesBtn = document.getElementById('ageYes');
				const noBtn = document.getElementById('ageNo');
				if (!overlay || !yesBtn || !noBtn) return;

				const verified = localStorage.getItem(key) === 'yes';
				if (!verified) {
					overlay.style.display = 'flex';
				}

				yesBtn.addEventListener('click', function () {
					localStorage.setItem(key, 'yes');
					overlay.style.display = 'none';
				});

				noBtn.addEventListener('click', function () {
					document.body.innerHTML = '<div style="padding:24px;font-family:Segoe UI,sans-serif;">Access denied. This website is for adults 18+ only.</div>';
				});
			})();
		</script>
	</body>
</html>
`;
}

export function renderWikiArticlePage(article: WikiArticleRecord): string {
	const title = escapeHtml(article.title || "Untitled");
	const content = escapeHtml(article.content || "");
	const updated = escapeHtml(article.updated_at || article.created_at || "");
	const author = escapeHtml(article.author || "fistingguide");
	return `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>${title} - Fisting Wiki</title>
		<style>
			:root {
				--bg: #000000;
				--card: #16181C;
				--line: #2F3336;
				--text: #E7E9EA;
				--muted: #71767B;
				--primary: #1D9BF0;
			}
			* { box-sizing: border-box; }
			body {
				margin: 0;
				font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
				background: var(--bg);
				color: var(--text);
				padding: 20px;
			}
			.wrap { width: 80vw; max-width: 80vw; margin: 0 auto; display: grid; gap: 14px; }
			.card {
				background: var(--card);
				border: 1px solid var(--line);
				border-radius: 14px;
				padding: 16px;
				box-shadow: 0 8px 20px rgba(15, 20, 25, 0.08);
			}
			.head { display: grid; gap: 12px; }
			.top-nav { display: flex; flex-wrap: wrap; gap: 12px; justify-content: flex-end; }
			.nav-btn {
				display: inline-flex;
				align-items: center;
				text-decoration: none;
				background: #71767B;
				color: #FFFFFF;
				padding: 12px 24px;
				border-radius: 18px;
				font-size: 16px;
				font-weight: 600;
			}
			.nav-btn.primary { background: var(--primary); }
			.nav-btn.active { box-shadow: 0 6px 14px rgba(29, 155, 240, 0.28); }
			.mobile-nav-row { display: none; width: 100%; }
			.mobile-nav {
				width: 100%;
				height: 42px;
				border: 1px solid var(--line);
				border-radius: 10px;
				background: #0F1419;
				color: var(--text);
				padding: 0 12px;
				font: inherit;
			}
			.article {
				max-width: 760px;
				margin: 0 auto;
				display: grid;
				gap: 14px;
			}
			.article h1 { margin: 0; font-size: 44px; line-height: 1.15; }
			.meta { color: var(--muted); font-size: 14px; }
			.article-body {
				white-space: pre-wrap;
				line-height: 1.9;
				font-size: 18px;
				color: #E7E9EA;
			}
			.age-gate-overlay {
				position: fixed;
				inset: 0;
				display: none;
				align-items: center;
				justify-content: center;
				background: rgba(15, 20, 25, 0.72);
				z-index: 9999;
				padding: 16px;
			}
			.age-gate-box {
				background: var(--bg);
				border-radius: 14px;
				padding: 18px;
				max-width: 420px;
				width: 100%;
				text-align: center;
				border: 1px solid var(--line);
			}
			.age-gate-actions { display: flex; gap: 10px; justify-content: center; margin-top: 12px; }
			.age-btn {
				border: none;
				border-radius: 10px;
				padding: 9px 14px;
				cursor: pointer;
				font: inherit;
				color: #FFFFFF;
			}
			.age-btn.yes { background: var(--primary); }
			.age-btn.no { background: #71767B; }
			@media (max-width: 840px) {
				body { font-size: 14px; }
				.wrap { width: 100%; max-width: 100%; }
				.top-nav { display: none; }
				.mobile-nav-row { display: block; }
				.article h1 { font-size: 30px; }
				.article-body { font-size: 16px; }
			}
		</style>
	</head>
	<body>
		<div class="age-gate-overlay" id="ageGate">
			<div class="age-gate-box">
				<h2>Age Confirmation</h2>
				<p>You must be 18+ to enter this site. Are you 18 years old or above?</p>
				<div class="age-gate-actions">
					<button class="age-btn yes" id="ageYes">Yes, I am 18+</button>
					<button class="age-btn no" id="ageNo">No</button>
				</div>
			</div>
		</div>

		<div class="wrap">
			<section class="card head">
				<nav class="top-nav">
					<a class="nav-btn" href="/">Ranking Page</a>
					<a class="nav-btn" href="/admin">Add new</a>
					<a class="nav-btn" href="/dashboard">Star Map</a>
					<a class="nav-btn primary active" href="/wiki">Fisting Wiki</a>
					<a class="nav-btn" href="/about">About</a>
				</nav>
				<div class="mobile-nav-row">
					<select class="mobile-nav" aria-label="Page Navigation" onchange="if(this.value){window.location.href=this.value;}">
						<option value="/">Ranking Page</option>
						<option value="/admin">Add new</option>
						<option value="/dashboard">Star Map</option>
						<option value="/wiki" selected>Fisting Wiki</option>
						<option value="/about">About</option>
					</select>
				</div>
			</section>
			<section class="card article">
				<h1>${title}</h1>
				<div class="meta">By ${author} �� Updated ${updated}</div>
				<div class="article-body">${content}</div>
			</section>
		</div>

		<script>
			(function () {
				const key = 'age_verified_18_v1';
				const overlay = document.getElementById('ageGate');
				const yesBtn = document.getElementById('ageYes');
				const noBtn = document.getElementById('ageNo');
				if (!overlay || !yesBtn || !noBtn) return;
				const verified = localStorage.getItem(key) === 'yes';
				if (!verified) overlay.style.display = 'flex';
				yesBtn.addEventListener('click', function () {
					localStorage.setItem(key, 'yes');
					overlay.style.display = 'none';
				});
				noBtn.addEventListener('click', function () {
					document.body.innerHTML = '<div style="padding:24px;font-family:Segoe UI,sans-serif;">Access denied. This website is for adults 18+ only.</div>';
				});
			})();
		</script>
	</body>
</html>
`;
}




