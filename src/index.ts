import {
	renderAdminPage,
	renderAboutPage,
	renderAuthorCallPage,
	renderDashboardPage,
	renderLeaderboardPage,
	renderListStarPage,
	type ProfileRecord,
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
	telegram?: unknown;
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
const BLOG_URL = "https://blog.fistingguide.workers.dev/";

type WikiPayload = {
	title?: unknown;
	content?: unknown;
	author?: unknown;
};

const SUPPORTED_UI_LANGS = ["en", "zh-CN", "zh-TW", "ja", "ko", "es", "pt", "th", "vi"] as const;
type UiLang = (typeof SUPPORTED_UI_LANGS)[number];

type SeoOptions = {
	title: string;
	description: string;
	pathname: string;
	robots?: "index,follow" | "noindex,nofollow";
	jsonLd?: Record<string, unknown>;
	locale?: string;
	siteName?: string;
	articlePublishedTime?: string;
	articleModifiedTime?: string;
	articleAuthor?: string;
};

type SeoPageKey = "ranking" | "admin" | "dashboard" | "about" | "wiki";
type SeoLocalePack = Record<SeoPageKey, { title: string; description: string }>;

const FEATURED_WIKI_ARTICLE_ID = 900001;
const FEATURED_WIKI_ARTICLE: WikiArticleRecord & {
	author_avatar?: string;
	author_handle?: string;
	author_url?: string;
	is_fixed?: boolean;
} = {
	id: FEATURED_WIKI_ARTICLE_ID,
	title: "拳交问题解答",
	content: `1.如何正确灌肠：
首先，酒店的淋浴头不推荐。淋浴头很脏而且金属头容易划破脆弱的肠道，建议用专用的灌肠喷头接到淋浴头上再进行灌肠。其次，我们要明确的是，并不是灌的越深越干净，初学者及不挑战深拳的不建议灌深，把二道口以下灌干净就好了。下面是推荐的灌肠过程：（1）脱掉裤子，排空粪便后，洗干净肛周。
（2）在肛门周围用润滑油或者石蜡油润滑，把灌肠管轻轻插入肛门2-3cm，慢慢打开水龙头，用接近体温的温水进行灌肠。
（3）感到肚子微微有点涨后，关闭水龙头，憋住3-5分钟，轻柔肚子，让水和粪便充分融合，再排出水和粪便。
（4）重复以上步骤直至无粪便排出，排出的水为清澈。
2.拳交推荐的润滑油：
推荐魔术粉，淘宝店铺有卖。推荐玩的前一天配置好，静置一晚能溶解更充分。用热水冲泡，按照2个瓶盖的粉配1瓶500ml水来配比，一定要充分大力混匀，没有白色粉末结晶后，静置一晚待气泡排出后可以使用。不建议任何带有舒缓，薄荷添加等的润滑液，使用这些润滑液会刺激肛门和肠道，导致“辣屁股”。不建议使用带有麻醉性质的舒缓膏。痛是人体重要的防御感觉，拳交过程中感到痛应根据情况充分润滑扩张，或者停止拳交。不顾及痛感暴力继续的，很可能受伤流血，甚至肛裂。
其他的食品级的起酥油，黑魂，云泥沙的也可以尝试。
3.玩拳后会变松吗，老了会收不回去被护工打吗
人的肛门受括约肌支配，成年人在未接受专业训练的情况下，肛门直径可以达到4.5cm，能进入4根手指，在进行专业训练扩肛后，局部括约肌可以达到10cm左右，一般小手拳攻的手直径在6.5cm-7cm，所以在充分扩张润滑后，进入一只手是不会损伤括约肌的。但是，括约肌就像一根橡皮筋，如果暴力进入，很容易把橡皮筋撑坏，导致肛裂，血流成河。正常玩拳不用担心，不玩的时候多做提肛训练，是不会导致肛门变松的。
4.玩拳应该准备什么
防水护理垫：避免油弄脏床单，方便清洁。
合适尺寸的手套：这个因人而异，有些拳受会觉得手套会有异物感。但是拳前无论是否佩戴手套，指甲一定要剪短并且用锉刀修整平滑，用手指对着自己大腿划，以没有任何尖锐感为主。个人习惯佩戴手套，用小一码的手套使其和手更加贴合，也可以保证自己手上小的倒刺或指甲不划伤拳受肛门，更安全。
灌肠：充分的肠道准备，干净的肠道是对彼此的尊重。粪便也会在后续拳交过程中产生很强的异物感，而且容易划伤肠道。
粘稠的润滑油：拳的过程中肠道会分泌肠液冲淡润滑油，推荐使用稍粘的润滑油。过稀的润滑油起不到润滑效果，容易受伤。
辅助用品（用来放松身体的）：按拳受个人体验选择。
适宜的室温、柔和的灯光：适宜温暖的房间温度和灯光可以让拳受身体更容易放松下来，使拳交过程更顺利。
尺寸合适的假阳具：可以作为扩张过程中的辅助。
充分的前戏：拳交是个互动的过程，要在前面充分建立起拳攻拳受间的信任，同时通过前戏增加情趣，让拳受更好的放松下来。
体位：扩开过程中，推荐胸膝位，就是在拳片中经常看到的跪着拳。双腿跪在床边，尽可能把屁股抬高，头贴到床上，手自然下垂。这个体位更容易使肛门放松。
5.拳会传染艾滋等传染病吗
不会。艾滋病毒在油里无法存活。
那么另外的传染病比如尖锐湿疣，HPV病毒是有可能通过性接触传播的，包括但不限于性交，肛交和口交。在拳交过程中，无法避免会有肠道细小黏膜的破损，如果再加上拳攻手上有破损，是有几率感染上的，也提醒大家注意个人防护安全。

作者简介是：玩拳十年的小手拳攻，也是一个刚毕业的医生。爱好rubber乳胶，喜欢穿着胶拳逼，另外还玩穿刺，深喉，喜欢玩有趣的，欢迎私信约拳。`,
	author: "皮卡丘",
	created_at: "2026-04-08T00:00:00.000Z",
	updated_at: "2026-04-08T00:00:00.000Z",
	author_avatar: "https://pbs.twimg.com/profile_images/1550105430507995138/nf8qq7c8_400x400.jpg",
	author_handle: "@fisterloving",
	author_url: "https://x.com/fisterloving",
	is_fixed: true,
};

FEATURED_WIKI_ARTICLE.title = "拳交问题解答";
FEATURED_WIKI_ARTICLE.author = "皮卡丘";
FEATURED_WIKI_ARTICLE.content = `# 如何正确灌肠：
首先，酒店的淋浴头不推荐。淋浴头很脏而且金属头容易划破脆弱的肠道，建议用专用的灌肠喷头接到淋浴头上再进行灌肠。其次，我们要明确的是，并不是灌的越深越干净，初学者及不挑战深拳的不建议灌深，把二道口以下灌干净就好了。下面是推荐的灌肠过程：
1. 脱掉裤子，排空粪便后，洗干净肛周。
2. 在肛门周围用润滑油或者石蜡油润滑，把灌肠管轻轻插入肛门2-3cm，慢慢打开水龙头，用接近体温的温水进行灌肠。
3. 感到肚子微微有点涨后，关闭水龙头，憋住3-5分钟，轻柔肚子，让水和粪便充分融合，再排出水和粪便。
4. 重复以上步骤直至无粪便排出，排出的水为清澈。

# 拳交推荐的润滑油：
推荐魔术粉，淘宝店铺有卖。推荐玩的前一天配置好，静置一晚能溶解更充分。用热水冲泡，按照2个瓶盖的粉配1瓶500ml水来配比，一定要充分大力混匀，没有白色粉末结晶后，静置一晚待气泡排出后可以使用。不建议任何带有舒缓，薄荷添加等的润滑液，使用这些润滑液会刺激肛门和肠道，导致“辣屁股”。不建议使用带有麻醉性质的舒缓膏。痛是人体重要的防御感觉，拳交过程中感到痛应根据情况充分润滑扩张，或者停止拳交。不顾及痛感暴力继续的，很可能受伤流血，甚至肛裂。
其他的食品级的起酥油，黑魂，云泥沙的也可以尝试。

# 玩拳后会变松吗，老了会收不回去被护工打吗
人的肛门受括约肌支配，成年人在未接受专业训练的情况下，肛门直径可以达到4.5cm，能进入4根手指，在进行专业训练扩肛后，局部括约肌可以达到10cm左右，一般小手拳攻的手直径在6.5cm-7cm，所以在充分扩张润滑后，进入一只手是不会损伤括约肌的。但是，括约肌就像一根橡皮筋，如果暴力进入，很容易把橡皮筋撑坏，导致肛裂，血流成河。正常玩拳不用担心，不玩的时候多做提肛训练，是不会导致肛门变松的。

# 玩拳应该准备什么
1. 防水护理垫：避免油弄脏床单，方便清洁。
2. 合适尺寸的手套：这个因人而异，有些拳受会觉得手套会有异物感。但是拳前无论是否佩戴手套，指甲一定要剪短并且用锉刀修整平滑，用手指对着自己大腿划，以没有任何尖锐感为主。个人习惯佩戴手套，用小一码的手套使其和手更加贴合，也可以保证自己手上小的倒刺或指甲不划伤拳受肛门，更安全。
3. 灌肠：充分的肠道准备，干净的肠道是对彼此的尊重。粪便也会在后续拳交过程中产生很强的异物感，而且容易划伤肠道。
4. 粘稠的润滑油：拳的过程中肠道会分泌肠液冲淡润滑油，推荐使用稍粘的润滑油。过稀的润滑油起不到润滑效果，容易受伤。
5. 辅助用品（用来放松身体的）：按拳受个人体验选择。
6. 适宜的室温、柔和的灯光：适宜温暖的房间温度和灯光可以让拳受身体更容易放松下来，使拳交过程更顺利。
7. 尺寸合适的假阳具：可以作为扩张过程中的辅助。
8. 充分的前戏：拳交是个互动的过程，要在前面充分建立起拳攻拳受间的信任，同时通过前戏增加情趣，让拳受更好的放松下来。
9. 体位：扩开过程中，推荐胸膝位，就是在拳片中经常看到的跪着拳。双腿跪在床边，尽可能把屁股抬高，头贴到床上，手自然下垂。这个体位更容易使肛门放松。

# 拳会传染艾滋等传染病吗
不会。艾滋病毒在油里无法存活。
那么另外的传染病比如尖锐湿疣，HPV病毒是有可能通过性接触传播的，包括但不限于性交，肛交和口交。在拳交过程中，无法避免会有肠道细小黏膜的破损，如果再加上拳攻手上有破损，是有几率感染上的，也提醒大家注意个人防护安全。

作者简介是：玩拳十年的小手拳攻，也是一个刚毕业的医生。爱好rubber乳胶，喜欢穿着胶拳逼，另外还玩穿刺，深喉，喜欢玩有趣的，欢迎私信约拳。`;

const LONG_GAME_WIKI_ARTICLE_ID = 900002;
const LONG_GAME_WIKI_ARTICLE: WikiArticleRecord & {
	author_avatar?: string;
	author_handle?: string;
	author_url?: string;
	is_fixed?: boolean;
} = {
	id: LONG_GAME_WIKI_ARTICLE_ID,
	title: "The Long Game",
	content: `# The Long Game:
What 20 Years of Fisting Taught Me About Safety, Patience, and Myself

People ask me all the time how I got started. The honest answer is that I got started badly. No guidance, no community, no one telling me to slow down. I learned through trial and error, and some of those errors left marks.

That's why I talk about this stuff now. On my podcast Brolapse, in interviews, in my book Deeper: An Anti-Memoir, and in every conversation I have with someone who's curious. Because the information I didn't have could have saved me a lot of pain, and not the fun kind.

Here's what I wish someone had told me on day one: this is not a race. Fisting rewards patience more than any other sexual practice I know. Your body is not a problem to be solved. It's a partner in the experience, and it will tell you everything you need to know if you listen.

Start with good lube, and lots of it. J-Lube, X-Lube, or a quality water-based gel. Silicone has its place, but for depth work, nothing beats a thick water-based formula you can reapply freely. Never use numbing agents. Pain is information. If something hurts, that's your body saying stop, reassess, add more lube, or try a different angle. Numbing that signal is how injuries happen.

Preparation matters. A clean body is a confident body, and confidence is half the game. Take your time with your enema routine. Warm water, not hot. Go slow. Don't rush it because you're eager to get to the main event. The prep is part of the practice.

And breathe. I cannot say this enough. Deep, steady breathing is the single most important technique in fisting. More than any trick with your hands, more than any toy progression, your breath is what opens you up. When you hold your breath, your body tenses. When you breathe, it yields.

I've been doing this for over two decades. I've been on Howard Stern. I've been called names I wear with pride. I wrote an entire book about the life that this practice shaped. And after all of it, the advice I come back to every single time is the simplest: slow down, breathe, communicate, and respect the body you're in.

Whether you're just starting out or you've been at this for years, the fundamentals never change. Safety is not the opposite of intensity. It's what makes real intensity possible.

作者简介：Brolapse  • Legends of Fisting  • Sound Initiative
Deeper  • Massive blooms  & pig-level ruin`,
	author: "HungerFF",
	created_at: "2026-04-09T00:00:00.000Z",
	updated_at: "2026-04-09T00:00:00.000Z",
	author_avatar: "https://pbs.twimg.com/profile_images/2019665387885834240/UqcDa_6b_400x400.jpg",
	author_handle: "@HungerFF",
	author_url: "https://x.com/HungerFF",
	is_fixed: true,
};

const SEO_I18N: Record<UiLang, SeoLocalePack> = {
	en: {
		ranking: {
			title: "Creator Ranking",
			description:
				"Global directory and ranking for adult gay fisting creators and profiles, with multilingual browsing and community wiki.",
		},
		admin: {
			title: "Database Admin Panel",
			description: "Administrative panel for profile and wiki management.",
		},
		dashboard: {
			title: "Data Dashboard",
			description: "Explore the global community map of adult creator profiles.",
		},
		about: {
			title: "About",
			description: "About this multilingual adult community project and contact information.",
		},
		wiki: {
			title: "Fisting Wiki",
			description: "Multilingual wiki with adult harm-reduction guides, community knowledge, and practical resources.",
		},
	},
	"zh-CN": {
		ranking: {
			title: "创作者排行",
			description: "面向全球成年社群的创作者目录与排行，支持多语言浏览与社区 Wiki。",
		},
		admin: {
			title: "数据库管理面板",
			description: "用于管理资料与 Wiki 内容的后台页面。",
		},
		dashboard: {
			title: "数据地图",
			description: "查看全球成年社群创作者资料分布地图。",
		},
		about: {
			title: "关于",
			description: "了解这个多语言成年社群项目及联系方式。",
		},
		wiki: {
			title: "Fisting Wiki",
			description: "多语言成年社群 Wiki，聚合安全与知识内容。",
		},
	},
	"zh-TW": {
		ranking: {
			title: "創作者排行",
			description: "面向全球成年社群的創作者目錄與排行，支援多語言瀏覽與社群 Wiki。",
		},
		admin: {
			title: "資料庫管理面板",
			description: "用於管理資料與 Wiki 內容的後台頁面。",
		},
		dashboard: {
			title: "資料地圖",
			description: "查看全球成年社群創作者資料分佈地圖。",
		},
		about: {
			title: "關於",
			description: "了解這個多語言成年社群專案與聯絡方式。",
		},
		wiki: {
			title: "Fisting Wiki",
			description: "多語言成年社群 Wiki，彙整安全與知識內容。",
		},
	},
	ja: {
		ranking: {
			title: "クリエイターランキング",
			description: "成人向けコミュニティのグローバルなクリエイターディレクトリとランキング。",
		},
		admin: {
			title: "管理パネル",
			description: "プロフィールと Wiki 記事を管理するための管理ページ。",
		},
		dashboard: {
			title: "データマップ",
			description: "世界の成人コミュニティプロフィール分布を地図で確認できます。",
		},
		about: {
			title: "このサイトについて",
			description: "多言語対応の成人コミュニティプロジェクトの紹介と連絡先。",
		},
		wiki: {
			title: "Fisting Wiki",
			description: "成人向けの安全情報とコミュニティ知識をまとめた多言語 Wiki。",
		},
	},
	ko: {
		ranking: {
			title: "크리에이터 랭킹",
			description: "성인 커뮤니티를 위한 글로벌 크리에이터 디렉터리 및 랭킹.",
		},
		admin: {
			title: "관리 패널",
			description: "프로필과 위키 콘텐츠를 관리하는 관리자 페이지입니다.",
		},
		dashboard: {
			title: "데이터 지도",
			description: "글로벌 성인 커뮤니티 프로필 분포를 지도에서 확인하세요.",
		},
		about: {
			title: "소개",
			description: "다국어 성인 커뮤니티 프로젝트 소개 및 연락 정보.",
		},
		wiki: {
			title: "Fisting Wiki",
			description: "성인 안전 정보와 커뮤니티 지식을 담은 다국어 위키.",
		},
	},
	es: {
		ranking: {
			title: "Ranking de Creadores",
			description: "Directorio y ranking global para perfiles adultos, con navegación multilingüe y wiki comunitaria.",
		},
		admin: {
			title: "Panel de Administración",
			description: "Panel administrativo para gestionar perfiles y contenido wiki.",
		},
		dashboard: {
			title: "Mapa de Datos",
			description: "Explora el mapa global de perfiles de la comunidad adulta.",
		},
		about: {
			title: "Acerca de",
			description: "Información del proyecto comunitario multilingüe para adultos y contacto.",
		},
		wiki: {
			title: "Fisting Wiki",
			description: "Wiki multilingüe con guías de reducción de riesgos y conocimiento comunitario para adultos.",
		},
	},
	pt: {
		ranking: {
			title: "Ranking de Criadores",
			description: "Diretorio e ranking global para perfis adultos, com navegacao multilingue e wiki da comunidade.",
		},
		admin: {
			title: "Painel de Administracao",
			description: "Painel administrativo para gerenciar perfis e conteudo da wiki.",
		},
		dashboard: {
			title: "Mapa de Dados",
			description: "Explore o mapa global de perfis da comunidade adulta.",
		},
		about: {
			title: "Sobre",
			description: "Informacoes sobre o projeto comunitario adulto multilingue e contato.",
		},
		wiki: {
			title: "Fisting Wiki",
			description: "Wiki multilingue com guias de reducao de riscos e conhecimento da comunidade adulta.",
		},
	},
	th: {
		ranking: {
			title: "อันดับครีเอเตอร์",
			description: "ไดเรกทอรีและอันดับครีเอเตอร์สำหรับชุมชนผู้ใหญ่แบบหลายภาษาในระดับโลก",
		},
		admin: {
			title: "แผงผู้ดูแลระบบ",
			description: "แผงจัดการโปรไฟล์และเนื้อหา Wiki",
		},
		dashboard: {
			title: "แผนที่ข้อมูล",
			description: "สำรวจแผนที่โปรไฟล์ชุมชนผู้ใหญ่จากทั่วโลก",
		},
		about: {
			title: "เกี่ยวกับ",
			description: "ข้อมูลโครงการชุมชนผู้ใหญ่หลายภาษาและช่องทางติดต่อ",
		},
		wiki: {
			title: "Fisting Wiki",
			description: "วิกิหลายภาษาสำหรับความรู้ชุมชนและข้อมูลความปลอดภัยสำหรับผู้ใหญ่",
		},
	},
	vi: {
		ranking: {
			title: "Bảng xếp hạng Creator",
			description: "Danh bạ và bảng xếp hạng toàn cầu cho cộng đồng người lớn, hỗ trợ đa ngôn ngữ và wiki.",
		},
		admin: {
			title: "Bảng quản trị",
			description: "Trang quản trị để quản lý hồ sơ và nội dung wiki.",
		},
		dashboard: {
			title: "Bản đồ dữ liệu",
			description: "Khám phá bản đồ phân bố hồ sơ cộng đồng người lớn trên toàn cầu.",
		},
		about: {
			title: "Giới thiệu",
			description: "Thông tin về dự án cộng đồng người lớn đa ngôn ngữ và liên hệ.",
		},
		wiki: {
			title: "Fisting Wiki",
			description: "Wiki đa ngôn ngữ về kiến thức cộng đồng và nội dung an toàn cho người lớn.",
		},
	},
};

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function escapeXml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}

