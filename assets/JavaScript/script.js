/* *********************************| المتغيرات العامة |********************************* */
let loadingScreenHidden = false;

/* *********************************| شاشة التحميل |********************************* */
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.opacity = '0'; // تأثير التلاشي
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        loadingScreenHidden = true;

        initializeMainPageTransitions();
    }, 0);
});

/* *********************************| تأثيرات الصفحة الرئيسية |********************************* */
function initializeMainPageTransitions() {
    const header = document.getElementById('header');
    const mainImageContainer = document.querySelector('.main-image-container');
    const icons = document.querySelectorAll('.icon');
    const mainSectionTitle = document.querySelector('.main-section-title');

    gsap.fromTo(header, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(mainImageContainer, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, delay: 0.2, ease: 'power2.out' });
    gsap.fromTo(icons, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, delay: 0.2, stagger: 0.05, ease: 'power2.out' });
    gsap.fromTo(mainSectionTitle, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, delay: 0.2, ease: 'power2.out' });
}

// تحديد عناصر القائمة والأيقونة
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

/* *********************************| التحكم في القائمة الجانبية |********************************* */
// التحكم في ظهور القائمة الجانبية عند الضغط على الأيقونة
menuToggle.addEventListener('change', () => {
    if (menuToggle.checked) {
        sidebar.classList.add('active'); // إظهار القائمة
    } else {
        sidebar.classList.remove('active'); // إخفاء القائمة
    }
});

/* *********************************| التنقل إلى الأقسام الداخلية |********************************* */
function showSection(sectionId, sectionName) {
    if (!loadingScreenHidden) return;

    const sections = document.querySelectorAll('.internal-section');
    const hamburgerIcon = document.querySelector('.hamburger'); // تحديد أيقونة الـ hamburger

    // إخفاء جميع الأقسام
    sections.forEach(section => {
        if (!section.classList.contains('hidden')) {
            gsap.to(section, {
                opacity: 0, duration: 0.1, onComplete: () => {
                    section.classList.add('hidden');
                }
            });
        }
    });

    // إظهار القسم الحالي
    gsap.to('#main-page', {
        opacity: 0, duration: 0.1, onComplete: () => {
            document.getElementById('main-page').style.display = 'none';

            const section = document.getElementById(sectionId);
            section.classList.remove('hidden');
            document.getElementById('header-title').textContent = sectionName;
            document.getElementById('back-icon').style.display = 'block';

            // التحكم في ظهور أو إخفاء أيقونة الـ hamburger
            if (sectionId === 'lectures') {
                hamburgerIcon.classList.add('visible'); // إظهار الأيقونة في صفحة المحاضرات
            } else {
                hamburgerIcon.classList.remove('visible'); // إخفاء الأيقونة في الصفحات الأخرى
                // إغلاق القائمة الجانبية تلقائيًا عند الانتقال لصفحة أخرى
                closeSidebar();
            }

            gsap.fromTo(section, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.1 });
            showBottomNav();
        }
    });
}

/* *********************************| العودة إلى الصفحة الرئيسية |********************************* */
function goBack() {
    if (!loadingScreenHidden) return;

    const sections = document.querySelectorAll('.internal-section');
    const hamburgerIcon = document.querySelector('.hamburger'); // تحديد أيقونة الـ hamburger

    // إخفاء جميع الأقسام
    gsap.to(sections, {
        opacity: 0, duration: 0.1, onComplete: () => {
            sections.forEach(section => section.classList.add('hidden'));

            // العودة إلى الصفحة الرئيسية
            document.getElementById('main-page').style.display = 'block';
            document.getElementById('header-title').textContent = 'دفعتنا';
            document.getElementById('back-icon').style.display = 'none';

            // إخفاء أيقونة الـ hamburger عند العودة إلى الصفحة الرئيسية
            hamburgerIcon.classList.remove('visible');

            // إغلاق القائمة الجانبية تلقائيًا عند العودة
            closeSidebar();

            gsap.fromTo('#main-page', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.1 });
            hideBottomNav();
        }
    });
}

/* *********************************| إغلاق القائمة الجانبية |********************************* */
function closeSidebar() {
    menuToggle.checked = false; // إعادة زر القائمة إلى حالته الافتراضية
    sidebar.classList.remove('active'); // إخفاء القائمة الجانبية
}


/* *********************************| شريط التنقل السفلي |********************************* */
function showBottomNav() {
    document.getElementById('bottom-nav').classList.add('visible');
}

function hideBottomNav() {
    document.getElementById('bottom-nav').classList.remove('visible');
}
