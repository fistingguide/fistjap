export type ProfileRecord = {
	id: number;
	name: string;
	handle: string;
	bio: string;
	profile_url: string;
	avatar: string;
	sexual_orientation: string;
	followers_count: number;
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
		return '<li class="empty">暂无数据，请先在管理面板新增记录。</li>';
	}

	return rows
		.map((row, index) => {
			const rank = index + 1;
			const rankClass = rank <= 3 ? "top-rank" : "normal-rank";
			const safeName = escapeHtml(row.name || "未命名");
			const safeHandle = escapeHtml(row.handle || "");
			const safeOrientation = escapeHtml(row.sexual_orientation || "同性恋");
			const safeUrl = escapeHtml(row.profile_url || "#");
			const safeBio = escapeHtml(row.bio || "暂无简介");
			const safeAvatar = escapeHtml(row.avatar || "");
			const avatarEl = safeAvatar
				? `<img class="avatar" src="${safeAvatar}" alt="${safeName}" referrerpolicy="no-referrer" loading="lazy" />`
				: `<div class="avatar placeholder">无图</div>`;

			return `
				<li class="leaderboard-item">
					<div class="card-top">
						<div class="rank ${rankClass}">#${rank}</div>
						<div class="badges">
							<div class="badge">性取向 ${safeOrientation}</div>
							<div class="badge">粉丝 ${row.followers_count}</div>
						</div>
					</div>
					<div class="identity">
						${avatarEl}
						<div>
							<a class="name-link" href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeName}</a>
							<div class="handle">${safeHandle}</div>
						</div>
					</div>
					<div class="bio">${safeBio}</div>
				</li>
			`;
		})
		.join("");
}

export function renderLeaderboardPage(rows: ProfileRecord[]): string {
	return `
<!DOCTYPE html>
<html lang="zh-CN">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>账号粉丝榜单</title>
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
			.header a {
				color: #fff;
				text-decoration: none;
				border: 1px solid rgba(255, 255, 255, 0.5);
				padding: 8px 12px;
				border-radius: 10px;
				font-size: 14px;
			}
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
					min-height: 270px;
					align-content: start;
					transition: transform 0.15s ease, box-shadow 0.15s ease;
				}
				.leaderboard-item:hover {
					transform: translateY(-2px);
					box-shadow: 0 10px 24px rgba(9, 30, 66, 0.09);
				}
				.card-top {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
				.rank { font-size: 17px; font-weight: 800; color: var(--muted); }
				.top-rank { color: var(--top); }
				.badges {
					display: flex;
					gap: 6px;
					align-items: center;
				}
				.badge {
					font-size: 11px;
					color: var(--muted);
					background: #eef3ff;
					padding: 4px 8px;
					border-radius: 999px;
					white-space: nowrap;
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
				.placeholder {
					display: grid;
					place-items: center;
					font-size: 11px;
					color: var(--muted);
				}
				.name-link {
					font-size: 21px;
					font-weight: 700;
					color: var(--text);
					text-decoration: none;
				}
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
				@media (max-width: 1280px) {
					.list { grid-template-columns: repeat(4, minmax(0, 1fr)); }
				}
				@media (max-width: 980px) {
					.list { grid-template-columns: repeat(3, minmax(0, 1fr)); }
				}
				@media (max-width: 720px) {
					.header { flex-direction: column; align-items: flex-start; }
					.header h1 { font-size: 24px; }
					.list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
					.panel { width: 94vw; max-width: 94vw; }
				}
				@media (max-width: 460px) {
					.list { grid-template-columns: 1fr; }
				}
			</style>
		</head>
	<body>
		<section class="panel">
			<header class="header">
				<div>
					<h1>账号粉丝榜单</h1>
					<p>排序规则：粉丝数降序，ID 升序</p>
				</div>
				<a href="/admin">打开数据库管理面板</a>
			</header>
			<ol class="list">
				${renderLeaderboardRows(rows)}
			</ol>
		</section>
	</body>
</html>
`;
}

