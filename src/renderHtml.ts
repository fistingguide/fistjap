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

type LocaleCode = "en" | "zh-CN" | "zh-TW" | "ja" | "ko" | "es" | "th" | "vi";

const LOCALE_CODES: LocaleCode[] = ["en", "zh-CN", "zh-TW", "ja", "ko", "es", "th", "vi"];
const RANKING_NOTICE_ZH_CN =
	"1. 本网站仅收录男性账号（包括 gay 用户以及对肛门扩张感兴趣的直男）。\n2. 为了保证公平性，网站每 10 分钟轮换一次置顶账号，以确保每位用户都有机会被更多人看到。\n3. 本网站地图上显示的所有位置仅为示意标注。这些位置可能参考公开信息进行大致标注，但已被刻意模糊化或随机设置，因此不会对应任何人的精确位置，仅用于展示社区的大致分布情况。若你不希望自己的名称或标注出现在地图上，可以随时联系我，我会将其删除或替换为一个完全随机的位置。本网站不会收集、存储或公开任何个人的具体地址信息。\n4. 每个人可以添加自己的账号和查看地图，手机端请点击汉堡按键查看更多操作。\n5. 任何信息请私信 @fistingguide。";
const TH_MESSAGES: Record<string, string> = {
	page_title_ranking: "รายชื่อนักแสดง",
	page_title_admin: "แผงผู้ดูแลฐานข้อมูล",
	page_title_dashboard: "แผนที่",
	page_title_about: "เกี่ยวกับ",
	page_title_wiki: "Fisting Wiki",
	page_title_wiki_article: "Fisting Wiki",
	heading_ranking: "รายชื่อนักแสดง",
	heading_add: "เพิ่มใหม่",
	heading_star: "แผนที่",
	heading_about: "เกี่ยวกับ",
	heading_wiki: "Fisting Wiki",
	nav_ranking: "รายชื่อนักแสดง",
	nav_add: "เพิ่มใหม่",
	nav_star: "แผนที่",
	nav_wiki: "Fisting Wiki",
	nav_about: "เกี่ยวกับ",
	dashboard_visit_select: "เลือกนักแสดงบนแผนที่ก่อน",
	dashboard_visit_named: "ไปที่ {name}",
	country_region: "ประเทศ(ภูมิภาค)",
	all_option: "ทั้งหมด",
	ranking_location_notice:
		"1. เว็บไซต์นี้รวบรวมเฉพาะบัญชีผู้ชาย (รวมผู้ใช้ gay และผู้ชายรักต่างเพศที่สนใจการขยายทวารหนัก)\n2. เพื่อความยุติธรรม เว็บไซต์จะสลับบัญชีปักหมุดทุก 10 นาที เพื่อให้ทุกคนมีโอกาสถูกมองเห็นมากขึ้น\n3. ตำแหน่งทั้งหมดบนแผนที่เป็นเพียงตำแหน่งเชิงสาธิต อาจอ้างอิงข้อมูลสาธารณะคร่าว ๆ แต่ถูกทำให้คลุมเครือหรือสุ่มโดยเจตนา จึงไม่ตรงกับตำแหน่งจริงของบุคคล ใช้เพื่อแสดงการกระจายของชุมชนเท่านั้น หากไม่ต้องการให้ชื่อหรือหมุดปรากฏบนแผนที่ ติดต่อฉันได้ตลอดเวลา ฉันจะลบหรือแทนที่ด้วยตำแหน่งสุ่มทั้งหมด เว็บไซต์นี้จะไม่เก็บรวบรวม จัดเก็บ หรือเผยแพร่ที่อยู่จริงของบุคคล\n4. ทุกคนสามารถเพิ่มบัญชีของตัวเองและดูแผนที่ได้ บนมือถือให้กดปุ่มแฮมเบอร์เกอร์เพื่อดูการทำงานเพิ่มเติม\n5. หากมีข้อมูลใด ๆ กรุณาส่งข้อความส่วนตัวถึง @fistingguide",
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
	heading_add: "Thêm mới",
	heading_star: "Bản đồ",
	heading_about: "Giới thiệu",
	heading_wiki: "Fisting Wiki",
	nav_ranking: "Danh sach nguoi bieu dien",
	nav_add: "Thêm mới",
	nav_star: "Bản đồ",
	nav_wiki: "Fisting Wiki",
	nav_about: "Giới thiệu",
	dashboard_visit_select: "Select a performer on the map first",
	dashboard_visit_named: "Visit {name}",
	country_region: "quoc gia(vung)",
	all_option: "Tat ca",
	ranking_location_notice:
		"1. Website nay chi liet ke cac tai khoan nam (bao gom nguoi dung gay va nam thang quan tam den anal expansion).\n2. De dam bao cong bang, website se xoay tai khoan ghim moi 10 phut de moi nguoi deu co co hoi duoc nhieu nguoi thay hon.\n3. Tat ca vi tri tren ban do chi mang tinh minh hoa. Cac vi tri nay co the duoc danh dau dua tren thong tin cong khai o muc do tong quat, nhung da duoc lam mo hoac ngau nhien co chu dich, vi vay khong the hien vi tri chinh xac cua bat ky ai. Muc dich chi de hien thi phan bo tong quan cua cong dong. Neu ban khong muon ten hoac danh dau cua minh xuat hien tren ban do, hay lien he toi bat cu luc nao, toi se xoa hoac thay bang mot vi tri hoan toan ngau nhien. Website nay khong thu thap, luu tru hay cong khai dia chi cu the cua bat ky ca nhan nao.\n4. Moi nguoi deu co the them tai khoan cua minh va xem ban do. Tren dien thoai, hay bam nut hamburger de xem them thao tac.\n5. Moi thong tin vui long nhan tin @fistingguide.",
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

const I18N_MESSAGES: Record<LocaleCode, Record<string, string>> = {
	en: {
		page_title_ranking: "Performers List",
		page_title_admin: "Database Admin Panel",
		page_title_dashboard: "Map",
		page_title_about: "About",
		page_title_wiki: "Fisting Wiki",
		page_title_wiki_article: "Fisting Wiki",
		heading_ranking: "Performers List",
		heading_add: "Add new",
		heading_star: "Map",
		heading_about: "About",
		heading_wiki: "Fisting Wiki",
		nav_ranking: "Performers List",
		nav_add: "Add new",
		nav_star: "Map",
		nav_wiki: "Fisting Wiki",
		nav_about: "About",
		dashboard_visit_select: "Select a performer on the map first",
		dashboard_visit_named: "Visit {name}",
		country_region: "country(region)",
		all_option: "All",
		ranking_location_notice:
			"1. This website only lists male accounts (including gay users and straight men interested in anal expansion).\n2. To keep things fair, the site rotates the pinned spotlight account every 10 minutes, so everyone gets a chance to be seen.\n3. All map locations on this site are illustrative markers. They may be roughly based on public info, but are intentionally blurred or randomized, so they do not match any person's exact location and are only used to show the community's general distribution. If you do not want your name or marker shown, contact me anytime and I will remove it or replace it with a fully random location. This site does not collect, store, or publish anyone's specific address information.\n4. Everyone can add their own account and view the map. On mobile, tap the hamburger button to see more actions.\n5. For any information, please DM @fistingguide.",
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
		heading_add: "\u65b0\u589e",
		heading_star: "\u5730\u56fe",
		heading_about: "\u5173\u4e8e",
		heading_wiki: "Fisting Wiki",
		nav_ranking: "\u8868\u6f14\u8005\u5217\u8868",
		nav_add: "\u65b0\u589e",
		nav_star: "\u5730\u56fe",
		nav_wiki: "Fisting Wiki",
		nav_about: "\u5173\u4e8e",
		dashboard_visit_select: "\u8bf7\u5148\u5728\u5730\u56fe\u4e0a\u9009\u62e9\u8868\u6f14\u8005",
		dashboard_visit_named: "\u8bbf\u95ee{name}",
		country_region: "\u56fd\u5bb6(\u5730\u533a)",
		all_option: "\u5168\u90e8",
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
		heading_add: "\u65b0\u589e",
		heading_star: "\u5730\u5716",
		heading_about: "\u95dc\u65bc",
		heading_wiki: "Fisting Wiki",
		nav_ranking: "\u8868\u6f14\u8005\u6e05\u55ae",
		nav_add: "\u65b0\u589e",
		nav_star: "\u5730\u5716",
		nav_wiki: "Fisting Wiki",
		nav_about: "\u95dc\u65bc",
		dashboard_visit_select: "\u8acb\u5148\u5728\u5730\u5716\u4e0a\u9078\u64c7\u8868\u6f14\u8005",
		dashboard_visit_named: "\u8a2a\u554f{name}",
		country_region: "\u570b\u5bb6(\u5730\u5340)",
		all_option: "\u5168\u90e8",
		ranking_location_notice:
			"1. 本網站僅收錄男性帳號（包含 gay 使用者，以及對肛門擴張感興趣的直男）。\n2. 為了維持公平性，網站每 10 分鐘輪換一次置頂帳號，確保每位使用者都有被更多人看到的機會。\n3. 本網站地圖上顯示的所有位置僅為示意標註。這些位置可能參考公開資訊進行大致標註，但已被刻意模糊化或隨機設定，因此不會對應任何人的精確位置，僅用於展示社群的大致分布情況。若你不希望自己的名稱或標註出現在地圖上，可以隨時聯絡我，我會將其刪除或替換為完全隨機的位置。本網站不會收集、儲存或公開任何個人的具體地址資訊。\n4. 每個人都可以新增自己的帳號並查看地圖，手機端請點擊漢堡按鈕查看更多操作。\n5. 任何資訊請私訊 @fistingguide。",
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
		heading_add: "\u65b0\u898f\u8ffd\u52a0",
		heading_star: "\u30de\u30c3\u30d7",
		heading_about: "\u6982\u8981",
		heading_wiki: "Fisting Wiki",
		nav_ranking: "\u30d1\u30d5\u30a9\u30fc\u30de\u30fc\u4e00\u89a7",
		nav_add: "\u65b0\u898f\u8ffd\u52a0",
		nav_star: "\u30de\u30c3\u30d7",
		nav_wiki: "Fisting Wiki",
		nav_about: "\u6982\u8981",
		dashboard_visit_select: "\u5730\u56f3\u4e0a\u3067\u30d1\u30d5\u30a9\u30fc\u30de\u30fc\u3092\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044",
		dashboard_visit_named: "{name}\u3078\u79fb\u52d5",
		country_region: "\u56fd(\u5730\u57df)",
		all_option: "\u3059\u3079\u3066",
		ranking_location_notice:
			"1. このサイトでは男性アカウントのみ掲載します（gayユーザー、および肛門拡張に関心のあるストレート男性を含む）。\n2. 公平性のため、サイトの置頂アカウントは10分ごとにローテーションし、全員に見られる機会を作ります。\n3. サイトの地図上の位置はすべて説明用の表示です。公開情報を参考に大まかに示す場合がありますが、意図的にぼかしやランダム化を行っているため、個人の正確な位置には対応しません。コミュニティの大まかな分布表示のみを目的としています。名前やマーカーの表示を希望しない場合は、いつでも連絡してください。削除または完全ランダム位置への置換に対応します。サイトは個人の具体的住所情報を収集・保存・公開しません。\n4. 誰でも自分のアカウントを追加し、地図を閲覧できます。モバイルではハンバーガーボタンから追加操作を確認してください。\n5. 連絡は @fistingguide へDMしてください。",
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
		heading_add: "\ucd94\uac00",
		heading_star: "\uc9c0\ub3c4",
		heading_about: "\uc18c\uac1c",
		heading_wiki: "Fisting Wiki",
		nav_ranking: "\ud37c\ud3ec\uba38 \ubaa9\ub85d",
		nav_add: "\ucd94\uac00",
		nav_star: "\uc9c0\ub3c4",
		nav_wiki: "Fisting Wiki",
		nav_about: "\uc18c\uac1c",
		dashboard_visit_select: "\uc9c0\ub3c4\uc5d0\uc11c \ud37c\ud3ec\uba38\ub97c \uba3c\uc800 \uc120\ud0dd\ud574 \uc8fc\uc138\uc694",
		dashboard_visit_named: "{name}\ub85c \uc774\ub3d9",
		country_region: "\uad6d\uac00(\uc9c0\uc5ed)",
		all_option: "\uc804\uccb4",
		ranking_location_notice:
			"1. 이 사이트는 남성 계정만 수록합니다(gay 사용자 및 항문 확장에 관심 있는 이성애 남성 포함).\n2. 공정성을 위해 사이트는 10분마다 상단 고정 계정을 순환 노출하여 모든 사용자가 더 많이 보일 기회를 갖게 합니다.\n3. 지도에 표시되는 모든 위치는 안내용 표기입니다. 공개 정보를 참고해 대략적으로 표시될 수 있지만 의도적으로 흐리게 처리되거나 무작위 설정되므로 개인의 정확한 위치와 일치하지 않습니다. 커뮤니티의 대략적 분포 표시 목적입니다. 이름/표시를 원하지 않으면 언제든지 연락해 주세요. 삭제하거나 완전 무작위 위치로 대체합니다. 이 사이트는 개인의 구체적 주소 정보를 수집, 저장, 공개하지 않습니다.\n4. 누구나 자신의 계정을 추가하고 지도를 볼 수 있습니다. 모바일에서는 햄버거 버튼을 눌러 더 많은 기능을 확인하세요.\n5. 문의는 @fistingguide 로 DM 주세요.",
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
		heading_add: "Agregar",
		heading_star: "Mapa",
		heading_about: "Acerca de",
		heading_wiki: "Fisting Wiki",
		nav_ranking: "Lista de artistas",
		nav_add: "Agregar",
		nav_star: "Mapa",
		nav_wiki: "Fisting Wiki",
		nav_about: "Acerca de",
		dashboard_visit_select: "Primero selecciona un artista en el mapa",
		dashboard_visit_named: "Visitar a {name}",
		country_region: "pais(region)",
		all_option: "Todos",
		ranking_location_notice:
			"1. Este sitio solo incluye cuentas masculinas (incluye usuarios gay y hombres heterosexuales interesados en la expansion anal).\n2. Para mantener la equidad, el sitio rota la cuenta fijada cada 10 minutos para que todos tengan oportunidad de ser vistos.\n3. Todas las ubicaciones del mapa son marcas ilustrativas. Pueden basarse de forma aproximada en informacion publica, pero se difuminan o aleatorizan de forma intencional, por lo que no corresponden a la ubicacion exacta de ninguna persona. Solo se usan para mostrar la distribucion general de la comunidad. Si no quieres que aparezcan tu nombre o marcador, contactame en cualquier momento y lo eliminare o lo reemplazare por una ubicacion totalmente aleatoria. Este sitio no recopila, almacena ni publica direcciones especificas de personas.\n4. Cualquiera puede agregar su propia cuenta y ver el mapa. En movil, pulsa el boton hamburguesa para ver mas acciones.\n5. Para cualquier informacion, envia DM a @fistingguide.",
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
								<div class="badge">Fans ${row.followers_count}</div>
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
			.mobile-select-enhanced { display: none; width: 100%; position: relative; }
			@media (max-width: 720px) {
				body { font-size: 13px; }
				.top-nav { display: none; }
				.mobile-nav-row { display: block; width: auto; }
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
				.header {
					padding: 10px 0 12px;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					background: transparent;
					box-shadow: none;
				}
				.header h1 { font-size: 20px; }
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
				.mobile-nav-row {
					display: flex;
					align-items: center;
					justify-content: flex-end;
					margin-left: auto;
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
				font-size: 13px;
				line-height: 1.5;
				white-space: pre-line;
			}
			.mobile-inline-carousel {
				display: none;
				position: relative;
				margin: 10px 0 0;
				border-radius: 12px;
				overflow: hidden;
				border: 1px solid var(--line);
				background: #0F1419;
			}
			.mobile-inline-carousel-slide {
				display: none;
			}
			.mobile-inline-carousel-slide.is-active {
				display: block;
			}
			.mobile-inline-carousel img {
				display: block;
				width: 100%;
				aspect-ratio: 16 / 9;
				object-fit: cover;
			}
			.mobile-inline-carousel-dots {
				position: absolute;
				left: 0;
				right: 0;
				bottom: 8px;
				display: flex;
				justify-content: center;
				gap: 6px;
				pointer-events: none;
			}
			.mobile-inline-carousel-dots span {
				width: 6px;
				height: 6px;
				border-radius: 50%;
				background: rgba(255, 255, 255, 0.45);
			}
			.mobile-inline-carousel-dots span.is-active {
				background: #FFFFFF;
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
					padding: 9px 10px;
					border: 0;
					border-radius: 0;
					background: transparent;
				}
				.mobile-inline-carousel {
					display: block;
					margin-top: 8px;
					border: 0;
					border-radius: 0;
					background: transparent;
				}
				.mobile-inline-carousel img {
					aspect-ratio: auto;
					height: auto;
					object-fit: contain;
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
			<header class="header">
				<div class="header-main">
					<div class="header-left">
						<div class="header-title-row">
							<h1 data-i18n="heading_ranking">Performers List</h1>
							${renderLanguageSwitcher("rankingLangSwitch")}
							<div class="mobile-nav-row">
								<select id="mobilePageNav" class="mobile-nav" aria-label="Page Navigation" onchange="if(this.value){window.location.href=this.value;}">
									<option value="/" selected data-i18n="nav_ranking">Performers List</option>
									<option value="/admin" data-i18n="nav_add">Add new</option>
									<option value="/dashboard" data-i18n="nav_star">Map</option>
									<option value="/wiki" data-i18n="nav_wiki">Fisting Wiki</option>
									<option value="/about" data-i18n="nav_about">About</option>
								</select>
								<div id="mobilePageNavCustom" class="mobile-select-enhanced"></div>
							</div>
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
						<nav class="top-nav">
							<a class="nav-btn primary active" href="/" data-i18n="nav_ranking">Performers List</a>
							<a class="nav-btn secondary" href="/admin" data-i18n="nav_add">Add new</a>
							<a class="nav-btn secondary" href="/dashboard" data-i18n="nav_star">Map</a>
							<a class="nav-btn secondary" href="/wiki" data-i18n="nav_wiki">Fisting Wiki</a>
							<a class="nav-btn secondary" href="/about" data-i18n="nav_about">About</a>
						</nav>
					</div>
				</div>
			</header>
			<p class="ranking-notice" data-i18n="ranking_location_notice">${escapeHtml(RANKING_NOTICE_ZH_CN)}</p>
			<div class="mobile-inline-carousel" id="mobileInlineCarousel" aria-label="Mobile Carousel">
				<a class="mobile-inline-carousel-slide is-active" href="https://fistjap.fistingguide.workers.dev/" target="_self"><img src="/assets/mobile-carousel/1.png" alt="1" loading="eager" fetchpriority="high" decoding="async" /></a>
				<a class="mobile-inline-carousel-slide" href="https://fistjap.fistingguide.workers.dev/" target="_self"><img src="/assets/mobile-carousel/2.png" alt="2" loading="lazy" fetchpriority="low" decoding="async" /></a>
				<a class="mobile-inline-carousel-slide" href="https://fistjap.fistingguide.workers.dev/" target="_self"><img src="/assets/mobile-carousel/3.png" alt="3" loading="lazy" fetchpriority="low" decoding="async" /></a>
				<a class="mobile-inline-carousel-slide" href="https://fistjap.fistingguide.workers.dev/" target="_self"><img src="/assets/mobile-carousel/4.png" alt="4" loading="lazy" fetchpriority="low" decoding="async" /></a>
				<a class="mobile-inline-carousel-slide" href="https://fistjap.fistingguide.workers.dev/" target="_self"><img src="/assets/mobile-carousel/5.png" alt="5" loading="lazy" fetchpriority="low" decoding="async" /></a>
				<div class="mobile-inline-carousel-dots" aria-hidden="true">
					<span class="is-active"></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
				</div>
			</div>
			<ol class="list">
				<li class="leaderboard-item spotlight-item" id="pinnedSpotlight" hidden></li>
				${renderLeaderboardRows(rows)}
			</ol>
		</section>
		${renderI18nScript("page_title_ranking")}
		<script>
			(function () {
				const initialRows = ${serializedRows};
				const listEl = document.querySelector('.list');
				const countrySelect = document.getElementById('rankCountryFilter');
				const navSelect = document.getElementById('mobilePageNav');
				const countryCustom = document.getElementById('rankCountryFilterCustom');
				const navCustom = document.getElementById('mobilePageNavCustom');
				let pinnedSpotlightEl = document.getElementById('pinnedSpotlight');
				let pinnedCountdownEl = null;
				let pinnedNextSwitchAt = null;
				let lastPinnedData = null;
				const mobileInlineCarouselEl = document.getElementById('mobileInlineCarousel');
				let mobileInlineCarouselTimer = null;

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
											'<div class="badge">Fans ' + row.followers_count + '</div>' +
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
					const fans = Number(row.followers_count || 0);
					const avatarEl = safeAvatar
						? '<img class="avatar" src="' + safeAvatar + '" alt="' + safeName + '" referrerpolicy="no-referrer" loading="lazy" />'
						: '<div class="avatar placeholder">N/A</div>';
					pinnedSpotlightEl.innerHTML =
						'<a class="card-link" href="' + safeUrl + '" target="_self" aria-label="Open ' + safeName + ' on X">' +
							'<div class="card-top">' +
								'<div class="rank top-rank">' + esc(t('spotlight_title', 'Rotating Spotlight')) + '</div>' +
								'<div class="badges">' +
									'<div class="badge">Orientation ' + safeOrientation + '</div>' +
									'<div class="badge">Fans ' + fans + '</div>' +
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

				function startMobileInlineCarousel() {
					if (!mobileInlineCarouselEl) return;
					const slides = Array.from(mobileInlineCarouselEl.querySelectorAll('.mobile-inline-carousel-slide'));
					const dots = Array.from(mobileInlineCarouselEl.querySelectorAll('.mobile-inline-carousel-dots span'));
					if (slides.length <= 1) return;
					const imgUrls = slides.map(function (slide) {
						const img = slide.querySelector('img');
						return img ? String(img.getAttribute('src') || '') : '';
					}).filter(Boolean);
					// Keep first paint fast, then warm the rest in background to avoid slow switch.
					setTimeout(function () {
						imgUrls.slice(1).forEach(function (url) {
							const preloadImg = new Image();
							preloadImg.decoding = 'async';
							preloadImg.src = url;
						});
					}, 1200);
					let index = 0;
					function renderSlide() {
						slides.forEach(function (slide, i) {
							if (i === index) slide.classList.add('is-active');
							else slide.classList.remove('is-active');
						});
						dots.forEach(function (dot, i) {
							if (i === index) dot.classList.add('is-active');
							else dot.classList.remove('is-active');
						});
					}
					renderSlide();
					if (mobileInlineCarouselTimer) clearInterval(mobileInlineCarouselTimer);
					mobileInlineCarouselTimer = setInterval(function () {
						index = (index + 1) % slides.length;
						renderSlide();
					}, 60000);
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
				loadCountries();
				loadPinnedProfile();
				startMobileInlineCarousel();
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
			.nav-btn.primary { background: #1D9BF0; }
			.nav-btn.active { box-shadow: 0 6px 14px rgba(29, 155, 240, 0.28); }
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
								<option value="/dashboard" data-i18n="nav_star">Map</option>
								<option value="/wiki" data-i18n="nav_wiki">Fisting Wiki</option>
								<option value="/about" data-i18n="nav_about">About</option>
							</select>
							<div id="adminPageNavCustom" class="mobile-select-enhanced"></div>
						</div>
					</div>
					<nav class="top-nav">
						<a class="nav-btn" href="/" data-i18n="nav_ranking">Performers List</a>
						<a class="nav-btn primary active" href="/admin" data-i18n="nav_add">Add new</a>
						<a class="nav-btn" href="/dashboard" data-i18n="nav_star">Map</a>
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
				els.bio.value = '';
				els.profileUrl.value = '';
				els.avatar.value = '';
				els.orientation.value = 'Gay';
				els.followers.value = '20';
				els.country.value = 'Japan';
				els.region.value = 'Tokyo';
				els.district.value = 'Itabashi';
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
				refreshLocationPreviewByValue();
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

				const query = '?keyword=' + encodeURIComponent(keyword);
				const res = await fetch('/api/profiles' + query);
				const data = await res.json();
				const rows = Array.isArray(data.results) ? data.results : [];
				currentRows = rows.filter(function (row) {
					return String(row.handle || '').toLowerCase().includes(keyword.toLowerCase());
				}).slice(0, 20);
				renderSuggestions(currentRows);
				setStatus(fmt(t('admin_status_matched_handles', 'Matched {count} handles'), { count: currentRows.length }));
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
				const isUpdate = currentMode === MODE_EDIT;
				const method = isUpdate ? 'PUT' : 'POST';
				const url = isUpdate ? '/api/profiles/' + editingId : '/api/profiles';

				setStatus(t('admin_status_submitting', 'Submitting...'));
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
								<option value="/dashboard" selected data-i18n="nav_star">Map</option>
								<option value="/wiki" data-i18n="nav_wiki">Fisting Wiki</option>
								<option value="/about" data-i18n="nav_about">About</option>
							</select>
							<div id="dashboardPageNavCustom" class="mobile-select-enhanced"></div>
						</div>
					</div>
					<nav class="top-nav">
						<a class="nav-btn" href="/" data-i18n="nav_ranking">Performers List</a>
						<a class="nav-btn" href="/admin" data-i18n="nav_add">Add new</a>
						<a class="nav-btn primary active" href="/dashboard" data-i18n="nav_star">Map</a>
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
			const GEO_CACHE_STORAGE_KEY = 'dashboard_geo_cache_v1';
			const GEO_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
			const GEO_MAX_CACHE_ENTRIES = 3000;
			const GEO_CONCURRENCY = 8;
			const geoCache = new Map();
			const map = L.map('map').setView([35.6812, 139.7671], 5);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 18,
				attribution: '&copy; OpenStreetMap contributors'
			}).addTo(map);
			const markerLayer = L.layerGroup().addTo(map);
			let selectedPerformer = null;

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
			function makeGeoKey(district, region, country) {
				return (String(district || '') + '|' + String(region || '') + '|' + String(country || '')).toLowerCase();
			}

			function loadGeoCacheFromStorage() {
				try {
					const raw = localStorage.getItem(GEO_CACHE_STORAGE_KEY);
					if (!raw) return;
					const parsed = JSON.parse(raw);
					if (!Array.isArray(parsed)) return;
					const now = Date.now();
					for (const entry of parsed) {
						if (!entry || typeof entry !== 'object') continue;
						const key = String(entry.key || '').trim();
						const lat = Number(entry.lat);
						const lon = Number(entry.lon);
						const ts = Number(entry.ts);
						if (!key) continue;
						if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
						if (!Number.isFinite(ts)) continue;
						if (now - ts > GEO_CACHE_TTL_MS) continue;
						geoCache.set(key, { lat: lat, lon: lon, ts: ts });
					}
				} catch {
					// ignore invalid local cache
				}
			}

			function persistGeoCacheToStorage() {
				try {
					const now = Date.now();
					const items = [];
					for (const [key, value] of geoCache.entries()) {
						const lat = Number(value && value.lat);
						const lon = Number(value && value.lon);
						const ts = Number(value && value.ts);
						if (!Number.isFinite(lat) || !Number.isFinite(lon) || !Number.isFinite(ts)) continue;
						if (now - ts > GEO_CACHE_TTL_MS) continue;
						items.push({ key: key, lat: lat, lon: lon, ts: ts });
					}
					items.sort(function (a, b) { return b.ts - a.ts; });
					const trimmed = items.slice(0, GEO_MAX_CACHE_ENTRIES);
					localStorage.setItem(GEO_CACHE_STORAGE_KEY, JSON.stringify(trimmed));
				} catch {
					// storage can fail in private mode/quota limits
				}
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

			async function geocode(district, region, country) {
				const key = makeGeoKey(district, region, country);
				const now = Date.now();
				const cached = geoCache.get(key);
				if (cached && Number.isFinite(Number(cached.lat)) && Number.isFinite(Number(cached.lon)) && Number.isFinite(Number(cached.ts))) {
					if (now - Number(cached.ts) <= GEO_CACHE_TTL_MS) {
						return { lat: Number(cached.lat), lon: Number(cached.lon) };
					}
				}
				const q = encodeURIComponent([district, region, country].filter(Boolean).join(', '));
				try {
					const res = await fetch('/api/geo/point?q=' + q);
					const data = await res.json();
					const point = data && data.point ? data.point : null;
					const normalized = point && Number.isFinite(Number(point.lat)) && Number.isFinite(Number(point.lon))
						? { lat: Number(point.lat), lon: Number(point.lon) }
						: null;
					if (normalized) {
						geoCache.set(key, { lat: normalized.lat, lon: normalized.lon, ts: now });
					}
					return normalized;
				} catch {
					return null;
				}
			}

			async function drawMap(rows) {
				markerLayer.clearLayers();
				setVisitButtonState(null);
				if (!rows.length) {
					return;
				}

				const uniqueLocations = new Map();
				for (const row of rows) {
					const district = (row.district || row.city) || 'Itabashi';
					const region = (row.region || row.province) || 'Tokyo';
					const country = row.country || 'Japan';
					const key = makeGeoKey(district, region, country);
					if (!uniqueLocations.has(key)) {
						uniqueLocations.set(key, { district: district, region: region, country: country });
					}
				}

				const tasks = Array.from(uniqueLocations.entries());
				let cursor = 0;
				const workerCount = Math.min(GEO_CONCURRENCY, tasks.length);
				if (tasks.length) {
					setStatus('Resolving map locations... (' + tasks.length + ')');
				}
				await Promise.all(Array.from({ length: workerCount }, async function () {
					while (cursor < tasks.length) {
						const current = cursor;
						cursor += 1;
						const pair = tasks[current];
						if (!pair) continue;
						const key = pair[0];
						const location = pair[1];
						const point = await geocode(location.district, location.region, location.country);
						if (point) {
							geoCache.set(key, { lat: Number(point.lat), lon: Number(point.lon), ts: Date.now() });
						}
					}
				}));
				persistGeoCacheToStorage();

				const bounds = [];
				const pointUsage = new Map();
				for (const row of rows) {
					const district = (row.district || row.city) || 'Itabashi';
					const region = (row.region || row.province) || 'Tokyo';
					const country = row.country || 'Japan';
					const point = geoCache.get(makeGeoKey(district, region, country));
					if (!point) continue;
					const pLat = Number(point.lat);
					const pLon = Number(point.lon);
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
				setStatus('');
			}

			document.getElementById('reloadBtn').addEventListener('click', loadData);
			countryFilterEl.addEventListener('change', loadData);
			if (visitPerformerBtn) {
				visitPerformerBtn.addEventListener('click', function () {
					if (!selectedPerformer || !selectedPerformer.profile_url) return;
					window.location.href = String(selectedPerformer.profile_url);
				});
			}

			(async function init() {
				loadGeoCacheFromStorage();
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
							<option value="/dashboard" data-i18n="nav_star">Map</option>
							<option value="/wiki" data-i18n="nav_wiki">Fisting Wiki</option>
							<option value="/about" selected data-i18n="nav_about">About</option>
						</select>
						<div id="aboutPageNavCustom" class="mobile-select-enhanced"></div>
					</div>
				</div>
				<nav class="top-nav">
					<a class="nav-btn" href="/" data-i18n="nav_ranking">Performers List</a>
					<a class="nav-btn" href="/admin" data-i18n="nav_add">Add new</a>
					<a class="nav-btn" href="/dashboard" data-i18n="nav_star">Map</a>
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
			.nav-btn.active { box-shadow: 0 6px 14px rgba(29, 155, 240, 0.28); }
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
				.mobile-nav-row { display: flex; width: auto; margin-left: auto; }
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
						<div class="mobile-nav-row">
							<select id="wikiPageNav" class="mobile-nav" aria-label="Page Navigation" onchange="if(this.value){window.location.href=this.value;}">
								<option value="/" data-i18n="nav_ranking">Performers List</option>
								<option value="/admin" data-i18n="nav_add">Add new</option>
								<option value="/dashboard" data-i18n="nav_star">Map</option>
								<option value="/wiki" selected data-i18n="nav_wiki">Fisting Wiki</option>
								<option value="/about" data-i18n="nav_about">About</option>
							</select>
							<div id="wikiPageNavCustom" class="mobile-select-enhanced"></div>
						</div>
					</div>
					<nav class="top-nav">
						<a class="nav-btn" href="/" data-i18n="nav_ranking">Performers List</a>
						<a class="nav-btn" href="/admin" data-i18n="nav_add">Add new</a>
						<a class="nav-btn" href="/dashboard" data-i18n="nav_star">Map</a>
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
							'<div class="post-meta">By ' + esc(row.author || 'fistingguide') + ' 闂傚倸鍊搁崐鎼佸磹瀹勬噴褰掑炊瑜夐弸鏍煛閸ャ儱鐏╃紒鎰殜閺岀喖鎮ч崼鐔哄嚒闂佸憡鍨规慨鎾煘閹达附鍋愰悗鍦Т椤ユ繄绱?ID #' + row.id + ' 闂傚倸鍊搁崐鎼佸磹瀹勬噴褰掑炊瑜夐弸鏍煛閸ャ儱鐏╃紒鎰殜閺岀喖鎮ч崼鐔哄嚒闂佸憡鍨规慨鎾煘閹达附鍋愰悗鍦Т椤ユ繄绱?Updated ' + esc(row.updated_at || row.created_at || '') + '</div>' +
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
				const deletePassword = window.prompt('Enter delete password to continue:');
				if (!deletePassword) {
					setStatus('Delete cancelled: password is required.');
					return;
				}

				const res = await fetch('/api/wiki/' + editingId, {
					method: 'DELETE',
					headers: { 'x-delete-password': deletePassword }
				});
				if (!res.ok) {
					const msg = await res.text();
					if (res.status === 403 && msg.indexOf('invalid delete password') !== -1) {
						window.alert('密码输入错误');
						return;
					}
					setStatus(msg ? 'Delete failed: ' + msg : 'Delete failed');
					return;
				}

				window.alert('Article deleted successfully.');
				resetForm();
				await loadRows();
			}

			async function deleteById(id) {
				if (!confirm('Delete article #' + id + '?')) return;
				const deletePassword = window.prompt('Enter delete password to continue:');
				if (!deletePassword) {
					setStatus('Delete cancelled: password is required.');
					return;
				}
				const res = await fetch('/api/wiki/' + id, {
					method: 'DELETE',
					headers: { 'x-delete-password': deletePassword }
				});
				if (!res.ok) {
					const msg = await res.text();
					if (res.status === 403 && msg.indexOf('invalid delete password') !== -1) {
						window.alert('密码输入错误');
						return;
					}
					setStatus(msg ? 'Delete failed: ' + msg : 'Delete failed');
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
				const select = document.getElementById('wikiPageNav');
				const mount = document.getElementById('wikiPageNavCustom');
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
					if (!event.target.closest('#wikiPageNavCustom')) closeMenu();
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
			.article-title-row {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 12px;
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
				.wrap { width: 100%; max-width: 100%; gap: 0; }
				.card {
					padding: 12px 0;
					border: 0;
					border-bottom: 1px solid var(--line);
					border-radius: 0;
					background: transparent;
					box-shadow: none;
				}
				.top-nav { display: none; }
				.mobile-nav-row { display: block; }
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
				.article h1 { font-size: 30px; }
				.article-body { font-size: 16px; }
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
			<section class="card head">
				<nav class="top-nav">
					<a class="nav-btn" href="/" data-i18n="nav_ranking">Performers List</a>
					<a class="nav-btn" href="/admin" data-i18n="nav_add">Add new</a>
					<a class="nav-btn" href="/dashboard" data-i18n="nav_star">Map</a>
					<a class="nav-btn primary active" href="/wiki" data-i18n="nav_wiki">Fisting Wiki</a>
					<a class="nav-btn" href="/about" data-i18n="nav_about">About</a>
				</nav>
				<div class="mobile-nav-row">
					<select class="mobile-nav" aria-label="Page Navigation" onchange="if(this.value){window.location.href=this.value;}">
						<option value="/" data-i18n="nav_ranking">Performers List</option>
						<option value="/admin" data-i18n="nav_add">Add new</option>
						<option value="/dashboard" data-i18n="nav_star">Map</option>
						<option value="/wiki" selected data-i18n="nav_wiki">Fisting Wiki</option>
						<option value="/about" data-i18n="nav_about">About</option>
					</select>
				</div>
			</section>
			<section class="card article">
				<div class="article-title-row">
					<h1>${title}</h1>
					${renderLanguageSwitcher("wikiArticleLangSwitch")}
				</div>
				<div class="meta"><span data-i18n="article_by">By</span> ${author} | <span data-i18n="article_updated">Updated</span> ${updated}</div>
				<div class="article-body">${content}</div>
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