function getOrigin(url: URL): string {
	return `${url.protocol}//${url.host}`;
}

function buildHreflangTags(origin: string, pathname: string): string {
	const tags = SUPPORTED_UI_LANGS.map((lang: UiLang) => {
		const href = new URL(pathname, origin);
		href.searchParams.set("lang", lang);
		return `<link rel="alternate" hreflang="${escapeHtml(lang)}" href="${escapeHtml(href.toString())}" />`;
	});
	const xDefaultHref = new URL(pathname, origin).toString();
	return `${tags.join("\n\t\t")}\n\t\t<link rel="alternate" hreflang="x-default" href="${escapeHtml(xDefaultHref)}" />`;
}

function normalizeUiLang(value: string | null | undefined): UiLang | null {
	if (!value) return null;
	const raw = value.trim();
	if (!raw) return null;
	const lower = raw.toLowerCase();
	if (lower === "zh-cn" || lower === "zh-hans") return "zh-CN";
	if (lower === "zh-tw" || lower === "zh-hk" || lower === "zh-hant") return "zh-TW";
	const direct = SUPPORTED_UI_LANGS.find((lang) => lang.toLowerCase() === lower);
	if (direct) return direct;
	const base = lower.split("-")[0];
	const byBase = SUPPORTED_UI_LANGS.find((lang) => lang.toLowerCase() === base);
	return byBase || null;
}