export function renderAdminPage(): string {
	return `
<!DOCTYPE html>
<html lang="zh-CN">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>数据库管理面板</title>
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
			.wrap { max-width: 1100px; margin: 0 auto; display: grid; gap: 16px; }
			.card {
				background: var(--card);
				border: 1px solid var(--line);
				border-radius: 16px;
				padding: 16px;
				box-shadow: 0 8px 24px rgba(9, 30, 66, 0.08);
			}
			h1 { margin: 0 0 6px; font-size: 28px; }
			.sub { color: var(--muted); margin-bottom: 0; }
			.toolbar {
				display: grid;
				grid-template-columns: 1fr auto auto;
				gap: 8px;
				align-items: center;
			}
			input, textarea, button {
				font: inherit;
				padding: 10px 12px;
				border-radius: 10px;
				border: 1px solid var(--line);
			}
			textarea { min-height: 70px; resize: vertical; }
			button { cursor: pointer; border: none; background: var(--primary); color: #fff; }
			button.secondary { background: #6b778c; }
			button.danger { background: var(--danger); }
			.form {
				display: grid;
				grid-template-columns: repeat(2, minmax(0, 1fr));
				gap: 10px;
			}
			.form .full { grid-column: 1 / -1; }
			table { width: 100%; border-collapse: collapse; }
			th, td {
				padding: 10px 8px;
				border-bottom: 1px solid var(--line);
				text-align: left;
				vertical-align: top;
				font-size: 14px;
			}
			th { color: var(--muted); font-weight: 600; }
			.actions { display: flex; gap: 8px; }
			.handle { color: var(--muted); font-size: 12px; }
			.status { color: var(--muted); font-size: 13px; }
			@media (max-width: 800px) {
				.toolbar { grid-template-columns: 1fr; }
				.form { grid-template-columns: 1fr; }
				table { font-size: 12px; }
			}
		</style>
	</head>
	<body>
		<div class="wrap">
			<section class="card">
				<h1>数据库管理面板</h1>
				<p class="sub">支持账号数据增删改查，数据表：profiles。<a href="/">查看榜单页</a></p>
			</section>

			<section class="card">
				<div class="toolbar">
					<input id="keyword" placeholder="搜索昵称 / 账号 / 简介" />
					<button id="searchBtn">查询</button>
					<button id="resetBtn" class="secondary">重置</button>
				</div>
			</section>

			<section class="card">
				<form id="profileForm" class="form">
					<input type="hidden" id="id" />
					<input id="name" placeholder="昵称" />
					<input id="handle" placeholder="账号（例如 @demo）" required />
					<input id="orientation" value="同性恋" placeholder="性取向" />
					<input id="followers" type="number" min="0" value="20" placeholder="粉丝数" />
					<input id="profileUrl" class="full" placeholder="主页链接" />
					<input id="avatar" class="full" placeholder="头像链接" />
					<textarea id="bio" class="full" placeholder="简介"></textarea>
					<div class="full actions">
						<button type="submit" id="submitBtn">新增</button>
						<button type="button" id="cancelEditBtn" class="secondary">取消编辑</button>
					</div>
				</form>
				<p class="status" id="status">就绪</p>
			</section>

			<section class="card">
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>账号信息</th>
							<th>性取向</th>
							<th>粉丝数</th>
							<th>操作</th>
						</tr>
					</thead>
					<tbody id="rows"></tbody>
				</table>
			</section>
		</div>

		<script>
			let currentRows = [];
			let editingId = null;

			const els = {
				keyword: document.getElementById('keyword'),
				searchBtn: document.getElementById('searchBtn'),
				resetBtn: document.getElementById('resetBtn'),
				rows: document.getElementById('rows'),
				status: document.getElementById('status'),
				form: document.getElementById('profileForm'),
				id: document.getElementById('id'),
				name: document.getElementById('name'),
				handle: document.getElementById('handle'),
				bio: document.getElementById('bio'),
				profileUrl: document.getElementById('profileUrl'),
				avatar: document.getElementById('avatar'),
				orientation: document.getElementById('orientation'),
				followers: document.getElementById('followers'),
				submitBtn: document.getElementById('submitBtn'),
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

			function renderRows() {
				if (!currentRows.length) {
					els.rows.innerHTML = '<tr><td colspan="5">暂无数据</td></tr>';
					return;
				}

				els.rows.innerHTML = currentRows.map(function (row) {
					return '' +
						'<tr>' +
							'<td>' + row.id + '</td>' +
							'<td><div><strong>' + esc(row.name || '未命名') + '</strong></div><div class="handle">' + esc(row.handle) + '</div></td>' +
							'<td>' + esc(row.sexual_orientation) + '</td>' +
							'<td>' + row.followers_count + '</td>' +
							'<td><div class="actions">' +
								'<button data-action="edit" data-id="' + row.id + '">编辑</button>' +
								'<button class="danger" data-action="delete" data-id="' + row.id + '">删除</button>' +
							'</div></td>' +
						'</tr>';
				}).join('');
			}

			function resetForm() {
				editingId = null;
				els.id.value = '';
				els.name.value = '';
				els.handle.value = '';
				els.bio.value = '';
				els.profileUrl.value = '';
				els.avatar.value = '';
				els.orientation.value = '同性恋';
				els.followers.value = '20';
				els.submitBtn.textContent = '新增';
			}

			function fillForm(row) {
				editingId = row.id;
				els.id.value = String(row.id);
				els.name.value = row.name || '';
				els.handle.value = row.handle || '';
				els.bio.value = row.bio || '';
				els.profileUrl.value = row.profile_url || '';
				els.avatar.value = row.avatar || '';
				els.orientation.value = row.sexual_orientation || '同性恋';
				els.followers.value = String(row.followers_count || 0);
				els.submitBtn.textContent = '保存修改';
			}

			async function loadRows() {
				setStatus('加载中...');
				const keyword = els.keyword.value.trim();
				const query = keyword ? '?keyword=' + encodeURIComponent(keyword) : '';
				const res = await fetch('/api/profiles' + query);
				const data = await res.json();
				currentRows = Array.isArray(data.results) ? data.results : [];
				renderRows();
				setStatus('共 ' + currentRows.length + ' 条记录');
			}

			function collectPayload() {
				return {
					name: els.name.value,
					handle: els.handle.value,
					bio: els.bio.value,
					profileUrl: els.profileUrl.value,
					avatar: els.avatar.value,
					sexualOrientation: els.orientation.value,
					followersCount: Number(els.followers.value || '0')
				};
			}

			async function submitForm(event) {
				event.preventDefault();
				if (!els.handle.value.trim()) {
					setStatus('账号不能为空');
					return;
				}

				const payload = collectPayload();
				const method = editingId ? 'PUT' : 'POST';
				const url = editingId ? '/api/profiles/' + editingId : '/api/profiles';

				setStatus('提交中...');
				const res = await fetch(url, {
					method,
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(payload)
				});

				if (!res.ok) {
					const msg = await res.text();
					setStatus('提交失败：' + msg);
					return;
				}

				setStatus(editingId ? '更新成功' : '新增成功');
				resetForm();
				await loadRows();
			}

			async function handleDelete(id) {
				if (!confirm('确认删除 ID ' + id + ' 吗？')) return;
				setStatus('删除中...');
				const res = await fetch('/api/profiles/' + id, { method: 'DELETE' });
				if (!res.ok) {
					const msg = await res.text();
					setStatus('删除失败：' + msg);
					return;
				}
				setStatus('删除成功');
				await loadRows();
			}

			els.rows.addEventListener('click', function (event) {
				const target = event.target;
				if (!(target instanceof HTMLElement)) return;
				const action = target.dataset.action;
				const id = Number(target.dataset.id || '0');
				if (!id || !action) return;

				if (action === 'edit') {
					const row = currentRows.find(function (item) { return item.id === id; });
					if (row) fillForm(row);
				}

				if (action === 'delete') {
					handleDelete(id);
				}
			});

			els.form.addEventListener('submit', submitForm);
			els.searchBtn.addEventListener('click', loadRows);
			els.resetBtn.addEventListener('click', function () {
				els.keyword.value = '';
				loadRows();
			});
			els.cancelEditBtn.addEventListener('click', resetForm);

			loadRows();
		</script>
	</body>
</html>
`;
}
