
			const INITIAL_ADMIN_MODE = "create";
			let currentRows = [];
			let editingId = null;
			let locationCandidates = [];
			let locationDebounce = null;
			let locationMap = null;
			let locationMarker = null;
			let selectedLat = 35.7512;
			let selectedLng = 139.7093;
			let adminWritePassword = '';
			let reverseRequestSeq = 0;
			const MODE_CREATE = 'create';
			const MODE_EDIT = 'edit';
			const MODE_DELETE = 'delete';
			const MODE_HOME = 'home';
			let currentMode = INITIAL_ADMIN_MODE;

			const els = {
				modeTitle: document.getElementById('adminModeTitle'),
				modeCreateBtn: document.getElementById('modeCreateBtn'),
				modeEditBtn: document.getElementById('modeEditBtn'),
				modeDeleteBtn: document.getElementById('modeDeleteBtn'),
				searchSection: document.getElementById('searchSection'),
				formSection: document.getElementById('formSection'),
				deleteSection: document.getElementById('deleteSection'),
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
				telegram: document.getElementById('telegram'),
				bio: document.getElementById('bio'),
				profileUrl: document.getElementById('profileUrl'),
				avatar: document.getElementById('avatar'),
				avatarPreview: document.getElementById('avatarPreview'),
				orientation: document.getElementById('orientation'),
				followers: document.getElementById('followers'),
				country: document.getElementById('country'),
				region: document.getElementById('region'),
				district: document.getElementById('district'),
				submitBtn: document.getElementById('submitBtn'),
				cancelEditBtn: document.getElementById('cancelEditBtn'),
				deleteOnlyBtn: document.getElementById('deleteOnlyBtn'),
				deleteTargetText: document.getElementById('deleteTargetText')
			};

			function t(key, fallback) {
				if (typeof window.__t === 'function') {
					return window.__t(key, fallback || '');
				}
				return fallback || '';
			}

			function fmt(template, vars) {
				return String(template || '').replace(/{(w+)}/g, function (_, name) {
					return String(vars && vars[name] != null ? vars[name] : '');
				});
			}

			function getModeFromUrl() {
				return INITIAL_ADMIN_MODE;
			}

			function setModeInUrl(mode) {
				void mode;
			}

			function updateModeTitle() {
				if (!els.modeTitle) return;
				if (currentMode === MODE_CREATE) {
					els.modeTitle.textContent = t('admin_mode_title_create', 'Add performer');
					return;
				}
				if (currentMode === MODE_EDIT) {
					els.modeTitle.textContent = t('admin_mode_title_edit', 'Edit performer');
					return;
				}
				if (currentMode === MODE_DELETE) {
					els.modeTitle.textContent = t('admin_mode_title_delete', 'Delete performer');
					return;
				}
				els.modeTitle.textContent = t('admin_mode_title_home', 'Choose action');
			}

			function updateDeleteTarget() {
				if (!els.deleteTargetText || !els.deleteOnlyBtn) return;
				if (!editingId) {
					els.deleteTargetText.textContent = t('admin_delete_hint', 'Please search and select an existing performer first.');
					els.deleteOnlyBtn.disabled = true;
					return;
				}
				const name = String(els.name.value || 'Unnamed').trim();
				const handle = String(els.handle.value || '').trim();
				els.deleteTargetText.textContent = fmt(
					t('admin_delete_selected', 'Selected: {name} ({handle}) ID {id}'),
					{ name, handle, id: editingId }
				);
				els.deleteOnlyBtn.disabled = false;
			}

			function applyMode(mode) {
				currentMode = mode;
				if (els.searchSection) els.searchSection.hidden = (mode === MODE_CREATE || mode === MODE_HOME);
				if (els.formSection) els.formSection.hidden = (mode === MODE_DELETE || mode === MODE_HOME);
				if (els.deleteSection) els.deleteSection.hidden = mode !== MODE_DELETE;
				if (els.locationSearch) {
					const lockLocationInput = (mode === MODE_CREATE || mode === MODE_EDIT);
					els.locationSearch.readOnly = lockLocationInput;
					els.locationSearch.setAttribute('aria-readonly', lockLocationInput ? 'true' : 'false');
				}
				if (els.modeCreateBtn) els.modeCreateBtn.classList.toggle('active', mode === MODE_CREATE);
				if (els.modeEditBtn) els.modeEditBtn.classList.toggle('active', mode === MODE_EDIT);
				if (els.modeDeleteBtn) els.modeDeleteBtn.classList.toggle('active', mode === MODE_DELETE);
				if (els.handle) {
					const lockHandle = mode === MODE_EDIT;
					els.handle.readOnly = lockHandle;
					els.handle.setAttribute('aria-readonly', lockHandle ? 'true' : 'false');
				}
				setEditingState(Boolean(editingId));
				setModeInUrl(mode);
				updateModeTitle();
				updateDeleteTarget();
			}

			function selectedText(district, region, country) {
				return t('admin_selected_prefix', 'Selected:') + ' ' + district + ' / ' + region + ' / ' + country;
			}

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

			function normalizeHandleValue(raw) {
				return String(raw || '').trim().replace(/^@+/, '');
			}

			function formatProfileSummary(profile, fallbackHandle) {
				const safe = profile && typeof profile === 'object' ? profile : {};
				const name = String(safe.name || '').trim();
				const handle = String(safe.handle || fallbackHandle || '').trim();
				const followers = safe.followers_count === null || safe.followers_count === undefined ? '' : String(safe.followers_count);
				const telegram = String(safe.telegram || '').trim();
				const orientation = String(safe.sexual_orientation || '').trim();
				const country = String(safe.country || '').trim();
				const region = String((safe.region || safe.province) || '').trim();
				const district = String((safe.district || safe.city) || '').trim();
				const lat = Number(safe.lat);
				const lng = Number(safe.lng);
				const lines = [];
				if (name) lines.push('Display Name: ' + name);
				if (handle) lines.push('X Handle: @' + handle.replace(/^@+/, ''));
				if (followers) lines.push('Followers: ' + followers);
				if (telegram) lines.push('Telegram: ' + telegram);
				if (orientation) lines.push('Orientation: ' + orientation);
				if (district || region || country) lines.push('Location: ' + [district, region, country].filter(Boolean).join(' / '));
				if (Number.isFinite(lat) && Number.isFinite(lng)) lines.push('Coordinates: ' + lat + ', ' + lng);
				return lines.join('
');
			}

			function setSelectedPoint(lat, lng) {
				const nLat = Number(lat);
				const nLng = Number(lng);
				if (!Number.isFinite(nLat) || !Number.isFinite(nLng)) return;
				selectedLat = nLat;
				selectedLng = nLng;
			}

			function showSuccessDialog(message) {
				window.alert(message);
			}

			function updateAvatarPreview() {
				const emptyAvatar = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
				const url = String(els.avatar.value || '').trim();
				if (!url) {
					els.avatarPreview.src = emptyAvatar;
					return;
				}
				els.avatarPreview.src = url;
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
				setSelectedPoint(item.lat, item.lng);
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
				els.locationSelected.textContent = selectedText(nextDistrict, nextRegion, nextCountry);
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
				if (els.locationSearch && els.locationSearch.readOnly) return;
				if (locationDebounce) clearTimeout(locationDebounce);
				locationDebounce = setTimeout(function () {
					fetchLocationSuggestions(els.locationSearch.value.trim());
				}, 250);
			}

			function applyLocationFromInput() {
				if (els.locationSearch && els.locationSearch.readOnly) return;
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
				if (currentMode === MODE_EDIT) {
					els.submitBtn.textContent = t('admin_btn_save_changes', 'Confirm Edit');
					els.submitBtn.disabled = !isEditing;
					els.cancelEditBtn.style.display = isEditing ? '' : 'none';
				} else if (currentMode === MODE_CREATE) {
					els.submitBtn.textContent = t('admin_btn_create', 'Create');
					els.submitBtn.disabled = false;
					els.cancelEditBtn.style.display = 'none';
				}
				updateDeleteTarget();
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
				els.telegram.value = '';
				els.bio.value = '';
				els.profileUrl.value = '';
				els.avatar.value = '';
				els.orientation.value = 'Gay';
				els.followers.value = '';
				els.country.value = 'Japan';
				els.region.value = 'Tokyo';
				els.district.value = 'Itabashi';
				setSelectedPoint(35.7512, 139.7093);
				els.locationSearch.value = 'Itabashi, Tokyo, Japan';
				els.locationSelected.textContent = selectedText('Itabashi', 'Tokyo', 'Japan');
				renderLocationPreview(35.7512, 139.7093);
				updateAvatarPreview();
				setEditingState(false);
				updateDeleteTarget();
			}

			function fillForm(row) {
				editingId = row.id;
				els.id.value = String(row.id);
				els.name.value = row.name || '';
				els.handle.value = row.handle || '';
				els.telegram.value = row.telegram || '';
				els.bio.value = row.bio || '';
				els.profileUrl.value = row.profile_url || '';
				els.avatar.value = row.avatar || '';
				els.orientation.value = row.sexual_orientation || 'Gay';
				els.followers.value = row.followers_count === null || row.followers_count === undefined ? '' : String(row.followers_count);
				els.country.value = row.country || 'Japan';
				els.region.value = (row.region || row.province) || 'Tokyo';
				els.district.value = (row.district || row.city) || 'Itabashi';
				els.locationSearch.value = [els.district.value, els.region.value, els.country.value].filter(Boolean).join(', ');
				els.locationSelected.textContent = selectedText(els.district.value, els.region.value, els.country.value);
				const rowLat = Number(row.lat);
				const rowLng = Number(row.lng);
				if (Number.isFinite(rowLat) && Number.isFinite(rowLng)) {
					setSelectedPoint(rowLat, rowLng);
					renderLocationPreview(rowLat, rowLng);
				} else {
					selectedLat = NaN;
					selectedLng = NaN;
					refreshLocationPreviewByValue();
				}
				updateAvatarPreview();
				setEditingState(true);
				updateDeleteTarget();
			}

			function renderSuggestions(rows) {
				els.handleSuggestions.innerHTML = rows.map(function (row) {
					const label = (row.name || 'Unnamed') + ' | ' + ((row.district || row.city) || 'Itabashi') + '/' + ((row.region || row.province) || 'Tokyo') + '/' + (row.country || 'Japan');
					return '<option value="' + esc(row.handle) + '" label="' + esc(label) + '"></option>';
				}).join('');
			}

			function selectByHandle(handle) {
				if (currentMode === MODE_CREATE) return;
				const normalizedTarget = normalizeHandleValue(handle);
				const target = currentRows.find(function (row) {
					return String(row.handle || '').toLowerCase() === normalizedTarget.toLowerCase();
				});
				if (!target) {
					setStatus(t('admin_status_no_exact_match_mode', 'No exact handle match for this mode.'));
					resetForm();
					updateDeleteTarget();
					return;
				}
				fillForm(target);
				setStatus('Selected ID ' + target.id + '.');
			}

			async function loadSuggestions() {
				if (currentMode === MODE_CREATE) return;
				const keyword = normalizeHandleValue(els.handleSearch.value);
				if (!keyword) {
					currentRows = [];
					renderSuggestions([]);
					resetForm();
					setStatus('');
					return;
				}

				const query = '?keyword=' + encodeURIComponent(keyword) + '&limit=20';
				const res = await fetch('/api/profiles' + query);
				const data = await res.json();
				const rows = Array.isArray(data.results) ? data.results : [];
				currentRows = rows.filter(function (row) {
					return String(row.handle || '').toLowerCase().includes(keyword.toLowerCase());
				});
				renderSuggestions(currentRows);
				setStatus(fmt(t('admin_status_matched_handles', 'Matched {count} handles'), { count: currentRows.length }));
				selectByHandle(keyword);
			}


			function collectPayload() {
				const followersRaw = String(els.followers.value || '').trim();
				const followersCount = followersRaw ? Number(followersRaw) : null;
				return {
					name: els.name.value,
					handle: String(els.handle.value || '').trim(),
					telegram: els.telegram.value,
					bio: els.bio.value,
					profileUrl: els.profileUrl.value,
					avatar: els.avatar.value,
					sexualOrientation: els.orientation.value,
					followersCount: Number.isFinite(followersCount) ? followersCount : null,
					lat: selectedLat,
					lng: selectedLng
				};
			}

			async function submitForm(event) {
				event.preventDefault();
				if (currentMode === MODE_DELETE) return;
				if (!els.handle.value.trim()) {
					setStatus(t('admin_status_handle_required', 'Handle is required'));
					return;
				}
				if (currentMode === MODE_EDIT && !editingId) {
					setStatus(t('admin_status_pick_existing_first', 'Please search and select an existing performer first.'));
					return;
				}

				const payload = collectPayload();
				if (!Number.isFinite(Number(payload.lat)) || !Number.isFinite(Number(payload.lng))) {
					setStatus('Please select a valid location point on the map');
					return;
				}
				const isUpdate = currentMode === MODE_EDIT;
				const method = isUpdate ? 'PUT' : 'POST';
				const url = isUpdate ? '/api/profiles/' + editingId : '/api/profiles';
				if (!adminWritePassword) {
					const pwd = window.prompt('Enter delete password to continue:');
					if (!pwd) {
						setStatus('Submit cancelled: password is required.');
						return;
					}
					adminWritePassword = pwd;
				}

				setStatus(t('admin_status_submitting', 'Submitting...'));
				const res = await fetch(url, {
					method,
					headers: {
						'content-type': 'application/json',
						'x-delete-password': adminWritePassword
					},
					body: JSON.stringify(payload)
				});

				if (!res.ok) {
					const msg = await res.text();
					if (res.status === 403 && msg.indexOf('invalid delete password') !== -1) {
						adminWritePassword = '';
						window.alert('密码输入错误');
						return;
					}
					setStatus('Submit failed: ' + msg);
					return;
				}
				const result = await res.json();

				setStatus(isUpdate ? t('admin_status_updated_success', 'Updated successfully') : t('admin_status_created_success', 'Created successfully'));
				const actionText = isUpdate
					? t('admin_alert_updated_success', 'Profile updated successfully.')
					: t('admin_alert_created_success', 'Profile created successfully.');
				const summary = formatProfileSummary(result && result.profile ? result.profile : null, payload.handle);
				showSuccessDialog(summary ? (actionText + '

' + summary) : actionText);
				resetForm();
				if (currentMode === MODE_EDIT) {
					els.handleSearch.value = payload.handle;
					await loadSuggestions();
				}
			}

			async function handleDelete() {
				if (currentMode !== MODE_DELETE) return;
				if (!editingId) {
					setStatus('Please select a handle first.');
					return;
				}
				if (!confirm('Delete ID ' + editingId + '?')) return;
				const deletePassword = window.prompt('Enter delete password to continue:');
				if (!deletePassword) {
					setStatus('Delete cancelled: password is required.');
					return;
				}

				setStatus('Deleting...');
				const res = await fetch('/api/profiles/' + editingId, {
					method: 'DELETE',
					headers: { 'x-delete-password': deletePassword }
				});
				if (!res.ok) {
					const msg = await res.text();
					if (res.status === 403 && msg.indexOf('invalid delete password') !== -1) {
						window.alert('密码输入错误');
						return;
					}
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
			if (els.modeCreateBtn) {
				els.modeCreateBtn.addEventListener('click', function () {
					window.location.href = '/admin/create';
				});
			}
			if (els.modeEditBtn) {
				els.modeEditBtn.addEventListener('click', function () {
					window.location.href = '/admin/edit';
				});
			}
			if (els.modeDeleteBtn) {
				els.modeDeleteBtn.addEventListener('click', function () {
					window.location.href = '/admin/delete';
				});
			}
			els.searchBtn.addEventListener('click', loadSuggestions);
			let handleSearchDebounceTimer = null;
			els.handleSearch.addEventListener('input', function () {
				if (handleSearchDebounceTimer) {
					clearTimeout(handleSearchDebounceTimer);
				}
				handleSearchDebounceTimer = setTimeout(function () {
					handleSearchDebounceTimer = null;
					loadSuggestions();
				}, 300);
			});
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
				els.avatarPreview.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
			});
			if (els.deleteOnlyBtn) {
				els.deleteOnlyBtn.addEventListener('click', handleDelete);
			}
			els.resetBtn.addEventListener('click', function () {
				els.handleSearch.value = '';
				renderSuggestions([]);
				renderLocationSuggestions([]);
				locationCandidates = [];
				els.locationDropdown.classList.remove('show');
				els.locationDropdown.style.display = 'none';
				resetForm();
				setStatus(t('admin_status_ready', 'Ready'));
			});
			els.cancelEditBtn.addEventListener('click', resetForm);

			applyMode(getModeFromUrl());
			updateAvatarPreview();
			renderLocationPreview(35.7512, 139.7093);
			setStatus('');
		