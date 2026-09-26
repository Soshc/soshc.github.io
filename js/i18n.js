// English lives in the HTML; this file holds the Arabic and swaps it in (plus RTL) on demand.
(() => {
  const AR = {
    // page
    title: 'ياسر العلقي — معرض الأعمال',
    description: 'ياسر العلقي (MadeBySoshi) — مطوّر ألعاب مستقل وفنان ثلاثي الأبعاد. محطة الجنوب، وThe House Wants More، وتصميم البيئات على Unreal Engine 5.8.',

    // nav
    nav_janob: 'محطة الجنوب',
    nav_env: 'تصميم البيئات',
    nav_skills: 'المهارات',
    nav_contact: 'تواصل معي',
    aria_menu: 'القائمة',
    aria_scroll: 'انزل للأسفل',
    aria_close: 'إغلاق',
    aria_prev: 'السابق',
    aria_next: 'التالي',

    // hero
    hero_name: 'ياسر العلقي',
    hero_role: 'مطوّر ألعاب مستقل وفنان ثلاثي الأبعاد',
    hero_teaser: '&#9654;&ensp;شاهد العرض التشويقي',
    hero_work: 'استعرض أعمالي',

    // stats
    stat_wish: 'إضافة إلى قائمة الرغبات على <bdi>Steam</bdi> قبل صدور العرض الرسمي',
    stat_views: 'مشاهدة',
    stat_games: 'لعبتان قيد التطوير',

    // Janob Station
    janob_tagline: 'رعب نفسي&ensp;|&ensp;واقعية ثقافية',
    janob_h2: 'نبذة عن اللعبة وفكرتها',
    janob_lead: '<span class="accent-red">محطة</span> الجنوب: لعبة رعب نفسي أطوّرها بمفردي.',
    janob_p1: '<b>القصة</b> — عامل في المناوبة الليلية بمحطة وقود ومقهى شاي على طريق سريع ناءٍ في السعودية، يجد نفسه في مواجهة لغزٍ مرعب.',
    janob_p2: '<b>واقعية ثقافية</b> — عمارة محلية مصمَّمة بأدق التفاصيل، وأجواء سعودية أصيلة.',
    janob_p3: '<b>شخصيات حيّة</b> — أداء صوتي عربي كامل، ورعب نفسي مكثّف، وظهور خاص لوجوه بارزة من مجتمع صنّاع المحتوى.',
    steam_small: 'أضِفها إلى قائمة الرغبات على',
    teaser_caption: 'العرض التشويقي الرسمي — صدر في 20 أغسطس 2026 · متاح على صفحة اللعبة في <bdi>Steam</bdi>',
    captures: 'لقطات من داخل اللعبة',
    captures_note: 'عرض لحظي على <bdi>Unreal Engine 5.8</bdi> — تقنية <bdi>Lumen</bdi> للإضاءة السينمائية، و<bdi>Nanite</bdi> لتفاصيل معمارية عالية الدقة.',
    model_h3: 'النمذجة ثلاثية الأبعاد والخامات',
    model_env_h: 'تصميم البيئة والعمارة',
    model_env_p: 'نمذجة المباني الأساسية في عالم اللعبة — ومنها المحطة والمسجد والمحلات — من الصفر بالكامل على <bdi>Blender</bdi>.',
    model_tex_h: 'الخامات وخرائط <bdi>UV</bdi>',
    model_tex_p: 'تصميم خامات خاصة من الصفر، وإعادة إكساء المجسّمات لتلائم بيئة سعودية أصيلة وأجواء الرعب، وإعداد خرائط <bdi>UV</bdi> محسّنة.',
    chars_h3: 'تصميم الشخصيات وتحريكها',
    chars_c1: 'وجوه عالية الدقة — شخصيات محلية مفصّلة صُمِّمت بأداة <bdi>MetaHuman Creator</bdi>، مع نحت الملامح عبر <bdi>FaceBuilder</bdi> وخامات مرسومة يدويًا.',
    chars_c2: 'شخصيات داخل اللعبة بأقمشة وأزياء محلية أصيلة.',
    chars_c3: '<bdi>Live Link Hub</bdi> في <bdi>UE 5.8</bdi> — التقاط حركة الجسم والوجه بالكامل لأداء الشخصيات بشكل لحظي.',
    collab_h3: 'المجتمع والتعاونات',
    collab_drth: 'مطوّر لعبة <bdi>Aunt Fatima</bdi>',
    collab_note: 'اتفاقيات مؤكَّدة لأداء صوتي وظهور خاص لأسماء بارزة من مجتمع صنّاع المحتوى.',

    // The House Wants More
    house_tagline: 'رعب بقاء تعاوني عبر الإنترنت',
    house_badge: 'لعبة قادمة',

    // Environment art
    env_h2: 'تصميم البيئات وتطوير مفاهيمها الفنية',
    env_role: '<em>الدور</em> فنان بيئات / مصمم مراحل',
    env_tools: '<em>الأدوات</em> <bdi>Unreal Engine 5.8 / Blender</bdi>',
    env_captures: 'لقطات من داخل المحرّك',

    // skills
    skills_h2: 'الأدوات والمهارات',
    skill_ue: 'تصميم المراحل، و<bdi>Blueprints</bdi>، وإضاءة <bdi>Lumen</bdi>، و<bdi>Nanite</bdi>، والمشاهد السينمائية عبر <bdi>Sequencer</bdi>، وتحسين الأداء.',
    skill_blender: 'نمذجة البيئات والمباني من الصفر، والمجسّمات، وخرائط <bdi>UV</bdi>.',
    skill_mh: '<bdi>MetaHuman Creator</bdi> و<bdi>FaceBuilder</bdi>، والتقاط حركة الجسم والوجه عبر <bdi>Live Link Hub</bdi>.',
    skill_krita: 'تصميم الخامات واللافتات والصور الترويجية الرئيسية والمواد التسويقية.',

    // contact / footer
    contact_h2: 'تواصل معي',
    support: '&#9829;&ensp;ادعم أعمالي',
    footer: '© 2026 ياسر العلقي · MadeBySoshi',

    // image descriptions (screen readers)
    alt_j1: 'محطة الجنوب — المحطة ليلًا تحت لافتة النيون',
    alt_j2: 'محطة الجنوب — زاوية حاوية النفايات',
    alt_j3: 'محطة الجنوب — المستودع',
    alt_j4: 'محطة الجنوب — جدار الشارع ليلًا',
    alt_j5: 'محطة الجنوب — زقاق',
    alt_j6: 'محطة الجنوب — شارع في الليل',
    alt_j7: 'محطة الجنوب — الغرفة الخضراء',
    alt_j8: 'محطة الجنوب — كاونتر البقالة',
    alt_j9: 'محطة الجنوب — من الداخل',
    alt_m1: 'المحطة — المجسّم في Blender',
    alt_m2: 'المحطة — النسخة النهائية في Unreal',
    alt_m3: 'عمارة سكنية — المجسّم في Blender',
    alt_m4: 'عمارة سكنية — النسخة النهائية في Unreal',
    alt_c1: 'شخصية MetaHuman ترتدي كابًا',
    alt_c2: 'شخصية ترتدي عباءة',
    alt_c3: 'شخصية ترتدي عباءة — لقطة قريبة',
    alt_c4: 'شخصية MetaHuman ترتدي نظارة',
    alt_h1: 'The House Wants More — غرفة النوم',
    alt_h2: 'The House Wants More — غرفة الطعام',
    alt_h3: 'The House Wants More — الممر المؤدي إلى المكتبة',
    alt_h4: 'The House Wants More — التمثال العظيم',
    alt_e1: 'تصميم البيئات — بوابة مهدّمة تحت العاصفة',
    alt_e2: 'تصميم البيئات — البوابة السحرية',
    alt_e3: 'تصميم البيئات — الساحة',
    alt_e4: 'تصميم البيئات — البوابة وقت الغروب'
  };

  const html = document.documentElement;
  const EN = { title: document.title, description: document.querySelector('meta[name="description"]').content };
  const texts = [...document.querySelectorAll('[data-i18n]')];
  const alts = [...document.querySelectorAll('[data-i18n-alt]')];
  const arias = [...document.querySelectorAll('[data-i18n-aria]')];
  texts.forEach(el => { el.dataset.en = el.innerHTML; });
  alts.forEach(el => { el.dataset.enAlt = el.alt; });
  arias.forEach(el => { el.dataset.enAria = el.getAttribute('aria-label'); });

  const label = document.querySelector('.lang-label');
  const btn = document.querySelector('.lang-toggle');

  function apply(lang) {
    const ar = lang === 'ar';
    html.lang = ar ? 'ar' : 'en';
    html.dir = ar ? 'rtl' : 'ltr';
    texts.forEach(el => { el.innerHTML = ar && AR[el.dataset.i18n] ? AR[el.dataset.i18n] : el.dataset.en; });
    alts.forEach(el => { el.alt = ar && AR[el.dataset.i18nAlt] ? AR[el.dataset.i18nAlt] : el.dataset.enAlt; });
    arias.forEach(el => { el.setAttribute('aria-label', ar && AR[el.dataset.i18nAria] ? AR[el.dataset.i18nAria] : el.dataset.enAria); });
    document.title = ar ? AR.title : EN.title;
    document.querySelector('meta[name="description"]').content = ar ? AR.description : EN.description;
    label.textContent = ar ? 'English' : 'العربية';
    btn.setAttribute('aria-label', ar ? 'Switch to English' : 'التبديل إلى العربية');
    try { localStorage.setItem('lang', lang); } catch (e) { /* private mode: ignore */ }
  }

  // ?lang=ar in the link wins, then the visitor's last choice, then their browser language
  let lang = new URLSearchParams(location.search).get('lang');
  if (lang !== 'ar' && lang !== 'en') {
    try { lang = localStorage.getItem('lang'); } catch (e) { lang = null; }
  }
  if (lang !== 'ar' && lang !== 'en') {
    lang = (navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en';
  }
  apply(lang);
  btn.addEventListener('click', () => apply(html.lang === 'ar' ? 'en' : 'ar'));
})();