function pickUiLang(url: URL, request: Request): UiLang {
	const fromUrl = normalizeUiLang(url.searchParams.get("lang"));
	if (fromUrl) return fromUrl;
	const acceptLanguage = request.headers.get("accept-language") || "";
	for (const part of acceptLanguage.split(",")) {
		const token = part.split(";")[0]?.trim();
		const normalized = normalizeUiLang(token);
		if (normalized) return normalized;
	}
	return "en";
}

function pageSeo(lang: UiLang, page: SeoPageKey): { title: string; description: string } {
	const pack = SEO_I18N[lang] || SEO_I18N.en;
	return pack[page] || SEO_I18N.en[page];
}

function toOgLocale(lang: UiLang): string {
	const map: Record<UiLang, string> = {
		en: "en_US",
		"zh-CN": "zh_CN",
		"zh-TW": "zh_TW",
		ja: "ja_JP",
		ko: "ko_KR",
		es: "es_ES",
		pt: "pt_BR",
		th: "th_TH",
		vi: "vi_VN",
	};
	return map[lang] || "en_US";
}

function normalizeTextSnippet(value: string, maxLen: number): string {
	const collapsed = value.replace(/\s+/g, " ").trim();
	if (!collapsed) return "";
	if (collapsed.length <= maxLen) return collapsed;
	return `${collapsed.slice(0, Math.max(0, maxLen - 1)).trim()}…`;
}

