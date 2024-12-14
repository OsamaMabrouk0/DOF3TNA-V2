// JavaScript
document.addEventListener("DOMContentLoaded", () => {
    const sidebarItems = document.querySelectorAll("#sidebar li");
    const courseContent = document.getElementById("course-content");

    if (!sidebarItems || !courseContent) return;

    // Clear other content
    function hideOtherContent() {
        courseContent.innerHTML = "";
    }

    // Update active state
    function updateActiveState(activeItem) {
        sidebarItems.forEach(item => item.classList.remove("active"));
        activeItem.classList.add("active");
    }

    // Update course content
    function updateCourseContent(courseName) {
        hideOtherContent();
        const content =
            courseName === "new"
                ? "محتوى المضاف حديثا سيظهر هنا."
                : `محتوى مادة ${courseName} سيظهر هنا.`;
        courseContent.innerHTML = `<p>${content}</p>`;
    }

    // Handle click events
    sidebarItems.forEach(item => {
        item.addEventListener("click", function () {
            updateActiveState(item);
            const courseName = item.id === "new-added-option" ? "new" : item.textContent;
            updateCourseContent(courseName);
        });
    });

    // Show default content
    updateCourseContent("new");
});
