/* *********************************| المتغيرات العامة |********************************* */
// تعقب انتهاء شاشة التحميل
let loadingScreenHidden = false;

/* *********************************| شاشة التحميل |********************************* */
// إخفاء شاشة التحميل عند انتهاء تحميل الصفحة
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.opacity = '0'; // تأثير التلاشي
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        loadingScreenHidden = true; // تحديث حالة الشاشة

        // تشغيل تأثيرات الصفحة الرئيسية بعد إخفاء شاشة التحميل بفارق زمني بسيط
        initializeMainPageTransitions();
    }, 0); // مدة التلاشي
});

/* *********************************| تأثيرات الصفحة الرئيسية |********************************* */
// تشغيل الترانزشن على الصفحة الرئيسية
function initializeMainPageTransitions() {
    const header = document.getElementById('header');
    const mainImageContainer = document.querySelector('.main-image-container');
    const icons = document.querySelectorAll('.icon');
    const mainSectionTitle = document.querySelector('.main-section-title');

    // تأثيرات الصفحة الرئيسية
    gsap.fromTo(header, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(mainImageContainer, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, delay: 0.2, ease: 'power2.out' });
    gsap.fromTo(icons, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, delay: 0.2, stagger: 0.05, ease: 'power2.out' });
    gsap.fromTo(mainSectionTitle, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, delay: 0.2, ease: 'power2.out' });
}

/* *********************************| التنقل إلى الأقسام الداخلية |********************************* */
// الانتقال إلى قسم داخلي معين
function showSection(sectionId, sectionName) {
    // التحقق من أن شاشة التحميل اختفت قبل تنفيذ الترانزشن
    if (!loadingScreenHidden) return;

    // إخفاء الصفحة الرئيسية
    gsap.to('#main-page', { opacity: 0, duration: 0.1, onComplete: () => {
        document.getElementById('main-page').style.display = 'none';

        // إظهار القسم المحدد
        const section = document.getElementById(sectionId);
        section.classList.remove('hidden');
        document.getElementById('header-title').textContent = sectionName;
        document.getElementById('back-icon').style.display = 'block';

        // تشغيل الترانزشن
        gsap.fromTo(section, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.1 });

        // إظهار شريط التنقل السفلي
        showBottomNav();
    }});
}

/* *********************************| العودة إلى الصفحة الرئيسية |********************************* */
// العودة من الأقسام الداخلية إلى الصفحة الرئيسية
function goBack() {
    // التحقق من أن شاشة التحميل اختفت قبل تنفيذ الترانزشن
    if (!loadingScreenHidden) return;

    // تحديد جميع الأقسام الداخلية
    const sections = document.querySelectorAll('.internal-section');

    // إخفاء الأقسام الداخلية
    gsap.to(sections, { opacity: 0, duration: 0.1, onComplete: () => {
        sections.forEach(section => section.classList.add('hidden'));

        // إظهار الصفحة الرئيسية
        document.getElementById('main-page').style.display = 'block';
        document.getElementById('header-title').textContent = 'دفعتنا';
        document.getElementById('back-icon').style.display = 'none';

        // تشغيل الترانزشن للصفحة الرئيسية
        gsap.fromTo('#main-page', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.1 });

        // إخفاء شريط التنقل السفلي
        hideBottomNav();
    }});
}

/* *********************************| شريط التنقل السفلي |********************************* */
// إظهار شريط التنقل السفلي
function showBottomNav() {
    document.getElementById('bottom-nav').classList.add('visible');
}

// إخفاء شريط التنقل السفلي
function hideBottomNav() {
    document.getElementById('bottom-nav').classList.remove('visible');
}