function articleFallbackDescription(lang: UiLang): string {
	const fallbackByLang: Record<UiLang, string> = {
		en: "Adult community wiki article.",
		"zh-CN": "成人社群 Wiki 文章。",
		"zh-TW": "成人社群 Wiki 文章。",
		ja: "成人コミュニティ向けの Wiki 記事です。",
		ko: "성인 커뮤니티 위키 문서입니다.",
		es: "Artículo de la wiki de la comunidad adulta.",
		pt: "Artigo da wiki da comunidade adulta.",
		th: "บทความวิกิของชุมชนผู้ใหญ่",
		vi: "Bài viết wiki của cộng đồng người lớn.",
	};
	return fallbackByLang[lang] || fallbackByLang.en;
}

function injectSeoTags(html: string, origin: string, seo: SeoOptions): string {
	if (!html.includes("</head>")) return html;
	const canonical = new URL(seo.pathname, origin).toString();
	const robots = seo.robots || "index,follow";
	const ogType = seo.pathname.startsWith("/wiki/article/") ? "article" : "website";
	const jsonLdBlock = seo.jsonLd
		? `\n\t\t<script type="application/ld+json">${JSON.stringify(seo.jsonLd).replaceAll("<", "\\u003c")}</script>`
		: "";
	const articleMetaBlock =
		ogType === "article"
			? [
					seo.articlePublishedTime
						? `<meta property="article:published_time" content="${escapeHtml(seo.articlePublishedTime)}" />`
						: "",
					seo.articleModifiedTime
						? `<meta property="article:modified_time" content="${escapeHtml(seo.articleModifiedTime)}" />`
						: "",
					seo.articleAuthor ? `<meta property="article:author" content="${escapeHtml(seo.articleAuthor)}" />` : "",
				]
					.filter(Boolean)
					.join("\n\t\t")
			: "";
	const tags = `
		<link rel="icon" type="image/png" href="/assets/mobile-carousel/logo.png" />
		<link rel="shortcut icon" type="image/png" href="/assets/mobile-carousel/logo.png" />
		<meta name="description" content="${escapeHtml(seo.description)}" />
		<meta name="robots" content="${escapeHtml(robots)}" />
		<link rel="canonical" href="${escapeHtml(canonical)}" />
		${buildHreflangTags(origin, seo.pathname)}
		<meta property="og:site_name" content="${escapeHtml(seo.siteName || "Fisting Guide")}" />
		<meta property="og:locale" content="${escapeHtml(seo.locale || "en_US")}" />
		<meta property="og:type" content="${escapeHtml(ogType)}" />
		<meta property="og:title" content="${escapeHtml(seo.title)}" />
		<meta property="og:description" content="${escapeHtml(seo.description)}" />
		<meta property="og:url" content="${escapeHtml(canonical)}" />
		<meta name="twitter:card" content="summary" />
		<meta name="twitter:title" content="${escapeHtml(seo.title)}" />
		<meta name="twitter:description" content="${escapeHtml(seo.description)}" />
		${articleMetaBlock}${jsonLdBlock}
	`;
	return html.replace("</head>", `${tags}\n\t</head>`);
}

