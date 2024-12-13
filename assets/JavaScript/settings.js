// عناصر التحكم
const fontFamilySelect = document.getElementById('fontFamilySelect');
const fontSizeSelect = document.getElementById('fontSizeSelect');
const resetButton = document.querySelector('.delete-data-btn');
const toggleSwitch = document.getElementById('darkModeToggle');
const themeImage = document.getElementById('themeImage');

// تحديد مسارات الصور
const lightModeImage = 'assets/Images/Education.svg';
const darkModeImage = 'assets/Images/Education-dark.svg';

// تحديث نوع الخط
fontFamilySelect.addEventListener('change', () => {
    const selectedFont = fontFamilySelect.value;
    document.body.style.fontFamily = selectedFont;
    localStorage.setItem('fontFamily', selectedFont); // حفظ الإعداد
});

// تحديث حجم الخط
fontSizeSelect.addEventListener('change', () => {
    const selectedSize = fontSizeSelect.value;
    document.body.style.fontSize = `${selectedSize}rem`;
    localStorage.setItem('fontSize', selectedSize); // حفظ الإعداد
});

// استرجاع الإعدادات المحفوظة
window.addEventListener('DOMContentLoaded', () => {
    const savedFontFamily = localStorage.getItem('fontFamily') || "'Cairo', sans-serif";
    const savedFontSize = localStorage.getItem('fontSize') || '1';
    const savedTheme = localStorage.getItem('theme') || 'light';

    // تطبيق الإعدادات المحفوظة
    document.body.style.fontFamily = savedFontFamily;
    fontFamilySelect.value = savedFontFamily;

    document.body.style.fontSize = `${savedFontSize}rem`;
    fontSizeSelect.value = savedFontSize;

    const isDarkMode = savedTheme === 'dark';
    document.body.classList.toggle('dark-mode', isDarkMode);
    toggleSwitch.checked = isDarkMode;
    themeImage.src = isDarkMode ? darkModeImage : lightModeImage;
});

// زر إعادة تعيين الإعدادات
resetButton.addEventListener('click', () => {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        text: 'سيتم إعادة تعيين جميع الإعدادات!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'نعم، إعادة تعيين',
        cancelButtonText: 'إلغاء',
    }).then((result) => {
        if (result.isConfirmed) {
            // إعادة تعيين الإعدادات
            localStorage.removeItem('fontFamily');
            localStorage.removeItem('fontSize');
            localStorage.removeItem('theme');

            // إعدادات افتراضية
            document.body.style.fontFamily = "'Cairo', sans-serif";
            document.body.style.fontSize = '1rem';
            fontFamilySelect.value = "'Cairo', sans-serif";
            fontSizeSelect.value = '1';

            // إعادة الوضع إلى النهار
            document.body.classList.remove('dark-mode');
            toggleSwitch.checked = false;
            themeImage.src = lightModeImage;

            Swal.fire('تمت إعادة التعيين!', 'تمت إعادة جميع الإعدادات إلى القيم الافتراضية.', 'success');
        }
    });
});

// تبديل الوضع وحفظه في التخزين المحلي
toggleSwitch.addEventListener('change', () => {
    const isDarkMode = toggleSwitch.checked;
    document.body.classList.toggle('dark-mode', isDarkMode);

    // تحديث مصدر الصورة
    themeImage.src = isDarkMode ? darkModeImage : lightModeImage;

    // حفظ الإعداد في localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    // تأثير GSAP لتغيير الوضع
    gsap.fromTo('body', { opacity: 0.5 }, { opacity: 1, duration: 0.5 });
});
