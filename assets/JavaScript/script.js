/* *********************************| التنقل إلى الأقسام الداخلية |********************************* */
function showSection(sectionId, sectionName) {
    gsap.to('#main-page', { opacity: 0, duration: 0.1, onComplete: () => {
        document.getElementById('main-page').style.display = 'none';
        const section = document.getElementById(sectionId);
        section.classList.remove('hidden');
        document.getElementById('header-title').textContent = sectionName;
        document.getElementById('back-icon').style.display = 'block';
        gsap.fromTo(section, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.1 });
        showBottomNav();

    }});
}

/* *********************************| العودة إلى الصفحة الرئيسية |********************************* */
function goBack() {
    const sections = document.querySelectorAll('.internal-section');
    gsap.to(sections, { opacity: 0, duration: 0.1, onComplete: () => {
        sections.forEach(section => section.classList.add('hidden'));
        document.getElementById('main-page').style.display = 'block';
        document.getElementById('header-title').textContent = 'دفعتنا';
        document.getElementById('back-icon').style.display = 'none';
        gsap.fromTo('#main-page', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.1 });
        hideBottomNav();

    }});
}

/* *********************************| تأثيرات الدخول عند تحميل الصفحة |********************************* */
window.addEventListener('load', () => {
    gsap.fromTo('#header', { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo('.main-image-container', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, delay: 0.2, ease: 'power2.out' });
    const icons = document.querySelectorAll('.icon');
    gsap.fromTo(icons, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, delay: 0.4, stagger: 0.05, ease: 'power2.out' });
});



/* *********************************| شريط التنقل السفلي |********************************* */

function showBottomNav() {
    document.getElementById('bottom-nav').classList.add('visible');
}

function hideBottomNav() {
    document.getElementById('bottom-nav').classList.remove('visible');
}


function showSection(sectionId, sectionName) {
    const sections = document.querySelectorAll('.internal-section');
    
    // إخفاء جميع الأقسام الداخلية
    sections.forEach(section => {
        if (!section.classList.contains('hidden')) {
            gsap.to(section, { opacity: 0, duration: 0.1, onComplete: () => {
                section.classList.add('hidden');
            }});
        }
    });

    // إظهار القسم المطلوب
    gsap.to('#main-page', { opacity: 0, duration: 0.1, onComplete: () => {
        document.getElementById('main-page').style.display = 'none';
        const section = document.getElementById(sectionId);
        section.classList.remove('hidden');
        document.getElementById('header-title').textContent = sectionName;
        document.getElementById('back-icon').style.display = 'block';
        gsap.fromTo(section, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.1 });
        showBottomNav();
    }});
}
