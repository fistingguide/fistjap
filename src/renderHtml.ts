export type ProfileRecord = {
	id: number;
	name: string;
	handle: string;
	telegram?: string;
	bio: string;
	profile_url: string;
	avatar: string;
	sexual_orientation: string;
	followers_count: number;
	total_credit?: number;
	country: string;
	region: string;
	district: string;
	lat?: number;
	lng?: number;
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
	author_avatar?: string;
	author_handle?: string;
	author_url?: string;
	is_fixed?: boolean;
};

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function formatCredit(value: unknown): string {
	const numeric = Number(value ?? 0);
	if (!Number.isFinite(numeric)) return "0";
	return Number.isInteger(numeric) ? String(numeric) : numeric.toFixed(1).replace(/\.0$/, "");
}

function sanitizeMarkdownUrl(url: string): string {
	const raw = String(url || "").trim();
	if (/^(https?:|mailto:)/i.test(raw)) return escapeHtml(raw);
	return "#";
}

function renderMarkdownInline(text: string): string {
	let out = escapeHtml(String(text || ""));
	const codeTokens: string[] = [];
	out = out.replace(/`([^`]+)`/g, (_m, code) => {
		const idx = codeTokens.push(`<code>${code}</code>`) - 1;
		return `@@CODE_${idx}@@`;
	});
	out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, url) => {
		const safeUrl = sanitizeMarkdownUrl(url);
		return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${label}</a>`;
	});
	out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
	out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
	out = out.replace(/@@CODE_(\d+)@@/g, (_m, idx) => codeTokens[Number(idx)] || "");
	return out;
}