function htmlResponse(html: string, origin: string, seo: SeoOptions): Response {
	const output = injectSeoTags(html, origin, seo);
	const headers: Record<string, string> = {
		"content-type": "text/html; charset=UTF-8",
	};
	if (seo.robots === "noindex,nofollow") {
		headers["x-robots-tag"] = "noindex, nofollow";
	}
	return new Response(output, {
		headers,
	});
}

function buildRobotsTxt(origin: string): string {
	return [
		"User-agent: *",
		"Allow: /",
		"Disallow: /admin",
		"Disallow: /api/",
		`Sitemap: ${origin}/sitemap.xml`,
	].join("\n");
}

function buildSitemapXml(origin: string): string {
	const staticPages = ["/", "/list-star", "/author-call", "/about", "/dashboard"];
	const staticUrls = staticPages.map(
		(pathname) =>
			`  <url><loc>${escapeXml(new URL(pathname, origin).toString())}</loc><changefreq>daily</changefreq></url>`,
	);
	return [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...staticUrls,
		`</urlset>`,
	].join("\n");
}

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

function json(data: unknown, status = 200, extraHeaders?: HeadersInit): Response {
	const headers = new Headers({
		"content-type": "application/json; charset=UTF-8",
		"x-robots-tag": "noindex, nofollow",
	});
	if (extraHeaders) {
		const append = new Headers(extraHeaders);
		append.forEach((value, key) => headers.set(key, value));
	}
	return new Response(JSON.stringify(data), {
		status,
		headers,
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
let seedProfilesPromise: Promise<void> | null = null;

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

function ensureSeededOnce(db: D1Database): Promise<void> {
	if (!seedProfilesPromise) {
		seedProfilesPromise = ensureSeeded(db).catch((error) => {
			seedProfilesPromise = null;
			throw error;
		});
	}
	return seedProfilesPromise;
}

async function ensureWikiSeeded(db: D1Database): Promise<void> {
	try {
		await db
			.prepare("DELETE FROM wiki_articles WHERE lower(title) IN ('for test 1', 'for test 2', 'for test 3')")
			.run();

		const row = await db.prepare("SELECT COUNT(*) AS total FROM wiki_articles").first<{ total: number | string }>();
		const total = Number(row?.total ?? 0);
		if (total > 0) {
			return;
		}
		return;
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
		limit?: number;
		offset?: number;
	},
): Promise<ProfileRecord[]> {
	const { whereClause, binds } = buildProfileFilters(params);
	const pageSql =
		typeof params.limit === "number" ? "\n\t\tLIMIT ?\n\t\tOFFSET ?" : "";
	const sql = `
		SELECT id, name, handle, telegram, bio, profile_url, avatar, sexual_orientation, followers_count, country,
			province AS region, city AS district, created_at
		FROM profiles
		${whereClause}
		ORDER BY followers_count DESC, id ASC
		${pageSql}
	`;
	const bindValues =
		typeof params.limit === "number" ? [...binds, params.limit, params.offset ?? 0] : binds;
	const stmt = bindValues.length > 0 ? db.prepare(sql).bind(...bindValues) : db.prepare(sql);
	const { results } = await stmt.all<ProfileRecord>();
	return results ?? [];
}

function buildProfileFilters(params: {
	keyword?: string;
	country?: string;
	handle?: string;
}): { whereClause: string; binds: unknown[] } {
	const conditions: string[] = [];
	const binds: unknown[] = [];
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
	return { whereClause, binds };
}

async function queryCountries(db: D1Database): Promise<string[]> {
	const { results } = await db
		.prepare(
			`SELECT DISTINCT country
			 FROM profiles
			 WHERE country IS NOT NULL AND country <> ''
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
	const { whereClause, binds } = buildProfileFilters({ country: params.country });
	const countSql = `SELECT COUNT(*) AS total FROM profiles${whereClause}`;
	const countStmt = binds.length > 0 ? db.prepare(countSql).bind(...binds) : db.prepare(countSql);
	const row = await countStmt.first<{ total: number | string }>();
	const poolSize = Number(row?.total ?? 0);
	if (poolSize === 0) {
		return { result: null, poolSize: 0, slot: null, nextSwitchAt: null };
	}

	const nowUnixSeconds = Math.floor(Date.now() / 1000);
	const { slot, index, nextSwitchAt } = computePinnedIndex(poolSize, nowUnixSeconds);
	const pickSql = `
		SELECT id, name, handle, telegram, bio, profile_url, avatar, sexual_orientation, followers_count, country,
			province AS region, city AS district, created_at
		FROM profiles
		${whereClause}
		ORDER BY followers_count DESC, id ASC
		LIMIT 1 OFFSET ?
	`;
	const pickStmt =
		binds.length > 0 ? db.prepare(pickSql).bind(...binds, index) : db.prepare(pickSql).bind(index);
	const selected = await pickStmt.first<ProfileRecord>();
	return {
		result: selected ?? null,
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
		telegram: toText(payload.telegram),
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
		const origin = getOrigin(url);
		const uiLang = pickUiLang(url, request);
		const method = request.method.toUpperCase();
		const idMatch = pathname.match(/^\/api\/profiles\/(\d+)$/);

		if (method === "GET" && pathname === "/robots.txt") {
			return new Response(buildRobotsTxt(origin), {
				headers: {
					"content-type": "text/plain; charset=UTF-8",
				},
			});
		}

		if (method === "GET" && pathname === "/sitemap.xml") {
			return new Response(buildSitemapXml(origin), {
				headers: {
					"content-type": "application/xml; charset=UTF-8",
				},
			});
		}

		if (method === "GET" && (pathname === "/wiki" || pathname.startsWith("/wiki/article/"))) {
			return Response.redirect(BLOG_URL, 301);
		}

		if (pathname === "/api/wiki" || pathname.startsWith("/api/wiki/")) {
			return json(
				{
					error: "wiki api has been removed",
					moved_to: BLOG_URL,
				},
				410,
			);
		}

		if (
			pathname === "/" ||
			pathname === "/admin" ||
			pathname === "/admin/create" ||
			pathname === "/admin/edit" ||
			pathname === "/admin/delete" ||
			pathname === "/dashboard" ||
			pathname === "/list-star" ||
			pathname === "/author-call" ||
			pathname === "/about" ||
			pathname.startsWith("/api/profiles")
		) {
			await ensureSeededOnce(env.DB);
		}

		if (method === "GET" && pathname === "/assets/leaflet.css") {
			return proxyTextAsset("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", "text/css; charset=UTF-8");
		}

		if (method === "GET" && pathname === "/assets/leaflet.js") {
			return proxyTextAsset("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", "application/javascript; charset=UTF-8");
		}

		if (method === "GET" && pathname === "/") {
			const rows = await queryProfiles(env.DB, {});
			const seo = pageSeo(uiLang, "ranking");
			return htmlResponse(renderLeaderboardPage(rows), origin, {
				title: seo.title,
				description: seo.description,
				pathname: "/",
				locale: toOgLocale(uiLang),
				siteName: "Fisting Guide",
			});
		}

		if (method === "GET" && pathname === "/admin") {
			const seo = pageSeo(uiLang, "admin");
			return htmlResponse(renderAdminPage("home"), origin, {
				title: seo.title,
				description: seo.description,
				pathname: "/admin",
				robots: "noindex,nofollow",
				locale: toOgLocale(uiLang),
				siteName: "Fisting Guide",
			});
		}

		if (method === "GET" && pathname === "/admin/create") {
			const seo = pageSeo(uiLang, "admin");
			return htmlResponse(renderAdminPage("create"), origin, {
				title: seo.title,
				description: seo.description,
				pathname: "/admin/create",
				robots: "noindex,nofollow",
				locale: toOgLocale(uiLang),
				siteName: "Fisting Guide",
			});
		}

		if (method === "GET" && pathname === "/admin/edit") {
			const seo = pageSeo(uiLang, "admin");
			return htmlResponse(renderAdminPage("edit"), origin, {
				title: seo.title,
				description: seo.description,
				pathname: "/admin/edit",
				robots: "noindex,nofollow",
				locale: toOgLocale(uiLang),
				siteName: "Fisting Guide",
			});
		}

		if (method === "GET" && pathname === "/admin/delete") {
			const seo = pageSeo(uiLang, "admin");
			return htmlResponse(renderAdminPage("delete"), origin, {
				title: seo.title,
				description: seo.description,
				pathname: "/admin/delete",
				robots: "noindex,nofollow",
				locale: toOgLocale(uiLang),
				siteName: "Fisting Guide",
			});
		}

		if (method === "GET" && pathname === "/dashboard") {
			const seo = pageSeo(uiLang, "dashboard");
			return htmlResponse(renderDashboardPage(), origin, {
				title: seo.title,
				description: seo.description,
				pathname: "/dashboard",
				locale: toOgLocale(uiLang),
				siteName: "Fisting Guide",
			});
		}

		if (method === "GET" && pathname === "/about") {
			const seo = pageSeo(uiLang, "about");
			return htmlResponse(renderAboutPage(), origin, {
				title: seo.title,
				description: seo.description,
				pathname: "/about",
				locale: toOgLocale(uiLang),
				siteName: "Fisting Guide",
			});
		}

		if (method === "GET" && pathname === "/list-star") {
			return htmlResponse(renderListStarPage(), origin, {
				title: "List Star",
				description: "List Star campaign details and how to join.",
				pathname: "/list-star",
				locale: toOgLocale(uiLang),
				siteName: "Fisting Guide",
			});
		}

		if (method === "GET" && pathname === "/author-call") {
			return htmlResponse(renderAuthorCallPage(), origin, {
				title: "文章征稿",
				description: "文章征稿专题页面",
				pathname: "/author-call",
				locale: toOgLocale(uiLang),
				siteName: "Fisting Guide",
			});
		}

		if (method === "GET" && pathname === "/api/profiles") {
			const cacheKey = new Request(url.toString(), request);
			const cached = await caches.default.match(cacheKey);
			if (cached) {
				return cached;
			}
			const keyword = url.searchParams.get("keyword")?.trim() ?? "";
			const country = url.searchParams.get("country")?.trim() ?? "";
			const handle = url.searchParams.get("handle")?.trim() ?? "";
			const limitRaw = (url.searchParams.get("limit") || "").trim();
			const offsetRaw = (url.searchParams.get("offset") || "").trim();
			const parsedLimit = Number(limitRaw);
			const parsedOffset = Number(offsetRaw);
			const limit =
				limitRaw && Number.isFinite(parsedLimit) && parsedLimit > 0
					? Math.min(200, Math.floor(parsedLimit))
					: undefined;
			const offset =
				typeof limit === "number" && Number.isFinite(parsedOffset) && parsedOffset >= 0
					? Math.floor(parsedOffset)
					: 0;
			const rows = await queryProfiles(env.DB, { keyword, country, handle, limit, offset });
			const payload =
				typeof limit === "number"
					? {
							results: rows,
							pagination: {
								limit,
								offset,
								hasMore: rows.length === limit,
							},
						}
					: { results: rows };
			const response = json(payload, 200, {
				"cache-control": "public, max-age=15, s-maxage=15",
				"cdn-cache-control": "public, max-age=15",
				vary: "accept-encoding",
			});
			ctx.waitUntil(caches.default.put(cacheKey, response.clone()));
			return response;
		}

		if (method === "GET" && pathname === "/api/profiles/pinned") {
			const cacheKey = new Request(url.toString(), request);
			const cached = await caches.default.match(cacheKey);
			if (cached) {
				return cached;
			}
			const country = url.searchParams.get("country")?.trim() ?? "";
			const pinned = await queryPinnedProfile(env.DB, { country });
			const response = json(pinned, 200, {
				"cache-control": "public, max-age=30, s-maxage=30",
				"cdn-cache-control": "public, max-age=30",
				vary: "accept-encoding",
			});
			ctx.waitUntil(caches.default.put(cacheKey, response.clone()));
			return response;
		}

		if (method === "GET" && pathname === "/api/countries") {
			const cacheKey = new Request(url.toString(), request);
			const cached = await caches.default.match(cacheKey);
			if (cached) {
				return cached;
			}
			const countries = await queryCountries(env.DB);
			const response = json(
				{ results: countries },
				200,
				{
					"cache-control": "public, max-age=30, s-maxage=30",
					"cdn-cache-control": "public, max-age=30",
					vary: "accept-encoding",
				},
			);
			ctx.waitUntil(caches.default.put(cacheKey, response.clone()));
			return response;
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
						name, handle, telegram, bio, profile_url, avatar, sexual_orientation, followers_count, country, province, city
					) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				)
					.bind(
						input.name,
						input.handle,
						input.telegram,
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
						 SET name = ?, handle = ?, telegram = ?, bio = ?, profile_url = ?, avatar = ?, sexual_orientation = ?, followers_count = ?, country = ?, province = ?, city = ?
						 WHERE id = ?`,
					)
						.bind(
							input.name,
							input.handle,
							input.telegram,
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

		return new Response("Not Found", { status: 404 });
	},
} satisfies ExportedHandler<RuntimeEnv>;

