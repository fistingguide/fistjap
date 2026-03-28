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
	city: string;
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
			const safeCountry = escapeHtml(row.country || "Japan");
			const safeCity = escapeHtml(row.city || "Tokyo");
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
					<div class="badge">${safeCountry} / ${safeCity}</div>
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
			@media (max-width: 720px) {
				.top-nav { justify-content: flex-start; width: 100%; }
				.header-main { flex-direction: column; align-items: flex-start; }
				.header-left { width: 100%; }
				.header-title-row { width: 100%; }
				.header-right { width: 100%; justify-content: flex-start; flex-wrap: wrap; }
				.header-filter { width: 100%; min-width: 0; }
				.header-filter select { width: 100%; }
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
				padding: 14px;
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
				.header h1 { font-size: 24px; }
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
						const safeCountry = esc(row.country || 'Japan');
						const safeCity = esc(row.city || 'Tokyo');
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
								'<div class="badge">' + safeCountry + ' / ' + safeCity + '</div>' +
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
			datalist { display: none; }
			@media (max-width: 900px) {
				.head { flex-direction: column; align-items: flex-start; }
				.top-nav { justify-content: flex-start; }
				.toolbar { grid-template-columns: 1fr; }
				.form { grid-template-columns: 1fr; }
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
					<div class="field">
						<label for="country">Country (Region)</label>
						<input id="country" list="countrySuggestions" placeholder="Country (Region) (map search)" value="Japan" />
						<datalist id="countrySuggestions"></datalist>
					</div>
					<div class="field">
						<label for="city">City</label>
						<input id="city" list="citySuggestions" placeholder="City (map search)" value="Tokyo" />
						<datalist id="citySuggestions"></datalist>
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

		<script>
			let currentRows = [];
			let editingId = null;
			let countryCandidates = [];
			let cityCandidates = [];
			let countryDebounce = null;
			let cityDebounce = null;

			const els = {
				handleSearch: document.getElementById('handleSearch'),
				handleSuggestions: document.getElementById('handleSuggestions'),
				countrySuggestions: document.getElementById('countrySuggestions'),
				citySuggestions: document.getElementById('citySuggestions'),
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
				city: document.getElementById('city'),
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

			function renderCountrySuggestions(items) {
				els.countrySuggestions.innerHTML = items.map(function (item) {
					return '<option value="' + esc(item.country) + '" label="' + esc(item.label) + '"></option>';
				}).join('');
			}

			function renderCitySuggestions(items) {
				els.citySuggestions.innerHTML = items.map(function (item) {
					return '<option value="' + esc(item.city) + '" label="' + esc(item.label) + '"></option>';
				}).join('');
			}

			async function fetchCountrySuggestions(keyword) {
				if (!keyword) {
					countryCandidates = [];
					renderCountrySuggestions([]);
					return;
				}
				try {
					const url = '/api/geo/suggest?type=country&q=' + encodeURIComponent(keyword);
					const res = await fetch(url);
					const data = await res.json();
					countryCandidates = Array.isArray(data.results) ? data.results : [];
					renderCountrySuggestions(countryCandidates);
				} catch {
					setStatus('Country (Region) map search failed');
				}
			}

			async function fetchCitySuggestions(keyword) {
				if (!keyword) {
					cityCandidates = [];
					renderCitySuggestions([]);
					return;
				}
				try {
					const country = els.country.value.trim();
					const url = '/api/geo/suggest?type=city&q=' + encodeURIComponent(keyword) + '&country=' + encodeURIComponent(country);
					const res = await fetch(url);
					const data = await res.json();
					cityCandidates = Array.isArray(data.results) ? data.results : [];
					renderCitySuggestions(cityCandidates);
				} catch {
					setStatus('City map search failed');
				}
			}

			function scheduleCountrySearch() {
				if (countryDebounce) clearTimeout(countryDebounce);
				countryDebounce = setTimeout(function () {
					fetchCountrySuggestions(els.country.value.trim());
				}, 250);
			}

			function scheduleCitySearch() {
				if (cityDebounce) clearTimeout(cityDebounce);
				cityDebounce = setTimeout(function () {
					fetchCitySuggestions(els.city.value.trim());
				}, 250);
			}

			function syncCountryFromCityChoice() {
				const city = els.city.value.trim().toLowerCase();
				if (!city) return;
				const found = cityCandidates.find(function (item) {
					return String(item.city || '').toLowerCase() === city;
				});
				if (found && found.country && !els.country.value.trim()) {
					els.country.value = found.country;
				}
			}

			function setEditingState(isEditing) {
				els.submitBtn.textContent = isEditing ? 'Save Changes' : 'Create';
				els.deleteBtn.disabled = !isEditing;
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
				els.city.value = 'Tokyo';
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
				els.city.value = row.city || 'Tokyo';
				updateAvatarPreview();
				setEditingState(true);
			}

			function renderSuggestions(rows) {
				els.handleSuggestions.innerHTML = rows.map(function (row) {
					const label = (row.name || 'Unnamed') + ' | ' + (row.country || 'Japan') + '/' + (row.city || 'Tokyo');
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
					country: els.country.value || 'Japan',
					city: els.city.value || 'Tokyo'
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
			els.country.addEventListener('input', scheduleCountrySearch);
			els.country.addEventListener('change', scheduleCountrySearch);
			els.city.addEventListener('input', scheduleCitySearch);
			els.city.addEventListener('change', function () {
				syncCountryFromCityChoice();
				scheduleCitySearch();
			});
			els.avatar.addEventListener('input', updateAvatarPreview);
			els.avatarPreview.addEventListener('error', function () {
				els.avatarPreviewNote.textContent = 'Image failed to load';
			});
			els.deleteBtn.addEventListener('click', handleDelete);
			els.resetBtn.addEventListener('click', function () {
				els.handleSearch.value = '';
				renderSuggestions([]);
				renderCountrySuggestions([]);
				renderCitySuggestions([]);
				resetForm();
				setStatus('Ready');
			});
			els.cancelEditBtn.addEventListener('click', resetForm);

			updateAvatarPreview();
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
		<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin="" />
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
			table { width: 100%; border-collapse: collapse; }
			th, td { border-bottom: 1px solid var(--line); padding: 8px; text-align: left; font-size: 14px; }
			#map { width: 100%; height: 480px; border-radius: 12px; overflow: hidden; }
			@media (max-width: 900px) {
				.head { flex-direction: column; align-items: flex-start; }
				.top-nav { justify-content: flex-start; }
				.toolbar { grid-template-columns: 1fr; }
				#map { height: 360px; }
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
					<thead><tr><th>Rank</th><th>Name</th><th>Handle</th><th>Country (Region)/City</th><th>Fans</th></tr></thead>
					<tbody id="rows"></tbody>
				</table>
			</section>
		</div>

		<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>
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
						'<td>' + (row.country || 'Japan') + ' / ' + (row.city || 'Tokyo') + '</td>' +
						'<td>' + formatNum(row.followers_count) + '</td>' +
					'</tr>';
				}).join('');
			}

			async function geocode(city, country) {
				const key = (city + '|' + country).toLowerCase();
				if (geoCache.has(key)) return geoCache.get(key);
				const q = encodeURIComponent(city + ', ' + country);
				const res = await fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=' + q);
				const data = await res.json();
				const first = Array.isArray(data) && data.length ? data[0] : null;
				const point = first ? { lat: Number(first.lat), lon: Number(first.lon) } : null;
				geoCache.set(key, point);
				return point;
			}

			async function drawMap(rows) {
				markerLayer.clearLayers();
				const bounds = [];
				for (const row of rows) {
					const city = row.city || 'Tokyo';
					const country = row.country || 'Japan';
					try {
						const point = await geocode(city, country);
						if (!point) continue;
						bounds.push([point.lat, point.lon]);
						L.marker([point.lat, point.lon])
							.bindPopup('<strong>' + (row.name || 'Unnamed') + '</strong><br/>' + (row.handle || '') + '<br/>' + country + ' / ' + city + '<br/>Fans: ' + formatNum(row.followers_count))
							.addTo(markerLayer);
					} catch {
						// ignore single geocoding failure
					}
				}
				if (bounds.length) {
					map.fitBounds(bounds, { padding: [30, 30] });
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
				.head { flex-direction: column; align-items: flex-start; }
				.top-nav { justify-content: flex-start; }
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
			</section>

			<section class="card">
				<div class="content">Hello,I'm a fisting enthusiast and I recently built a simple navigation website to help people quickly discover creators and accounts in the community.The goal of this site is to make it easier for people to find creators, explore new content, and connect with others who share the same interests.If you have any suggestions, feedback, or would like to collaborate on improving the project, feel free to reach out.You can contact me on X:@fistingguideOr by email:fistingguide@proton.meIf you prefer not to appear on the website, just let me know and I will remove your listing.Thank you and I hope this project can help the community grow.

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
				.top-nav { justify-content: flex-start; }
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
				.wrap { width: 100%; max-width: 100%; }
				.top-nav { justify-content: flex-start; }
				.article h1 { font-size: 34px; }
				.article-body { font-size: 17px; }
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