function renderMarkdown(markdown: string): string {
	const lines = String(markdown || "").replace(/\r\n?/g, "\n").split("\n");
	const html: string[] = [];
	let i = 0;
	let inOrderedList = false;

	const closeOrderedList = () => {
		if (inOrderedList) {
			html.push("</ol>");
			inOrderedList = false;
		}
	};

	while (i < lines.length) {
		const line = lines[i].trim();
		if (!line) {
			closeOrderedList();
			i += 1;
			continue;
		}

		const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
		if (headingMatch) {
			closeOrderedList();
			const level = Math.min(6, headingMatch[1].length + 1);
			html.push(`<h${level}>${renderMarkdownInline(headingMatch[2])}</h${level}>`);
			i += 1;
			continue;
		}

		const orderedMatch = line.match(/^\d+\.\s+(.+)$/);
		if (orderedMatch) {
			if (!inOrderedList) {
				html.push("<ol>");
				inOrderedList = true;
			}
			html.push(`<li>${renderMarkdownInline(orderedMatch[1])}</li>`);
			i += 1;
			continue;
		}

		closeOrderedList();
		const paragraphLines: string[] = [line];
		i += 1;
		while (i < lines.length) {
			const nextLine = lines[i].trim();
			if (!nextLine || /^(#{1,6})\s+/.test(nextLine) || /^\d+\.\s+/.test(nextLine)) break;
			paragraphLines.push(nextLine);
			i += 1;
		}
		html.push(`<p>${renderMarkdownInline(paragraphLines.join("<br>"))}</p>`);
	}

	closeOrderedList();
	return html.join("");
}

type LocaleCode = "en" | "zh-CN" | "zh-TW" | "ja" | "ko" | "es" | "pt" | "th" | "vi";

const LOCALE_CODES: LocaleCode[] = ["en", "zh-CN", "zh-TW", "ja", "ko", "es", "pt", "th", "vi"];
const RANKING_NOTICE_EN =
	"This site only lists male users. Accounts are rotated in the spotlight to ensure fair exposure. Map locations are blurred for illustration only and are not real addresses. Users can add themselves or request deletion through the Telegram group. The book icon is our blog. For any issue, contact X: @fistingguide.";
const RANKING_NOTICE_ZH_CN =
	"本网站仅收录男性用户；账号轮换置顶以保证公平展示；地图位置为模糊示意，不涉及真实地址；用户可通过 TG 群组自行添加或申请删除信息；书籍图标是我们的博客；任何问题请联系 X: @fistingguide。";
const TH_MESSAGES: Record<string, string> = {
	page_title_ranking: "รายชื่อนักแสดง",
	page_title_admin: "แผงผู้ดูแลฐานข้อมูล",
	page_title_dashboard: "แผนที่",
	page_title_about: "เกี่ยวกับ",
	page_title_wiki: "Fisting Wiki",
	page_title_wiki_article: "Fisting Wiki",
	heading_ranking: "รายชื่อนักแสดง",
	heading_language: "ภาษา",
	heading_add: "เพิ่มใหม่",
	heading_star: "แผนที่",
	heading_about: "เกี่ยวกับ",
	heading_wiki: "Fisting Wiki",
	nav_ranking: "รายชื่อนักแสดง",
	nav_add: "เพิ่มใหม่",
	nav_star: "แผนที่",
	nav_wiki: "บทความ",
	nav_about: "เกี่ยวกับ",
	dashboard_visit_select: "เลือกนักแสดงบนแผนที่ก่อน",
	dashboard_visit_named: "ไปที่ {name}",
	country_region: "ประเทศ(ภูมิภาค)",
	all_option: "ทั้งหมด",
	friendly_links: "ความร่วมมือชุมชน",
	view_articles: "ดูบทความ",
	partner_qutoys: "QUTOYS (ส่วนลด 10%)",
	ranking_location_notice:
		"เว็บไซต์นี้รวบรวมเฉพาะผู้ใช้ผู้ชายเท่านั้น บัญชีจะถูกสลับปักหมุดเพื่อให้แสดงผลอย่างเป็นธรรม ตำแหน่งบนแผนที่เป็นการแสดงแบบเบลอเพื่อประกอบเท่านั้นและไม่ใช่ที่อยู่จริง ผู้ใช้สามารถเพิ่มข้อมูลเองหรือขอลบข้อมูลผ่านกลุ่ม TG ได้ ไอคอนรูปหนังสือคือบล็อกของเรา หากมีปัญหาใด ๆ โปรดติดต่อ X: @fistingguide",
	spotlight_title: "ไฮไลต์หมุนเวียน",
	spotlight_next_switch: "สลับอีกใน {time}",
	age_title: "ยืนยันอายุ",
	age_desc: "คุณต้องมีอายุ 18 ปีขึ้นไปเพื่อเข้าสู่เว็บไซต์นี้ คุณอายุ 18 ปีขึ้นไปหรือไม่?",
	age_yes: "ใช่ ฉันอายุ 18+",
	age_no: "ไม่",
	age_denied: "ปฏิเสธการเข้าถึง เว็บไซต์นี้สำหรับผู้ใหญ่ 18+ เท่านั้น",
	article_by: "โดย",
	article_updated: "อัปเดต",
	wiki_submit_hint: "ส่งบทความไปยัง fistingguide",
	about_description:
		"สวัสดี ฉันเป็นผู้ที่สนใจ fisting และเพิ่งสร้างเว็บไซต์นำทางแบบเรียบง่ายเพื่อช่วยให้ค้นหาครีเอเตอร์และบัญชีในชุมชนได้รวดเร็วขึ้น เป้าหมายของเว็บไซต์นี้คือช่วยให้ค้นพบครีเอเตอร์ สำรวจเนื้อหาใหม่ และเชื่อมต่อกับผู้ที่มีความสนใจเดียวกันได้ง่ายขึ้น หากคุณมีข้อเสนอแนะ คำติชม หรืออยากร่วมพัฒนาโครงการนี้ สามารถติดต่อฉันได้ที่ X: @fistingguide หรืออีเมล: fistingguide@proton.me หากคุณไม่ต้องการให้แสดงบนเว็บไซต์ แจ้งฉันได้และฉันจะลบรายการของคุณ ขอบคุณ และหวังว่าโครงการนี้จะช่วยให้ชุมชนเติบโต",
	campaign_title: "แคมเปญ",
	author_call_title: "รับบทความ",
	author_call_page_title: "รับบทความ",
	author_call_back_home: "กลับหน้าหลัก",
	author_call_intro:
		"เปิดกิจกรรมระยะยาวสำหรับการรวบรวมและแบ่งปันประสบการณ์เกี่ยวกับ Fisting แล้ว!\nสวัสดีทุกคน ฉันเริ่มกิจกรรมระยะยาวเพื่อแบ่งปันประสบการณ์และรวบรวมเรื่องราวเกี่ยวกับ Fisting ยินดีต้อนรับทุกคนที่สนใจเข้าร่วม\n\nเนื้อหาที่เปิดรับหลักๆ:\nวิธีเริ่มเล่นอย่างปลอดภัย (ขั้นตอนสำหรับมือใหม่และการเตรียมตัว)\nวิธีทำ enema ที่ถูกต้อง ข้อควรระวัง และประสบการณ์ที่ใช้ได้จริง\nเทคนิคความปลอดภัยระหว่างการเล่น การเลือกสารหล่อลื่น ปัญหาที่พบบ่อยและวิธีแก้\nเรื่องราวจริงจากประสบการณ์ของคุณเอง (solo หรือกับคู่) ความรู้สึกและข้อคิด\nคำแนะนำของเล่น ประสบการณ์การใช้งาน และการดูแลรักษา\n\nไม่ว่าคุณจะเป็นมือใหม่ที่สนใจหรือผู้มีประสบการณ์ก็ส่งมาได้ทั้งหมด ความยาวไม่จำกัด และส่งแบบไม่เปิดเผยตัวตนได้\n\nคำชี้แจงความปลอดภัย:\nFisting เป็นกิจกรรมที่มีความเข้มข้นสูง ความปลอดภัย การค่อยๆ ทำ การหล่อลื่นให้เพียงพอ และความยินยอมของทุกฝ่ายเป็นสิ่งสำคัญมาก เนื้อหาทั้งหมดในกิจกรรมนี้มีไว้เพื่อการแลกเปลี่ยนข้อมูลเท่านั้น ไม่ใช่คำแนะนำทางการแพทย์ โปรดเตรียมตัวให้พร้อม หากรู้สึกไม่สบายให้หยุดทันทีและปรึกษาแพทย์\n\nวิธีส่ง:\nส่ง DM มาทาง X (Twitter/X)\nหรือส่งอีเมล\n\nฉันจะอ่านทุกข้อความอย่างตั้งใจ เคารพความเป็นส่วนตัว และรองรับการโพสต์แบบไม่ระบุตัวตน มาร่วมแบ่งปันประสบการณ์และเรื่องราวเพื่อช่วยให้คนอื่นสำรวจอย่างปลอดภัยและสนุกยิ่งขึ้น~\nส่งมาได้ทาง DM หรืออีเมล ขอบคุณ!",
	event_title: "List Star",
	event_description:
		"โปรเจกต์ List Star เริ่มแล้ว! ตลอด 1 เดือน เราจะโปรโมตผู้ที่ชื่นชอบ Fisting ที่โดดเด่นฟรีบนเว็บไซต์และ X! เมื่อเป็น List Star คุณจะได้รับ\n1. ตำแหน่งเด่นบนลิสต์ทางการ\n2. โปสเตอร์พิเศษ 1 ใบ\n3. โปรโมตผ่านบัญชี X ทางการ\n\nวิธีเข้าร่วม?\nรูปครึ่งตัวท่อนบนที่ปิดบังใบหน้า 1 รูป, วิดีโอ fisting 1 คลิป และคำบรรยาย/คัดลอกเกี่ยวกับวิดีโอนั้น",
	admin_search_placeholder: "ค้นหาด้วยแฮนเดิล X",
	admin_search_hint: "รองรับเฉพาะบัญชีที่มีอยู่ เพื่อแก้ไขข้อมูลที่เกี่ยวข้องหรือลบ",
	admin_search_btn: "ค้นหา",
	admin_reset_btn: "รีเซ็ต",
	admin_label_display_name: "ชื่อที่แสดง",
	admin_ph_display_name: "ชื่อที่แสดง",
	admin_label_x_handle: "แฮนเดิล X",
	admin_ph_x_handle: "แฮนเดิล (เช่น @demo)",
	admin_label_orientation: "รสนิยมทางเพศ",
	admin_ph_orientation: "รสนิยมทางเพศ",
	admin_label_fans_count: "ผู้ติดตาม",
	admin_ph_fans_count: "ผู้ติดตาม",
	admin_label_location: "เขต / ภูมิภาค / ประเทศ (ภูมิภาค)",
	admin_ph_location_search: "ค้นหาประเทศ(ภูมิภาค)หรือเมือง (ค้นหาบนแผนที่)",
	admin_selected_prefix: "ที่เลือก:",
	admin_label_map_preview: "โปรดคลิกตำแหน่งของคุณจนกว่าที่อยู่เริ่มต้นจะเปลี่ยนแปลง",
	admin_label_profile_url: "URL โปรไฟล์",
	admin_ph_profile_url: "URL โปรไฟล์",
	admin_label_avatar_url: "URL รูปโปรไฟล์",
	admin_ph_avatar_url: "URL รูปโปรไฟล์",
	admin_label_bio: "ชีวประวัติ",
	admin_ph_bio: "ชีวประวัติ",
	admin_btn_create: "สร้าง",
	admin_btn_save_changes: "ยืนยันการแก้ไข",
	admin_btn_delete_current: "ลบรายการปัจจุบัน",
	admin_btn_cancel_edit: "ยกเลิกการแก้ไข",
	admin_mode_title_home: "เลือกการทำงาน",
	admin_mode_title_create: "เพิ่มผู้แสดง",
	admin_mode_title_edit: "แก้ไขผู้แสดง",
	admin_mode_title_delete: "ลบผู้แสดง",
	admin_mode_btn_create: "เพิ่มผู้แสดง",
	admin_mode_btn_edit: "แก้ไขผู้แสดง",
	admin_mode_btn_delete: "ลบผู้แสดง",
	admin_delete_hint: "กรุณาค้นหาและเลือกผู้แสดงที่มีอยู่ก่อน",
	admin_delete_selected: "ที่เลือก: {name} ({handle}) ID {id}",
	admin_status_no_exact_match_mode: "ไม่พบแฮนเดิลที่ตรงทั้งหมดสำหรับโหมดนี้",
	admin_status_pick_existing_first: "กรุณาค้นหาและเลือกผู้แสดงที่มีอยู่ก่อน",
	admin_status_ready: "พร้อม",
	admin_status_no_exact_match: "ไม่พบแฮนเดิลที่ตรงทั้งหมด คุณสามารถสร้างรายการใหม่ได้",
	admin_status_matched_handles: "พบแฮนเดิลที่ตรงกัน {count} รายการ",
	admin_status_handle_required: "จำเป็นต้องกรอกแฮนเดิล",
	admin_status_submitting: "กำลังส่ง...",
	admin_status_updated_success: "อัปเดตสำเร็จ",
	admin_status_created_success: "สร้างสำเร็จ",
	admin_alert_updated_success: "อัปเดตโปรไฟล์สำเร็จ",
	admin_alert_created_success: "สร้างโปรไฟล์สำเร็จ",
};
const VI_MESSAGES: Record<string, string> = {
	page_title_ranking: "Danh sach nguoi bieu dien",
	page_title_admin: "Bảng quản trị cơ sở dữ liệu",
	page_title_dashboard: "Bản đồ",
	page_title_about: "Giới thiệu",
	page_title_wiki: "Fisting Wiki",
	page_title_wiki_article: "Fisting Wiki",
	heading_ranking: "Danh sach nguoi bieu dien",
	heading_language: "Ngon ngu",
	heading_add: "Thêm mới",
	heading_star: "Bản đồ",
	heading_about: "Giới thiệu",
	heading_wiki: "Fisting Wiki",
	nav_ranking: "Danh sach nguoi bieu dien",
	nav_add: "Thêm mới",
	nav_star: "Bản đồ",
	nav_wiki: "Bài viết",
	nav_about: "Giới thiệu",
	dashboard_visit_select: "Select a performer on the map first",
	dashboard_visit_named: "Visit {name}",
	country_region: "quoc gia(vung)",
	all_option: "Tat ca",
	friendly_links: "Hop tac cong dong",
	view_articles: "Xem bai viet",
	partner_qutoys: "QUTOYS (giam 10%)",
	ranking_location_notice:
		"Trang web nay chi liệt ke nguoi dung nam. Tai khoan duoc xoay ghim de dam bao hien thi cong bang. Vi tri ban do la vi tri mo phong da lam mo, khong phai dia chi thuc. Nguoi dung co the tu them thong tin hoac yeu cau xoa qua nhom TG. Bieu tuong sach la blog cua chung toi. Moi van de vui long lien he X: @fistingguide.",
	spotlight_title: "Ghim luan phien",
	spotlight_next_switch: "Se doi sau {time}",
	age_title: "Xac nhan do tuoi",
	age_desc: "Ban phai tu 18+ moi co the vao trang nay. Ban co tu 18 tuoi tro len khong?",
	age_yes: "Co, toi 18+",
	age_no: "Khong",
	age_denied: "Tu choi truy cap. Website nay chi danh cho nguoi lon 18+.",
	article_by: "Boi",
	article_updated: "Cap nhat",
	wiki_submit_hint: "gui bai viet cho fistingguide",
	about_description:
		"Xin chao, toi la mot nguoi yeu thich fisting va da tao mot website dieu huong don gian de giup moi nguoi nhanh chong tim thay creator va tai khoan trong cong dong. Muc tieu cua trang la giup tim creator de hon, kham pha noi dung moi va ket noi voi nhung nguoi co cung so thich. Neu ban co goi y, phan hoi hoac muon hop tac cai thien du an, hay lien he toi tren X: @fistingguide hoac email: fistingguide@proton.me. Neu ban khong muon xuat hien tren website, hay bao toi va toi se go danh sach cua ban.",
	campaign_title: "Chiến dịch",
	author_call_title: "Kêu gọi bài viết",
	author_call_page_title: "Kêu gọi bài viết",
	author_call_back_home: "Về trang chủ",
	author_call_intro:
		"Sự kiện dài hạn thu thập và chia sẻ câu chuyện Fisting chính thức bắt đầu!\nXin chào mọi người, mình đang mở một hoạt động dài hạn để chia sẻ kinh nghiệm và thu thập câu chuyện về Fisting. Tất cả những ai quan tâm đều được chào đón.\n\nNội dung chính cần thu thập:\nCách bắt đầu an toàn (các bước cho người mới, chuẩn bị)\nPhương pháp enema đúng, lưu ý và kinh nghiệm thực tế\nKỹ thuật an toàn khi chơi, lựa chọn lubricant, vấn đề thường gặp và cách xử lý\nCâu chuyện fisting thực tế của bản thân (solo hoặc cùng partner), cảm nhận và bài học\nGợi ý toy, trải nghiệm sử dụng và bảo quản\n\nDù bạn là người mới hay đã có nhiều kinh nghiệm đều có thể gửi bài. Bài dài hay ngắn đều được, có thể gửi ẩn danh.\n\nTuyên bố an toàn:\nFisting là hoạt động cường độ cao. An toàn, tiến dần từng bước, bôi trơn đầy đủ và sự đồng thuận của cả hai bên là cực kỳ quan trọng. Mọi nội dung chia sẻ chỉ nhằm mục đích tham khảo, không phải tư vấn y khoa. Hãy luôn chuẩn bị đầy đủ, nếu có bất kỳ khó chịu nào hãy dừng ngay và tham khảo bác sĩ.\n\nCách gửi bài:\nNhắn tin riêng qua X (Twitter/X)\nHoặc gửi email\n\nMình sẽ đọc kỹ tất cả bài gửi, tôn trọng quyền riêng tư và hỗ trợ đăng ẩn danh. Mong mọi người chia sẻ kinh nghiệm và câu chuyện để giúp nhiều người khám phá an toàn và thú vị hơn~\nVui lòng gửi trực tiếp qua DM hoặc email. Cảm ơn!",
	event_title: "List Star",
	event_description:
		"Dự án List Star đã bắt đầu! Trong 1 tháng, chúng tôi sẽ quảng bá miễn phí những người đam mê Fisting nổi bật trên website và X! Khi trở thành List Star, bạn sẽ nhận được\n1. Vị trí nổi bật trên bảng List chính thức\n2. 1 poster độc quyền\n3. Quảng bá trên tài khoản X chính thức\n\nCách tham gia?\n1 ảnh nửa thân trên có che mặt, 1 video fisting, và 1 đoạn caption/copy về video đó.",
	admin_search_placeholder: "Search by X handle",
	admin_search_hint: "Only supports existing accounts for modifying related information or deleting.",
	admin_mode_title_home: "Chon thao tac",
	admin_mode_title_create: "Them nguoi bieu dien",
	admin_mode_title_edit: "Sua nguoi bieu dien",
	admin_mode_title_delete: "Xoa nguoi bieu dien",
	admin_mode_btn_create: "Them nguoi bieu dien",
	admin_mode_btn_edit: "Sua nguoi bieu dien",
	admin_mode_btn_delete: "Xoa nguoi bieu dien",
	admin_delete_hint: "Hay tim va chon mot nguoi bieu dien da ton tai truoc.",
	admin_delete_selected: "Da chon: {name} ({handle}) ID {id}",
	admin_status_no_exact_match_mode: "Khong co handle trung khop chinh xac cho che do nay.",
	admin_status_pick_existing_first: "Hay tim va chon mot nguoi bieu dien da ton tai truoc.",
};

const PT_MESSAGES: Record<string, string> = {
	page_title_ranking: "Lista de Criadores",
	page_title_admin: "Painel de Administracao",
	page_title_dashboard: "Mapa",
	page_title_about: "Sobre",
	page_title_wiki: "Fisting Wiki",
	page_title_wiki_article: "Fisting Wiki",
	heading_ranking: "Lista de Criadores",
	heading_language: "Idioma",
	heading_add: "Adicionar",
	heading_star: "Mapa",
	heading_about: "Sobre",
	heading_wiki: "Fisting Wiki",
	nav_ranking: "Lista de Criadores",
	nav_add: "Adicionar",
	nav_star: "Mapa",
	nav_wiki: "Artigos",
	nav_about: "Sobre",
	dashboard_visit_select: "Selecione um criador no mapa primeiro",
	dashboard_visit_named: "Visitar {name}",
	country_region: "pais(regiao)",
	all_option: "Todos",
	friendly_links: "Parcerias da comunidade",
	view_articles: "Ver artigos",
	partner_qutoys: "QUTOYS (10% OFF)",
	ranking_location_notice:
		"Este site lista apenas usuarios masculinos. As contas sao alternadas no destaque para garantir exibicao justa. As posicoes no mapa sao apenas ilustracoes desfocadas e nao correspondem a enderecos reais. Os usuarios podem se adicionar ou solicitar exclusao pelo grupo TG. O icone de livro e o nosso blog. Em caso de qualquer problema, contate no X: @fistingguide.",
	spotlight_title: "Destaque Rotativo",
	spotlight_next_switch: "Proxima troca em {time}",
	age_title: "Confirmacao de idade",
	age_desc: "Voce precisa ter 18+ para entrar neste site. Voce tem 18 anos ou mais?",
	age_yes: "Sim, tenho 18+",
	age_no: "Nao",
	age_denied: "Acesso negado. Este site e apenas para adultos 18+.",
	article_by: "Por",
	article_updated: "Atualizado",
	wiki_submit_hint: "enviar artigo para fistingguide",
	about_description:
		"Ola, sou um entusiasta de fisting e recentemente criei um site de navegacao simples para ajudar as pessoas a descobrirem rapidamente criadores e contas da comunidade. O objetivo deste site e facilitar encontrar criadores, explorar novos conteudos e se conectar com outras pessoas que compartilham os mesmos interesses. Se voce tiver sugestoes, feedback ou quiser colaborar para melhorar o projeto, fique a vontade para entrar em contato. Voce pode falar comigo no X: @fistingguide ou por email: fistingguide@proton.me. Se preferir nao aparecer no site, e so me avisar que removo seu cadastro. Obrigado, e espero que este projeto ajude a comunidade a crescer.",
	campaign_title: "Campanha",
	author_call_title: "Convocacao de Artigos",
	author_call_page_title: "Convocacao de Artigos",
	author_call_back_home: "Voltar ao inicio",
	author_call_intro:
		"Lancamento do evento de longo prazo para coleta e compartilhamento de historias sobre Fisting!\nOla, pessoal. Estou iniciando uma acao continua para compartilhar experiencias e coletar historias sobre Fisting. Todos os interessados sao bem-vindos.\n\nPrincipais temas para envio:\nComo comecar com seguranca (passos para iniciantes e preparacao)\nMetodo correto de enema, cuidados e dicas praticas\nTecnicas de seguranca durante a pratica, escolha de lubrificante, problemas comuns e solucoes\nRelatos reais de fisting (solo ou com parceiro), sensacoes e aprendizados\nRecomendacoes de brinquedos, experiencias de uso e manutencao\n\nSeja voce iniciante ou experiente, pode enviar sua contribuicao. O texto pode ser curto ou longo, e envios anonimos sao aceitos.\n\nDeclaracao de seguranca:\nFisting e uma pratica de alta intensidade. Seguranca, progressao gradual, lubrificacao abundante e consentimento mutuo sao extremamente importantes. Todo conteudo compartilhado neste evento e apenas para referencia e troca de experiencias e nao constitui aconselhamento medico. Aja com responsabilidade, prepare-se bem e pare imediatamente se houver qualquer desconforto, procurando orientacao medica.\n\nComo enviar:\nEnvie mensagem privada no X (Twitter/X)\nOu envie um email\n\nVou ler todos os envios com atencao, respeitar sua privacidade e apoiar publicacao anonima. Espero suas experiencias e historias para ajudar mais pessoas a explorar essa pratica com seguranca e prazer.\nEnvie diretamente por DM ou email. Obrigado!",
	event_description:
		"Projeto List Star no ar! Durante um mes, vamos promover gratuitamente entusiastas de Fisting no site e no X. Como List Star, voce recebe\n1. Destaque no topo da lista oficial\n2. Um poster exclusivo\n3. Divulgacao na conta oficial do X\n\nComo participar?\nUma foto da parte superior do corpo com o rosto oculto, um video de fisting e uma legenda/copy sobre o video.",
	admin_search_placeholder: "Buscar por handle do X",
	admin_search_hint: "Somente contas existentes para editar ou excluir",
	admin_mode_title_home: "Escolher acao",
	admin_mode_title_create: "Adicionar criador",
	admin_mode_title_edit: "Editar criador",
	admin_mode_title_delete: "Excluir criador",
	admin_mode_btn_create: "Adicionar criador",
	admin_mode_btn_edit: "Editar criador",
	admin_mode_btn_delete: "Excluir criador",
	admin_delete_hint: "Busque e selecione um criador existente primeiro.",
	admin_delete_selected: "Selecionado: {name} ({handle}) ID {id}",
	admin_status_no_exact_match_mode: "Nenhum handle exato para este modo.",
	admin_status_pick_existing_first: "Busque e selecione um criador existente primeiro.",
};

const I18N_MESSAGES: Record<LocaleCode, Record<string, string>> = {
	en: {
		page_title_ranking: "Performers List",
		page_title_admin: "Database Admin Panel",
		page_title_dashboard: "Map",
		page_title_about: "About",
		page_title_wiki: "Fisting Wiki",
		page_title_wiki_article: "Fisting Wiki",
		heading_ranking: "Performers List",
		heading_language: "Language",
		heading_add: "Add new",
		heading_star: "Map",
		heading_about: "About",
		heading_wiki: "Fisting Wiki",
		nav_ranking: "Performers List",
		nav_add: "Add new",
		nav_star: "Map",
		nav_wiki: "Articles",
		nav_about: "About",
		dashboard_visit_select: "Select a performer on the map first",
		dashboard_visit_named: "Visit {name}",
		country_region: "country(region)",
		all_option: "All",
		friendly_links: "Community Partners",
	view_articles: "View Articles",
		partner_qutoys: "QUTOYS (10% OFF)",
		ranking_location_notice: RANKING_NOTICE_EN,
		spotlight_title: "Rotating Spotlight",
		spotlight_next_switch: "Next switch in {time}",
		age_title: "Age Confirmation",
		age_desc: "You must be 18+ to enter this site. Are you 18 years old or above?",
		age_yes: "Yes, I am 18+",
		age_no: "No",
		age_denied: "Access denied. This website is for adults 18+ only.",
		article_by: "By",
		article_updated: "Updated",
		wiki_submit_hint: "submit an article to fistingguide",
		about_description:
			"Hello, I am a fisting enthusiast and I recently built a simple navigation website to help people quickly discover creators and accounts in the community. The goal of this site is to make it easier for people to find creators, explore new content, and connect with others who share the same interests. If you have any suggestions, feedback, or would like to collaborate on improving the project, feel free to reach out. You can contact me on X: @fistingguide or by email: fistingguide@proton.me. If you prefer not to appear on the website, just let me know and I will remove your listing. Thank you, and I hope this project can help the community grow.",
		campaign_title: "Campaign",
		author_call_title: "Call For Authors",
		author_call_page_title: "Call For Authors",
		author_call_back_home: "Back Home",
		author_call_intro:
			"Fisting Stories Collection & Sharing Long-term Event Launch!\nHello everyone, I’m starting a long-term event for experience sharing and story collection about Fisting. Everyone who is interested is welcome to participate.\n\nThis event mainly collects the following content:\nHow to safely start fisting (beginner steps, preparation)\nCorrect methods, precautions, and practical tips for enema\nSafety techniques during fisting, lubricant choices, common problems and solutions\nPersonal real-life fisting stories (solo or with a partner), feelings, and insights\nToy recommendations, usage experiences, and maintenance tips\n\nWhether you’re a curious beginner or an experienced player, you’re welcome to submit and share. Stories can be long or short, and anonymous submissions are accepted.\n\nSafety First Statement:\nFisting is a high-intensity activity. Safety, gradual progression, plenty of lubrication, and mutual consent are extremely important. All sharing in this event is for reference and exchange only and does not constitute any medical advice. Please always act responsibly, make full preparations, and stop immediately if you feel any discomfort and consult a doctor.\n\nSubmission Methods:\nSend me a private message on my X (Twitter/X) account\nOr send me an email\n\nI will read all submissions carefully, respect your privacy, and anonymous posts are supported. Looking forward to everyone sharing their experiences and stories to help more people explore this kink safely and enjoyably~\nPlease submit directly via DM or email. Thank you!",
		event_title: "List Star",
		event_description:
			"List Star Project is live! For one month, we will promote outstanding Fisting enthusiasts for free on the website and X! As a List Star, you will receive\n1. Official List top placement\n2. One exclusive poster\n3. Promotion on the official X account\n\nHow to join?\nA photo of the upper body with the face obscured, a fisting video, and a caption/copy about the video.",
		admin_search_placeholder: "Search by X handle",
		admin_search_hint: "Only supports existing accounts for modifying their related information or deleting.",
		admin_search_btn: "Search",
		admin_reset_btn: "Reset",
		admin_label_display_name: "Display Name",
		admin_ph_display_name: "Display name",
		admin_label_x_handle: "X Handle",
		admin_ph_x_handle: "Handle (e.g. @demo)",
		admin_label_orientation: "Orientation",
		admin_ph_orientation: "Orientation",
		admin_label_fans_count: "Followers",
		admin_ph_fans_count: "Followers",
		admin_label_location: "District / Region / Country (Region)",
		admin_ph_location_search: "Search country (region) or city (map search)",
		admin_selected_prefix: "Selected:",
		admin_label_map_preview: "Please click your location until the default address changes",
		admin_label_profile_url: "Profile URL",
		admin_ph_profile_url: "Profile URL",
		admin_label_avatar_url: "Avatar URL",
		admin_ph_avatar_url: "Avatar URL",
		admin_label_bio: "Bio",
		admin_ph_bio: "Bio",
	admin_btn_create: "Create",
		admin_btn_save_changes: "Confirm Edit",
	admin_btn_delete_current: "Delete Current",
	admin_btn_cancel_edit: "Cancel Edit",
	admin_mode_title_home: "Choose action",
	admin_mode_title_create: "Add performer",
	admin_mode_title_edit: "Edit performer",
	admin_mode_title_delete: "Delete performer",
	admin_mode_btn_create: "Add Performer",
	admin_mode_btn_edit: "Edit Performer",
	admin_mode_btn_delete: "Delete Performer",
	admin_delete_hint: "Please search and select an existing performer first.",
	admin_delete_selected: "Selected: {name} ({handle}) ID {id}",
	admin_status_no_exact_match_mode: "No exact handle match for this mode.",
	admin_status_pick_existing_first: "Please search and select an existing performer first.",
		admin_status_ready: "Ready",
		admin_status_no_exact_match: "No exact handle match. You can create a new record.",
		admin_status_matched_handles: "Matched {count} handles",
		admin_status_handle_required: "Handle is required",
		admin_status_submitting: "Submitting...",
		admin_status_updated_success: "Updated successfully",
		admin_status_created_success: "Created successfully",
		admin_alert_updated_success: "Profile updated successfully.",
		admin_alert_created_success: "Profile created successfully.",
	},
	"zh-CN": {
		page_title_ranking: "\u8868\u6f14\u8005\u5217\u8868",
		page_title_admin: "\u6570\u636e\u5e93\u7ba1\u7406\u9762\u677f",
		page_title_dashboard: "\u5730\u56fe",
		page_title_about: "\u5173\u4e8e",
		page_title_wiki: "Fisting Wiki",
		page_title_wiki_article: "Fisting Wiki",
		heading_ranking: "\u8868\u6f14\u8005\u5217\u8868",
		heading_language: "\u8bed\u8a00",
		heading_add: "\u65b0\u589e",
		heading_star: "\u5730\u56fe",
		heading_about: "\u5173\u4e8e",
		heading_wiki: "Fisting Wiki",
		nav_ranking: "\u8868\u6f14\u8005\u5217\u8868",
		nav_add: "\u65b0\u589e",
		nav_star: "\u5730\u56fe",
		nav_wiki: "\u6587\u7ae0",
		nav_about: "\u5173\u4e8e",
		dashboard_visit_select: "\u8bf7\u5148\u5728\u5730\u56fe\u4e0a\u9009\u62e9\u8868\u6f14\u8005",
		dashboard_visit_named: "\u8bbf\u95ee{name}",
		country_region: "\u56fd\u5bb6(\u5730\u533a)",
		all_option: "\u5168\u90e8",
		friendly_links: "\u793e\u533a\u5408\u4f5c",
	view_articles: "查看文章",
		partner_qutoys: "QUTOYS\uff0810%\u6298\u6263\uff09",
		ranking_location_notice: RANKING_NOTICE_ZH_CN,
		spotlight_title: "\u8f6e\u64ad\u7f6e\u9876",
		spotlight_next_switch: "{time} \u540e\u5207\u6362",
		age_title: "\u5e74\u9f84\u786e\u8ba4",
		age_desc: "\u4f60\u5fc5\u987b\u5e74\u6ee118\u5c81\u624d\u80fd\u8fdb\u5165\u672c\u7ad9\u3002\u4f60\u662f\u5426\u5df2\u6ee118\u5c81\uff1f",
		age_yes: "\u662f\u7684\uff0c\u6211\u5df2\u6ee118\u5c81",
		age_no: "\u5426",
		age_denied: "\u8bbf\u95ee\u88ab\u62d2\u7edd\u3002\u672c\u7ad9\u4ec5\u965018\u5c81\u4ee5\u4e0a\u6210\u4eba\u3002",
		article_by: "\u4f5c\u8005",
		article_updated: "\u66f4\u65b0\u4e8e",
		wiki_submit_hint: "\u5411fistingguide\u6295\u7a3f\u6587\u7ae0",
		about_description:
			"\u4f60\u597d\uff0c\u6211\u662f\u4e00\u540d fisting \u7231\u597d\u8005\uff0c\u6700\u8fd1\u505a\u4e86\u4e00\u4e2a\u7b80\u5355\u7684\u5bfc\u822a\u7f51\u7ad9\uff0c\u5e2e\u52a9\u5927\u5bb6\u66f4\u5feb\u5730\u53d1\u73b0\u793e\u533a\u4e2d\u7684\u521b\u4f5c\u8005\u548c\u8d26\u53f7\u3002\u8fd9\u4e2a\u7f51\u7ad9\u7684\u76ee\u6807\u662f\u8ba9\u5927\u5bb6\u66f4\u5bb9\u6613\u627e\u5230\u521b\u4f5c\u8005\uff0c\u63a2\u7d22\u65b0\u5185\u5bb9\uff0c\u5e76\u4e0e\u6709\u76f8\u540c\u5174\u8da3\u7684\u4eba\u5efa\u7acb\u8054\u7cfb\u3002\u5982\u679c\u4f60\u6709\u5efa\u8bae\u3001\u53cd\u9988\uff0c\u6216\u5e0c\u671b\u4e00\u8d77\u534f\u4f5c\u6539\u8fdb\u8fd9\u4e2a\u9879\u76ee\uff0c\u6b22\u8fce\u8054\u7cfb\u6211\u3002\u4f60\u53ef\u4ee5\u5728 X \u627e\u5230\u6211\uff1a@fistingguide\uff0c\u6216\u53d1\u90ae\u4ef6\u5230\uff1afistingguide@proton.me\u3002\u5982\u679c\u4f60\u4e0d\u5e0c\u671b\u51fa\u73b0\u5728\u7f51\u7ad9\u4e0a\uff0c\u8bf7\u544a\u8bc9\u6211\uff0c\u6211\u4f1a\u5220\u9664\u4f60\u7684\u6761\u76ee\u3002\u8c22\u8c22\uff0c\u5e0c\u671b\u8fd9\u4e2a\u9879\u76ee\u80fd\u5e2e\u52a9\u793e\u533a\u6210\u957f\u3002",
		campaign_title: "活动",
		author_call_title: "文章征稿",
		author_call_page_title: "文章征稿",
		author_call_back_home: "返回首页",
		author_call_intro:
			"Fisting故事征集 & 分享长期活动开启！\n大家好，我准备长期发起一个关于Fisting的经验分享和故事征集活动，欢迎所有感兴趣的朋友参与。\n\n本次活动主要征集以下内容：\n如何安全开始玩Fisting（新手入门步骤、准备工作）\n灌肠（enema）的正确方法、注意事项和实用经验\nFisting过程中的安全技巧、润滑选择、常见问题及解决办法\n自己真实玩Fisting（solo 或和伴侣）的个人故事、感受和心得\n玩具推荐、使用心得、保养经验等\n\n无论你是刚有兴趣的新手，还是已经有经验的老手，都欢迎投稿分享。故事长短不限，可以匿名投稿。\n\n安全第一声明：\nFisting属于高强度玩法，安全、渐进、充足润滑和双方自愿非常重要。本活动所有分享仅供参考交流，不构成任何医疗建议。请大家实际操作时量力而行，做好充分准备，如有不适立即停止并咨询医生。\n\n投稿方式：\n私信我的 X（Twitter/X）账号\n或发送邮件给我\n\n所有投稿我都会认真阅读，尊重隐私，可匿名发布。期待大家把自己的经验和故事分享出来，一起帮助更多人安全、有趣地探索这个玩法～\n投稿请直接私信或发邮件，谢谢！",
		event_title: "List Star",
		event_description:
			"List Star 拳星计划启动！为期一个月，我们将在网站和X上免费推广优秀 Fisting 爱好者！成为 List Star 可获得 \n1. 官方List排名置顶\n2. 一张专属海报\n3. 官方X平台宣传\n\n如何参与？\n1张上半身且遮挡面部的照片、1条fisting视频，以及一段关于该视频的文案。",
		admin_search_placeholder: "\u6309 X \u8d26\u53f7\u641c\u7d22",
		admin_search_hint: "\u4ec5\u652f\u6301\u5df2\u5b58\u5728\u8d26\u53f7\uff0c\u7528\u4e8e\u4fee\u6539\u5176\u76f8\u5173\u4fe1\u606f\u6216\u5220\u9664",
		admin_search_btn: "\u641c\u7d22",
		admin_reset_btn: "\u91cd\u7f6e",
		admin_label_display_name: "\u663e\u793a\u540d\u79f0",
		admin_ph_display_name: "\u663e\u793a\u540d\u79f0",
		admin_label_x_handle: "X \u8d26\u53f7",
		admin_ph_x_handle: "\u8d26\u53f7\uff08\u4f8b\u5982 @demo\uff09",
		admin_label_orientation: "\u53d6\u5411",
		admin_ph_orientation: "\u53d6\u5411",
		admin_label_fans_count: "\u5173\u6ce8\u8005",
		admin_ph_fans_count: "\u5173\u6ce8\u8005",
		admin_label_location: "\u533a/\u57df/\u56fd\u5bb6(\u5730\u533a)",
		admin_ph_location_search: "\u641c\u7d22\u56fd\u5bb6(\u5730\u533a)\u6216\u57ce\u5e02\uff08\u5730\u56fe\u641c\u7d22\uff09",
		admin_selected_prefix: "\u5df2\u9009\u62e9\uff1a",
		admin_label_map_preview: "\u8bf7\u70b9\u51fb\u4f60\u7684\u4f4d\u7f6e\uff0c\u76f4\u5230\u9ed8\u8ba4\u5730\u5740\u53d1\u751f\u53d8\u5316",
		admin_label_profile_url: "\u4e3b\u9875 URL",
		admin_ph_profile_url: "\u4e3b\u9875 URL",
		admin_label_avatar_url: "\u5934\u50cf URL",
		admin_ph_avatar_url: "\u5934\u50cf URL",
		admin_label_bio: "\u7b80\u4ecb",
		admin_ph_bio: "\u7b80\u4ecb",
	admin_btn_create: "\u521b\u5efa",
	admin_btn_save_changes: "\u786e\u8ba4\u7f16\u8f91",
	admin_btn_delete_current: "\u5220\u9664\u5f53\u524d",
	admin_btn_cancel_edit: "\u53d6\u6d88\u7f16\u8f91",
	admin_mode_title_home: "\u9009\u62e9\u64cd\u4f5c",
	admin_mode_title_create: "\u65b0\u589e\u8868\u6f14\u8005",
	admin_mode_title_edit: "\u7f16\u8f91\u8868\u6f14\u8005",
	admin_mode_title_delete: "\u5220\u9664\u8868\u6f14\u8005",
	admin_mode_btn_create: "\u65b0\u589e\u8868\u6f14\u8005",
	admin_mode_btn_edit: "\u7f16\u8f91\u8868\u6f14\u8005",
	admin_mode_btn_delete: "\u5220\u9664\u8868\u6f14\u8005",
	admin_delete_hint: "\u8bf7\u5148\u641c\u7d22\u5e76\u9009\u62e9\u5df2\u5b58\u5728\u7684\u8868\u6f14\u8005",
	admin_delete_selected: "\u5df2\u9009\u62e9\uff1a{name} ({handle}) ID {id}",
	admin_status_no_exact_match_mode: "\u5f53\u524d\u6a21\u5f0f\u4e0b\u672a\u627e\u5230\u7cbe\u786e\u5339\u914d\u7684\u8d26\u53f7",
	admin_status_pick_existing_first: "\u8bf7\u5148\u641c\u7d22\u5e76\u9009\u62e9\u5df2\u5b58\u5728\u7684\u8868\u6f14\u8005",
		admin_status_ready: "\u5c31\u7eea",
		admin_status_no_exact_match: "\u6ca1\u6709\u7cbe\u786e\u5339\u914d\u7684\u8d26\u53f7\uff0c\u4f60\u53ef\u4ee5\u521b\u5efa\u65b0\u8bb0\u5f55\u3002",
		admin_status_matched_handles: "\u5339\u914d\u5230 {count} \u4e2a\u8d26\u53f7",
		admin_status_handle_required: "\u8d26\u53f7\u4e3a\u5fc5\u586b\u9879",
		admin_status_submitting: "\u63d0\u4ea4\u4e2d...",
		admin_status_updated_success: "\u66f4\u65b0\u6210\u529f",
		admin_status_created_success: "\u521b\u5efa\u6210\u529f",
		admin_alert_updated_success: "\u8d44\u6599\u66f4\u65b0\u6210\u529f\u3002",
		admin_alert_created_success: "\u8d44\u6599\u521b\u5efa\u6210\u529f\u3002",
	},
	"zh-TW": {
		page_title_ranking: "\u8868\u6f14\u8005\u6e05\u55ae",
		page_title_admin: "\u8cc7\u6599\u5eab\u7ba1\u7406\u9762\u677f",
		page_title_dashboard: "\u5730\u5716",
		page_title_about: "\u95dc\u65bc",
		page_title_wiki: "Fisting Wiki",
		page_title_wiki_article: "Fisting Wiki",
		heading_ranking: "\u8868\u6f14\u8005\u6e05\u55ae",
		heading_language: "\u8a9e\u8a00",
		heading_add: "\u65b0\u589e",
		heading_star: "\u5730\u5716",
		heading_about: "\u95dc\u65bc",
		heading_wiki: "Fisting Wiki",
		nav_ranking: "\u8868\u6f14\u8005\u6e05\u55ae",
		nav_add: "\u65b0\u589e",
		nav_star: "\u5730\u5716",
		nav_wiki: "\u6587\u7ae0",
		nav_about: "\u95dc\u65bc",
		dashboard_visit_select: "\u8acb\u5148\u5728\u5730\u5716\u4e0a\u9078\u64c7\u8868\u6f14\u8005",
		dashboard_visit_named: "\u8a2a\u554f{name}",
		country_region: "\u570b\u5bb6(\u5730\u5340)",
		all_option: "\u5168\u90e8",
		friendly_links: "\u793e\u7fa4\u5408\u4f5c",
	view_articles: "查看文章",
		partner_qutoys: "QUTOYS\uff0810%\u6298\u6263\uff09",
		ranking_location_notice:
			"本網站僅收錄男性用戶；帳號輪換置頂以保證公平展示；地圖位置為模糊示意，不涉及真實地址；用戶可透過 TG 群組自行添加或申請刪除資訊；書籍圖示是我們的部落格；任何問題請聯絡 X: @fistingguide。",
		spotlight_title: "\u8f2a\u64ad\u7f6e\u9802",
		spotlight_next_switch: "{time} \u5f8c\u5207\u63db",
		age_title: "\u5e74\u9f61\u78ba\u8a8d",
		age_desc: "\u4f60\u5fc5\u9808\u5e74\u6eff18\u6b72\u624d\u80fd\u9032\u5165\u672c\u7ad9\u3002\u4f60\u662f\u5426\u5df2\u6eff18\u6b72\uff1f",
		age_yes: "\u662f\u7684\uff0c\u6211\u5df2\u6eff18\u6b72",
		age_no: "\u5426",
		age_denied: "\u5b58\u53d6\u88ab\u62d2\u7d55\u3002\u672c\u7ad9\u50c5\u965018\u6b72\u4ee5\u4e0a\u6210\u4eba\u3002",
		article_by: "\u4f5c\u8005",
		article_updated: "\u66f4\u65b0\u65bc",
		wiki_submit_hint: "\u5411fistingguide\u6295\u7a3f\u6587\u7ae0",
		about_description:
			"\u4f60\u597d\uff0c\u6211\u662f\u4e00\u540d fisting \u611b\u597d\u8005\uff0c\u6700\u8fd1\u505a\u4e86\u4e00\u500b\u7c21\u55ae\u7684\u5c0e\u822a\u7db2\u7ad9\uff0c\u5e6b\u52a9\u5927\u5bb6\u66f4\u5feb\u5730\u767c\u73fe\u793e\u7fa4\u4e2d\u7684\u5275\u4f5c\u8005\u8207\u5e33\u865f\u3002\u9019\u500b\u7db2\u7ad9\u7684\u76ee\u6a19\u662f\u8b93\u5927\u5bb6\u66f4\u5bb9\u6613\u627e\u5230\u5275\u4f5c\u8005\uff0c\u63a2\u7d22\u65b0\u5167\u5bb9\uff0c\u4e26\u8207\u6709\u76f8\u540c\u8208\u8da3\u7684\u4eba\u9023\u7d50\u3002\u5982\u679c\u4f60\u6709\u5efa\u8b70\u3001\u56de\u994b\uff0c\u6216\u5e0c\u671b\u4e00\u8d77\u534f\u4f5c\u6539\u9032\u9019\u500b\u5c08\u6848\uff0c\u6b61\u8fce\u806f\u7d61\u6211\u3002\u4f60\u53ef\u4ee5\u5728 X \u627e\u5230\u6211\uff1a@fistingguide\uff0c\u6216\u5bc4\u4fe1\u5230\uff1afistingguide@proton.me\u3002\u5982\u679c\u4f60\u4e0d\u5e0c\u671b\u51fa\u73fe\u5728\u7db2\u7ad9\u4e0a\uff0c\u8acb\u544a\u8a34\u6211\uff0c\u6211\u6703\u79fb\u9664\u4f60\u7684\u689d\u76ee\u3002\u8b1d\u8b1d\uff0c\u5e0c\u671b\u9019\u500b\u5c08\u6848\u80fd\u5e6b\u52a9\u793e\u7fa4\u6210\u9577\u3002",
		campaign_title: "活動",
		author_call_title: "文章徵稿",
		author_call_page_title: "文章徵稿",
		author_call_back_home: "返回首頁",
		author_call_intro:
			"Fisting故事徵集 & 分享長期活動開啟！\n大家好，我準備長期發起一個關於Fisting的經驗分享和故事徵集活動，歡迎所有感興趣的朋友參與。\n\n本次活動主要徵集以下內容：\n如何安全開始玩Fisting（新手入門步驟、準備工作）\n灌腸（enema）的正確方法、注意事項和實用經驗\nFisting過程中的安全技巧、潤滑選擇、常見問題及解決辦法\n自己真實玩Fisting（solo 或和伴侶）的個人故事、感受和心得\n玩具推薦、使用心得、保養經驗等\n\n無論你是剛有興趣的新手，還是已經有經驗的老手，都歡迎投稿分享。故事長短不限，可以匿名投稿。\n\n安全第一聲明：\nFisting屬於高強度玩法，安全、漸進、充足潤滑和雙方自願非常重要。本活動所有分享僅供參考交流，不構成任何醫療建議。請大家實際操作時量力而行，做好充分準備，如有不適立即停止並諮詢醫生。\n\n投稿方式：\n私訊我的 X（Twitter/X）帳號\n或發送郵件給我\n\n所有投稿我都會認真閱讀，尊重隱私，可匿名發布。期待大家把自己的經驗和故事分享出來，一起幫助更多人安全、有趣地探索這個玩法～\n投稿請直接私訊或發郵件，謝謝！",
		event_title: "List Star",
		event_description:
			"List Star 拳星計畫啟動！為期一個月，我們將在網站和X上免費推廣優秀 Fisting 愛好者！成為 List Star 可獲得 \n1. 官方List排名置頂\n2. 一張專屬海報\n3. 官方X平台宣傳\n\n如何參與？\n1張上半身且遮擋臉部的照片、1條fisting影片，以及一段關於該影片的文案。",
		admin_search_placeholder: "\u4ee5 X \u5e33\u865f\u641c\u5c0b",
		admin_search_hint: "\u50c5\u652f\u63f4\u5df2\u5b58\u5728\u5e33\u865f\uff0c\u7528\u65bc\u4fee\u6539\u5176\u76f8\u95dc\u8cc7\u8a0a\u6216\u522a\u9664",
		admin_search_btn: "\u641c\u5c0b",
		admin_reset_btn: "\u91cd\u8a2d",
		admin_label_display_name: "\u986f\u793a\u540d\u7a31",
		admin_ph_display_name: "\u986f\u793a\u540d\u7a31",
		admin_label_x_handle: "X \u5e33\u865f",
		admin_ph_x_handle: "\u5e33\u865f\uff08\u4f8b\u5982 @demo\uff09",
		admin_label_orientation: "\u53d6\u5411",
		admin_ph_orientation: "\u53d6\u5411",
		admin_label_fans_count: "\u8ffd\u8e64\u8005",
		admin_ph_fans_count: "\u8ffd\u8e64\u8005",
		admin_label_location: "\u5340/\u57df/\u570b\u5bb6(\u5730\u5340)",
		admin_ph_location_search: "\u641c\u5c0b\u570b\u5bb6(\u5730\u5340)\u6216\u57ce\u5e02\uff08\u5730\u5716\u641c\u5c0b\uff09",
		admin_selected_prefix: "\u5df2\u9078\u64c7\uff1a",
		admin_label_map_preview: "\u8acb\u9ede\u64ca\u4f60\u7684\u4f4d\u7f6e\uff0c\u76f4\u5230\u9810\u8a2d\u5730\u5740\u767c\u751f\u8b8a\u5316",
		admin_label_profile_url: "\u500b\u4eba\u9801 URL",
		admin_ph_profile_url: "\u500b\u4eba\u9801 URL",
		admin_label_avatar_url: "\u982d\u50cf URL",
		admin_ph_avatar_url: "\u982d\u50cf URL",
		admin_label_bio: "\u7c21\u4ecb",
		admin_ph_bio: "\u7c21\u4ecb",
	admin_btn_create: "\u5efa\u7acb",
	admin_btn_save_changes: "\u78ba\u8a8d\u7de8\u8f2f",
	admin_btn_delete_current: "\u522a\u9664\u7576\u524d",
	admin_btn_cancel_edit: "\u53d6\u6d88\u7de8\u8f2f",
	admin_mode_title_home: "\u9078\u64c7\u64cd\u4f5c",
	admin_mode_title_create: "\u65b0\u589e\u8868\u6f14\u8005",
	admin_mode_title_edit: "\u7de8\u8f2f\u8868\u6f14\u8005",
	admin_mode_title_delete: "\u522a\u9664\u8868\u6f14\u8005",
	admin_mode_btn_create: "\u65b0\u589e\u8868\u6f14\u8005",
	admin_mode_btn_edit: "\u7de8\u8f2f\u8868\u6f14\u8005",
	admin_mode_btn_delete: "\u522a\u9664\u8868\u6f14\u8005",
	admin_delete_hint: "\u8acb\u5148\u641c\u5c0b\u4e26\u9078\u64c7\u5df2\u5b58\u5728\u7684\u8868\u6f14\u8005",
	admin_delete_selected: "\u5df2\u9078\u64c7\uff1a{name} ({handle}) ID {id}",
	admin_status_no_exact_match_mode: "\u6b64\u6a21\u5f0f\u4e0b\u627e\u4e0d\u5230\u7cbe\u78ba\u5339\u914d\u7684\u5e33\u865f",
	admin_status_pick_existing_first: "\u8acb\u5148\u641c\u5c0b\u4e26\u9078\u64c7\u5df2\u5b58\u5728\u7684\u8868\u6f14\u8005",
		admin_status_ready: "\u5c31\u7dd2",
		admin_status_no_exact_match: "\u6c92\u6709\u7cbe\u78ba\u5339\u914d\u7684\u5e33\u865f\uff0c\u4f60\u53ef\u4ee5\u5efa\u7acb\u65b0\u7d00\u9304\u3002",
		admin_status_matched_handles: "\u5339\u914d\u5230 {count} \u500b\u5e33\u865f",
		admin_status_handle_required: "\u5e33\u865f\u70ba\u5fc5\u586b",
		admin_status_submitting: "\u63d0\u4ea4\u4e2d...",
		admin_status_updated_success: "\u66f4\u65b0\u6210\u529f",
		admin_status_created_success: "\u5efa\u7acb\u6210\u529f",
		admin_alert_updated_success: "\u8cc7\u6599\u66f4\u65b0\u6210\u529f\u3002",
		admin_alert_created_success: "\u8cc7\u6599\u5efa\u7acb\u6210\u529f\u3002",
	},
	ja: {
		page_title_ranking: "\u30d1\u30d5\u30a9\u30fc\u30de\u30fc\u4e00\u89a7",
		page_title_admin: "\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u7ba1\u7406\u30d1\u30cd\u30eb",
		page_title_dashboard: "\u30de\u30c3\u30d7",
		page_title_about: "\u6982\u8981",
		page_title_wiki: "Fisting Wiki",
		page_title_wiki_article: "Fisting Wiki",
		heading_ranking: "\u30d1\u30d5\u30a9\u30fc\u30de\u30fc\u4e00\u89a7",
		heading_language: "\u8a00\u8a9e",
		heading_add: "\u65b0\u898f\u8ffd\u52a0",
		heading_star: "\u30de\u30c3\u30d7",
		heading_about: "\u6982\u8981",
		heading_wiki: "Fisting Wiki",
		nav_ranking: "\u30d1\u30d5\u30a9\u30fc\u30de\u30fc\u4e00\u89a7",
		nav_add: "\u65b0\u898f\u8ffd\u52a0",
		nav_star: "\u30de\u30c3\u30d7",
		nav_wiki: "\u8a18\u4e8b",
		nav_about: "\u6982\u8981",
		dashboard_visit_select: "\u5730\u56f3\u4e0a\u3067\u30d1\u30d5\u30a9\u30fc\u30de\u30fc\u3092\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044",
		dashboard_visit_named: "{name}\u3078\u79fb\u52d5",
		country_region: "\u56fd(\u5730\u57df)",
		all_option: "\u3059\u3079\u3066",
		friendly_links: "\u30b3\u30df\u30e5\u30cb\u30c6\u30a3\u9023\u643a",
	view_articles: "記事を見る",
		partner_qutoys: "QUTOYS\uff0810%\u5272\u5f15\uff09",
		ranking_location_notice:
			"このサイトは男性ユーザーのみを掲載します。公平な表示のため、アカウントはローテーションで上位表示されます。地図上の位置はぼかしたイメージ表示であり、実際の住所ではありません。ユーザーはTGグループから自分で追加、または削除申請ができます。本のアイコンは私たちのブログです。問題があればX: @fistingguide までご連絡ください。",
		spotlight_title: "\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3\u8868\u793a",
		spotlight_next_switch: "{time} \u5f8c\u306b\u5207\u308a\u66ff\u3048",
		age_title: "\u5e74\u9f62\u78ba\u8a8d",
		age_desc: "\u3053\u306e\u30b5\u30a4\u30c8\u306f18\u6b73\u4ee5\u4e0a\u304c\u5bfe\u8c61\u3067\u3059\u300218\u6b73\u4ee5\u4e0a\u3067\u3059\u304b\uff1f",
		age_yes: "\u306f\u3044\u300118\u6b73\u4ee5\u4e0a\u3067\u3059",
		age_no: "\u3044\u3044\u3048",
		age_denied: "\u30a2\u30af\u30bb\u30b9\u62d2\u5426\u3002\u3053\u306e\u30b5\u30a4\u30c8\u306f18\u6b73\u4ee5\u4e0a\u9650\u5b9a\u3067\u3059\u3002",
		article_by: "\u8457\u8005",
		article_updated: "\u66f4\u65b0",
		wiki_submit_hint: "fistingguide \u3078\u8a18\u4e8b\u3092\u6295\u7a3f",
		about_description:
			"\u3053\u3093\u306b\u3061\u306f\u3002\u79c1\u306f fisting \u611b\u597d\u5bb6\u3067\u3001\u30b3\u30df\u30e5\u30cb\u30c6\u30a3\u306e\u30af\u30ea\u30a8\u30a4\u30bf\u30fc\u3084\u30a2\u30ab\u30a6\u30f3\u30c8\u3092\u3059\u3070\u3084\u304f\u898b\u3064\u3051\u3089\u308c\u308b\u3088\u3046\u306b\u3001\u30b7\u30f3\u30d7\u30eb\u306a\u30ca\u30d3\u30b2\u30fc\u30b7\u30e7\u30f3\u30b5\u30a4\u30c8\u3092\u4f5c\u308a\u307e\u3057\u305f\u3002\u3053\u306e\u30b5\u30a4\u30c8\u306e\u76ee\u7684\u306f\u3001\u30af\u30ea\u30a8\u30a4\u30bf\u30fc\u3092\u63a2\u3057\u3084\u3059\u304f\u3057\u3001\u65b0\u3057\u3044\u30b3\u30f3\u30c6\u30f3\u30c4\u3092\u898b\u3064\u3051\u3001\u540c\u3058\u8208\u5473\u3092\u6301\u3064\u4eba\u3068\u3064\u306a\u304c\u308b\u3053\u3068\u3067\u3059\u3002\u3054\u610f\u898b\u30fb\u3054\u611f\u60f3\u30fb\u6539\u5584\u306e\u305f\u3081\u306e\u30b3\u30e9\u30dc\u306a\u3069\u304c\u3042\u308c\u3070\u3001\u304a\u6c17\u8efd\u306b\u3054\u9023\u7d61\u304f\u3060\u3055\u3044\u3002X: @fistingguide \u307e\u305f\u306f\u30e1\u30fc\u30eb: fistingguide@proton.me \u3067\u9023\u7d61\u53ef\u80fd\u3067\u3059\u3002\u30b5\u30a4\u30c8\u306b\u63b2\u8f09\u3055\u308c\u305f\u304f\u306a\u3044\u5834\u5408\u306f\u3001\u304a\u77e5\u3089\u305b\u304f\u3060\u3055\u3044\u3002\u4e00\u89a7\u304b\u3089\u524a\u9664\u3057\u307e\u3059\u3002\u3042\u308a\u304c\u3068\u3046\u3054\u3056\u3044\u307e\u3059\u3002\u3053\u306e\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u304c\u30b3\u30df\u30e5\u30cb\u30c6\u30a3\u306e\u6210\u9577\u306b\u5f79\u7acb\u3064\u3053\u3068\u3092\u9858\u3063\u3066\u3044\u307e\u3059\u3002",
		campaign_title: "キャンペーン",
		author_call_title: "記事募集",
		author_call_page_title: "記事募集",
		author_call_back_home: "ホームに戻る",
		author_call_intro:
			"Fisting体験談募集＆シェア長期企画開始！\n皆さんこんにちは、Fistingについての経験共有と体験談募集を長期で開催する企画を始めます。興味のある方はぜひご参加ください。\n\n主に募集する内容：\nFistingを安全に始める方法（初心者向け手順、準備）\n浣腸（enema）の正しいやり方、注意点、実践的な経験\nFisting中の安全テクニック、潤滑剤の選び方、よくあるトラブルと解決法\n自分で実際にFistingをしたリアル体験談（ソロまたはパートナーと）、感想、心得\nおすすめのトイ、使用感、保養方法など\n\n初心者で興味がある方から、経験豊富な方まで、どなたでも大歓迎です。体験談は長くても短くてもOK、匿名投稿も可能です。\n\n安全第一のお願い：\nFistingは高強度のプレイです。安全、徐々に進めること、十分な潤滑、相互の同意が非常に重要です。この企画での全ての共有は参考・交流目的のみであり、医療的なアドバイスではありません。実際に行う際は無理をせず、十分に準備をし、違和感を感じたらすぐに中止して医師に相談してください。\n\n投稿方法：\n私のX（Twitter/X）アカウントにダイレクトメッセージ（DM）で送信\nまたはメールで送る\n\n全ての投稿を丁寧に拝見し、プライバシーを尊重します。匿名での掲載も対応可能です。皆さんの経験やストーリーを共有していただき、より多くの人が安全に楽しくこのプレイを探求できるようにしていきましょう～\n投稿はDMまたはメールでお願いします。よろしくお願いします！",
		event_title: "List Star",
		event_description:
			"List Star \u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u958b\u59cb\uff01\u671f\u9593\u306f1\u304b\u6708\u3002\u30b5\u30a4\u30c8\u3068X\u3067\u512a\u79c0\u306aFisting\u611b\u597d\u5bb6\u3092\u7121\u6599\u3067\u7d39\u4ecb\u3057\u307e\u3059\uff01List Star \u306b\u306a\u308b\u3068\n1. \u516c\u5f0fList\u30e9\u30f3\u30ad\u30f3\u30b0\u306e\u4e0a\u4f4d\u63b2\u8f09\n2. \u5c02\u7528\u30dd\u30b9\u30bf\u30fc1\u679a\n3. \u516c\u5f0fX\u30a2\u30ab\u30a6\u30f3\u30c8\u3067\u306e\u5ba3\u4f1d\n\n\u53c2\u52a0\u65b9\u6cd5\uff1f\n\u9854\u3092\u96a0\u3057\u305f\u4e0a\u534a\u8eab\u306e\u5199\u771f1\u679a\u3001fisting\u52d5\u753b1\u672c\u3001\u305d\u3057\u3066\u305d\u306e\u52d5\u753b\u306b\u3064\u3044\u3066\u306e\u30ad\u30e3\u30d7\u30b7\u30e7\u30f3\u6587\u3002",
		admin_search_placeholder: "X \u30cf\u30f3\u30c9\u30eb\u3067\u691c\u7d22",
		admin_search_hint: "\u65e2\u5b58\u30a2\u30ab\u30a6\u30f3\u30c8\u306e\u307f\u5bfe\u5fdc\u3001\u95a2\u9023\u60c5\u5831\u306e\u4fee\u6b63\u307e\u305f\u306f\u524a\u9664\u7528",
		admin_search_btn: "\u691c\u7d22",
		admin_reset_btn: "\u30ea\u30bb\u30c3\u30c8",
		admin_label_display_name: "\u8868\u793a\u540d",
		admin_ph_display_name: "\u8868\u793a\u540d",
		admin_label_x_handle: "X \u30cf\u30f3\u30c9\u30eb",
		admin_ph_x_handle: "\u30cf\u30f3\u30c9\u30eb\uff08\u4f8b @demo\uff09",
		admin_label_orientation: "\u6307\u5411",
		admin_ph_orientation: "\u6307\u5411",
		admin_label_fans_count: "\u30d5\u30a9\u30ed\u30ef\u30fc",
		admin_ph_fans_count: "\u30d5\u30a9\u30ed\u30ef\u30fc",
		admin_label_location: "\u5730\u57df / \u90fd\u9053\u5e9c\u770c / \u56fd(\u5730\u57df)",
		admin_ph_location_search: "\u56fd(\u5730\u57df)\u307e\u305f\u306f\u90fd\u5e02\u3092\u691c\u7d22\uff08\u5730\u56f3\u691c\u7d22\uff09",
		admin_selected_prefix: "\u9078\u629e\u4e2d:",
		admin_label_map_preview: "\u30c7\u30d5\u30a9\u30eb\u30c8\u306e\u4f4f\u6240\u304c\u5909\u308f\u308b\u307e\u3067\u4f4d\u7f6e\u3092\u30af\u30ea\u30c3\u30af\u3057\u3066\u304f\u3060\u3055\u3044",
		admin_label_profile_url: "\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb URL",
		admin_ph_profile_url: "\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb URL",
		admin_label_avatar_url: "\u30a2\u30d0\u30bf\u30fc URL",
		admin_ph_avatar_url: "\u30a2\u30d0\u30bf\u30fc URL",
		admin_label_bio: "\u7d39\u4ecb\u6587",
		admin_ph_bio: "\u7d39\u4ecb\u6587",
	admin_btn_create: "\u4f5c\u6210",
	admin_btn_save_changes: "\u7de8\u96c6\u3092\u78ba\u5b9a",
	admin_btn_delete_current: "\u73fe\u5728\u306e\u9805\u76ee\u3092\u524a\u9664",
	admin_btn_cancel_edit: "\u7de8\u96c6\u3092\u30ad\u30e3\u30f3\u30bb\u30eb",
	admin_mode_title_home: "\u64cd\u4f5c\u3092\u9078\u629e",
	admin_mode_title_create: "\u30d1\u30d5\u30a9\u30fc\u30de\u30fc\u3092\u8ffd\u52a0",
	admin_mode_title_edit: "\u30d1\u30d5\u30a9\u30fc\u30de\u30fc\u3092\u7de8\u96c6",
	admin_mode_title_delete: "\u30d1\u30d5\u30a9\u30fc\u30de\u30fc\u3092\u524a\u9664",
	admin_mode_btn_create: "\u30d1\u30d5\u30a9\u30fc\u30de\u30fc\u3092\u8ffd\u52a0",
	admin_mode_btn_edit: "\u30d1\u30d5\u30a9\u30fc\u30de\u30fc\u3092\u7de8\u96c6",
	admin_mode_btn_delete: "\u30d1\u30d5\u30a9\u30fc\u30de\u30fc\u3092\u524a\u9664",
	admin_delete_hint: "\u307e\u305a\u5b58\u5728\u3059\u308b\u30d1\u30d5\u30a9\u30fc\u30de\u30fc\u3092\u691c\u7d22\u3057\u3066\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044",
	admin_delete_selected: "\u9078\u629e\u4e2d: {name} ({handle}) ID {id}",
	admin_status_no_exact_match_mode: "\u3053\u306e\u30e2\u30fc\u30c9\u3067\u306f\u4e00\u81f4\u3059\u308b\u30cf\u30f3\u30c9\u30eb\u304c\u3042\u308a\u307e\u305b\u3093",
	admin_status_pick_existing_first: "\u307e\u305a\u5b58\u5728\u3059\u308b\u30d1\u30d5\u30a9\u30fc\u30de\u30fc\u3092\u691c\u7d22\u3057\u3066\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044",
		admin_status_ready: "\u6e96\u5099\u5b8c\u4e86",
		admin_status_no_exact_match: "\u5b8c\u5168\u4e00\u81f4\u3059\u308b\u30cf\u30f3\u30c9\u30eb\u304c\u3042\u308a\u307e\u305b\u3093\u3002\u65b0\u898f\u4f5c\u6210\u3067\u304d\u307e\u3059\u3002",
		admin_status_matched_handles: "{count} \u4ef6\u306e\u30cf\u30f3\u30c9\u30eb\u304c\u4e00\u81f4",
		admin_status_handle_required: "\u30cf\u30f3\u30c9\u30eb\u306f\u5fc5\u9808\u3067\u3059",
		admin_status_submitting: "\u9001\u4fe1\u4e2d...",
		admin_status_updated_success: "\u66f4\u65b0\u306b\u6210\u529f\u3057\u307e\u3057\u305f",
		admin_status_created_success: "\u4f5c\u6210\u306b\u6210\u529f\u3057\u307e\u3057\u305f",
		admin_alert_updated_success: "\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u3092\u66f4\u65b0\u3057\u307e\u3057\u305f\u3002",
		admin_alert_created_success: "\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u3092\u4f5c\u6210\u3057\u307e\u3057\u305f\u3002",
	},
	ko: {
		page_title_ranking: "\ud37c\ud3ec\uba38 \ubaa9\ub85d",
		page_title_admin: "\ub370\uc774\ud130\ubca0\uc774\uc2a4 \uad00\ub9ac\uc790 \ud328\ub110",
		page_title_dashboard: "\uc9c0\ub3c4",
		page_title_about: "\uc18c\uac1c",
		page_title_wiki: "Fisting Wiki",
		page_title_wiki_article: "Fisting Wiki",
		heading_ranking: "\ud37c\ud3ec\uba38 \ubaa9\ub85d",
		heading_language: "\uc5b8\uc5b4",
		heading_add: "\ucd94\uac00",
		heading_star: "\uc9c0\ub3c4",
		heading_about: "\uc18c\uac1c",
		heading_wiki: "Fisting Wiki",
		nav_ranking: "\ud37c\ud3ec\uba38 \ubaa9\ub85d",
		nav_add: "\ucd94\uac00",
		nav_star: "\uc9c0\ub3c4",
		nav_wiki: "\uac8c\uc2dc\uae00",
		nav_about: "\uc18c\uac1c",
		dashboard_visit_select: "\uc9c0\ub3c4\uc5d0\uc11c \ud37c\ud3ec\uba38\ub97c \uba3c\uc800 \uc120\ud0dd\ud574 \uc8fc\uc138\uc694",
		dashboard_visit_named: "{name}\ub85c \uc774\ub3d9",
		country_region: "\uad6d\uac00(\uc9c0\uc5ed)",
		all_option: "\uc804\uccb4",
		friendly_links: "\ucee4\ubba4\ub2c8\ud2f0 \ud611\uc5c5",
	view_articles: "게시글 보기",
		partner_qutoys: "QUTOYS (10% \ud560\uc778)",
		ranking_location_notice:
			"이 사이트는 남성 사용자만 수록합니다. 공정한 노출을 위해 계정은 순환 고정됩니다. 지도 위치는 흐림 처리된 예시이며 실제 주소가 아닙니다. 사용자는 TG 그룹에서 직접 추가하거나 삭제를 요청할 수 있습니다. 책 아이콘은 우리의 블로그입니다. 문의 사항은 X: @fistingguide 로 연락해 주세요.",
		spotlight_title: "\uc21c\ud658 \uace0\uc815 \ub178\ucd9c",
		spotlight_next_switch: "{time} \ud6c4 \uc804\ud658",
		age_title: "\uc5f0\ub839 \ud655\uc778",
		age_desc: "\uc774 \uc0ac\uc774\ud2b8\ub294 18\uc138 \uc774\uc0c1\ub9cc \uc774\uc6a9\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \ub9cc 18\uc138 \uc774\uc0c1\uc778\uac00\uc694?",
		age_yes: "\ub124, \ub9cc 18\uc138 \uc774\uc0c1\uc785\ub2c8\ub2e4",
		age_no: "\uc544\ub2c8\uc694",
		age_denied: "\uc811\uadfc\uc774 \uac70\ubd80\ub418\uc5c8\uc2b5\ub2c8\ub2e4. \uc774 \uc0ac\uc774\ud2b8\ub294 18\uc138 \uc774\uc0c1\ub9cc \uc774\uc6a9 \uac00\ub2a5\ud569\ub2c8\ub2e4.",
		article_by: "\uc791\uc131\uc790",
		article_updated: "\uc5c5\ub370\uc774\ud2b8",
		wiki_submit_hint: "fistingguide\uc5d0 \uae00 \uae30\uace0",
		about_description:
			"\uc548\ub155\ud558\uc138\uc694. \uc800\ub294 fisting \uc560\ud638\uac00\uc774\uba70, \ucee4\ubba4\ub2c8\ud2f0\uc5d0\uc11c \ud06c\ub9ac\uc5d0\uc774\ud130\uc640 \uacc4\uc815\uc744 \ube60\ub974\uac8c \ucc3e\uc744 \uc218 \uc788\ub3c4\ub85d \ub2e8\uc21c\ud55c \ub124\ube44\uac8c\uc774\uc158 \uc6f9\uc0ac\uc774\ud2b8\ub97c \ub9cc\ub4e4\uc5c8\uc2b5\ub2c8\ub2e4. \uc774 \uc0ac\uc774\ud2b8\uc758 \ubaa9\ud45c\ub294 \ud06c\ub9ac\uc5d0\uc774\ud130\ub97c \ub354 \uc27d\uac8c \ucc3e\uace0, \uc0c8\ub85c\uc6b4 \ucf58\ud150\uce20\ub97c \ud0d0\uc0c9\ud558\uba70, \uac19\uc740 \uad00\uc2ec\uc0ac\ub97c \uac00\uc9c4 \uc0ac\ub78c\ub4e4\uacfc \uc5f0\uacb0\ud558\ub294 \uac83\uc785\ub2c8\ub2e4. \uc81c\uc548, \ud53c\ub4dc\ubc31, \ud639\uc740 \ud504\ub85c\uc81d\ud2b8 \uac1c\uc120\uc744 \ud568\uaed8\ud558\uace0 \uc2f6\uc73c\uc2dc\uba74 \ud3b8\ud558\uac8c \uc5f0\ub77d\ud574 \uc8fc\uc138\uc694. X \uacc4\uc815 @fistingguide \ub610\ub294 \uc774\uba54\uc77c fistingguide@proton.me \ub85c \uc5f0\ub77d\ud558\uc2e4 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \uc6f9\uc0ac\uc774\ud2b8\uc5d0 \ub178\ucd9c\ub418\uace0 \uc2f6\uc9c0 \uc54a\uc73c\uc2dc\uba74 \uc54c\ub824 \uc8fc\uc138\uc694. \ub9ac\uc2a4\ud305\uc744 \uc81c\uac70\ud574 \ub4dc\ub9ac\uaca0\uc2b5\ub2c8\ub2e4. \uac10\uc0ac\ud569\ub2c8\ub2e4. \uc774 \ud504\ub85c\uc81d\ud2b8\uac00 \ucee4\ubba4\ub2c8\ud2f0 \uc131\uc7a5\uc5d0 \ub3c4\uc6c0\uc774 \ub418\uae30\ub97c \ubc14\ub78d\ub2c8\ub2e4.",
		campaign_title: "캠페인",
		author_call_title: "원고 모집",
		author_call_page_title: "원고 모집",
		author_call_back_home: "홈으로 돌아가기",
		author_call_intro:
			"Fisting 이야기 수집 및 공유 장기 이벤트 시작!\n안녕하세요. 저는 Fisting에 대한 경험 공유와 이야기 모집을 위한 장기 이벤트를 시작합니다. 관심 있는 모든 분들의 참여를 환영합니다.\n\n주요 모집 내용:\n안전하게 시작하는 방법(입문 단계, 준비)\nenema의 올바른 방법, 주의사항, 실전 팁\n플레이 중 안전 테크닉, 윤활제 선택, 자주 발생하는 문제와 해결법\n실제 fisting 경험담(솔로 또는 파트너와 함께), 느낌과 인사이트\n토이 추천, 사용 후기, 관리 팁\n\n입문자든 숙련자든 누구나 자유롭게 참여할 수 있습니다. 글 길이는 제한 없고, 익명 제출도 가능합니다.\n\n안전 우선 안내:\nFisting은 고강도 플레이입니다. 안전, 점진적 진행, 충분한 윤활, 상호 동의가 매우 중요합니다. 본 이벤트의 모든 내용은 참고 및 교류 목적이며 의료 조언이 아닙니다. 실제 진행 시 무리하지 말고 충분히 준비하며, 불편함이 있으면 즉시 중단하고 의사와 상담하세요.\n\n제출 방법:\nX(Twitter/X) 계정으로 DM 보내기\n또는 이메일 보내기\n\n모든 제출물은 신중히 읽고 개인정보를 존중하겠습니다. 익명 게시도 지원합니다. 더 많은 분들이 안전하고 즐겁게 탐색할 수 있도록 여러분의 경험과 이야기를 기다립니다~\nDM 또는 이메일로 바로 보내주세요. 감사합니다!",
		event_title: "List Star",
		event_description:
			"List Star \ud504\ub85c\uc81d\ud2b8 \uc2dc\uc791! \ud55c \ub2ec \ub3d9\uc548 \uc6f9\uc0ac\uc774\ud2b8\uc640 X\uc5d0\uc11c \uc6b0\uc218\ud55c Fisting \uc560\ud638\uac00\ub97c \ubb34\ub8cc\ub85c \ud64d\ubcf4\ud569\ub2c8\ub2e4! List Star\uac00 \ub418\uba74\n1. \uacf5\uc2dd List \ub7ad\ud0b9 \uc0c1\ub2e8 \uace0\uc815\n2. \uc804\uc6a9 \ud3ec\uc2a4\ud130 1\uc7a5\n3. \uacf5\uc2dd X \uacc4\uc815 \ud64d\ubcf4\n\n\ucc38\uc5ec \ubc29\ubc95?\n\uc5bc\uad74\uc744 \uac00\ub9b0 \uc0c1\ubc18\uc2e0 \uc0ac\uc9c4 1\uc7a5, fisting \uc601\uc0c1 1\uac1c, \uadf8\ub9ac\uace0 \ud574\ub2f9 \uc601\uc0c1\uc5d0 \ub300\ud55c \ucea1\uc158/\uce74\ud53c.",
		admin_search_placeholder: "X \ud578\ub4e4\ub85c \uac80\uc0c9",
		admin_search_hint: "\uae30\uc874 \uacc4\uc815\ub9cc \uc9c0\uc6d0\ud558\uba70 \uad00\ub828 \uc815\ubcf4 \uc218\uc815 \ub610\ub294 \uc0ad\uc81c \uc6a9\ub3c4",
		admin_search_btn: "\uac80\uc0c9",
		admin_reset_btn: "\ucd08\uae30\ud654",
		admin_label_display_name: "\ud45c\uc2dc \uc774\ub984",
		admin_ph_display_name: "\ud45c\uc2dc \uc774\ub984",
		admin_label_x_handle: "X \ud578\ub4e4",
		admin_ph_x_handle: "\ud578\ub4e4(\uc608: @demo)",
		admin_label_orientation: "\uc131\ud5a5",
		admin_ph_orientation: "\uc131\ud5a5",
		admin_label_fans_count: "\ud314\ub85c\uc6cc",
		admin_ph_fans_count: "\ud314\ub85c\uc6cc",
		admin_label_location: "\uad6c/\uc9c0\uc5ed/\uad6d\uac00(\uc9c0\uc5ed)",
		admin_ph_location_search: "\uad6d\uac00(\uc9c0\uc5ed) \ub610\ub294 \ub3c4\uc2dc \uac80\uc0c9(\uc9c0\ub3c4 \uac80\uc0c9)",
		admin_selected_prefix: "\uc120\ud0dd:",
		admin_label_map_preview: "\uae30\ubcf8 \uc8fc\uc18c\uac00 \ubcc0\uacbd\ub420 \ub54c\uae4c\uc9c0 \uc704\uce58\ub97c \ud074\ub9ad\ud574 \uc8fc\uc138\uc694",
		admin_label_profile_url: "\ud504\ub85c\ud544 URL",
		admin_ph_profile_url: "\ud504\ub85c\ud544 URL",
		admin_label_avatar_url: "\uc544\ubc14\ud0c0 URL",
		admin_ph_avatar_url: "\uc544\ubc14\ud0c0 URL",
		admin_label_bio: "\uc18c\uac1c",
		admin_ph_bio: "\uc18c\uac1c",
	admin_btn_create: "\uc0dd\uc131",
	admin_btn_save_changes: "\ud3b8\uc9d1 \ud655\uc778",
	admin_btn_delete_current: "\ud604\uc7ac \ud56d\ubaa9 \uc0ad\uc81c",
	admin_btn_cancel_edit: "\ud3b8\uc9d1 \ucde8\uc18c",
	admin_mode_title_home: "\uc791\uc5c5 \uc120\ud0dd",
	admin_mode_title_create: "\ud37c\ud3ec\uba38 \ucd94\uac00",
	admin_mode_title_edit: "\ud37c\ud3ec\uba38 \uc218\uc815",
	admin_mode_title_delete: "\ud37c\ud3ec\uba38 \uc0ad\uc81c",
	admin_mode_btn_create: "\ud37c\ud3ec\uba38 \ucd94\uac00",
	admin_mode_btn_edit: "\ud37c\ud3ec\uba38 \uc218\uc815",
	admin_mode_btn_delete: "\ud37c\ud3ec\uba38 \uc0ad\uc81c",
	admin_delete_hint: "\uba3c\uc800 \uae30\uc874 \ud37c\ud3ec\uba38\ub97c \uac80\uc0c9\ud558\uace0 \uc120\ud0dd\ud574 \uc8fc\uc138\uc694",
	admin_delete_selected: "\uc120\ud0dd\ub428: {name} ({handle}) ID {id}",
	admin_status_no_exact_match_mode: "\ud604\uc7ac \ubaa8\ub4dc\uc5d0\uc11c \uc77c\uce58\ud558\ub294 \ud578\ub4e4\uc744 \ucc3e\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4",
	admin_status_pick_existing_first: "\uba3c\uc800 \uae30\uc874 \ud37c\ud3ec\uba38\ub97c \uac80\uc0c9\ud558\uace0 \uc120\ud0dd\ud574 \uc8fc\uc138\uc694",
		admin_status_ready: "\uc900\ube44\ub428",
		admin_status_no_exact_match: "\uc815\ud655\ud788 \uc77c\uce58\ud558\ub294 \ud578\ub4e4\uc774 \uc5c6\uc2b5\ub2c8\ub2e4. \uc0c8 \uae30\ub85d\uc744 \ub9cc\ub4e4 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
		admin_status_matched_handles: "{count}\uac1c \ud578\ub4e4 \uc77c\uce58",
		admin_status_handle_required: "\ud578\ub4e4\uc740 \ud544\uc218\uc785\ub2c8\ub2e4",
		admin_status_submitting: "\uc81c\ucd9c \uc911...",
		admin_status_updated_success: "\uc5c5\ub370\uc774\ud2b8 \uc131\uacf5",
		admin_status_created_success: "\uc0dd\uc131 \uc131\uacf5",
		admin_alert_updated_success: "\ud504\ub85c\ud544\uc774 \uc131\uacf5\uc801\uc73c\ub85c \uc5c5\ub370\uc774\ud2b8\ub418\uc5c8\uc2b5\ub2c8\ub2e4.",
		admin_alert_created_success: "\ud504\ub85c\ud544\uc774 \uc131\uacf5\uc801\uc73c\ub85c \uc0dd\uc131\ub418\uc5c8\uc2b5\ub2c8\ub2e4.",
	},
	es: {
		page_title_ranking: "Lista de artistas",
		page_title_admin: "Panel de administracion de base de datos",
		page_title_dashboard: "Mapa",
		page_title_about: "Acerca de",
		page_title_wiki: "Fisting Wiki",
		page_title_wiki_article: "Fisting Wiki",
		heading_ranking: "Lista de artistas",
		heading_language: "Idioma",
		heading_add: "Agregar",
		heading_star: "Mapa",
		heading_about: "Acerca de",
		heading_wiki: "Fisting Wiki",
		nav_ranking: "Lista de artistas",
		nav_add: "Agregar",
		nav_star: "Mapa",
		nav_wiki: "Artículos",
		nav_about: "Acerca de",
		dashboard_visit_select: "Primero selecciona un artista en el mapa",
		dashboard_visit_named: "Visitar a {name}",
		country_region: "pais(region)",
		all_option: "Todos",
		friendly_links: "Colaboracion comunitaria",
	view_articles: "Ver articulos",
		partner_qutoys: "QUTOYS (10% de descuento)",
		ranking_location_notice:
			"Este sitio solo incluye usuarios masculinos. Las cuentas se rotan en destacado para garantizar una exhibicion justa. Las ubicaciones del mapa son referencias difuminadas y no corresponden a direcciones reales. Los usuarios pueden agregarse o solicitar eliminacion mediante el grupo de TG. El icono de libro es nuestro blog. Cualquier problema, contacta en X: @fistingguide.",
		spotlight_title: "Destacado Rotativo",
		spotlight_next_switch: "Siguiente cambio en {time}",
		age_title: "Confirmacion de edad",
		age_desc: "Debes tener 18+ para entrar a este sitio. Tienes 18 anos o mas?",
		age_yes: "Si, tengo 18+",
		age_no: "No",
		age_denied: "Acceso denegado. Este sitio es solo para adultos de 18+.",
		article_by: "Por",
		article_updated: "Actualizado",
		wiki_submit_hint: "enviar un articulo a fistingguide",
		about_description:
			"Hola, soy un entusiasta del fisting y hace poco cree un sitio de navegacion simple para ayudar a descubrir rapidamente creadores y cuentas de la comunidad. El objetivo de este sitio es facilitar encontrar creadores, explorar contenido nuevo y conectar con otras personas que comparten los mismos intereses. Si tienes sugerencias, comentarios o quieres colaborar para mejorar el proyecto, no dudes en escribirme. Puedes contactarme en X: @fistingguide o por correo: fistingguide@proton.me. Si prefieres no aparecer en el sitio web, avisame y eliminare tu listado. Gracias, y espero que este proyecto ayude a que la comunidad siga creciendo.",
		campaign_title: "Campaña",
		author_call_title: "Convocatoria de Artículos",
		author_call_page_title: "Convocatoria de Artículos",
		author_call_back_home: "Volver al inicio",
		author_call_intro:
			"¡Lanzamiento del evento a largo plazo de recopilación y compartición de historias de Fisting!\nHola a todos. Estoy iniciando un evento a largo plazo para compartir experiencias y recopilar historias sobre Fisting. Cualquier persona interesada es bienvenida.\n\nContenido principal que buscamos:\nCómo empezar de forma segura (pasos para principiantes y preparación)\nMétodos correctos de enema, precauciones y consejos prácticos\nTécnicas de seguridad durante la práctica, elección de lubricantes, problemas comunes y soluciones\nHistorias reales de fisting (solo o con pareja), sensaciones y aprendizajes\nRecomendaciones de juguetes, experiencia de uso y mantenimiento\n\nTanto si eres principiante como si tienes experiencia, puedes enviar tu aporte. Las historias pueden ser largas o cortas y se aceptan envíos anónimos.\n\nDeclaración de seguridad:\nEl fisting es una práctica de alta intensidad. La seguridad, la progresión gradual, una lubricación abundante y el consentimiento mutuo son fundamentales. Todo lo compartido en este evento es solo para referencia e intercambio y no constituye consejo médico. Actúa con responsabilidad, prepárate bien y detente de inmediato si sientes cualquier molestia, consultando a un médico.\n\nMétodos de envío:\nEnvíame un mensaje privado por X (Twitter/X)\nO envíame un correo electrónico\n\nLeeré todos los envíos con atención, respetaré tu privacidad y se admiten publicaciones anónimas. Espero sus experiencias e historias para ayudar a más personas a explorar este kink de forma segura y disfrutable~\nEnvía directamente por DM o por correo. ¡Gracias!",
		event_title: "List Star",
		event_description:
			"El proyecto List Star esta en marcha. Durante un mes, promocionaremos gratis a destacados entusiastas del Fisting en la web y en X. Si eres List Star, obtendras:\n1. Posicion destacada en el ranking oficial List\n2. Un poster exclusivo\n3. Promocion en la cuenta oficial de X\n\nComo participar?\nUna foto del torso superior con el rostro oculto, un video de fisting y un texto/copy sobre el video.",
		admin_search_placeholder: "Buscar por handle de X",
		admin_search_hint: "Solo admite cuentas existentes para modificar su informacion relacionada o eliminar.",
		admin_search_btn: "Buscar",
		admin_reset_btn: "Restablecer",
		admin_label_display_name: "Nombre visible",
		admin_ph_display_name: "Nombre visible",
		admin_label_x_handle: "Handle de X",
		admin_ph_x_handle: "Handle (ej. @demo)",
		admin_label_orientation: "Orientacion",
		admin_ph_orientation: "Orientacion",
		admin_label_fans_count: "Seguidores",
		admin_ph_fans_count: "Seguidores",
		admin_label_location: "Distrito / Region / Pais (Region)",
		admin_ph_location_search: "Buscar pais (region) o ciudad (busqueda en mapa)",
		admin_selected_prefix: "Seleccionado:",
		admin_label_map_preview: "Haz clic en tu ubicacion hasta que cambie la direccion predeterminada",
		admin_label_profile_url: "URL del perfil",
		admin_ph_profile_url: "URL del perfil",
		admin_label_avatar_url: "URL del avatar",
		admin_ph_avatar_url: "URL del avatar",
		admin_label_bio: "Bio",
		admin_ph_bio: "Bio",
	admin_btn_create: "Crear",
	admin_btn_save_changes: "Confirmar edicion",
	admin_btn_delete_current: "Eliminar actual",
	admin_btn_cancel_edit: "Cancelar edicion",
	admin_mode_title_home: "Elegir accion",
	admin_mode_title_create: "Agregar artista",
	admin_mode_title_edit: "Editar artista",
	admin_mode_title_delete: "Eliminar artista",
	admin_mode_btn_create: "Agregar artista",
	admin_mode_btn_edit: "Editar artista",
	admin_mode_btn_delete: "Eliminar artista",
	admin_delete_hint: "Primero busca y selecciona un artista existente.",
	admin_delete_selected: "Seleccionado: {name} ({handle}) ID {id}",
	admin_status_no_exact_match_mode: "No hay coincidencia exacta del handle para este modo.",
	admin_status_pick_existing_first: "Primero busca y selecciona un artista existente.",
		admin_status_ready: "Listo",
		admin_status_no_exact_match: "No hay coincidencia exacta del handle. Puedes crear un nuevo registro.",
		admin_status_matched_handles: "{count} handles coinciden",
		admin_status_handle_required: "El handle es obligatorio",
		admin_status_submitting: "Enviando...",
		admin_status_updated_success: "Actualizado correctamente",
		admin_status_created_success: "Creado correctamente",
		admin_alert_updated_success: "Perfil actualizado correctamente.",
		admin_alert_created_success: "Perfil creado correctamente.",
	},
	pt: PT_MESSAGES,
	th: TH_MESSAGES,
	vi: VI_MESSAGES,
};
function renderLanguageSwitcher(id: string): string {
	return `
		<select id="${escapeHtml(id)}" class="lang-switch" data-uniform-dropdown="1" aria-label="Language">
			<option value="en">English</option>
			<option value="zh-CN">&#31616;&#20307;&#20013;&#25991;</option>
			<option value="zh-TW">&#32321;&#39636;&#20013;&#25991;</option>
			<option value="ja">&#26085;&#26412;&#35486;</option>
			<option value="ko">&#54620;&#44397;&#50612;</option>
			<option value="es">Espa&#241;ol</option>
			<option value="pt">Portugues</option>
			<option value="th">ไทย</option>
			<option value="vi">Tiếng Việt</option>
		</select>
	`;
}
function renderI18nScript(pageTitleKey: string): string {
	const localesJson = JSON.stringify(LOCALE_CODES).replaceAll("<", "\\u003c").replaceAll("</", "<\\/");
	const messagesJson = JSON.stringify(I18N_MESSAGES).replaceAll("<", "\\u003c").replaceAll("</", "<\\/");
	return `
		<script>
			(function () {
				const storageKey = "ui_lang";
				const locales = ${localesJson};
				const messages = ${messagesJson};
				const pageTitleKey = ${JSON.stringify(pageTitleKey)};

				function normalizeLang(input) {
					const text = String(input || "").trim();
					if (!text) return "";
					const lower = text.toLowerCase();
					if (lower === "zh-cn" || lower === "zh-hans" || lower === "zh") return "zh-CN";
					if (lower === "zh-tw" || lower === "zh-hant" || lower === "zh-hk") return "zh-TW";
					if (lower.startsWith("ja")) return "ja";
					if (lower.startsWith("ko")) return "ko";
					if (lower.startsWith("es")) return "es";
					if (lower.startsWith("pt")) return "pt";
					if (lower.startsWith("th")) return "th";
					if (lower.startsWith("vi")) return "vi";
					if (lower.startsWith("en")) return "en";
					const direct = locales.find(function (item) { return item.toLowerCase() === lower; });
					return direct || "";
				}

				function pickLang() {
					const url = new URL(window.location.href);
					const fromUrl = normalizeLang(url.searchParams.get("lang"));
					if (fromUrl) return fromUrl;
					const fromStorage = normalizeLang(localStorage.getItem(storageKey));
					if (fromStorage) return fromStorage;
					const fromBrowser = normalizeLang(navigator.language || "");
					return fromBrowser || "en";
				}

				function tr(lang, key, fallback) {
					const pack = messages[lang] || messages.en || {};
					return pack[key] || fallback || "";
				}

				function withLang(raw, lang) {
					if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return raw;
					try {
						const next = new URL(raw, window.location.origin);
						next.searchParams.set("lang", lang);
						const query = next.searchParams.toString();
						return next.pathname + (query ? "?" + query : "") + (next.hash || "");
					} catch {
						return raw;
					}
				}

				const lang = pickLang();
				localStorage.setItem(storageKey, lang);
				document.documentElement.lang = lang;
				window.__uiLang = lang;
				window.__I18N_MESSAGES = messages;
				window.__t = function (key, fallback) {
					return tr(lang, key, fallback);
				};

				const url = new URL(window.location.href);
				if (url.searchParams.get("lang") !== lang) {
					url.searchParams.set("lang", lang);
					history.replaceState(null, "", url.pathname + "?" + url.searchParams.toString() + url.hash);
				}

				document.querySelectorAll("[data-i18n]").forEach(function (el) {
					const key = el.getAttribute("data-i18n");
					if (!key) return;
					el.textContent = tr(lang, key, el.textContent || "");
				});
				document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
					const key = el.getAttribute("data-i18n-placeholder");
					if (!key) return;
					if (!(el instanceof HTMLInputElement) && !(el instanceof HTMLTextAreaElement)) return;
					el.placeholder = tr(lang, key, el.placeholder || "");
				});

				if (pageTitleKey) {
					document.title = tr(lang, pageTitleKey, document.title);
				}

				document.querySelectorAll("a[href]").forEach(function (el) {
					const raw = el.getAttribute("href") || "";
					const nextHref = withLang(raw, lang);
					if (nextHref && nextHref !== raw) el.setAttribute("href", nextHref);
				});

				document.querySelectorAll("select option").forEach(function (el) {
					const raw = el.getAttribute("value") || "";
					const nextValue = withLang(raw, lang);
					if (nextValue && nextValue !== raw) el.setAttribute("value", nextValue);
				});

				function measureTextWidthByFont(text, font) {
					const probe = document.createElement("span");
					probe.textContent = text;
					probe.style.position = "absolute";
					probe.style.visibility = "hidden";
					probe.style.whiteSpace = "pre";
					probe.style.pointerEvents = "none";
					probe.style.font = font;
					document.body.appendChild(probe);
					const width = probe.getBoundingClientRect().width;
					probe.remove();
					return width;
				}

				function applyLangSwitchWidth(selectEl, mountEl) {
					if (!(selectEl instanceof HTMLSelectElement)) return;
					if (!selectEl.classList.contains("lang-switch")) return;
					const selected = selectEl.selectedOptions && selectEl.selectedOptions[0] ? selectEl.selectedOptions[0] : selectEl.options[0];
					const text = (selected && selected.textContent ? selected.textContent : "").trim();
					const computed = window.getComputedStyle(selectEl);
					const measured = Math.ceil(measureTextWidthByFont(text || "Language", computed.font || "13px sans-serif"));
					const minWidth = 72;
					const maxWidth = Math.min(220, Math.floor(window.innerWidth * 0.62));
					const finalWidth = Math.max(minWidth, Math.min(maxWidth, measured + 34));
					selectEl.style.width = finalWidth + "px";
					if (mountEl instanceof HTMLElement) {
						mountEl.style.width = finalWidth + "px";
					}
				}

				document.querySelectorAll(".lang-switch").forEach(function (el) {
					if (!(el instanceof HTMLSelectElement)) return;
					el.value = lang;
					const syncLangWidth = function () { applyLangSwitchWidth(el); };
					syncLangWidth();
					window.addEventListener("resize", syncLangWidth);
					el.addEventListener("change", function () {
						const nextLang = normalizeLang(el.value) || "en";
						localStorage.setItem(storageKey, nextLang);
						const nextUrl = new URL(window.location.href);
						nextUrl.searchParams.set("lang", nextLang);
						window.location.href = nextUrl.toString();
					});
				});

				function escHtml(input) {
					return String(input || "")
						.replace(/&/g, "&amp;")
						.replace(/</g, "&lt;")
						.replace(/>/g, "&gt;")
						.replace(/"/g, "&quot;")
						.replace(/'/g, "&#39;");
				}

				function injectUniformSelectCss() {
					if (document.getElementById("uniformSelectCss")) return;
					const style = document.createElement("style");
					style.id = "uniformSelectCss";
					style.textContent =
						".uniform-select-enhanced{display:none;}" +
						".uniform-select-menu{display:none;}" +
						"@media (max-width: 900px) {" +
							".uniform-select-enhanced{display:none;width:100%;position:relative;}" +
							".uniform-select-enhanced.is-lang-switch{width:auto;max-width:100%;}" +
							"html.uniform-select-ready select[data-uniform-dropdown='1']{display:none !important;}" +
							"html.uniform-select-ready .uniform-select-enhanced{display:block;}" +
							".uniform-select-trigger{" +
								"width:100%;height:34px;border:0;border-bottom:1px solid #2F3336;" +
								"background:#000;color:#8B98A5;font:inherit;font-size:13px;padding:0 24px 0 0;" +
								"text-align:left;cursor:pointer;background-image:url(\\\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238B98A5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\\\");" +
								"background-repeat:no-repeat;background-position:right 2px center;" +
							"}" +
							".uniform-select-enhanced.open .uniform-select-trigger{border-bottom-color:#1D9BF0;}" +
							".uniform-select-enhanced.is-lang-switch .uniform-select-trigger{width:auto;display:inline-block;}" +
							".uniform-select-menu{" +
								"display:none;position:absolute;top:calc(100% + 6px);left:0;right:0;z-index:80;" +
								"background:#000;border:1px solid #2F3336;border-radius:10px;overflow:hidden;" +
							"}" +
							".uniform-select-enhanced.is-lang-switch .uniform-select-menu{left:0;right:auto;min-width:100%;}" +
							".uniform-select-enhanced.open .uniform-select-menu{display:block;}" +
							".uniform-select-option{" +
								"width:100%;border:0;border-bottom:1px solid #20252B;background:#000;color:#8B98A5;" +
								"font:inherit;font-size:13px;text-align:left;padding:9px 12px;cursor:pointer;" +
							"}" +
							".uniform-select-option:last-child{border-bottom:0;}" +
							".uniform-select-option.is-selected{color:#E7E9EA;}" +
							".uniform-select-option:active{background:#0B0E12;}" +
						"}";
					document.head.appendChild(style);
				}

				function closeUniformSelectMenus() {
					document.querySelectorAll(".uniform-select-enhanced.open").forEach(function (node) {
						node.classList.remove("open");
					});
				}

				function setupUniformDropdown(selectEl) {
					if (!(selectEl instanceof HTMLSelectElement)) return;
					if (selectEl.dataset.uniformDropdownReady === "1") return;
					selectEl.dataset.uniformDropdownReady = "1";
					const isLangSwitch = selectEl.classList.contains("lang-switch");

					const mount = document.createElement("div");
					mount.className = "uniform-select-enhanced";
					if (isLangSwitch) mount.classList.add("is-lang-switch");
					selectEl.insertAdjacentElement("afterend", mount);

					function renderUniformSelect() {
						const options = Array.from(selectEl.options || []);
						if (!options.length) {
							mount.innerHTML = "";
							return;
						}
						const selectedValue = String(selectEl.value || "");
						const selectedOption = options.find(function (opt) {
							return String(opt.value) === selectedValue;
						}) || options[0];
						mount.innerHTML =
							'<button type="button" class="uniform-select-trigger" aria-haspopup="listbox" aria-expanded="false">' +
								escHtml(selectedOption ? selectedOption.text : "") +
							"</button>" +
							'<div class="uniform-select-menu" role="listbox">' +
								options.map(function (opt) {
									const value = String(opt.value || "");
									const selectedClass = value === selectedValue ? " is-selected" : "";
									return '<button type="button" class="uniform-select-option' + selectedClass + '" data-value="' + escHtml(value) + '">' + escHtml(opt.text) + "</button>";
								}).join("") +
							"</div>";
						if (isLangSwitch) applyLangSwitchWidth(selectEl, mount);

						const trigger = mount.querySelector(".uniform-select-trigger");
						const menu = mount.querySelector(".uniform-select-menu");
						if (!(trigger instanceof HTMLButtonElement) || !(menu instanceof HTMLDivElement)) return;
						trigger.addEventListener("click", function (event) {
							event.preventDefault();
							const isOpen = mount.classList.contains("open");
							closeUniformSelectMenus();
							if (!isOpen) mount.classList.add("open");
						});
						menu.addEventListener("click", function (event) {
							const target = event.target;
							if (!(target instanceof Element)) return;
							const btn = target.closest(".uniform-select-option");
							if (!(btn instanceof HTMLButtonElement)) return;
							const nextValue = btn.getAttribute("data-value") || "";
							if (String(selectEl.value || "") !== nextValue) {
								selectEl.value = nextValue;
								selectEl.dispatchEvent(new Event("change", { bubbles: true }));
							}
							closeUniformSelectMenus();
							renderUniformSelect();
						});
					}

					selectEl.addEventListener("change", renderUniformSelect);
					const observer = new MutationObserver(renderUniformSelect);
					observer.observe(selectEl, { childList: true, subtree: true, characterData: true, attributes: true });
					renderUniformSelect();
				}

				injectUniformSelectCss();
				document.querySelectorAll("select[data-uniform-dropdown='1']").forEach(function (el) {
					setupUniformDropdown(el);
				});
				document.addEventListener("click", function (event) {
					const target = event.target;
					if (!(target instanceof Element)) return;
					if (!target.closest(".uniform-select-enhanced")) closeUniformSelectMenus();
				});
				document.addEventListener("keydown", function (event) {
					if (event.key === "Escape") closeUniformSelectMenus();
				});
				document.documentElement.classList.add("uniform-select-ready");
			})();
		</script>
	`;
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
			const credit = formatCredit(row.total_credit);
			const avatarEl = safeAvatar
				? `<img class="avatar" src="${safeAvatar}" alt="${safeName}" referrerpolicy="no-referrer" loading="lazy" />`
				: `<div class="avatar placeholder">N/A</div>`;

			return `
				<li class="leaderboard-item">
					<a class="card-link" href="${safeUrl}" target="_self" aria-label="Open ${safeName} on X">
						<div class="card-top">
							<div class="rank ${rankClass}">#${rank}</div>
							<div class="badges">
								<div class="badge">Orientation ${safeOrientation}</div>
								<div class="badge">Credit ${credit}</div>
							</div>
						</div>
						<div class="identity">
							${avatarEl}
							<div>
								<div class="name-link">${safeName}</div>
								<div class="handle">${safeHandle}</div>
							</div>
						</div>
						<div class="badge location-badge">${safeDistrict} / ${safeRegion} / ${safeCountry}</div>
						<div class="bio">${safeBio}</div>
					</a>
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
		<title>Performers List</title>
		<link rel="stylesheet" href="/assets/leaflet.css" />
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
			@media (min-width: 721px) {
				:root { --primary: #7e0202; }
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
			.panel-sticky-top {
				position: static;
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
			.header-language-title {
				margin: 0;
				font-size: 12px;
				letter-spacing: 0;
				text-transform: none;
				color: #8B98A5;
				font-weight: 500;
				white-space: nowrap;
			}
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
			.lang-switch {
				font: inherit;
				border: 1px solid var(--line);
				background: #16181C;
				color: var(--text);
				padding: 0 12px;
				border-radius: 10px;
				height: 46px;
				width: 200px;
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
				gap: 10px;
			}
			.mobile-field-label {
				display: none;
				width: auto;
				font-size: 12px;
				letter-spacing: 0;
				text-transform: none;
				color: #8B98A5;
				white-space: nowrap;
			}
			.label-globe {
				display: inline-block;
				width: 12px;
				height: 12px;
				margin-left: 4px;
				vertical-align: -1px;
				background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238B98A5' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cpath d='M3 12h18'/%3E%3Cpath d='M12 3c3 3 3 15 0 18'/%3E%3Cpath d='M12 3c-3 3-3 15 0 18'/%3E%3C/svg%3E");
				background-size: 12px 12px;
				background-repeat: no-repeat;
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
				flex: 0 0 auto;
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
			.nav-btn.primary { background: var(--primary); }
			.nav-btn:hover { filter: brightness(1.03); }
			.nav-btn.active { box-shadow: 0 6px 14px rgba(126, 2, 2, 0.28); }
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
			.mobile-select-enhanced { display: none; width: 100%; position: relative; }
			@media (max-width: 720px) {
				body { font-size: 13px; }
				.top-nav { display: none; }
				.header-main { flex-direction: column; align-items: flex-start; }
				.header-left { width: 100%; }
				.header-title-row {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}
				.header-right { width: 100%; justify-content: flex-start; flex-wrap: wrap; gap: 8px; }
				.header-filter { width: 100%; min-width: 0; }
				.mobile-field-label { display: block; }
				.panel { width: 100%; max-width: 100%; gap: 0; }
				.panel-sticky-top {
					position: sticky;
					top: 0;
					z-index: 180;
					background: rgba(0, 0, 0, 0.96);
					padding: 6px 0;
				}
				.header {
					padding: 10px 0 12px;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					background: transparent;
					box-shadow: none;
				}
				.header h1 { font-size: 20px; }
				.header-language-title { font-size: 12px; }
				.lang-switch {
					height: 34px;
					font-size: 13px;
					background-color: #000000;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					color: #8B98A5;
					appearance: none;
					-webkit-appearance: none;
					-moz-appearance: none;
					padding: 0 24px 0 0;
					background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238B98A5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
					background-repeat: no-repeat;
					background-position: right 2px center;
				}
				.header-filter {
					display: grid;
					grid-template-columns: 116px 1fr;
					align-items: center;
					gap: 10px;
				}
				html.mobile-select-ready .header-filter select,
				html.mobile-select-ready .mobile-nav {
					display: none;
				}
				html.mobile-select-ready .mobile-select-enhanced {
					display: block;
				}
				.header-filter select,
				.mobile-nav {
					width: 100%;
					height: 34px;
					font-size: 13px;
					background-color: #000000;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					color: #8B98A5;
					appearance: none;
					-webkit-appearance: none;
					-moz-appearance: none;
					padding: 0 24px 0 0;
					background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238B98A5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
					background-repeat: no-repeat;
					background-position: right 2px center;
				}
				.header-filter select:focus,
				.mobile-nav:focus {
					outline: none;
					border-bottom-color: #1D9BF0;
					box-shadow: none;
				}
				.header-filter select option,
				.mobile-nav option {
					background-color: #000000;
					color: #8B98A5;
				}
				.mobile-select-trigger {
					width: 100%;
					height: 34px;
					border: 0;
					border-bottom: 1px solid var(--line);
					background: #000000;
					color: #8B98A5;
					font: inherit;
					font-size: 13px;
					padding: 0 24px 0 0;
					text-align: left;
					cursor: pointer;
					background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238B98A5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
					background-repeat: no-repeat;
					background-position: right 2px center;
				}
				.mobile-select-enhanced.open .mobile-select-trigger {
					border-bottom-color: #1D9BF0;
				}
				.mobile-select-menu {
					display: none;
					position: absolute;
					top: calc(100% + 6px);
					left: 0;
					right: 0;
					background: #000000;
					border: 1px solid var(--line);
					border-radius: 10px;
					overflow: hidden;
					z-index: 40;
				}
				.mobile-select-enhanced.open .mobile-select-menu { display: block; }
				.mobile-nav-row .mobile-select-menu {
					left: auto;
					right: 0;
					min-width: 168px;
				}
				.mobile-select-option {
					width: 100%;
					border: 0;
					border-bottom: 1px solid #20252B;
					background: #000000;
					color: #8B98A5;
					font: inherit;
					font-size: 13px;
					text-align: left;
					padding: 9px 12px;
					cursor: pointer;
				}
				.mobile-select-option:last-child { border-bottom: 0; }
				.mobile-select-option.is-selected { color: #E7E9EA; }
				.mobile-select-option:active { background: #0B0E12; }
				.mobile-nav-row .mobile-select-trigger {
					width: 34px;
					height: 34px;
					padding: 0;
					border: 0;
					background: transparent;
					background-image: none;
					display: inline-flex;
					align-items: center;
					justify-content: center;
				}
				.mobile-nav-row .mobile-select-trigger .nav-bars {
					display: inline-grid;
					gap: 4px;
				}
				.mobile-nav-row .mobile-select-trigger .nav-bars span {
					display: block;
					width: 16px;
					height: 1.5px;
					background: #8B98A5;
					border-radius: 99px;
				}
				.mobile-nav-row .mobile-select-enhanced.open .mobile-select-trigger .nav-bars span {
					background: #E7E9EA;
				}
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
			.ranking-notice {
				margin: 0;
				padding: 10px 14px;
				border: 1px solid var(--line);
				border-radius: 12px;
				background: #0F1419;
				color: var(--muted);
				font-size: 14px;
				line-height: 1.5;
				white-space: pre-line;
			}
			.top-disclaimer {
				margin: 0 0 10px;
			}
			.event-promo {
				margin: 10px 0 0;
				padding: 10px 0;
				border: 0;
				border-radius: 0;
				background: transparent;
				overflow: hidden;
			}
			.event-promo-campaign {
				margin: 0 0 8px;
				font-size: 25px;
				line-height: 1.2;
				font-weight: 700;
				color: #FFFFFF;
				letter-spacing: 0.02em;
			}
			.event-promo-title {
				margin: 8px 0 0;
				font-size: 18px;
				line-height: 1.2;
				font-weight: 700;
				letter-spacing: 0.02em;
				color: #FFFFFF;
				text-align: center;
			}
			.event-promo-item {
				display: grid;
				gap: 8px;
				align-content: start;
			}
			.event-promo-banner {
				position: relative;
				display: grid;
				place-items: center;
				width: 100%;
				border-radius: 10px;
				border: 0;
				overflow: hidden;
				background: transparent;
			}
			.event-promo-media-grid {
				display: grid;
				grid-template-columns: repeat(3, minmax(0, 1fr));
				gap: 10px;
			}
			.social-links {
				margin: 10px 0 0;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				gap: 12px;
			}
			.inline-map-card {
				display: grid;
				gap: 10px;
				padding: 12px;
				border: 1px solid var(--line);
				border-radius: 12px;
				background: var(--card);
				position: relative;
				z-index: 1;
			}
			#inlineMap {
				width: 100%;
				height: 360px;
				border-radius: 10px;
				overflow: hidden;
				border: 1px solid var(--line);
				position: relative;
				z-index: 1;
			}
			.header-filter {
				position: relative;
				z-index: 30;
			}
			#rankCountryFilterCustom.mobile-select-enhanced .mobile-select-menu {
				position: absolute;
				top: calc(100% + 6px);
				left: 0;
				right: 0;
				max-height: 220px;
				overflow-y: auto;
				z-index: 120;
			}
			.social-link {
				display: inline-flex;
				align-items: center;
				gap: 0;
				padding: 8px 0;
				color: #E7E9EA;
				font-weight: 700;
				text-decoration: none;
			}
			.social-link-icon-wrap {
				width: 56px;
				height: 56px;
				display: grid;
				place-items: center;
				border-radius: 8px;
				flex: 0 0 auto;
			}
			.discord-icon-wrap { background: #5865F2; }
			.telegram-icon-wrap { background: #229ED9; }
			.profile-icon-wrap { background: #2E7D32; }
			.blog-icon-wrap { background: #EF6C00; }
			.about-icon-wrap { background: #455A64; }
			.x-icon-wrap { background: #000000; }
			.email-icon-wrap { background: #0F1419; }
			.discord-promo-icon {
				width: 36px;
				height: 36px;
				fill: #FFFFFF;
				display: block;
			}
			.event-promo-banner-link {
				display: block;
				width: 100%;
			}
			.event-promo-banner-img {
				display: block;
				width: 100%;
				height: auto;
			}
			.event-promo-desc {
				margin: 10px 0 0;
				color: var(--muted);
				font-size: 20px;
				line-height: 1.5;
				white-space: pre-line;
			}
			.mobile-inline-carousel {
				display: grid;
				grid-template-columns: repeat(3, minmax(0, 1fr));
				gap: 10px;
				margin: 10px 0 0;
			}
			.mobile-inline-carousel-title {
				display: block;
				font-size: 25px;
				font-weight: 700;
				color: #FFFFFF;
				margin: 8px 0 4px;
				letter-spacing: 0.02em;
			}
			.mobile-inline-carousel-slide {
				display: grid;
				justify-items: center;
				align-content: center;
				gap: 8px;
				border: 0;
				border-radius: 0;
				overflow: visible;
				background: transparent;
				padding: 0;
				text-decoration: none;
			}
			.mobile-inline-carousel img {
				display: block;
				width: 100%;
				aspect-ratio: auto;
				height: auto;
				object-fit: contain;
				margin: 0 auto;
			}
			.mobile-inline-carousel-label {
				font-size: 18px;
				font-weight: 700;
				color: #FFFFFF;
				text-align: center;
				letter-spacing: 0.02em;
			}
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
			.card-link {
				display: grid;
				gap: 12px;
				color: inherit;
				text-decoration: none;
			}
			.leaderboard-item:hover {
				transform: translateY(-2px);
				box-shadow: 0 10px 24px rgba(15, 20, 25, 0.09);
			}
			.spotlight-label {
				font-size: 11px;
				font-weight: 700;
				color: #7FC4FF;
				letter-spacing: 0.02em;
				text-transform: uppercase;
				margin-bottom: 4px;
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
				.list {
					grid-template-columns: 1fr;
					gap: 0;
				}
				.leaderboard-item {
					padding: 10px 0;
					gap: 6px;
					min-height: auto;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					background: transparent;
					box-shadow: none;
				}
				.leaderboard-item:hover {
					transform: none;
					box-shadow: none;
				}
				.card-link { gap: 6px; }
				.card-top { display: none; }
				.rank { display: none; }
				.card-top .badges { display: none; }
				.location-badge { display: none; }
				.identity {
					grid-template-columns: 48px 1fr;
					gap: 10px;
					align-items: start;
				}
				.avatar {
					width: 48px;
					height: 48px;
				}
				.name-link { font-size: 16px; }
				.handle {
					margin-top: 1px;
					font-size: 12px;
				}
				.bio {
					font-size: 12px;
					-webkit-line-clamp: 2;
					line-height: 1.35;
				}
				.ranking-notice {
					font-size: 12px;
					padding: 8px 10px;
					border: 1px solid var(--line);
					border-radius: 8px;
					background: #0F1419;
				}
				.top-disclaimer { margin: 0 0 8px; }
				.event-promo {
					padding: 10px 0;
					border: 0;
					border-radius: 0;
					background: transparent;
				}
				.event-promo-campaign {
					margin: 0 0 8px;
					font-size: 13px;
				}
				.event-promo-title {
					font-size: 9px;
					margin: 8px 0 0;
					color: var(--text);
				}
				.event-promo-banner {
					border-radius: 10px;
				}
				.event-promo-media-grid {
					grid-template-columns: repeat(3, minmax(0, 1fr));
					gap: 8px;
				}
				.social-links {
					margin: 8px 0 0;
					gap: 10px;
				}
				.social-link {
					padding: 6px 0;
				}
				.social-link-icon-wrap {
					width: 39px;
					height: 39px;
				}
				.discord-promo-icon {
					width: 25px;
					height: 25px;
				}
				.event-promo-desc {
					font-size: 12px;
					margin: 8px 0 0;
					color: var(--muted);
				}
				.mobile-inline-carousel {
					margin-top: 8px;
					grid-template-columns: repeat(3, minmax(0, 1fr));
					gap: 8px;
				}
				.mobile-inline-carousel-label {
					font-size: 9px;
				}
				.mobile-inline-carousel-title {
					font-size: 14px;
				}
				.inline-map-card {
					padding: 8px 0;
					border: 0;
					border-radius: 0;
					background: transparent;
				}
				#inlineMap {
					height: 240px;
					border-radius: 0;
				}
				.spotlight-label {
					font-size: 10px;
					margin-bottom: 2px;
				}
			}
			@media (max-width: 460px) { .list { grid-template-columns: 1fr; } }
		</style>
		<!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "def0f01252734ae59676f95377aad23b"}'></script><!-- End Cloudflare Web Analytics -->
	</head>
	<body>
		<div class="age-gate-overlay" id="ageGate">
			<div class="age-gate-box">
				<h2 data-i18n="age_title">Age Confirmation</h2>
				<p data-i18n="age_desc">You must be 18+ to enter this site. Are you 18 years old or above?</p>
				<div class="age-gate-actions">
					<button class="age-btn yes" id="ageYes" data-i18n="age_yes">Yes, I am 18+</button>
					<button class="age-btn no" id="ageNo" data-i18n="age_no">No</button>
				</div>
			</div>
		</div>
		<div id="ageDeniedText" data-i18n="age_denied" hidden>Access denied. This website is for adults 18+ only.</div>
		<section class="panel">
			<div class="panel-sticky-top">
				<p class="ranking-notice top-disclaimer" data-i18n="ranking_location_notice">${escapeHtml(RANKING_NOTICE_ZH_CN)}</p>
				<header class="header">
					<div class="header-main">
						<div class="header-left">
							<div class="header-title-row">
								<h1 class="header-language-title" data-i18n="heading_language">Language</h1>
								${renderLanguageSwitcher("rankingLangSwitch")}
							</div>
						</div>
							<div class="header-right">
								<div class="header-filter">
									<label class="mobile-field-label" for="rankCountryFilter" data-i18n="country_region">country(region)<span class="label-globe" aria-hidden="true"></span></label>
									<select id="rankCountryFilter" aria-label="Country (Region)">
										<option value="" data-i18n="all_option">All</option>
									</select>
									<div id="rankCountryFilterCustom" class="mobile-select-enhanced"></div>
								</div>
						</div>
					</div>
				</header>
			</div>
			<div class="social-links" aria-label="Social Links">
				<a class="social-link" href="https://t.co/RmDE2FA61Y" target="_blank" rel="noopener noreferrer" aria-label="Open Discord Link">
					<span class="social-link-icon-wrap discord-icon-wrap" aria-hidden="true">
						<svg class="discord-promo-icon" viewBox="0 0 24 24" role="img" focusable="false">
							<path d="M20.3 4.37A17.6 17.6 0 0 0 15.9 3l-.22.45a16.4 16.4 0 0 1 4.12 1.35A13.6 13.6 0 0 0 12 2.4a13.6 13.6 0 0 0-7.8 2.4 16.4 16.4 0 0 1 4.12-1.35L8.1 3a17.6 17.6 0 0 0-4.4 1.37C1.2 8.1.5 11.74.84 15.34a17.8 17.8 0 0 0 5.36 2.67l1.16-1.58c-.62-.23-1.2-.52-1.74-.88.15.11.3.22.46.31 3.25 1.88 6.78 1.88 10.02 0 .16-.09.31-.2.46-.31-.54.36-1.12.65-1.74.88l1.16 1.58a17.8 17.8 0 0 0 5.36-2.67c.4-4.17-.68-7.78-3.05-10.97ZM9.6 13.83c-.92 0-1.67-.85-1.67-1.9 0-1.06.74-1.9 1.67-1.9.93 0 1.68.84 1.67 1.9 0 1.05-.75 1.9-1.67 1.9Zm4.8 0c-.92 0-1.67-.85-1.67-1.9 0-1.06.74-1.9 1.67-1.9.93 0 1.68.84 1.67 1.9 0 1.05-.75 1.9-1.67 1.9Z"></path>
						</svg>
					</span>
				</a>
				<a class="social-link" href="https://t.me/fistingguidebot" target="_blank" rel="noopener noreferrer" aria-label="Open Telegram Bot">
					<span class="social-link-icon-wrap telegram-icon-wrap" aria-hidden="true">
						<svg class="discord-promo-icon" viewBox="0 0 24 24" role="img" focusable="false">
							<path d="M21.05 3.17 2.95 10.02c-1.23.48-1.22 1.16-.22 1.47l4.64 1.45 1.79 5.57c.22.62.11.87.77.87.51 0 .74-.23 1.02-.5l2.23-2.17 4.64 3.42c.86.47 1.47.23 1.68-.8l3.08-14.53c.31-1.26-.48-1.83-1.53-1.35ZM8.1 12.6l10.77-6.8c.54-.33 1.04-.15.63.22l-8.95 8.08-.35 3.76-2.1-5.26Z" fill="#FFFFFF"></path>
						</svg>
					</span>
				</a>
				<a class="social-link" href="/admin" target="_self" aria-label="Open Profile Management">
					<span class="social-link-icon-wrap profile-icon-wrap" aria-hidden="true">
						<svg class="discord-promo-icon" viewBox="0 0 24 24" role="img" focusable="false">
							<path d="M12 12c2.76 0 5-2.46 5-5.5S14.76 1 12 1 7 3.46 7 6.5 9.24 12 12 12Zm0 2c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6Z"></path>
						</svg>
					</span>
				</a>
				<a class="social-link" href="https://blog.fistingguide.workers.dev/" target="_blank" rel="noopener noreferrer" aria-label="Open Blog">
					<span class="social-link-icon-wrap blog-icon-wrap" aria-hidden="true">
						<svg class="discord-promo-icon" viewBox="0 0 24 24" role="img" focusable="false">
							<path d="M3 6a3 3 0 0 1 3-3h5v16H6a3 3 0 0 0-3 3V6Zm18 0v16a3 3 0 0 0-3-3h-5V3h5a3 3 0 0 1 3 3Zm-9-3h1v16h-1V3Z"></path>
						</svg>
					</span>
				</a>
				<a class="social-link" href="https://x.com/FistingGuide" target="_blank" rel="noopener noreferrer" aria-label="Open FistingGuide on X">
					<span class="social-link-icon-wrap x-icon-wrap" aria-hidden="true">
						<svg class="discord-promo-icon" viewBox="0 0 24 24" role="img" focusable="false">
							<path d="M18.9 2h3.7l-8.09 9.25L24 22h-7.52l-5.9-6.85L4.6 22H.9l8.65-9.89L0 2h7.72l5.33 6.2L18.9 2Zm-1.3 17.8h2.05L6.6 4.1H4.4l13.2 15.7Z"></path>
						</svg>
					</span>
				</a>
				<a class="social-link" href="mailto:fistingguide@proton.me" aria-label="Send email to fistingguide@proton.me">
					<span class="social-link-icon-wrap email-icon-wrap" aria-hidden="true">
						<svg class="discord-promo-icon" viewBox="0 0 24 24" role="img" focusable="false">
							<rect x="2.5" y="5.5" width="19" height="13" rx="2.4" ry="2.4" fill="none" stroke="#FFFFFF" stroke-width="1.8"></rect>
							<path d="M4 7.5 12 13l8-5.5" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
					</span>
				</a>
				<a class="social-link" href="/about" target="_self" aria-label="Open About">
					<span class="social-link-icon-wrap about-icon-wrap" aria-hidden="true">
						<svg class="discord-promo-icon" viewBox="0 0 24 24" role="img" focusable="false">
							<path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 4a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 12 6Zm2 12h-4v-1.8h1.2v-4H10V10h3v6.2H14Z"></path>
						</svg>
					</span>
				</a>
			</div>
			<section class="inline-map-card" aria-label="Community Map">
				<div id="inlineMap"></div>
			</section>
			<div class="mobile-inline-carousel-title" data-i18n="friendly_links">社区合作</div>
			<div class="mobile-inline-carousel" id="mobileInlineCarousel" aria-label="Brand Links">
				<a class="mobile-inline-carousel-slide" href="https://x.com/kikuchi168" target="_self"><img src="/r2-fg/assets/mobile-carousel/1.png" alt="KIKUCHI" loading="eager" fetchpriority="high" decoding="async" /><span class="mobile-inline-carousel-label">KIKUCHI</span></a>
				<a class="mobile-inline-carousel-slide" href="https://pixiong.tmall.com" target="_self"><img src="/r2-fg/assets/mobile-carousel/2.png" alt="PLAYBEAR" loading="lazy" fetchpriority="low" decoding="async" /><span class="mobile-inline-carousel-label">PLAYBEAR</span></a>
				<a class="mobile-inline-carousel-slide" href="https://t.co/sSpFX1Z8kk" target="_self"><img src="/r2-fg/assets/mobile-carousel/3.png" alt="QUTOYS" loading="lazy" fetchpriority="low" decoding="async" /><span class="mobile-inline-carousel-label" data-i18n="partner_qutoys">QUTOYS(10%折扣)</span></a>
				<a class="mobile-inline-carousel-slide" href="https://www.amazon.com/dp/B0G6Y9HL5V" target="_self"><img src="/r2-fg/assets/mobile-carousel/4.png" alt="HungerFF" loading="lazy" fetchpriority="low" decoding="async" /><span class="mobile-inline-carousel-label">HungerFF</span></a>
				<a class="mobile-inline-carousel-slide" href="https://www.ilovefist.com/" target="_self"><img src="/r2-fg/assets/mobile-carousel/5.png" alt="ILOVEFIST" loading="lazy" fetchpriority="low" decoding="async" /><span class="mobile-inline-carousel-label">ILOVEFIST</span></a>
				<a class="mobile-inline-carousel-slide" href="https://agay.jp/magazine/category/fist/" target="_self"><img src="/r2-fg/assets/mobile-carousel/6.png" alt="AGAY.jp" loading="lazy" fetchpriority="low" decoding="async" /><span class="mobile-inline-carousel-label">AGAY.jp</span></a>
				<a class="mobile-inline-carousel-slide" href="https://www.tarisss.com/" target="_self"><img src="/r2-fg/assets/mobile-carousel/7.png" alt="TaRiss's" loading="lazy" fetchpriority="low" decoding="async" /><span class="mobile-inline-carousel-label">TaRiss's</span></a>
			</div>
			<section class="event-promo" aria-label="list star promotion">
				<h2 class="event-promo-campaign" data-i18n="campaign_title">Campaign</h2>
				<div class="event-promo-media-grid">
					<div class="event-promo-item">
						<div class="event-promo-banner">
							<a class="event-promo-banner-link" href="/list-star" target="_self" aria-label="Open List Star Campaign">
								<img class="event-promo-banner-img" src="/r2-fg/assets/mobile-carousel/liststar.png" alt="List Star Banner" loading="eager" fetchpriority="high" decoding="async" />
							</a>
						</div>
						<h3 class="event-promo-title" data-i18n="event_title">List Star</h3>
					</div>
					<div class="event-promo-item">
						<div class="event-promo-banner">
							<a class="event-promo-banner-link" href="/author-call" target="_self" aria-label="Open Author Call">
								<img class="event-promo-banner-img" src="/r2-fg/assets/mobile-carousel/author.png" alt="Author Call Banner" loading="lazy" fetchpriority="low" decoding="async" />
							</a>
						</div>
						<h3 class="event-promo-title" data-i18n="author_call_title">文章征稿</h3>
					</div>
				</div>
			</section>
			<ol class="list">
				<li class="leaderboard-item spotlight-item" id="pinnedSpotlight" hidden></li>
				${renderLeaderboardRows(rows)}
			</ol>
		</section>
		${renderI18nScript("page_title_ranking")}
		<script src="/assets/leaflet.js"></script>
		<script>
			(function () {
				const initialRows = ${serializedRows};
				const listEl = document.querySelector('.list');
				const countrySelect = document.getElementById('rankCountryFilter');
				const navSelect = document.getElementById('mobilePageNav');
				const countryCustom = document.getElementById('rankCountryFilterCustom');
				const navCustom = document.getElementById('mobilePageNavCustom');
				let inlineMap = null;
				let inlineMapLayer = null;
				let pinnedSpotlightEl = document.getElementById('pinnedSpotlight');
				let pinnedCountdownEl = null;
				let pinnedNextSwitchAt = null;
				let lastPinnedData = null;

				function esc(v) {
					return String(v || '')
						.replace(/&/g, '&amp;')
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;')
						.replace(/"/g, '&quot;')
						.replace(/'/g, '&#39;');
				}

				function t(key, fallback) {
					if (typeof window.__t === 'function') {
						return window.__t(key, fallback || '');
					}
					return fallback || '';
				}

				function formatCredit(value) {
					const numeric = Number(value || 0);
					if (!Number.isFinite(numeric)) return '0';
					return Number.isInteger(numeric) ? String(numeric) : numeric.toFixed(1).replace(/\\.0$/, '');
				}

				function ensureInlineMap() {
					if (inlineMap) return true;
					const mount = document.getElementById('inlineMap');
					if (!mount || typeof L === 'undefined') return false;
					inlineMap = L.map('inlineMap').setView([35.6812, 139.7671], 5);
					L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
						maxZoom: 18,
						attribution: '&copy; OpenStreetMap contributors'
					}).addTo(inlineMap);
					inlineMapLayer = L.layerGroup().addTo(inlineMap);
					return true;
				}

				function drawInlineMap(rows) {
					if (!ensureInlineMap() || !inlineMapLayer) return;
					inlineMapLayer.clearLayers();
					const bounds = [];
					const pointUsage = new Map();
					for (const row of rows || []) {
						const pLat = Number(row.lat);
						const pLng = Number(row.lng);
						if (!Number.isFinite(pLat) || !Number.isFinite(pLng)) continue;
						const district = (row.district || row.city) || 'Itabashi';
						const region = (row.region || row.province) || 'Tokyo';
						const country = row.country || 'Japan';
						const key = pLat.toFixed(5) + '|' + pLng.toFixed(5);
						const used = pointUsage.get(key) || 0;
						pointUsage.set(key, used + 1);
						let lat = pLat;
						let lng = pLng;
						if (used > 0) {
							const angle = (used * 55) * Math.PI / 180;
							const r = 0.008 + used * 0.0015;
							lat = pLat + Math.sin(angle) * r;
							lng = pLng + Math.cos(angle) * r;
						}
						bounds.push([lat, lng]);
						L.circleMarker([lat, lng], {
							radius: 5,
							color: '#ffffff',
							weight: 2,
							fillColor: '#1D9BF0',
							fillOpacity: 0.9
						})
							.bindPopup('<strong>' + esc(row.name || 'Unnamed') + '</strong><br/>' + esc(row.handle || '') + '<br/>' + esc(district + ' / ' + region + ' / ' + country))
							.addTo(inlineMapLayer);
					}
					if (bounds.length) {
						inlineMap.fitBounds(bounds, { padding: [20, 20] });
					} else {
						inlineMap.setView([35.7512, 139.7093], 10);
					}
				}

				function renderRows(rows) {
					if (!listEl) return;
					const pinnedPlaceholder = '<li class="leaderboard-item spotlight-item" id="pinnedSpotlight" hidden></li>';
					const rowsHtml = !rows.length
						? '<li class="empty">No data yet. Add records in the admin panel.</li>'
						: rows.map(function (row, index) {
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
						const credit = formatCredit(row.total_credit);
						const avatarEl = safeAvatar
							? '<img class="avatar" src="' + safeAvatar + '" alt="' + safeName + '" referrerpolicy="no-referrer" loading="lazy" />'
							: '<div class="avatar placeholder">N/A</div>';
						return '' +
							'<li class="leaderboard-item">' +
								'<a class="card-link" href="' + safeUrl + '" target="_self" aria-label="Open ' + safeName + ' on X">' +
									'<div class="card-top">' +
									'<div class="rank ' + rankClass + '">#' + rank + '</div>' +
										'<div class="badges">' +
											'<div class="badge">Orientation ' + safeOrientation + '</div>' +
											'<div class="badge">Credit ' + credit + '</div>' +
										'</div>' +
									'</div>' +
									'<div class="identity">' +
										avatarEl +
										'<div>' +
											'<div class="name-link">' + safeName + '</div>' +
											'<div class="handle">' + safeHandle + '</div>' +
										'</div>' +
									'</div>' +
									'<div class="badge location-badge">' + safeDistrict + ' / ' + safeRegion + ' / ' + safeCountry + '</div>' +
									'<div class="bio">' + safeBio + '</div>' +
								'</a>' +
							'</li>';
					}).join('');
					listEl.innerHTML = pinnedPlaceholder + rowsHtml;
					pinnedSpotlightEl = listEl.querySelector('#pinnedSpotlight');
					pinnedCountdownEl = null;
					drawInlineMap(rows);
					if (lastPinnedData) {
						renderPinnedCard(lastPinnedData);
					}
				}

				function renderPinnedCard(data) {
					if (!pinnedSpotlightEl) return;
					lastPinnedData = data || null;
					const row = data && data.result ? data.result : null;
					if (!row) {
						pinnedSpotlightEl.hidden = true;
						pinnedSpotlightEl.innerHTML = '';
						pinnedCountdownEl = null;
						pinnedNextSwitchAt = null;
						return;
					}
					const safeName = esc(row.name || 'Unnamed');
					const safeHandle = esc(row.handle || '');
					const safeUrl = esc(row.profile_url || '#');
					const safeBio = esc(row.bio || 'No bio');
					const safeAvatar = esc(row.avatar || '');
					const safeRegion = esc((row.region || row.province) || 'Tokyo');
					const safeCountry = esc(row.country || 'Japan');
					const safeDistrict = esc((row.district || row.city) || 'Itabashi');
					const safeOrientation = esc(row.sexual_orientation || 'Gay');
					const credit = formatCredit(row.total_credit);
					const avatarEl = safeAvatar
						? '<img class="avatar" src="' + safeAvatar + '" alt="' + safeName + '" referrerpolicy="no-referrer" loading="lazy" />'
						: '<div class="avatar placeholder">N/A</div>';
					pinnedSpotlightEl.innerHTML =
						'<a class="card-link" href="' + safeUrl + '" target="_self" aria-label="Open ' + safeName + ' on X">' +
							'<div class="card-top">' +
								'<div class="rank top-rank">' + esc(t('spotlight_title', 'Rotating Spotlight')) + '</div>' +
								'<div class="badges">' +
									'<div class="badge">Orientation ' + safeOrientation + '</div>' +
									'<div class="badge">Credit ' + credit + '</div>' +
								'</div>' +
							'</div>' +
							'<div class="identity">' +
								avatarEl +
								'<div>' +
									'<div class="spotlight-label">' + esc(t('spotlight_title', 'Rotating Spotlight')) + '</div>' +
									'<div class="name-link">' + safeName + '</div>' +
									'<div class="handle">' + safeHandle + '</div>' +
								'</div>' +
							'</div>' +
							'<div class="badge location-badge">' + safeDistrict + ' / ' + safeRegion + ' / ' + safeCountry + '</div>' +
							'<div class="bio"><span id="pinnedCountdownText"></span> · ' + safeBio + '</div>' +
						'</a>';
					pinnedCountdownEl = pinnedSpotlightEl.querySelector('#pinnedCountdownText');
					pinnedSpotlightEl.hidden = false;
					const parsed = Date.parse(String(data.nextSwitchAt || ''));
					pinnedNextSwitchAt = Number.isFinite(parsed) ? parsed : null;
					updatePinnedCountdown();
				}

				function updatePinnedCountdown() {
					if (!pinnedCountdownEl || !pinnedNextSwitchAt) return;
					const remainSec = Math.max(0, Math.floor((pinnedNextSwitchAt - Date.now()) / 1000));
					const min = String(Math.floor(remainSec / 60)).padStart(2, '0');
					const sec = String(remainSec % 60).padStart(2, '0');
					const timeText = min + ':' + sec;
					const template = t('spotlight_next_switch', 'Next switch in {time}');
					pinnedCountdownEl.textContent = String(template).replace('{time}', timeText);
				}

				async function loadPinnedProfile() {
					const res = await fetch('/api/profiles/pinned');
					if (!res.ok) return;
					const data = await res.json();
					renderPinnedCard(data);
				}

				function closeAllCustomSelects() {
					document.querySelectorAll('.mobile-select-enhanced.open').forEach(function (node) {
						node.classList.remove('open');
					});
				}

				function setupCustomMobileSelect(nativeSelect, mountEl) {
					if (!nativeSelect || !mountEl) return function () {};
					function refresh() {
						const options = Array.from(nativeSelect.options || []);
						const selectedValue = String(nativeSelect.value || '');
						const selectedOption = options.find(function (opt) {
							return String(opt.value) === selectedValue;
						}) || options[0];
						const isNavMenu = mountEl.id === 'mobilePageNavCustom';
						const triggerHtml = isNavMenu
							? '<button type="button" class="mobile-select-trigger" aria-label="Open navigation menu" aria-haspopup="listbox" aria-expanded="false"><span class="nav-bars" aria-hidden="true"><span></span><span></span><span></span></span></button>'
							: '<button type="button" class="mobile-select-trigger" aria-haspopup="listbox" aria-expanded="false">' + esc(selectedOption ? selectedOption.text : '') + '</button>';
						mountEl.innerHTML =
							triggerHtml +
							'<div class="mobile-select-menu" role="listbox">' +
								options.map(function (opt) {
									const value = String(opt.value || '');
									const selectedClass = value === selectedValue ? ' is-selected' : '';
									return '<button type="button" class="mobile-select-option' + selectedClass + '" data-value="' + esc(value) + '">' + esc(opt.text) + '</button>';
								}).join('') +
							'</div>';
						const trigger = mountEl.querySelector('.mobile-select-trigger');
						const menu = mountEl.querySelector('.mobile-select-menu');
						if (!trigger || !menu) return;
						trigger.addEventListener('click', function (event) {
							event.preventDefault();
							const isOpen = mountEl.classList.contains('open');
							closeAllCustomSelects();
							if (!isOpen) mountEl.classList.add('open');
						});
						menu.addEventListener('click', function (event) {
							const btn = event.target.closest('.mobile-select-option');
							if (!btn) return;
							const nextValue = btn.getAttribute('data-value') || '';
							if (String(nativeSelect.value || '') !== nextValue) {
								nativeSelect.value = nextValue;
								nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
							}
							closeAllCustomSelects();
							refresh();
						});
					}
					nativeSelect.addEventListener('change', refresh);
					refresh();
					return refresh;
				}

				let refreshCountryCustom = function () {};
				if (countrySelect && countryCustom) {
					refreshCountryCustom = setupCustomMobileSelect(countrySelect, countryCustom);
				}
				if (navSelect && navCustom) {
					setupCustomMobileSelect(navSelect, navCustom);
				}
				document.addEventListener('click', function (event) {
					if (!event.target.closest('.mobile-select-enhanced')) {
						closeAllCustomSelects();
					}
				});
				document.addEventListener('keydown', function (event) {
					if (event.key === 'Escape') closeAllCustomSelects();
				});
				document.documentElement.classList.add('mobile-select-ready');

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
					refreshCountryCustom();
				}

				async function filterByCountry() {
					if (!countrySelect) return;
					const country = countrySelect.value.trim();
					const query = country ? ('?country=' + encodeURIComponent(country)) : '';
					const [profileRes, pinnedRes] = await Promise.all([
						fetch('/api/profiles' + query),
						fetch('/api/profiles/pinned'),
					]);
					if (profileRes.ok) {
						const data = await profileRes.json();
						const rows = Array.isArray(data.results) ? data.results : [];
						renderRows(rows);
					}
					if (pinnedRes.ok) {
						const data = await pinnedRes.json();
						renderPinnedCard(data);
					}
				}

				if (countrySelect) {
					countrySelect.addEventListener('change', filterByCountry);
				}
				drawInlineMap(initialRows);
				loadCountries();
				loadPinnedProfile();
				setInterval(updatePinnedCountdown, 1000);
				setInterval(loadPinnedProfile, 30000);

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
					const deniedText = (document.getElementById('ageDeniedText')?.textContent || 'Access denied. This website is for adults 18+ only.');
					document.body.innerHTML = '<div style="padding:24px;font-family:Segoe UI,sans-serif;">' + deniedText + '</div>';
				});
			})();
		</script>
	</body>
</html>
`;
}

export function renderAdminPage(mode: "home" | "create" | "edit" | "delete" = "home"): string {
	const adminMode = mode === "create" || mode === "edit" || mode === "delete" ? mode : "home";
	const adminTitleKey =
		adminMode === "create"
			? "admin_mode_title_create"
			: adminMode === "edit"
				? "admin_mode_title_edit"
				: adminMode === "delete"
					? "admin_mode_title_delete"
					: "admin_mode_title_home";
	const adminTitle =
		adminMode === "create" ? "Add performer" : adminMode === "edit" ? "Edit performer" : adminMode === "delete" ? "Delete performer" : "Choose action";
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
			@media (min-width: 721px) {
				:root { --primary: #7e0202; }
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
			.head-title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				gap: 10px;
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
				flex: 0 0 auto;
				text-decoration: none;
				background: #71767B;
				color: #FFFFFF;
				padding: 12px 24px;
				border-radius: 18px;
				font-size: 16px;
				font-weight: 600;
				white-space: nowrap;
			}
			.nav-btn.primary { background: var(--primary); }
			.nav-btn.active { box-shadow: 0 6px 14px rgba(126, 2, 2, 0.28); }
			.lang-switch {
				font: inherit;
				border: 1px solid var(--line);
				background: #16181C;
				color: var(--text);
				padding: 0 12px;
				border-radius: 10px;
				height: 46px;
				width: 200px;
			}
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
			.mobile-select-enhanced { display: none; width: 100%; position: relative; }
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
			.field { display: grid; gap: 6px; min-width: 0; }
			.field input, .field textarea, .field select { width: 100%; min-width: 0; }
			.field label { font-size: 12px; color: var(--muted); font-weight: 600; }
			.form .full { grid-column: 1 / -1; }
			.avatar-inline {
				display: grid;
				grid-template-columns: 44px 1fr;
				align-items: center;
				gap: 10px;
			}
			.avatar-preview {
				width: 44px;
				height: 44px;
				border-radius: 50%;
				object-fit: cover;
				border: 1px solid var(--line);
				background: #0F1419;
			}
			.avatar-inline input { height: 44px; }
			.actions { display: flex; gap: 8px; }
			.actions #submitBtn,
			.actions #cancelEditBtn {
				width: auto;
				height: 40px;
				padding: 0 14px;
				border: 1px solid var(--line);
				border-radius: 10px;
				background-color: #000000;
				font-size: 14px;
				background-image: none;
			}
			.actions #submitBtn {
				color: #28C76F;
			}
			.actions #cancelEditBtn {
				color: #FFFFFF;
			}
			.admin-mode-switch {
				display: grid;
				grid-template-columns: repeat(3, minmax(0, 1fr));
				gap: 10px;
			}
			.mode-btn {
				height: 42px;
				border: 1px solid var(--line);
				border-radius: 10px;
				background: #0F1419;
				color: #E7E9EA;
				font-weight: 600;
			}
			.mode-btn[data-mode="create"] { color: #28C76F; }
			.mode-btn[data-mode="edit"] { color: #1D9BF0; }
			.mode-btn[data-mode="delete"] { color: #FF2D55; }
			.mode-btn.active {
				border-color: #1D9BF0;
				box-shadow: 0 0 0 2px rgba(29, 155, 240, 0.22);
			}
			.delete-panel {
				display: grid;
				gap: 12px;
			}
			#deleteOnlyBtn {
				width: fit-content;
				min-width: 160px;
				height: 40px;
				border: 1px solid var(--line);
				border-radius: 10px;
				background: #000000;
				color: #FF2D55;
			}
			.delete-target {
				color: #E7E9EA;
				font-size: 14px;
				line-height: 1.5;
			}
			.status { color: var(--muted); font-size: 13px; }
			.search-hint {
				color: var(--muted);
				font-size: 12px;
				margin-top: 8px;
			}
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
			#locationSearch:read-only {
				background: #111418;
				color: var(--muted);
				cursor: not-allowed;
			}
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
				h1 { font-size: 20px; }
				.wrap { width: 100%; max-width: 100%; gap: 0; }
				.card {
					padding: 12px 0;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					background: transparent;
					box-shadow: none;
				}
				.head-card {
					padding: 10px 0 12px;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					background: transparent;
					box-shadow: none;
					position: relative;
					z-index: 2000;
				}
				.head { align-items: center; position: relative; z-index: 2001; }
				.top-nav { display: none; }
				.mobile-nav-row { display: flex; width: auto; margin-left: auto; position: relative; z-index: 2002; }
				.mobile-nav-row,
				.mobile-nav-row .mobile-select-enhanced,
				.head-card,
				.head {
					overflow: visible;
				}
				html.mobile-select-ready .mobile-nav { display: none; }
				html.mobile-select-ready .mobile-select-enhanced { display: block; }
				.lang-switch {
					height: 34px;
					font-size: 13px;
					background-color: #000000;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					color: #8B98A5;
					appearance: none;
					-webkit-appearance: none;
					-moz-appearance: none;
					padding: 0 24px 0 0;
					background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238B98A5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
					background-repeat: no-repeat;
					background-position: right 2px center;
				}
				.mobile-nav-row .mobile-select-trigger {
					width: 34px;
					height: 34px;
					padding: 0;
					border: 0;
					background: transparent;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
				}
				.mobile-nav-row .mobile-select-trigger .nav-bars {
					display: inline-grid;
					gap: 4px;
				}
				.mobile-nav-row .mobile-select-trigger .nav-bars span {
					display: block;
					width: 16px;
					height: 1.5px;
					background: #8B98A5;
					border-radius: 99px;
				}
				.mobile-nav-row .mobile-select-menu {
					display: none;
					position: absolute;
					top: calc(100% + 6px);
					right: 0;
					min-width: 168px;
					background: #000000;
					border: 1px solid var(--line);
					border-radius: 10px;
					overflow: hidden;
					z-index: 3000;
				}
				.mobile-nav-row .mobile-select-enhanced.open .mobile-select-menu { display: block; }
				.mobile-nav-row .mobile-select-option {
					width: 100%;
					border: 0;
					border-bottom: 1px solid #20252B;
					background: #000000;
					color: #8B98A5;
					font: inherit;
					font-size: 13px;
					text-align: left;
					padding: 9px 12px;
					cursor: pointer;
				}
				.mobile-nav-row .mobile-select-option:last-child { border-bottom: 0; }
				.mobile-nav-row .mobile-select-option.is-selected { color: #E7E9EA; }
				.toolbar {
					grid-template-columns: minmax(0, 1fr) 40px 40px;
					gap: 8px;
					align-items: center;
				}
				.admin-mode-switch {
					grid-template-columns: 1fr;
				}
				.toolbar #handleSearch {
					height: 40px;
					padding: 0 12px;
				}
				.toolbar #searchBtn,
				.toolbar #resetBtn {
					height: 40px;
					width: 40px;
					padding: 0;
					border: 1px solid var(--line);
					border-radius: 10px;
					background-color: #000000;
					color: transparent;
					font-size: 0;
					background-repeat: no-repeat;
					background-position: center;
					background-size: 18px 18px;
				}
				.toolbar #searchBtn {
					background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231D9BF0' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'/%3E%3C/svg%3E\");
				}
				.toolbar #resetBtn {
					background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23E7E9EA' stroke-width='2.1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 12a9 9 0 1 0 3-6.7'/%3E%3Cpolyline points='3 3 3 9 9 9'/%3E%3C/svg%3E\");
				}
				.form { grid-template-columns: repeat(2, minmax(0, 1fr)); }
				.form .field:not(.identity-field),
				.form .full { grid-column: 1 / -1; }
				.form .identity-field { grid-column: auto; }
				.location-meta { grid-template-columns: 1fr; }
			}
		</style>
		<!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "def0f01252734ae59676f95377aad23b"}'></script><!-- End Cloudflare Web Analytics -->
	</head>
	<body>
		<div class="age-gate-overlay" id="ageGate">
			<div class="age-gate-box">
				<h2 data-i18n="age_title">Age Confirmation</h2>
				<p data-i18n="age_desc">You must be 18+ to enter this site. Are you 18 years old or above?</p>
				<div class="age-gate-actions">
					<button class="age-btn yes" id="ageYes" data-i18n="age_yes">Yes, I am 18+</button>
					<button class="age-btn no" id="ageNo" data-i18n="age_no">No</button>
				</div>
			</div>
		</div>
		<div id="ageDeniedText" data-i18n="age_denied" hidden>Access denied. This website is for adults 18+ only.</div>
		<div class="wrap">
			<section class="card head-card">
				<div class="head">
					<div class="head-title">
						<h1 id="adminModeTitle" data-i18n="${adminTitleKey}">${adminTitle}</h1>
						${renderLanguageSwitcher("adminLangSwitch")}
						<div class="mobile-nav-row">
							<select id="adminPageNav" class="mobile-nav" aria-label="Page Navigation" onchange="if(this.value){window.location.href=this.value;}">
								<option value="/" data-i18n="nav_ranking">Performers List</option>
								<option value="/admin" selected data-i18n="nav_add">Add new</option>
								<option value="/wiki" data-i18n="nav_wiki">Fisting Wiki</option>
								<option value="/about" data-i18n="nav_about">About</option>
							</select>
							<div id="adminPageNavCustom" class="mobile-select-enhanced"></div>
						</div>
					</div>
					<nav class="top-nav">
						<a class="nav-btn" href="/" data-i18n="nav_ranking">Performers List</a>
						<a class="nav-btn primary active" href="/admin" data-i18n="nav_add">Add new</a>
						<a class="nav-btn" href="/wiki" data-i18n="nav_wiki">Fisting Wiki</a>
						<a class="nav-btn" href="/about" data-i18n="nav_about">About</a>
					</nav>
				</div>
			</section>

			${adminMode === "home" ? `
			<section class="card">
				<div class="admin-mode-switch">
					<button type="button" class="mode-btn" id="modeCreateBtn" data-mode="create" data-i18n="admin_mode_btn_create">Add Performer</button>
					<button type="button" class="mode-btn" id="modeEditBtn" data-mode="edit" data-i18n="admin_mode_btn_edit">Edit Performer</button>
					<button type="button" class="mode-btn" id="modeDeleteBtn" data-mode="delete" data-i18n="admin_mode_btn_delete">Delete Performer</button>
				</div>
			</section>
			` : ""}

			<section class="card" id="searchSection">
				<div class="toolbar">
					<input id="handleSearch" list="handleSuggestions" placeholder="Search by X handle" data-i18n-placeholder="admin_search_placeholder" />
					<datalist id="handleSuggestions"></datalist>
					<button id="searchBtn" data-i18n="admin_search_btn">Search</button>
					<button id="resetBtn" class="secondary" data-i18n="admin_reset_btn">Reset</button>
				</div>
				<div class="search-hint" data-i18n="admin_search_hint">Only supports existing accounts for modifying their related information or deleting.</div>
			</section>

			<section class="card" id="formSection">
				<form id="profileForm" class="form">
					<input type="hidden" id="id" />
					<div class="field identity-field">
						<label for="name" data-i18n="admin_label_display_name">Display Name</label>
						<input id="name" placeholder="Display name" data-i18n-placeholder="admin_ph_display_name" />
					</div>
					<div class="field identity-field">
						<label for="handle" data-i18n="admin_label_x_handle">X Handle</label>
						<input id="handle" placeholder="Handle (e.g. @demo)" data-i18n-placeholder="admin_ph_x_handle" required />
					</div>
					<div class="field identity-field">
						<label for="orientation" data-i18n="admin_label_orientation">Orientation</label>
						<input id="orientation" value="Gay" placeholder="Orientation" data-i18n-placeholder="admin_ph_orientation" />
					</div>
					<div class="field identity-field">
						<label for="followers" data-i18n="admin_label_fans_count">Followers</label>
						<input id="followers" type="number" min="0" value="20" placeholder="Followers" data-i18n-placeholder="admin_ph_fans_count" />
					</div>
					<div class="field full">
						<label for="locationSearch" data-i18n="admin_label_location">District / Region / Country (Region)</label>
						<div class="location-search-wrap">
						<input id="locationSearch" list="locationSuggestions" placeholder="Search country (region) or city (map search)" data-i18n-placeholder="admin_ph_location_search" value="Itabashi, Tokyo, Japan" autocomplete="off" readonly />
							<div id="locationDropdown" class="location-dropdown"></div>
						</div>
						<datalist id="locationSuggestions"></datalist>
						<input id="country" type="hidden" value="Japan" />
						<input id="region" type="hidden" value="Tokyo" />
						<input id="district" type="hidden" value="Itabashi" />
						<div class="location-selected" id="locationSelected"><span data-i18n="admin_selected_prefix">Selected:</span> Itabashi / Tokyo / Japan</div>
					</div>
					<div class="field full">
						<label data-i18n="admin_label_map_preview">Please click your location until the default address changes</label>
						<div id="locationPreview" class="location-preview"></div>
					</div>
					<div class="field full">
						<label for="profileUrl" data-i18n="admin_label_profile_url">Profile URL</label>
						<input id="profileUrl" placeholder="Profile URL" data-i18n-placeholder="admin_ph_profile_url" />
					</div>
					<div class="field full">
						<label for="avatar" data-i18n="admin_label_avatar_url">Avatar URL</label>
						<div class="avatar-inline">
							<img id="avatarPreview" class="avatar-preview" src="" alt="Avatar preview" />
							<input id="avatar" placeholder="Avatar URL" data-i18n-placeholder="admin_ph_avatar_url" />
						</div>
					</div>
					<div class="field full">
						<label for="telegram">Telegram</label>
						<input id="telegram" placeholder="@username" />
					</div>
					<div class="field full">
						<label for="bio" data-i18n="admin_label_bio">Bio</label>
						<textarea id="bio" placeholder="Bio" data-i18n-placeholder="admin_ph_bio"></textarea>
					</div>
					<div class="full actions">
						<button type="submit" id="submitBtn" data-i18n="admin_btn_create">Create</button>
						<button type="button" id="cancelEditBtn" class="secondary" data-i18n="admin_btn_cancel_edit">Cancel Edit</button>
					</div>
				</form>
				<p class="status" id="status" data-i18n="admin_status_ready">Ready</p>
			</section>

			<section class="card" id="deleteSection" hidden>
				<div class="delete-panel">
					<div class="delete-target" id="deleteTargetText">Please search and select an existing performer first.</div>
					<button type="button" id="deleteOnlyBtn" class="danger" data-i18n="admin_btn_delete_current" disabled>Delete Current</button>
				</div>
			</section>
		</div>

		${renderI18nScript("page_title_admin")}
		<script src="/assets/leaflet.js"></script>
