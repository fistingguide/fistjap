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
	return `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Creator Ranking</title>
		<style>
			:root {
				color-scheme: light;
				--bg: #eff4ff;
				--card: #ffffff;
				--text: #172b4d;
				--muted: #5e6c84;
				--line: #dfe1e6;
				--top: #ff7b00;
				--primary: #0b66e4;
			}
			* { box-sizing: border-box; }
			body {
				margin: 0;
				font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
				background: radial-gradient(circle at top left, #dbe8ff 0%, var(--bg) 45%, #edf2ff 100%);
				color: var(--text);
				min-height: 100vh;
				padding: 20px;
			}
			.panel {
				width: 80vw;
				max-width: 80vw;
				background: var(--card);
				border: 1px solid var(--line);
				border-radius: 20px;
				box-shadow: 0 18px 45px rgba(9, 30, 66, 0.1);
				overflow: hidden;
				margin: 0 auto;
			}
			.header {
				padding: 26px 24px;
				background: linear-gradient(120deg, #0b66e4, #5393ff);
				color: #fff;
				display: flex;
				justify-content: space-between;
				gap: 10px;
				align-items: end;
			}
			.header h1 { margin: 0; font-size: 30px; }
			.header p { margin: 8px 0 0; opacity: 0.92; }
			.header .links { display: flex; gap: 8px; }
			.header a {
				color: #fff;
				text-decoration: none;
				border: 1px solid rgba(255, 255, 255, 0.5);
				padding: 8px 12px;
				border-radius: 10px;
				font-size: 14px;
			}
			.age-gate-overlay {
				position: fixed;
				inset: 0;
				display: none;
				align-items: center;
				justify-content: center;
				background: rgba(10, 20, 40, 0.75);
				z-index: 9999;
				padding: 16px;
			}
			.age-gate-box {
				background: #fff;
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
				color: #fff;
			}
			.age-btn.yes { background: var(--primary); }
			.age-btn.no { background: #6b778c; }
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
				background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
				min-height: 280px;
				align-content: start;
				transition: transform 0.15s ease, box-shadow 0.15s ease;
			}
			.leaderboard-item:hover {
				transform: translateY(-2px);
				box-shadow: 0 10px 24px rgba(9, 30, 66, 0.09);
			}
			.card-top { display: flex; justify-content: space-between; align-items: center; }
			.rank { font-size: 17px; font-weight: 800; color: var(--muted); }
			.top-rank { color: var(--top); }
			.badges { display: flex; gap: 6px; align-items: center; }
			.badge {
				font-size: 11px;
				color: var(--muted);
				background: #eef3ff;
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
				background: #f2f4f7;
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
				.header { flex-direction: column; align-items: flex-start; }
				.header h1 { font-size: 24px; }
				.list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
				.panel { width: 94vw; max-width: 94vw; }
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
				<div>
					<h1>Creator Ranking</h1>
					<p>Sort: Fans DESC, ID ASC</p>
				</div>
				<div class="links">
					<a href="/dashboard">Open Dashboard</a>
					<a href="/admin">Open Admin Panel</a>
					<a href="/about">About</a>
				</div>
			</header>
			<ol class="list">
				${renderLeaderboardRows(rows)}
			</ol>
		</section>
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
				--bg: #f5f7ff;
				--card: #ffffff;
				--line: #dfe1e6;
				--text: #172b4d;
				--muted: #5e6c84;
				--primary: #0b66e4;
				--danger: #c62828;
			}
			* { box-sizing: border-box; }
			body {
				margin: 0;
				font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
				background: linear-gradient(160deg, #eef3ff 0%, #f8fbff 100%);
				color: var(--text);
				padding: 20px;
			}
			.wrap { max-width: 1200px; margin: 0 auto; display: grid; gap: 16px; }
			.card {
				background: var(--card);
				border: 1px solid var(--line);
				border-radius: 16px;
				padding: 16px;
				box-shadow: 0 8px 24px rgba(9, 30, 66, 0.08);
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
			.head-actions { display: flex; gap: 8px; }
			.link-btn {
				display: inline-flex;
				align-items: center;
				text-decoration: none;
				background: var(--primary);
				color: #fff;
				padding: 9px 12px;
				border-radius: 10px;
				font-size: 14px;
			}
			.link-btn.alt { background: #6b778c; }
			.age-gate-overlay {
				position: fixed;
				inset: 0;
				display: none;
				align-items: center;
				justify-content: center;
				background: rgba(10, 20, 40, 0.75);
				z-index: 9999;
				padding: 16px;
			}
			.age-gate-box {
				background: #fff;
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
				color: #fff;
			}
			.age-btn.yes { background: var(--primary); }
			.age-btn.no { background: #6b778c; }
			input, textarea, button, select {
				font: inherit;
				padding: 10px 12px;
				border-radius: 10px;
				border: 1px solid var(--line);
			}
			textarea { min-height: 70px; resize: vertical; }
			button { cursor: pointer; border: none; background: var(--primary); color: #fff; }
			button.secondary { background: #6b778c; }
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
				background: #f2f4f7;
			}
			.avatar-preview-note { color: var(--muted); font-size: 12px; }
			.actions { display: flex; gap: 8px; }
			.status { color: var(--muted); font-size: 13px; }
			datalist { display: none; }
			@media (max-width: 900px) {
				.head { flex-direction: column; align-items: flex-start; }
				.toolbar { grid-template-columns: 1fr; }
				.form { grid-template-columns: 1fr; }
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
						<h1>Database Admin Panel</h1>
						<p class="sub">CRUD for the <code>profiles</code> table.</p>
					</div>
					<div class="head-actions">
						<a class="link-btn alt" href="/">Ranking Page</a>
						<a class="link-btn" href="/dashboard">Dashboard</a>
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
					<div class="field">
						<label for="country">Country / Region</label>
						<input id="country" list="countrySuggestions" placeholder="Country / Region (map search)" value="Japan" />
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
					setStatus('Country map search failed');
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
				--bg: #eef4fb;
				--card: #ffffff;
				--line: #dae3ef;
				--text: #0f2744;
				--muted: #4f657d;
				--primary: #0f62fe;
			}
			* { box-sizing: border-box; }
			body {
				margin: 0;
				font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
				background: radial-gradient(circle at top right, #d7e7ff 0%, var(--bg) 52%, #edf3ff 100%);
				color: var(--text);
				padding: 20px;
			}
			.wrap { max-width: 1200px; margin: 0 auto; display: grid; gap: 14px; }
			.card {
				background: var(--card);
				border: 1px solid var(--line);
				border-radius: 14px;
				padding: 14px;
				box-shadow: 0 8px 20px rgba(6, 24, 44, 0.08);
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
			.head-actions { display: flex; gap: 8px; }
			.link-btn {
				display: inline-flex;
				align-items: center;
				text-decoration: none;
				background: var(--primary);
				color: #fff;
				padding: 9px 12px;
				border-radius: 10px;
				font-size: 14px;
			}
			.link-btn.alt { background: #6b778c; }
			.toolbar { display: grid; grid-template-columns: 220px auto auto; gap: 8px; align-items: center; }
			button, select {
				font: inherit;
				padding: 9px 12px;
				border: 1px solid var(--line);
				border-radius: 10px;
			}
			button { cursor: pointer; background: var(--primary); color: #fff; border: none; }
			.age-gate-overlay {
				position: fixed;
				inset: 0;
				display: none;
				align-items: center;
				justify-content: center;
				background: rgba(10, 20, 40, 0.75);
				z-index: 9999;
				padding: 16px;
			}
			.age-gate-box {
				background: #fff;
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
				color: #fff;
			}
			.age-btn.yes { background: var(--primary); }
			.age-btn.no { background: #6b778c; }
			.stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
			.stat {
				background: #f8fbff;
				border: 1px solid var(--line);
				border-radius: 10px;
				padding: 10px;
			}
			.stat .label { color: var(--muted); font-size: 12px; }
			.stat .value { font-size: 24px; font-weight: 700; margin-top: 3px; }
			table { width: 100%; border-collapse: collapse; }
			th, td { border-bottom: 1px solid var(--line); padding: 8px; text-align: left; font-size: 14px; }
			#map { width: 100%; height: 480px; border-radius: 12px; overflow: hidden; }
			@media (max-width: 900px) {
				.head { flex-direction: column; align-items: flex-start; }
				.toolbar, .stats { grid-template-columns: 1fr; }
				#map { height: 360px; }
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
						<h1>Data Dashboard</h1>
						<p>Filter by country/region, sort by fans, and display city-level locations on the map.</p>
					</div>
					<div class="head-actions">
						<a class="link-btn alt" href="/">Ranking Page</a>
						<a class="link-btn" href="/admin">Admin Panel</a>
					</div>
				</div>
			</section>

			<section class="card toolbar">
				<select id="countryFilter"><option value="">All Countries/Regions</option></select>
				<button id="reloadBtn">Reload Data</button>
				<div id="status">Ready</div>
			</section>

			<section class="card stats">
				<div class="stat"><div class="label">Profiles</div><div class="value" id="profilesCount">0</div></div>
				<div class="stat"><div class="label">Total Fans</div><div class="value" id="totalFans">0</div></div>
				<div class="stat"><div class="label">Avg Fans</div><div class="value" id="avgFans">0</div></div>
			</section>

			<section class="card"><div id="map"></div></section>

			<section class="card">
				<table>
					<thead><tr><th>Rank</th><th>Name</th><th>Handle</th><th>Country/City</th><th>Fans</th></tr></thead>
					<tbody id="rows"></tbody>
				</table>
			</section>
		</div>

		<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>
		<script>
			const statusEl = document.getElementById('status');
			const countryFilterEl = document.getElementById('countryFilter');
			const profilesCountEl = document.getElementById('profilesCount');
			const totalFansEl = document.getElementById('totalFans');
			const avgFansEl = document.getElementById('avgFans');
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
				countryFilterEl.innerHTML = '<option value="">All Countries/Regions</option>';
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

			function updateStats(rows) {
				const totalFans = rows.reduce(function (sum, item) { return sum + Number(item.followers_count || 0); }, 0);
				profilesCountEl.textContent = formatNum(rows.length);
				totalFansEl.textContent = formatNum(totalFans);
				avgFansEl.textContent = rows.length ? formatNum(Math.round(totalFans / rows.length)) : '0';
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
				updateStats(rows);
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
				--bg: #eef4fb;
				--card: #ffffff;
				--line: #dae3ef;
				--text: #0f2744;
				--muted: #4f657d;
				--primary: #0f62fe;
			}
			* { box-sizing: border-box; }
			body {
				margin: 0;
				font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
				background: radial-gradient(circle at top right, #d7e7ff 0%, var(--bg) 52%, #edf3ff 100%);
				color: var(--text);
				padding: 20px;
			}
			.wrap { max-width: 980px; margin: 0 auto; display: grid; gap: 14px; }
			.card {
				background: var(--card);
				border: 1px solid var(--line);
				border-radius: 14px;
				padding: 16px;
				box-shadow: 0 8px 20px rgba(6, 24, 44, 0.08);
			}
			.head {
				display: flex;
				justify-content: space-between;
				align-items: center;
				gap: 10px;
			}
			.head h1 { margin: 0; }
			.head-actions { display: flex; gap: 8px; }
			.link-btn {
				display: inline-flex;
				align-items: center;
				text-decoration: none;
				background: var(--primary);
				color: #fff;
				padding: 9px 12px;
				border-radius: 10px;
				font-size: 14px;
			}
			.link-btn.alt { background: #6b778c; }
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
				background: rgba(10, 20, 40, 0.75);
				z-index: 9999;
				padding: 16px;
			}
			.age-gate-box {
				background: #fff;
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
				color: #fff;
			}
			.age-btn.yes { background: var(--primary); }
			.age-btn.no { background: #6b778c; }
			@media (max-width: 700px) {
				.head { flex-direction: column; align-items: flex-start; }
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
				<div class="head-actions">
					<a class="link-btn alt" href="/">Ranking Page</a>
					<a class="link-btn" href="/admin">Admin Panel</a>
				</div>
			</section>

			<section class="card">
				<div class="content">Hello,

I’m a fisting enthusiast and I recently built a simple navigation website to help people quickly discover creators and accounts in the community.

The goal of this site is to make it easier for people to find creators, explore new content, and connect with others who share the same interests.

If you have any suggestions, feedback, or would like to collaborate on improving the project, feel free to reach out.

You can contact me on X:
@fistingguide

Or by email:
fistingguide@proton.me

If you prefer not to appear on the website, just let me know and I will remove your listing.

Thank you and I hope this project can help the community grow.

Best regards



你好，

我是一个拳交爱好者，最近做了一个简单的导航网站，希望帮助大家更方便地发现社区里的创作者和账号。

这个网站的目标是让大家更容易找到创作者、探索新的内容，也让拥有相同兴趣的人更容易彼此连接。

如果你有任何建议、反馈，或者有兴趣一起参与这个项目的开发和改进，欢迎随时联系我。

你可以通过 X 联系我：
@fistingguide

或者通过邮箱：
fistingguide@proton.me

如果你不希望自己的账号出现在网站上，也可以告诉我，我会删除对应的条目。

谢谢，也希望这个项目能帮助社区更好地发展。</div>
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