<script>
			const INITIAL_ADMIN_MODE = ${JSON.stringify(adminMode)};
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
				return String(template || '').replace(/\{(\w+)\}/g, function (_, name) {
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
				els.followers.value = '20';
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
				els.followers.value = String(row.followers_count || 0);
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
				const target = currentRows.find(function (row) {
					return String(row.handle || '').toLowerCase() === String(handle || '').toLowerCase();
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
				const keyword = els.handleSearch.value.trim();
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
				return {
					name: els.name.value,
					handle: els.handle.value,
					telegram: els.telegram.value,
					bio: els.bio.value,
					profileUrl: els.profileUrl.value,
					avatar: els.avatar.value,
					sexualOrientation: els.orientation.value,
					followersCount: Number(els.followers.value || '0'),
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

				setStatus(isUpdate ? t('admin_status_updated_success', 'Updated successfully') : t('admin_status_created_success', 'Created successfully'));
				showSuccessDialog(isUpdate ? t('admin_alert_updated_success', 'Profile updated successfully.') : t('admin_alert_created_success', 'Profile created successfully.'));
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
		</script>
<script>
			(function () {
				const select = document.getElementById('adminPageNav');
				const mount = document.getElementById('adminPageNavCustom');
				if (!select || !mount) return;
				function esc(v) {
					return String(v || '')
						.replace(/&/g, '&amp;')
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;')
						.replace(/"/g, '&quot;')
						.replace(/'/g, '&#39;');
				}
				function closeMenu() { mount.classList.remove('open'); }
				function render() {
					const options = Array.from(select.options || []);
					const selectedValue = String(select.value || '');
					mount.innerHTML =
						'<button type="button" class="mobile-select-trigger" aria-label="Open navigation menu"><span class="nav-bars" aria-hidden="true"><span></span><span></span><span></span></span></button>' +
						'<div class="mobile-select-menu" role="listbox">' +
							options.map(function (opt) {
								const value = String(opt.value || '');
								const selectedClass = value === selectedValue ? ' is-selected' : '';
								return '<button type="button" class="mobile-select-option' + selectedClass + '" data-value="' + esc(value) + '">' + esc(opt.text) + '</button>';
							}).join('') +
						'</div>';
					const trigger = mount.querySelector('.mobile-select-trigger');
					const menu = mount.querySelector('.mobile-select-menu');
					if (!trigger || !menu) return;
					trigger.addEventListener('click', function (event) {
						event.preventDefault();
						mount.classList.toggle('open');
					});
					menu.addEventListener('click', function (event) {
						const btn = event.target.closest('.mobile-select-option');
						if (!btn) return;
						const nextValue = btn.getAttribute('data-value') || '';
						if (nextValue) window.location.href = nextValue;
						closeMenu();
					});
				}
				select.addEventListener('change', render);
				render();
				document.documentElement.classList.add('mobile-select-ready');
				document.addEventListener('click', function (event) {
					if (!event.target.closest('#adminPageNavCustom')) closeMenu();
				});
				document.addEventListener('keydown', function (event) {
					if (event.key === 'Escape') closeMenu();
				});
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
					const deniedText = (document.getElementById('ageDeniedText')?.textContent || 'Access denied. This website is for adults 18+ only.');
					document.body.innerHTML = '<div style="padding:24px;font-family:Segoe UI,sans-serif;">' + deniedText + '</div>';
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
			@media (min-width: 721px) {
				:root { --primary: #7e0202; }
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
			.head-title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				gap: 10px;
			}
			.head-meta { display: grid; gap: 6px; }
			.lang-switch {
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
				flex: 0 0 auto;
				text-decoration: none;
				background: #71767B;
				color: #FFFFFF;
				padding: 12px 24px;
				border-radius: 18px;
				font-size: 16px;
				font-weight: 600;
				white-space: nowrap;
			}
			.nav-btn.primary { background: var(--primary); }
			.nav-btn.active { box-shadow: 0 6px 14px rgba(126, 2, 2, 0.28); }
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
			.mobile-select-enhanced { display: none; width: 100%; position: relative; }
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
			#countryFilter {
				font: inherit;
				border: 1px solid var(--line);
				background: #16181C;
				color: var(--text);
				padding: 0 12px;
				border-radius: 10px;
				height: 46px;
				width: 200px;
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
			#visitPerformerBtn {
				width: 100%;
				height: 44px;
				border-radius: 10px;
				border: 1px solid var(--line);
				background: #0F1419;
				color: #1D9BF0;
				font-weight: 700;
			}
			#visitPerformerBtn[disabled] {
				color: #71767B;
				cursor: not-allowed;
			}
			@media (max-width: 900px) {
				body { font-size: 14px; }
				h1 { font-size: 20px; }
				.wrap { width: 100%; max-width: 100%; gap: 0; }
				.card {
					padding: 12px 0;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					background: transparent;
					box-shadow: none;
				}
				.head-card {
					padding: 10px 0 12px;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					background: transparent;
					box-shadow: none;
				}
				.head { align-items: center; }
				.lang-switch {
					height: 34px;
					font-size: 13px;
					background-color: #000000;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					color: #8B98A5;
					appearance: none;
					-webkit-appearance: none;
					-moz-appearance: none;
					padding: 0 24px 0 0;
					background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238B98A5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
					background-repeat: no-repeat;
					background-position: right 2px center;
				}
				.top-nav { display: none; }
				.mobile-nav-row { display: flex; width: auto; margin-left: auto; }
				html.mobile-select-ready .mobile-nav { display: none; }
				html.mobile-select-ready .mobile-select-enhanced { display: block; }
				.mobile-nav-row .mobile-select-trigger {
					width: 34px;
					height: 34px;
					padding: 0;
					border: 0;
					background: transparent;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
				}
				.mobile-nav-row .mobile-select-trigger .nav-bars {
					display: inline-grid;
					gap: 4px;
				}
				.mobile-nav-row .mobile-select-trigger .nav-bars span {
					display: block;
					width: 16px;
					height: 1.5px;
					background: #8B98A5;
					border-radius: 99px;
				}
				.mobile-nav-row .mobile-select-menu {
					display: none;
					position: absolute;
					top: calc(100% + 6px);
					right: 0;
					min-width: 168px;
					background: #000000;
					border: 1px solid var(--line);
					border-radius: 10px;
					overflow: hidden;
					z-index: 40;
				}
				.mobile-nav-row .mobile-select-enhanced.open .mobile-select-menu { display: block; }
				.mobile-nav-row .mobile-select-option {
					width: 100%;
					border: 0;
					border-bottom: 1px solid #20252B;
					background: #000000;
					color: #8B98A5;
					font: inherit;
					font-size: 13px;
					text-align: left;
					padding: 9px 12px;
					cursor: pointer;
				}
				.mobile-nav-row .mobile-select-option:last-child { border-bottom: 0; }
				.mobile-nav-row .mobile-select-option.is-selected { color: #E7E9EA; }
				.toolbar {
					grid-template-columns: minmax(0, 1fr) 40px;
					gap: 8px;
					align-items: center;
				}
				#countryFilter {
					width: 100%;
					height: 34px;
					font-size: 13px;
					background-color: #000000;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					color: #8B98A5;
					appearance: none;
					-webkit-appearance: none;
					-moz-appearance: none;
					padding: 0 24px 0 0;
					background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238B98A5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
					background-repeat: no-repeat;
					background-position: right 2px center;
				}
				#countryFilter:focus {
					outline: none;
					border-bottom-color: #1D9BF0;
					box-shadow: none;
				}
				#countryFilter option {
					background-color: #000000;
					color: #8B98A5;
				}
				#reloadBtn {
					width: 40px;
					height: 40px;
					padding: 0;
					border: 0;
					border-radius: 10px;
					background-color: #000000;
					color: transparent;
					font-size: 0;
					background-repeat: no-repeat;
					background-position: center;
					background-size: 18px 18px;
					background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FFFFFF' stroke-width='2.1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='23 4 23 10 17 10'/%3E%3Cpolyline points='1 20 1 14 7 14'/%3E%3Cpath d='M3.51 9a9 9 0 0 1 14.13-3.36L23 10M1 14l5.36 4.36A9 9 0 0 0 20.49 15'/%3E%3C/svg%3E");
				}
				#status { display: none; }
				.map-section {
					padding: 0;
					border-bottom: 0;
					position: relative;
					z-index: 1;
				}
				#map {
					height: calc(100vh - 150px);
					min-height: 520px;
					border-radius: 0;
					position: relative;
					z-index: 1;
				}
				#map .leaflet-pane,
				#map .leaflet-top,
				#map .leaflet-bottom {
					z-index: 1 !important;
				}
				.table-section { display: none; }
				th, td { font-size: 12px; padding: 7px 6px; }
			}
		</style>
		<!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "def0f01252734ae59676f95377aad23b"}'></script><!-- End Cloudflare Web Analytics -->
	</head>
	<body>
		<div class="age-gate-overlay" id="ageGate">
			<div class="age-gate-box">
				<h2 data-i18n="age_title">Age Confirmation</h2>
				<p data-i18n="age_desc">You must be 18+ to enter this site. Are you 18 years old or above?</p>
				<div class="age-gate-actions">
					<button class="age-btn yes" id="ageYes" data-i18n="age_yes">Yes, I am 18+</button>
					<button class="age-btn no" id="ageNo" data-i18n="age_no">No</button>
				</div>
			</div>
		</div>
		<div id="ageDeniedText" data-i18n="age_denied" hidden>Access denied. This website is for adults 18+ only.</div>
		<div class="wrap">
			<section class="card head-card">
				<div class="head">
					<div class="head-title">
						<div class="head-meta">
							<h1 data-i18n="heading_star">Map</h1>
						</div>
						${renderLanguageSwitcher("dashboardLangSwitch")}
						<div class="mobile-nav-row">
							<select id="dashboardPageNav" class="mobile-nav" aria-label="Page Navigation" onchange="if(this.value){window.location.href=this.value;}">
								<option value="/" data-i18n="nav_ranking">Performers List</option>
								<option value="/admin" data-i18n="nav_add">Add new</option>
								<option value="/wiki" data-i18n="nav_wiki">Fisting Wiki</option>
								<option value="/about" data-i18n="nav_about">About</option>
							</select>
							<div id="dashboardPageNavCustom" class="mobile-select-enhanced"></div>
						</div>
					</div>
					<nav class="top-nav">
						<a class="nav-btn" href="/" data-i18n="nav_ranking">Performers List</a>
						<a class="nav-btn" href="/admin" data-i18n="nav_add">Add new</a>
						<a class="nav-btn" href="/wiki" data-i18n="nav_wiki">Fisting Wiki</a>
						<a class="nav-btn" href="/about" data-i18n="nav_about">About</a>
					</nav>
				</div>
			</section>

			<section class="card toolbar">
				<select id="countryFilter" data-uniform-dropdown="1"><option value="">All Countries (Regions)</option></select>
				<button id="reloadBtn">Reload Data</button>
				<div id="status"></div>
			</section>

			<section class="card">
				<button id="visitPerformerBtn" type="button" data-i18n="dashboard_visit_select" disabled>Select a performer on the map first</button>
			</section>

			<section class="card map-section"><div id="map"></div></section>

			<section class="card table-section">
				<table>
					<thead><tr><th>Rank</th><th>Name</th><th>Handle</th><th>District / Region / Country</th><th>Fans</th></tr></thead>
					<tbody id="rows"></tbody>
				</table>
			</section>
		</div>

		${renderI18nScript("page_title_dashboard")}
		<script src="/assets/leaflet.js"></script>
		<script>
			const statusEl = document.getElementById('status');
			const countryFilterEl = document.getElementById('countryFilter');
			const rowsEl = document.getElementById('rows');
			const visitPerformerBtn = document.getElementById('visitPerformerBtn');
			const reloadBtn = document.getElementById('reloadBtn');
			const map = L.map('map').setView([35.6812, 139.7671], 5);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 18,
				attribution: '&copy; OpenStreetMap contributors'
			}).addTo(map);
			const markerLayer = L.layerGroup().addTo(map);
			let selectedPerformer = null;
			let reloadInFlight = false;

			function setStatus(text) { statusEl.textContent = text; }
			function formatNum(value) { return Number(value || 0).toLocaleString(); }
			function t(key, fallback) {
				if (typeof window.__t === 'function') return window.__t(key, fallback || '');
				return fallback || '';
			}
			function fmt(template, vars) {
				return String(template || '').replace(/\{(\w+)\}/g, function (_, name) {
					return String(vars && vars[name] != null ? vars[name] : '');
				});
			}
			function setVisitButtonState(row) {
				if (!visitPerformerBtn) return;
				selectedPerformer = row || null;
				if (!selectedPerformer) {
					visitPerformerBtn.disabled = true;
					visitPerformerBtn.textContent = t('dashboard_visit_select', 'Select a performer on the map first');
					return;
				}
				const displayName = String(selectedPerformer.name || 'Unnamed').trim() || 'Unnamed';
				const template = String(t('dashboard_visit_named', 'Visit {handle}') || '');
				let text = template
					.replace('{name}', displayName)
					.replace('{handle}', displayName)
					.replace('(handle)', displayName);
				if (text === template) {
					text = 'Visit ' + displayName;
				}
				visitPerformerBtn.disabled = !String(selectedPerformer.profile_url || '').trim();
				visitPerformerBtn.textContent = text;
			}
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

			async function drawMap(rows) {
				markerLayer.clearLayers();
				setVisitButtonState(null);
				if (!rows.length) {
					setStatus('');
					return;
				}

				const bounds = [];
				const pointUsage = new Map();
				let missingCoordinates = 0;
				for (const row of rows) {
					const district = (row.district || row.city) || 'Itabashi';
					const region = (row.region || row.province) || 'Tokyo';
					const country = row.country || 'Japan';
					const pLat = Number(row.lat);
					const pLon = Number(row.lng);
					if (!Number.isFinite(pLat) || !Number.isFinite(pLon)) continue;
					const key = pLat.toFixed(5) + '|' + pLon.toFixed(5);
					const used = pointUsage.get(key) || 0;
					pointUsage.set(key, used + 1);
					let lat = pLat;
					let lon = pLon;
					if (used > 0) {
						const angle = (used * 55) * Math.PI / 180;
						const r = 0.008 + used * 0.0015;
						lat = pLat + Math.sin(angle) * r;
						lon = pLon + Math.cos(angle) * r;
					}
					bounds.push([lat, lon]);
					const marker = L.circleMarker([lat, lon], {
						radius: 6,
						color: '#ffffff',
						weight: 2,
						fillColor: '#1D9BF0',
						fillOpacity: 0.9
					})
						.bindPopup('<strong>' + (row.name || 'Unnamed') + '</strong><br/>' + (row.handle || '') + '<br/>' + district + ' / ' + region + ' / ' + country + '<br/>Fans: ' + formatNum(row.followers_count))
						.addTo(markerLayer);
					marker.on('click', function () {
						setVisitButtonState(row);
					});
				}
				missingCoordinates = rows.length - bounds.length;
				if (bounds.length) {
					map.fitBounds(bounds, { padding: [30, 30] });
					if (missingCoordinates > 0) {
						setStatus('Loaded markers: ' + bounds.length + '. Missing coordinates: ' + missingCoordinates);
					} else {
						setStatus('');
					}
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
					setStatus('No valid coordinates found, showing fallback marker');
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
			}

			async function runGeoBackfill() {
				if (reloadInFlight) return;
				reloadInFlight = true;
				if (reloadBtn) reloadBtn.disabled = true;
				try {
					setStatus('Refreshing map data...');
					await loadData();
				} catch (error) {
					setStatus('Refresh failed: ' + String(error && error.message ? error.message : error));
				} finally {
					reloadInFlight = false;
					if (reloadBtn) reloadBtn.disabled = false;
				}
			}

			document.getElementById('reloadBtn').addEventListener('click', runGeoBackfill);
			countryFilterEl.addEventListener('change', loadData);
			if (visitPerformerBtn) {
				visitPerformerBtn.addEventListener('click', function () {
					if (!selectedPerformer || !selectedPerformer.profile_url) return;
					window.location.href = String(selectedPerformer.profile_url);
				});
			}

			(async function init() {
				await loadCountries();
				await loadData();
			})();
		</script>
		<script>
			(function () {
				const select = document.getElementById('dashboardPageNav');
				const mount = document.getElementById('dashboardPageNavCustom');
				if (!select || !mount) return;
				function esc(v) {
					return String(v || '')
						.replace(/&/g, '&amp;')
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;')
						.replace(/"/g, '&quot;')
						.replace(/'/g, '&#39;');
				}
				function closeMenu() { mount.classList.remove('open'); }
				function render() {
					const options = Array.from(select.options || []);
					const selectedValue = String(select.value || '');
					mount.innerHTML =
						'<button type="button" class="mobile-select-trigger" aria-label="Open navigation menu"><span class="nav-bars" aria-hidden="true"><span></span><span></span><span></span></span></button>' +
						'<div class="mobile-select-menu" role="listbox">' +
							options.map(function (opt) {
								const value = String(opt.value || '');
								const selectedClass = value === selectedValue ? ' is-selected' : '';
								return '<button type="button" class="mobile-select-option' + selectedClass + '" data-value="' + esc(value) + '">' + esc(opt.text) + '</button>';
							}).join('') +
						'</div>';
					const trigger = mount.querySelector('.mobile-select-trigger');
					const menu = mount.querySelector('.mobile-select-menu');
					if (!trigger || !menu) return;
					trigger.addEventListener('click', function (event) {
						event.preventDefault();
						mount.classList.toggle('open');
					});
					menu.addEventListener('click', function (event) {
						const btn = event.target.closest('.mobile-select-option');
						if (!btn) return;
						const nextValue = btn.getAttribute('data-value') || '';
						if (nextValue) window.location.href = nextValue;
						closeMenu();
					});
				}
				select.addEventListener('change', render);
				render();
				document.documentElement.classList.add('mobile-select-ready');
				document.addEventListener('click', function (event) {
					if (!event.target.closest('#dashboardPageNavCustom')) closeMenu();
				});
				document.addEventListener('keydown', function (event) {
					if (event.key === 'Escape') closeMenu();
				});
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
					const deniedText = (document.getElementById('ageDeniedText')?.textContent || 'Access denied. This website is for adults 18+ only.');
					document.body.innerHTML = '<div style="padding:24px;font-family:Segoe UI,sans-serif;">' + deniedText + '</div>';
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
			@media (min-width: 721px) {
				:root { --primary: #7e0202; }
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
			.head-title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				gap: 10px;
			}
			.lang-switch {
				font: inherit;
				border: 1px solid var(--line);
				background: #16181C;
				color: var(--text);
				padding: 0 12px;
				border-radius: 10px;
				height: 46px;
				width: 200px;
			}
			.head h1 { margin: 0; }
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
				flex: 0 0 auto;
				text-decoration: none;
				background: #71767B;
				color: #FFFFFF;
				padding: 12px 24px;
				border-radius: 18px;
				font-size: 16px;
				font-weight: 600;
				white-space: nowrap;
			}
			.nav-btn.primary { background: var(--primary); }
			.nav-btn.active { box-shadow: 0 6px 14px rgba(126, 2, 2, 0.28); }
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
			.mobile-select-enhanced { display: none; width: 100%; position: relative; }
			.content {
				white-space: pre-wrap;
				line-height: 1.65;
				font-size: 15px;
			}
			.contact-actions {
				margin-top: 14px;
				display: flex;
				gap: 10px;
				flex-wrap: wrap;
			}
			.contact-btn {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				text-decoration: none;
				padding: 10px 14px;
				border-radius: 10px;
				border: 1px solid var(--line);
				background: #0F1419;
				color: #E7E9EA;
				font-size: 14px;
				font-weight: 600;
			}
			.contact-btn:hover { border-color: #1D9BF0; color: #1D9BF0; }
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
				.head h1 { font-size: 20px; }
				.wrap { width: 100%; max-width: 100%; gap: 0; }
				.card {
					padding: 12px 0;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					background: transparent;
					box-shadow: none;
				}
				.head-card {
					padding: 10px 0 12px;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					background: transparent;
					box-shadow: none;
				}
				.head { align-items: center; }
				.top-nav { display: none; }
				.mobile-nav-row { display: flex; width: auto; margin-left: auto; }
				.lang-switch {
					height: 34px;
					font-size: 13px;
					background-color: #000000;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					color: #8B98A5;
					appearance: none;
					-webkit-appearance: none;
					-moz-appearance: none;
					padding: 0 24px 0 0;
					background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238B98A5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
					background-repeat: no-repeat;
					background-position: right 2px center;
				}
				html.mobile-select-ready .mobile-nav { display: none; }
				html.mobile-select-ready .mobile-select-enhanced { display: block; }
				.mobile-nav-row .mobile-select-trigger {
					width: 34px;
					height: 34px;
					padding: 0;
					border: 0;
					background: transparent;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
				}
				.mobile-nav-row .mobile-select-trigger .nav-bars {
					display: inline-grid;
					gap: 4px;
				}
				.mobile-nav-row .mobile-select-trigger .nav-bars span {
					display: block;
					width: 16px;
					height: 1.5px;
					background: #8B98A5;
					border-radius: 99px;
				}
				.mobile-nav-row .mobile-select-menu {
					display: none;
					position: absolute;
					top: calc(100% + 6px);
					right: 0;
					min-width: 168px;
					background: #000000;
					border: 1px solid var(--line);
					border-radius: 10px;
					overflow: hidden;
					z-index: 40;
				}
				.mobile-nav-row .mobile-select-enhanced.open .mobile-select-menu { display: block; }
				.mobile-nav-row .mobile-select-option {
					width: 100%;
					border: 0;
					border-bottom: 1px solid #20252B;
					background: #000000;
					color: #8B98A5;
					font: inherit;
					font-size: 13px;
					text-align: left;
					padding: 9px 12px;
					cursor: pointer;
				}
				.mobile-nav-row .mobile-select-option:last-child { border-bottom: 0; }
				.mobile-nav-row .mobile-select-option.is-selected { color: #E7E9EA; }
				.contact-actions { margin-top: 10px; }
				.contact-btn {
					padding: 9px 12px;
					font-size: 13px;
				}
			}
		</style>
		<!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "def0f01252734ae59676f95377aad23b"}'></script><!-- End Cloudflare Web Analytics -->
	</head>
	<body>
		<div class="age-gate-overlay" id="ageGate">
			<div class="age-gate-box">
				<h2 data-i18n="age_title">Age Confirmation</h2>
				<p data-i18n="age_desc">You must be 18+ to enter this site. Are you 18 years old or above?</p>
				<div class="age-gate-actions">
					<button class="age-btn yes" id="ageYes" data-i18n="age_yes">Yes, I am 18+</button>
					<button class="age-btn no" id="ageNo" data-i18n="age_no">No</button>
				</div>
			</div>
		</div>
		<div id="ageDeniedText" data-i18n="age_denied" hidden>Access denied. This website is for adults 18+ only.</div>

		<div class="wrap">
			<section class="card head head-card">
				<div class="head-title">
					<h1 data-i18n="heading_about">About</h1>
					${renderLanguageSwitcher("aboutLangSwitch")}
					<div class="mobile-nav-row">
						<select id="aboutPageNav" class="mobile-nav" aria-label="Page Navigation" onchange="if(this.value){window.location.href=this.value;}">
							<option value="/" data-i18n="nav_ranking">Performers List</option>
							<option value="/admin" data-i18n="nav_add">Add new</option>
							<option value="/wiki" data-i18n="nav_wiki">Fisting Wiki</option>
							<option value="/about" selected data-i18n="nav_about">About</option>
						</select>
						<div id="aboutPageNavCustom" class="mobile-select-enhanced"></div>
					</div>
				</div>
				<nav class="top-nav">
					<a class="nav-btn" href="/" data-i18n="nav_ranking">Performers List</a>
					<a class="nav-btn" href="/admin" data-i18n="nav_add">Add new</a>
					<a class="nav-btn" href="/wiki" data-i18n="nav_wiki">Fisting Wiki</a>
					<a class="nav-btn primary active" href="/about" data-i18n="nav_about">About</a>
				</nav>
			</section>

			<section class="card">
				<div class="content" data-i18n="about_description">Hello, I am a fisting enthusiast and I recently built a simple navigation website to help people quickly discover creators and accounts in the community. The goal of this site is to make it easier for people to find creators, explore new content, and connect with others who share the same interests. If you have any suggestions, feedback, or would like to collaborate on improving the project, feel free to reach out. You can contact me on X: @fistingguide or by email: fistingguide@proton.me. If you prefer not to appear on the website, just let me know and I will remove your listing. Thank you, and I hope this project can help the community grow.</div>
				<div class="contact-actions">
					<a class="contact-btn" href="mailto:fistingguide@proton.me">Email</a>
					<a class="contact-btn" href="https://x.com/FistingGuide" target="_blank" rel="noopener noreferrer">X</a>
				</div>
			</section>
		</div>

		${renderI18nScript("page_title_about")}
		<script>
			(function () {
				const select = document.getElementById('aboutPageNav');
				const mount = document.getElementById('aboutPageNavCustom');
				if (!select || !mount) return;
				function esc(v) {
					return String(v || '')
						.replace(/&/g, '&amp;')
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;')
						.replace(/"/g, '&quot;')
						.replace(/'/g, '&#39;');
				}
				function closeMenu() { mount.classList.remove('open'); }
				function render() {
					const options = Array.from(select.options || []);
					const selectedValue = String(select.value || '');
					mount.innerHTML =
						'<button type="button" class="mobile-select-trigger" aria-label="Open navigation menu"><span class="nav-bars" aria-hidden="true"><span></span><span></span><span></span></span></button>' +
						'<div class="mobile-select-menu" role="listbox">' +
							options.map(function (opt) {
								const value = String(opt.value || '');
								const selectedClass = value === selectedValue ? ' is-selected' : '';
								return '<button type="button" class="mobile-select-option' + selectedClass + '" data-value="' + esc(value) + '">' + esc(opt.text) + '</button>';
							}).join('') +
						'</div>';
					const trigger = mount.querySelector('.mobile-select-trigger');
					const menu = mount.querySelector('.mobile-select-menu');
					if (!trigger || !menu) return;
					trigger.addEventListener('click', function (event) {
						event.preventDefault();
						mount.classList.toggle('open');
					});
					menu.addEventListener('click', function (event) {
						const btn = event.target.closest('.mobile-select-option');
						if (!btn) return;
						const nextValue = btn.getAttribute('data-value') || '';
						if (nextValue) window.location.href = nextValue;
						closeMenu();
					});
				}
				select.addEventListener('change', render);
				render();
				document.documentElement.classList.add('mobile-select-ready');
				document.addEventListener('click', function (event) {
					if (!event.target.closest('#aboutPageNavCustom')) closeMenu();
				});
				document.addEventListener('keydown', function (event) {
					if (event.key === 'Escape') closeMenu();
				});
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
					const deniedText = (document.getElementById('ageDeniedText')?.textContent || 'Access denied. This website is for adults 18+ only.');
					document.body.innerHTML = '<div style="padding:24px;font-family:Segoe UI,sans-serif;">' + deniedText + '</div>';
				});
			})();
		</script>
	</body>
</html>
`;
}

export function renderListStarPage(): string {
	return `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>List Star</title>
		<style>
			:root {
				--bg: #000000;
				--card: #16181C;
				--line: #2F3336;
				--text: #E7E9EA;
				--muted: #71767B;
				--primary: #1D9BF0;
			}
			@media (min-width: 721px) {
				:root { --primary: #7e0202; }
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
			.head-title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				gap: 10px;
			}
			.lang-switch {
				font: inherit;
				border: 1px solid var(--line);
				background: #16181C;
				color: var(--text);
				padding: 0 12px;
				border-radius: 10px;
				height: 46px;
				width: 200px;
			}
			.head h1 { margin: 0; }
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
				flex: 0 0 auto;
				text-decoration: none;
				background: #71767B;
				color: #FFFFFF;
				padding: 12px 24px;
				border-radius: 18px;
				font-size: 16px;
				font-weight: 600;
				white-space: nowrap;
			}
			.nav-btn.primary { background: var(--primary); }
			.nav-btn.active { box-shadow: 0 6px 14px rgba(126, 2, 2, 0.28); }
			.mobile-nav-row { display: none; width: 100%; }
			.mobile-nav {
				font: inherit;
				border: 1px solid var(--line);
				background: #16181C;
				color: var(--text);
				padding: 0 12px;
				border-radius: 10px;
				height: 46px;
				width: 100%;
			}
			.mobile-select-enhanced { display: none; width: 100%; position: relative; }
			.campaign-label {
				margin: 0 0 12px;
				font-size: 25px;
				font-weight: 700;
				color: #FFFFFF;
			}
			.poster-box {
				border-radius: 10px;
				overflow: hidden;
				margin-bottom: 0;
			}
			.poster-box img {
				display: block;
				width: 100%;
				height: auto;
				object-fit: contain;
			}
			.feature-layout {
				display: grid;
				grid-template-columns: repeat(2, minmax(0, 1fr));
				gap: 16px;
				align-items: start;
			}
			.feature-content {
				display: grid;
				gap: 10px;
				align-content: start;
			}
			.event-title {
				margin: 0 0 10px;
				font-size: 25px;
				font-weight: 700;
				color: #FFFFFF;
			}
			.event-desc {
				margin: 0;
				color: var(--muted);
				font-size: 20px;
				line-height: 1.5;
				white-space: pre-line;
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
				.head h1 { font-size: 20px; }
				.wrap { width: 100%; max-width: 100%; gap: 0; }
				.card {
					padding: 12px 0;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					background: transparent;
					box-shadow: none;
				}
				.head-card {
					padding: 10px 0 12px;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					background: transparent;
					box-shadow: none;
				}
				.top-nav { display: none; }
				.mobile-nav-row { display: flex; width: auto; margin-left: auto; }
				.lang-switch {
					height: 34px;
					font-size: 13px;
					background-color: #000000;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					color: #8B98A5;
					appearance: none;
					-webkit-appearance: none;
					-moz-appearance: none;
					padding: 0 24px 0 0;
					background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238B98A5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
					background-repeat: no-repeat;
					background-position: right 2px center;
				}
				html.mobile-select-ready .mobile-nav { display: none; }
				html.mobile-select-ready .mobile-select-enhanced { display: block; }
				.mobile-nav-row .mobile-select-trigger {
					width: 34px;
					height: 34px;
					padding: 0;
					border: 0;
					background: transparent;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
				}
				.mobile-nav-row .mobile-select-trigger .nav-bars { display: inline-grid; gap: 4px; }
				.mobile-nav-row .mobile-select-trigger .nav-bars span {
					display: block;
					width: 16px;
					height: 1.5px;
					background: #8B98A5;
					border-radius: 99px;
				}
				.mobile-nav-row .mobile-select-menu {
					display: none;
					position: absolute;
					top: calc(100% + 6px);
					right: 0;
					min-width: 168px;
					background: #000000;
					border: 1px solid var(--line);
					border-radius: 10px;
					overflow: hidden;
					z-index: 40;
				}
				.mobile-nav-row .mobile-select-enhanced.open .mobile-select-menu { display: block; }
				.mobile-nav-row .mobile-select-option {
					width: 100%;
					border: 0;
					border-bottom: 1px solid #20252B;
					background: #000000;
					color: #8B98A5;
					font: inherit;
					font-size: 13px;
					text-align: left;
					padding: 9px 12px;
					cursor: pointer;
				}
				.mobile-nav-row .mobile-select-option:last-child { border-bottom: 0; }
				.mobile-nav-row .mobile-select-option.is-selected { color: #E7E9EA; }
				.feature-layout { grid-template-columns: 1fr; gap: 10px; }
				.campaign-label,
				.event-title { font-size: 14px; }
				.event-desc { font-size: 12px; }
			}
		</style>
		<!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "def0f01252734ae59676f95377aad23b"}'></script><!-- End Cloudflare Web Analytics -->
	</head>
	<body>
		<div class="age-gate-overlay" id="ageGate">
			<div class="age-gate-box">
				<h2 data-i18n="age_title">Age Confirmation</h2>
				<p data-i18n="age_desc">You must be 18+ to enter this site. Are you 18 years old or above?</p>
				<div class="age-gate-actions">
					<button class="age-btn yes" id="ageYes" data-i18n="age_yes">Yes, I am 18+</button>
					<button class="age-btn no" id="ageNo" data-i18n="age_no">No</button>
				</div>
			</div>
		</div>
		<div id="ageDeniedText" data-i18n="age_denied" hidden>Access denied. This website is for adults 18+ only.</div>

		<div class="wrap">
			<section class="card head head-card">
				<div class="head-title">
					<h1 data-i18n="event_title">List Star</h1>
					${renderLanguageSwitcher("listStarLangSwitch")}
					<div class="mobile-nav-row">
						<select id="listStarPageNav" class="mobile-nav" aria-label="Page Navigation" onchange="if(this.value){window.location.href=this.value;}">
							<option value="/" selected data-i18n="nav_ranking">Performers List</option>
							<option value="/admin" data-i18n="nav_add">Add new</option>
							<option value="/wiki" data-i18n="nav_wiki">Fisting Wiki</option>
							<option value="/about" data-i18n="nav_about">About</option>
						</select>
						<div id="listStarPageNavCustom" class="mobile-select-enhanced"></div>
					</div>
				</div>
				<nav class="top-nav">
					<a class="nav-btn primary active" href="/" data-i18n="nav_ranking">Performers List</a>
					<a class="nav-btn" href="/admin" data-i18n="nav_add">Add new</a>
					<a class="nav-btn" href="/wiki" data-i18n="nav_wiki">Fisting Wiki</a>
					<a class="nav-btn" href="/about" data-i18n="nav_about">About</a>
				</nav>
			</section>

			<section class="card">
				<h2 class="campaign-label" data-i18n="campaign_title">Campaign</h2>
				<div class="feature-layout">
					<div class="poster-box">
						<img src="/r2-fg/assets/mobile-carousel/liststar.png" alt="List Star Banner" loading="eager" fetchpriority="high" decoding="async" />
					</div>
					<div class="feature-content">
						<h3 class="event-title" data-i18n="event_title">List Star</h3>
						<p class="event-desc" data-i18n="event_description">List Star Project is live! For one month, we will promote outstanding Fisting enthusiasts for free on the website and X! As a List Star, you will receive
1. Official List top placement
2. One exclusive poster
3. Promotion on the official X account

How to join?
A photo of the upper body with the face obscured, a fisting video, and a caption/copy about the video.</p>
					</div>
				</div>
			</section>
		</div>

		${renderI18nScript("event_title")}
		<script>
			(function () {
				const select = document.getElementById('listStarPageNav');
				const mount = document.getElementById('listStarPageNavCustom');
				if (!select || !mount) return;
				function esc(v) {
					return String(v || '')
						.replace(/&/g, '&amp;')
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;')
						.replace(/"/g, '&quot;')
						.replace(/'/g, '&#39;');
				}
				function closeMenu() { mount.classList.remove('open'); }
				function render() {
					const options = Array.from(select.options || []);
					const selectedValue = String(select.value || '');
					mount.innerHTML =
						'<button type="button" class="mobile-select-trigger" aria-label="Open navigation menu"><span class="nav-bars" aria-hidden="true"><span></span><span></span><span></span></span></button>' +
						'<div class="mobile-select-menu" role="listbox">' +
							options.map(function (opt) {
								const value = String(opt.value || '');
								const selectedClass = value === selectedValue ? ' is-selected' : '';
								return '<button type="button" class="mobile-select-option' + selectedClass + '" data-value="' + esc(value) + '">' + esc(opt.text) + '</button>';
							}).join('') +
						'</div>';
					const trigger = mount.querySelector('.mobile-select-trigger');
					const menu = mount.querySelector('.mobile-select-menu');
					if (!trigger || !menu) return;
					trigger.addEventListener('click', function (event) {
						event.preventDefault();
						mount.classList.toggle('open');
					});
					menu.addEventListener('click', function (event) {
						const btn = event.target.closest('.mobile-select-option');
						if (!btn) return;
						const nextValue = btn.getAttribute('data-value') || '';
						if (nextValue) window.location.href = nextValue;
						closeMenu();
					});
				}
				select.addEventListener('change', render);
				render();
				document.documentElement.classList.add('mobile-select-ready');
				document.addEventListener('click', function (event) {
					if (!event.target.closest('#listStarPageNavCustom')) closeMenu();
				});
				document.addEventListener('keydown', function (event) {
					if (event.key === 'Escape') closeMenu();
				});
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
				if (!verified) overlay.style.display = 'flex';
				yesBtn.addEventListener('click', function () {
					localStorage.setItem(key, 'yes');
					overlay.style.display = 'none';
				});
				noBtn.addEventListener('click', function () {
					const deniedText = (document.getElementById('ageDeniedText')?.textContent || 'Access denied. This website is for adults 18+ only.');
					document.body.innerHTML = '<div style="padding:24px;font-family:Segoe UI,sans-serif;">' + deniedText + '</div>';
				});
			})();
		</script>
	</body>
</html>
`;
}

export function renderAuthorCallPage(): string {
	return `
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Call For Authors</title>
		<style>
			:root {
				--bg: #000000;
				--card: #16181C;
				--line: #2F3336;
				--text: #E7E9EA;
				--muted: #71767B;
				--primary: #1D9BF0;
			}
			@media (min-width: 721px) {
				:root { --primary: #7e0202; }
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
			.head-title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				gap: 10px;
			}
			.lang-switch {
				font: inherit;
				border: 1px solid var(--line);
				background: #16181C;
				color: var(--text);
				padding: 0 12px;
				border-radius: 10px;
				height: 46px;
				width: 200px;
			}
			.head h1 { margin: 0; }
			.top-nav {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				text-decoration: none;
				flex-wrap: nowrap;
				gap: 12px;
				justify-content: flex-end;
			}
			.nav-btn {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				flex: 0 0 auto;
				text-decoration: none;
				background: #71767B;
				color: #FFFFFF;
				padding: 12px 24px;
				border-radius: 18px;
				font-size: 16px;
				font-weight: 600;
				white-space: nowrap;
			}
			.nav-btn.primary { background: var(--primary); }
			.nav-btn.active { box-shadow: 0 6px 14px rgba(126, 2, 2, 0.28); }
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
			.mobile-select-enhanced { display: none; width: 100%; position: relative; }
			.campaign-label {
				margin: 0 0 12px;
				font-size: 25px;
				font-weight: 700;
				color: #FFFFFF;
			}
			.poster-box {
				border-radius: 10px;
				overflow: hidden;
				margin-bottom: 0;
			}
			.poster-box img {
				display: block;
				width: 100%;
				height: auto;
				object-fit: contain;
			}
			.feature-layout {
				display: grid;
				grid-template-columns: repeat(2, minmax(0, 1fr));
				gap: 16px;
				align-items: start;
			}
			.feature-content {
				display: grid;
				gap: 10px;
				align-content: start;
			}
			.event-title {
				margin: 0 0 10px;
				font-size: 25px;
				font-weight: 700;
				color: #FFFFFF;
			}
			.intro {
				margin: 0;
				white-space: pre-line;
				line-height: 1.5;
				font-size: 20px;
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
				.head h1 { font-size: 20px; }
				.wrap { width: 100%; max-width: 100%; gap: 0; }
				.card {
					padding: 12px 0;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					background: transparent;
					box-shadow: none;
				}
				.head-card {
					padding: 10px 0 12px;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					background: transparent;
					box-shadow: none;
				}
				.top-nav { display: none; }
				.mobile-nav-row { display: flex; width: auto; margin-left: auto; }
				.lang-switch {
					height: 34px;
					font-size: 13px;
					background-color: #000000;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					color: #8B98A5;
					appearance: none;
					-webkit-appearance: none;
					-moz-appearance: none;
					padding: 0 24px 0 0;
					background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238B98A5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
					background-repeat: no-repeat;
					background-position: right 2px center;
				}
				html.mobile-select-ready .mobile-nav { display: none; }
				html.mobile-select-ready .mobile-select-enhanced { display: block; }
				.mobile-nav-row .mobile-select-trigger {
					width: 34px;
					height: 34px;
					padding: 0;
					border: 0;
					background: transparent;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
				}
				.mobile-nav-row .mobile-select-trigger .nav-bars { display: inline-grid; gap: 4px; }
				.mobile-nav-row .mobile-select-trigger .nav-bars span {
					display: block;
					width: 16px;
					height: 1.5px;
					background: #8B98A5;
					border-radius: 99px;
				}
				.mobile-nav-row .mobile-select-menu {
					display: none;
					position: absolute;
					top: calc(100% + 6px);
					right: 0;
					min-width: 168px;
					background: #000000;
					border: 1px solid var(--line);
					border-radius: 10px;
					overflow: hidden;
					z-index: 40;
				}
				.mobile-nav-row .mobile-select-enhanced.open .mobile-select-menu { display: block; }
				.mobile-nav-row .mobile-select-option {
					width: 100%;
					border: 0;
					border-bottom: 1px solid #20252B;
					background: #000000;
					color: #8B98A5;
					font: inherit;
					font-size: 13px;
					text-align: left;
					padding: 9px 12px;
					cursor: pointer;
				}
				.mobile-nav-row .mobile-select-option:last-child { border-bottom: 0; }
				.mobile-nav-row .mobile-select-option.is-selected { color: #E7E9EA; }
				.feature-layout { grid-template-columns: 1fr; gap: 10px; }
				.campaign-label,
				.event-title { font-size: 14px; }
				.intro { font-size: 12px; }
			}
		</style>
		<!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "def0f01252734ae59676f95377aad23b"}'></script><!-- End Cloudflare Web Analytics -->
	</head>
	<body>
		<div class="age-gate-overlay" id="ageGate">
			<div class="age-gate-box">
				<h2 data-i18n="age_title">Age Confirmation</h2>
				<p data-i18n="age_desc">You must be 18+ to enter this site. Are you 18 years old or above?</p>
				<div class="age-gate-actions">
					<button class="age-btn yes" id="ageYes" data-i18n="age_yes">Yes, I am 18+</button>
					<button class="age-btn no" id="ageNo" data-i18n="age_no">No</button>
				</div>
			</div>
		</div>
		<div id="ageDeniedText" data-i18n="age_denied" hidden>Access denied. This website is for adults 18+ only.</div>

		<div class="wrap">
			<section class="card head head-card">
				<div class="head-title">
					<h1 data-i18n="author_call_page_title">文章征稿</h1>
					${renderLanguageSwitcher("authorCallLangSwitch")}
					<div class="mobile-nav-row">
						<select id="authorCallPageNav" class="mobile-nav" aria-label="Page Navigation" onchange="if(this.value){window.location.href=this.value;}">
							<option value="/" selected data-i18n="nav_ranking">Performers List</option>
							<option value="/admin" data-i18n="nav_add">Add new</option>
							<option value="/wiki" data-i18n="nav_wiki">Fisting Wiki</option>
							<option value="/about" data-i18n="nav_about">About</option>
						</select>
						<div id="authorCallPageNavCustom" class="mobile-select-enhanced"></div>
					</div>
				</div>
				<nav class="top-nav">
					<a class="nav-btn primary active" href="/" data-i18n="nav_ranking">Performers List</a>
					<a class="nav-btn" href="/admin" data-i18n="nav_add">Add new</a>
					<a class="nav-btn" href="/wiki" data-i18n="nav_wiki">Fisting Wiki</a>
					<a class="nav-btn" href="/about" data-i18n="nav_about">About</a>
				</nav>
			</section>

			<section class="card">
				<h2 class="campaign-label" data-i18n="campaign_title">Campaign</h2>
				<div class="feature-layout">
					<div class="poster-box">
						<img class="poster" src="/r2-fg/assets/mobile-carousel/author.png" alt="文章征稿" loading="eager" fetchpriority="high" decoding="async" />
					</div>
					<div class="feature-content">
						<h3 class="event-title" data-i18n="author_call_title">文章征稿</h3>
						<div class="intro" data-i18n="author_call_intro">Fisting故事征集 & 分享长期活动开启！
大家好，我准备长期发起一个关于Fisting的经验分享和故事征集活动，欢迎所有感兴趣的朋友参与。

本次活动主要征集以下内容：
如何安全开始玩Fisting（新手入门步骤、准备工作）
灌肠（enema）的正确方法、注意事项和实用经验
Fisting过程中的安全技巧、润滑选择、常见问题及解决办法
自己真实玩Fisting（solo 或和伴侣）的个人故事、感受和心得
玩具推荐、使用心得、保养经验等

无论你是刚有兴趣的新手，还是已经有经验的老手，都欢迎投稿分享。故事长短不限，可以匿名投稿。

安全第一声明：
Fisting属于高强度玩法，安全、渐进、充足润滑和双方自愿非常重要。本活动所有分享仅供参考交流，不构成任何医疗建议。请大家实际操作时量力而行，做好充分准备，如有不适立即停止并咨询医生。

投稿方式：
私信我的 X（Twitter/X）账号
或发送邮件给我

所有投稿我都会认真阅读，尊重隐私，可匿名发布。期待大家把自己的经验和故事分享出来，一起帮助更多人安全、有趣地探索这个玩法～
投稿请直接私信或发邮件，谢谢！</div>
					</div>
				</div>
			</section>
		</div>
		${renderI18nScript("author_call_page_title")}
		<script>
			(function () {
				const select = document.getElementById('authorCallPageNav');
				const mount = document.getElementById('authorCallPageNavCustom');
				if (!select || !mount) return;
				function esc(v) {
					return String(v || '')
						.replace(/&/g, '&amp;')
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;')
						.replace(/"/g, '&quot;')
						.replace(/'/g, '&#39;');
				}
				function closeMenu() { mount.classList.remove('open'); }
				function render() {
					const options = Array.from(select.options || []);
					const selectedValue = String(select.value || '');
					mount.innerHTML =
						'<button type="button" class="mobile-select-trigger" aria-label="Open navigation menu"><span class="nav-bars" aria-hidden="true"><span></span><span></span><span></span></span></button>' +
						'<div class="mobile-select-menu" role="listbox">' +
							options.map(function (opt) {
								const value = String(opt.value || '');
								const selectedClass = value === selectedValue ? ' is-selected' : '';
								return '<button type="button" class="mobile-select-option' + selectedClass + '" data-value="' + esc(value) + '">' + esc(opt.text) + '</button>';
							}).join('') +
						'</div>';
					const trigger = mount.querySelector('.mobile-select-trigger');
					const menu = mount.querySelector('.mobile-select-menu');
					if (!trigger || !menu) return;
					trigger.addEventListener('click', function (event) {
						event.preventDefault();
						mount.classList.toggle('open');
					});
					menu.addEventListener('click', function (event) {
						const btn = event.target.closest('.mobile-select-option');
						if (!btn) return;
						const nextValue = btn.getAttribute('data-value') || '';
						if (nextValue) window.location.href = nextValue;
						closeMenu();
					});
				}
				select.addEventListener('change', render);
				render();
				document.documentElement.classList.add('mobile-select-ready');
				document.addEventListener('click', function (event) {
					if (!event.target.closest('#authorCallPageNavCustom')) closeMenu();
				});
				document.addEventListener('keydown', function (event) {
					if (event.key === 'Escape') closeMenu();
				});
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
				if (!verified) overlay.style.display = 'flex';
				yesBtn.addEventListener('click', function () {
					localStorage.setItem(key, 'yes');
					overlay.style.display = 'none';
				});
				noBtn.addEventListener('click', function () {
					const deniedText = (document.getElementById('ageDeniedText')?.textContent || 'Access denied. This website is for adults 18+ only.');
					document.body.innerHTML = '<div style="padding:24px;font-family:Segoe UI,sans-serif;">' + deniedText + '</div>';
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
			@media (min-width: 721px) {
				:root { --primary: #7e0202; }
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
			.head-title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				gap: 10px;
			}
			.lang-switch {
				font: inherit;
				border: 1px solid var(--line);
				background: #16181C;
				color: var(--text);
				padding: 0 12px;
				border-radius: 10px;
				height: 46px;
				width: 200px;
			}
			.head h1 { margin: 0; font-size: 34px; }
			.head p { margin: 0; color: var(--muted); }
			.top-nav { display: flex; flex-wrap: nowrap; gap: 12px; justify-content: flex-end; }
			.nav-btn {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				flex: 0 0 auto;
				text-decoration: none;
				background: #71767B;
				color: #FFFFFF;
				padding: 12px 24px;
				border-radius: 18px;
				font-size: 16px;
				font-weight: 600;
				white-space: nowrap;
			}
			.nav-btn.primary { background: var(--primary); }
			.nav-btn.active { box-shadow: 0 6px 14px rgba(126, 2, 2, 0.28); }
			.lang-switch {
				font: inherit;
				border: 1px solid var(--line);
				background: #16181C;
				color: var(--text);
				padding: 0 12px;
				border-radius: 10px;
				height: 46px;
				width: 200px;
			}
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
			.mobile-select-enhanced { display: none; width: 100%; position: relative; }
			.submit-bar {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 12px;
				flex-wrap: wrap;
			}
			.submit-hint {
				background: transparent;
				color: #E7E9EA;
				border: 0;
				border-radius: 0;
				padding: 0;
				font-size: 13px;
				line-height: 1.2;
			}
			.submit-btn {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				width: 42px;
				height: 42px;
				border-radius: 10px;
				text-decoration: none;
				background: #000000;
				border: 1px solid var(--line);
				background-repeat: no-repeat;
				background-position: center;
				background-size: 20px 20px;
				background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231D9BF0' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 2 11 13'/%3E%3Cpath d='M22 2 15 22 11 13 2 9 22 2z'/%3E%3C/svg%3E");
			}
			.status { font-size: 13px; color: var(--muted); }
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
			.post-author-row {
				display: flex;
				align-items: center;
				gap: 8px;
				margin-bottom: 4px;
			}
			.post-author-avatar {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				object-fit: cover;
				border: 1px solid var(--line);
				background: #0F1419;
				flex: 0 0 auto;
			}
			.post-author-avatar.placeholder {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				font-size: 10px;
				color: var(--muted);
			}
			.post-body {
				font-size: 14px;
				line-height: 1.6;
				color: #E7E9EA;
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 5;
				-webkit-box-orient: vertical;
			}
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
				.head h1 { font-size: 20px; }
				.wrap { width: 100%; max-width: 100%; gap: 0; }
				.card {
					padding: 12px 0;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					background: transparent;
					box-shadow: none;
				}
				.head-card {
					padding: 10px 0 12px;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					background: transparent;
					box-shadow: none;
				}
				.top-nav { display: none; }
				.head { align-items: center; }
				.lang-switch {
					height: 34px;
					font-size: 13px;
					background-color: #000000;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					color: #8B98A5;
					appearance: none;
					-webkit-appearance: none;
					-moz-appearance: none;
					padding: 0 24px 0 0;
					background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238B98A5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
					background-repeat: no-repeat;
					background-position: right 2px center;
				}
				.blog-grid { grid-template-columns: 1fr; }
				.post-card {
					padding: 10px 0;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					background: transparent;
					min-height: auto;
				}
			}
		</style>
		<!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "def0f01252734ae59676f95377aad23b"}'></script><!-- End Cloudflare Web Analytics -->
	</head>
	<body>
		<div class="age-gate-overlay" id="ageGate">
			<div class="age-gate-box">
				<h2 data-i18n="age_title">Age Confirmation</h2>
				<p data-i18n="age_desc">You must be 18+ to enter this site. Are you 18 years old or above?</p>
				<div class="age-gate-actions">
					<button class="age-btn yes" id="ageYes" data-i18n="age_yes">Yes, I am 18+</button>
					<button class="age-btn no" id="ageNo" data-i18n="age_no">No</button>
				</div>
			</div>
		</div>
		<div id="ageDeniedText" data-i18n="age_denied" hidden>Access denied. This website is for adults 18+ only.</div>

		<div class="wrap">
			<section class="card head-card">
				<div class="head">
					<div class="head-title">
						<div>
							<h1 data-i18n="heading_wiki">Fisting Wiki</h1>
						</div>
						${renderLanguageSwitcher("wikiLangSwitch")}
					</div>
					<nav class="top-nav">
						<a class="nav-btn" href="/" data-i18n="nav_ranking">Performers List</a>
						<a class="nav-btn" href="/admin" data-i18n="nav_add">Add new</a>
						<a class="nav-btn primary active" href="/wiki" data-i18n="nav_wiki">Fisting Wiki</a>
						<a class="nav-btn" href="/about" data-i18n="nav_about">About</a>
					</nav>
				</div>
			</section>

			<section class="card">
				<div class="submit-bar">
					<div class="submit-hint" data-i18n="wiki_submit_hint">submit an article to fistingguide</div>
					<a class="submit-btn" href="https://x.com/FistingGuide" target="_blank" rel="noopener noreferrer" aria-label="Submit an article to fistingguide"></a>
				</div>
				<p class="status" id="status"></p>
			</section>

			<section class="card">
				<div id="rows" class="blog-grid"></div>
			</section>
		</div>

		${renderI18nScript("page_title_wiki")}
		<script>
			let currentRows = [];
			const els = {
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

			function currentLang() {
				const fromWindow = String(window.__uiLang || '').trim();
				if (fromWindow) return fromWindow;
				const fromUrl = new URL(window.location.href).searchParams.get('lang');
				return String(fromUrl || 'en').trim() || 'en';
			}

			function withLang(path) {
				const next = new URL(path, window.location.origin);
				next.searchParams.set('lang', currentLang());
				const query = next.searchParams.toString();
				return next.pathname + (query ? ('?' + query) : '');
			}

			function renderRows() {
				if (!currentRows.length) {
					els.rows.innerHTML = '<div class="empty">No articles yet.</div>';
					return;
				}

				els.rows.innerHTML = currentRows.map(function (row) {
					const authorName = esc(row.author || 'fistingguide');
					const authorHandle = esc(row.author_handle || '');
					const authorAvatar = esc(row.author_avatar || '');
					const articleHref = withLang('/wiki/article/' + row.id);
					const avatarEl = authorAvatar
						? '<img class="post-author-avatar" src="' + authorAvatar + '" alt="' + authorName + '" loading="lazy" referrerpolicy="no-referrer" />'
						: '<span class="post-author-avatar placeholder">A</span>';
					const handleText = authorHandle ? (' ' + authorHandle) : '';
					return '<article class="post-card">' +
						'<a class="post-link" href="' + esc(articleHref) + '">' +
							'<h3 class="post-title">' + esc(row.title) + '</h3>' +
							'<div class="post-author-row">' + avatarEl + '<div class="post-meta">By ' + authorName + handleText + '</div></div>' +
							'<div class="post-body">' + esc(row.content || '') + '</div>' +
						'</a>' +
					'</article>';
				}).join('');
			}

			async function loadRows() {
				setStatus('Loading...');
				const res = await fetch(withLang('/api/wiki'));
				const data = await res.json();
				currentRows = Array.isArray(data.results) ? data.results : [];
				renderRows();
				setStatus('Total ' + currentRows.length + ' articles');
			}

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
					const deniedText = (document.getElementById('ageDeniedText')?.textContent || 'Access denied. This website is for adults 18+ only.');
					document.body.innerHTML = '<div style="padding:24px;font-family:Segoe UI,sans-serif;">' + deniedText + '</div>';
				});
			})();
		</script>
	</body>
</html>
`;
}

export function renderWikiArticlePage(article: WikiArticleRecord): string {
	const title = escapeHtml(article.title || "Untitled");
	const rawContent = String(article.content || "");
	const updated = escapeHtml(article.updated_at || article.created_at || "");
	const author = escapeHtml(article.author || "fistingguide");
	const rawAuthorHandle = String(article.author_handle || "").trim();
	const normalizedHandle = rawAuthorHandle
		? (rawAuthorHandle.startsWith("@") ? rawAuthorHandle : `@${rawAuthorHandle}`)
		: "";
	const resolvedAuthorUrl = String(article.author_url || "").trim() || (normalizedHandle ? `https://x.com/${normalizedHandle.replace(/^@/, "")}` : "");
	const authorHandle = escapeHtml(normalizedHandle);
	const authorUrl = escapeHtml(resolvedAuthorUrl);
	const authorAvatar = escapeHtml(String(article.author_avatar || "").trim());
	const introMatch = rawContent.match(/作者简介(?:是)?[:：]\s*([\s\S]*?)(?:\n{2,}|$)/);
	const authorIntro = escapeHtml((introMatch?.[1] || "").trim());
	const markdownContent = rawContent.replace(/作者简介(?:是)?[:：]\s*([\s\S]*?)(?:\n{2,}|$)/, "").trim();
	const contentHtml = renderMarkdown(markdownContent);
	const authorHandleHtml = authorHandle
		? (authorUrl
			? ` <a href="${authorUrl}" target="_blank" rel="noopener noreferrer">${authorHandle}</a>`
			: ` ${authorHandle}`)
		: "";
	const authorBannerInner = `
		<svg class="author-banner-svg" viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true">
			<defs>
				<linearGradient id="authorBannerBg" x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" stop-color="#0B0E12" />
					<stop offset="55%" stop-color="#10151C" />
					<stop offset="100%" stop-color="#151A22" />
				</linearGradient>
				<linearGradient id="authorBannerAccent" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stop-color="#7e0202" />
					<stop offset="100%" stop-color="#320101" />
				</linearGradient>
			</defs>
			<rect x="0" y="0" width="1200" height="220" fill="url(#authorBannerBg)" />
			<path d="M0,188 L560,122 L1200,152 L1200,220 L0,220 Z" fill="rgba(255,255,255,0.03)" />
			<path d="M0,204 L430,152 L1200,176 L1200,220 L0,220 Z" fill="rgba(126,2,2,0.20)" />
			<rect x="0" y="0" width="8" height="220" fill="url(#authorBannerAccent)" />
		</svg>
		<div class="author-banner-content">
			${authorAvatar
				? `<img class="author-banner-avatar" src="${authorAvatar}" alt="${author}" loading="lazy" referrerpolicy="no-referrer" />`
				: `<span class="author-banner-avatar author-banner-avatar-placeholder">A</span>`}
			<div class="author-banner-text">
				<div class="author-banner-name">${author}</div>
				<div class="author-banner-handle">${authorHandle || "@fistingguide"}</div>
			</div>
			<span class="author-banner-xmark" aria-hidden="true">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M18.9 2H22l-6.77 7.74L23 22h-6.09l-4.78-6.26L6.65 22H3.5l7.23-8.27L1 2h6.25l4.32 5.69L18.9 2zm-1.07 18h1.69L6.33 3.9H4.5L17.83 20z"></path>
				</svg>
			</span>
		</div>
	`;
	const authorBannerHtml = authorUrl
		? `<a class="author-banner" href="${authorUrl}" target="_blank" rel="noopener noreferrer">${authorBannerInner}</a>`
		: `<div class="author-banner">${authorBannerInner}</div>`;
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
			@media (min-width: 721px) {
				:root { --primary: #7e0202; }
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
			.article {
				display: grid;
				gap: 14px;
			}
			.article h1 { margin: 0; font-size: 25px; line-height: 1.2; color: #FFFFFF; }
			.meta { color: var(--muted); font-size: 16px; }
			.meta a {
				color: inherit;
				text-decoration: none;
			}
			.meta a:hover { text-decoration: underline; }
			.author-banner {
				position: relative;
				display: block;
				overflow: hidden;
				padding: 0;
				border: 1px solid var(--line);
				border-radius: 12px;
				background: #0F1419;
				text-decoration: none;
				color: var(--text);
			}
			.author-banner:hover { border-color: var(--primary); }
			.author-banner-svg {
				display: block;
				width: 100%;
				height: 110px;
			}
			.author-banner-content {
				position: absolute;
				inset: 0;
				display: flex;
				align-items: center;
				gap: 14px;
				padding: 0 16px;
			}
			.author-banner-avatar {
				width: 68px;
				height: 68px;
				border-radius: 50%;
				object-fit: cover;
				flex: 0 0 auto;
				background: #111;
			}
			.author-banner-avatar-placeholder {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				color: var(--muted);
			}
			.author-banner-text { display: grid; gap: 5px; }
			.author-banner-name { font-size: 24px; color: #FFFFFF; line-height: 1.05; }
			.author-banner-handle {
				font-size: 18px;
				color: #A7B1BC;
				letter-spacing: 0.03em;
				line-height: 1.1;
			}
			.author-banner-xmark {
				margin-left: auto;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				width: 28px;
				height: 28px;
				color: #CED6DD;
				opacity: 0.9;
			}
			.author-banner-xmark svg { width: 20px; height: 20px; }
			.author-intro {
				white-space: pre-line;
				line-height: 1.5;
				font-size: 20px;
				color: #E7E9EA;
				padding: 12px;
				border: 1px solid var(--line);
				border-radius: 12px;
				background: #0F1419;
			}
			.article-body {
				line-height: 1.65;
				font-size: 20px;
				color: var(--muted);
			}
			.article-body h2,
			.article-body h3,
			.article-body h4,
			.article-body h5,
			.article-body h6 {
				margin: 14px 0 8px;
				color: var(--muted);
				line-height: 1.25;
			}
			.article-body p { margin: 0 0 10px; }
			.article-body ol {
				margin: 0 0 10px 22px;
				padding: 0;
			}
			.article-body li { margin: 0 0 6px; }
			.article-body a {
				color: #9CCAFF;
				text-decoration: underline;
				text-underline-offset: 2px;
			}
			.article-body code {
				background: rgba(255, 255, 255, 0.08);
				border: 1px solid var(--line);
				border-radius: 6px;
				padding: 0 6px;
				color: #F3F7FB;
				font-size: 0.92em;
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
				.wrap { width: 100%; max-width: 100%; gap: 0; }
				.card {
					padding: 12px 0;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					background: transparent;
					box-shadow: none;
				}
				.article h1 { font-size: 14px; }
				.meta { font-size: 12px; }
				.author-banner { border-radius: 10px; }
				.author-banner-svg { height: 90px; }
				.author-banner-content { padding: 0 10px; gap: 10px; }
				.author-banner-avatar { width: 52px; height: 52px; }
				.author-banner-name { font-size: 17px; }
				.author-banner-handle { font-size: 14px; }
				.author-banner-xmark { width: 22px; height: 22px; }
				.author-banner-xmark svg { width: 16px; height: 16px; }
				.author-intro { font-size: 12px; padding: 10px; border-radius: 10px; }
				.article-body { font-size: 12px; }
				.article-body h2,
				.article-body h3,
				.article-body h4,
				.article-body h5,
				.article-body h6 { margin: 10px 0 6px; }
				.article-body p,
				.article-body ol,
				.article-body li { margin-bottom: 8px; }
			}
		</style>
		<!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "def0f01252734ae59676f95377aad23b"}'></script><!-- End Cloudflare Web Analytics -->
	</head>
	<body>
		<div class="age-gate-overlay" id="ageGate">
			<div class="age-gate-box">
				<h2 data-i18n="age_title">Age Confirmation</h2>
				<p data-i18n="age_desc">You must be 18+ to enter this site. Are you 18 years old or above?</p>
				<div class="age-gate-actions">
					<button class="age-btn yes" id="ageYes" data-i18n="age_yes">Yes, I am 18+</button>
					<button class="age-btn no" id="ageNo" data-i18n="age_no">No</button>
				</div>
			</div>
		</div>
		<div id="ageDeniedText" data-i18n="age_denied" hidden>Access denied. This website is for adults 18+ only.</div>

		<div class="wrap">
			<section class="card article">
				<h1>${title}</h1>
				${authorBannerHtml}
				<div class="meta"><span data-i18n="article_by">By</span> ${author}${authorHandleHtml} | <span data-i18n="article_updated">Updated</span> ${updated}</div>
				${authorIntro ? `<div class="author-intro">${authorIntro}</div>` : ""}
				<div class="article-body">${contentHtml}</div>
			</section>
		</div>

		${renderI18nScript("")}
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
					const deniedText = (document.getElementById('ageDeniedText')?.textContent || 'Access denied. This website is for adults 18+ only.');
					document.body.innerHTML = '<div style="padding:24px;font-family:Segoe UI,sans-serif;">' + deniedText + '</div>';
				});
			})();
		</script>
	</body>
</html>
`;
}









