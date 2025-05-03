function setCachedData(key, value, ttl = 600) {
    const expiration = Date.now() + ttl * 1000;
    localStorage.setItem(key, JSON.stringify({ value, expiration }));
}

function getCachedData(key) {
    const cached = localStorage.getItem(key);
    if (cached) {
        const { value, expiration } = JSON.parse(cached);
        if (Date.now() < expiration) return value;
    }
    return null;
}

// جلب البيانات من Google Drive API
async function fetchFromGoogleDrive(endpoint) {
    const cachedData = getCachedData(endpoint);
    if (cachedData) return cachedData;

    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Failed to fetch data from API");

    const data = await response.json();
    setCachedData(endpoint, data);
    return data;
}

// جلب المواد (المجلدات) من Google Drive
async function fetchFolders() {
    const url = `https://www.googleapis.com/drive/v3/files?q='${mainFolderId}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&key=${GOOGLE_DRIVE_API_KEY}&fields=files(id,name)`;
    const data = await fetchFromGoogleDrive(url);
    return data.files || [];
}

// جلب الملفات من Google Drive
async function fetchFiles(parentId) {
    const url = `https://www.googleapis.com/drive/v3/files?q='${parentId}'+in+parents+and+mimeType!='application/vnd.google-apps.folder'&key=${GOOGLE_DRIVE_API_KEY}&fields=files(id,name)`;
    const data = await fetchFromGoogleDrive(url);
    return data.files || [];
}

// تحديث الإحصائيات
async function updateStatistics() {
    const folderOpenCounts = JSON.parse(localStorage.getItem("folderOpenCounts")) || {};
    const accessTimestamps = JSON.parse(localStorage.getItem("folderAccessTimestamps")) || {};
    let totalViews = Object.values(folderOpenCounts).reduce((sum, count) => sum + count, 0); // حساب إجمالي المشاهدات

    try {
        const folders = await fetchFolders();
        const folderNames = {};
        let totalFiles = 0;
        const subjectDetails = [];

        for (const folder of folders) {
            folderNames[folder.id] = folder.name;
            const files = await fetchFiles(folder.id);
            totalFiles += files.length;

            subjectDetails.push({
                name: folder.name,
                views: folderOpenCounts[folder.id] || 0,
                filesCount: files.length,
            });
        }


        localStorage.setItem("folders", JSON.stringify(folders));
        localStorage.setItem("folderNames", JSON.stringify(folderNames));
        localStorage.setItem("subjectDetails", JSON.stringify(subjectDetails));
        localStorage.setItem("totalFiles", totalFiles);


        document.getElementById("total-subjects").textContent = folders.length;
        document.getElementById("total-files").textContent = totalFiles;

        const mostViewedFolderId = Object.keys(folderOpenCounts).reduce((a, b) =>
            folderOpenCounts[a] > folderOpenCounts[b] ? a : b, null);
        document.getElementById("most-viewed").textContent = folderNames[mostViewedFolderId] || "-";
        document.getElementById("total-views").textContent = totalViews;

        const subjectsDetailsElement = document.getElementById("subjects-details");
        subjectsDetailsElement.innerHTML = subjectDetails.map(detail => `
            <tr>
                <td>${detail.name}</td>
                <td>${detail.views}</td>
                <td>${detail.filesCount}</td>
            </tr>
        `).join("");

        // رسم الرسم البياني الخاص بعدد الملفات في كل مادة
        const filesChartCtx = document.getElementById("filesChart").getContext("2d");
        new Chart(filesChartCtx, {
            type: "bar",
            data: {
                labels: subjectDetails.map(detail => detail.name),
                datasets: [{
                    label: "عدد الملفات",
                    data: subjectDetails.map(detail => detail.filesCount),
                    backgroundColor: "rgba(153, 102, 255, 0.2)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    borderWidth: 1
                }]
            }
        });

        // رسم الرسم البياني الخاص بعدد المشاهدات في كل مادة
        const viewsChartCtx = document.getElementById("viewsChart").getContext("2d");
        new Chart(viewsChartCtx, {
            type: "bar",
            data: {
                labels: subjectDetails.map(detail => detail.name),
                datasets: [{
                    label: "عدد المشاهدات",
                    data: subjectDetails.map(detail => detail.views),
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1
                }]
            }
        });

    } catch (error) {
        console.error("Error loading statistics:", error);
        loadFromLocalStorage();
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    if (navigator.onLine) {
        await updateStatistics();
    } else {
        loadFromLocalStorage();
    }
});




function loadFromLocalStorage() {
    const folders = JSON.parse(localStorage.getItem("folders")) || [];
    const folderNames = JSON.parse(localStorage.getItem("folderNames")) || {};
    const subjectDetails = JSON.parse(localStorage.getItem("subjectDetails")) || [];
    const totalFiles = parseInt(localStorage.getItem("totalFiles")) || 0;
    const downloadsCount = parseInt(localStorage.getItem("downloadsCount")) || 0;

    document.getElementById("total-subjects").textContent = folders.length;
    document.getElementById("total-files").textContent = totalFiles;
    document.getElementById("downloads-count").textContent = downloadsCount;

    const subjectsDetailsElement = document.getElementById("subjects-details");

    function applyNightDayMode() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        subjectsDetailsElement.innerHTML = subjectDetails.map(detail => `
        <tr class="${isDarkMode ? 'dark-mode-row' : ''}">
            <td>${detail.name}</td>
            <td>${detail.views}</td>
            <td>${detail.filesCount}</td>
        </tr>
    `).join("");
    }

    applyNightDayMode();


    // رسم الرسم البياني الخاص بعدد الملفات في كل مادة
    const filesChartCtx = document.getElementById("filesChart").getContext("2d");
    new Chart(filesChartCtx, {
        type: "bar",
        data: {
            labels: subjectDetails.map(detail => detail.name),
            datasets: [{
                label: "عدد الملفات",
                data: subjectDetails.map(detail => detail.filesCount),
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1
            }]
        }
    });

    // رسم الرسم البياني الخاص بعدد المشاهدات في كل مادة
    const viewsChartCtx = document.getElementById("viewsChart").getContext("2d");
    new Chart(viewsChartCtx, {
        type: "bar",
        data: {
            labels: subjectDetails.map(detail => detail.name),
            datasets: [{
                label: "عدد المشاهدات",
                data: subjectDetails.map(detail => detail.views),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        }
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    if (navigator.onLine) {
        await updateStatistics();
    } else {
        loadFromLocalStorage();
    }

    setInterval(async () => {
        if (navigator.onLine) {
            await updateStatistics();
        }
    }, 1000);
});

window.addEventListener("focus", async () => {
    const currentPath = window.location.pathname;

    if (currentPath === "/") {
        if (navigator.onLine) {
            await updateStatistics();
        } else {
            loadFromLocalStorage();
        }
    }
});

// دالة لتصدير البيانات إلى Excel
document.getElementById("exportExcelBtn").addEventListener("click", () => {
    Swal.fire({
        title: 'تصدير إلى Excel',
        html: `
            <div style="background: linear-gradient(135deg, #c8e6c9, #a5d6a7); padding: 20px; border-radius: 10px;">
                <img src="./assets/Images/microsoft-excel-2019.png" alt="Excel Icon" style="width: 80px; margin-bottom: 15px;">
                <p style="font-size: 1.3rem; color: #2e7d32;">هل تريد بالتأكيد تصدير البيانات إلى <b>Excel</b>؟</p>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-check-circle"></i> نعم، تصدير',
        cancelButtonText: '<i class="fas fa-times-circle"></i> إلغاء',
        customClass: {
            confirmButton: 'btn btn-primary btn-lg mx-2',
            cancelButton: 'btn btn-secondary btn-lg mx-2',
        },
        buttonsStyling: false,
    }).then((result) => {
        if (result.isConfirmed) {
            try {
                const table = document.getElementById("subjects-details");
                const rows = Array.from(table.rows);
                const data = rows.map(row => Array.from(row.cells).map(cell => cell.textContent));

                data.unshift(["اسم المادة", "عدد المشاهدات", "عدد الملفات"]);

                const ws = XLSX.utils.aoa_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Subjects");

                XLSX.writeFile(wb, "subjects_data.xlsx");

                // إظهار رسالة النجاح
                Swal.fire({
                    html: `
                        <div style="background: linear-gradient(135deg, #c8e6c9, #a5d6a7); padding: 20px; border-radius: 10px;">
                            <img src="./assets/Images/microsoft-excel-2019.png" alt="Excel Success" style="width: 80px; margin-bottom: 15px;">
                            <p style="font-size: 1.3rem; color: #2e7d32;">تم تصدير الملف إلى <b>Excel</b> بنجاح!</p>
                        </div>
                    `,
                    confirmButtonText: 'موافق',
                    customClass: {
                        confirmButton: 'btn btn-primary btn-lg',
                    },
                    buttonsStyling: false,
                });
            } catch (error) {
                // إظهار رسالة الخطأ
                Swal.fire({
                    html: `
                        <div style="background: linear-gradient(135deg, #ffcdd2, #ef9a9a); padding: 20px; border-radius: 10px;">
                            <img src="./assets/Images/microsoft-excel-2019.png" alt="Excel Error" style="width: 80px; margin-bottom: 15px;">
                            <p style="font-size: 1.3rem; color: #d32f2f;">حدثت مشكلة أثناء تصدير <b>Excel</b>.</p>
                        </div>
                    `,
                    confirmButtonText: 'حسنًا',
                    customClass: {
                        confirmButton: 'btn btn-danger btn-lg',
                    },
                    buttonsStyling: false,
                });
            }
        }
    });
});

let filesChart = null;
let viewsChart = null;


async function updateStatistics() {
    const folderOpenCounts = JSON.parse(localStorage.getItem("folderOpenCounts")) || {};
    let totalViews = Object.values(folderOpenCounts).reduce((sum, count) => sum + count, 0); // حساب إجمالي المشاهدات

    try {
        const folders = await fetchFolders();
        const folderNames = {};
        let totalFiles = 0;
        const subjectDetails = [];

        for (const folder of folders) {
            folderNames[folder.id] = folder.name;
            const files = await fetchFiles(folder.id);
            totalFiles += files.length;

            subjectDetails.push({
                name: folder.name,
                views: folderOpenCounts[folder.id] || 0,
                filesCount: files.length,
            });
        }

        localStorage.setItem("folders", JSON.stringify(folders));
        localStorage.setItem("folderNames", JSON.stringify(folderNames));
        localStorage.setItem("subjectDetails", JSON.stringify(subjectDetails));
        localStorage.setItem("totalFiles", totalFiles);

        // تحديث الكروت
        document.getElementById("total-subjects").textContent = folders.length;
        document.getElementById("total-files").textContent = totalFiles;
        document.getElementById("total-views").textContent = totalViews;

        const mostViewedFolderId = Object.keys(folderOpenCounts).reduce((a, b) =>
            folderOpenCounts[a] > folderOpenCounts[b] ? a : b, null);
        document.getElementById("most-viewed").textContent = folderNames[mostViewedFolderId] || "لايوجد";

        // تحديث الجدول
        const subjectsDetailsElement = document.getElementById("subjects-details");
        subjectsDetailsElement.innerHTML = subjectDetails.map(detail => `
            <tr>
                <td>${detail.name}</td>
                <td>${detail.views}</td>
                <td>${detail.filesCount}</td>
            </tr>
        `).join("");


        if (filesChart) {
            filesChart.data.labels = subjectDetails.map(detail => detail.name);
            filesChart.data.datasets[0].data = subjectDetails.map(detail => detail.filesCount);
            filesChart.update();
        }

        if (viewsChart) {
            viewsChart.data.labels = subjectDetails.map(detail => detail.name);
            viewsChart.data.datasets[0].data = subjectDetails.map(detail => detail.views);
            viewsChart.update();
        }

    } catch (error) {
        console.error("Error loading statistics:", error);
        loadFromLocalStorage();
    }
}

// دالة لتحميل البيانات عند عدم وجود اتصال
function loadFromLocalStorage() {
    const folders = JSON.parse(localStorage.getItem("folders")) || [];
    const subjectDetails = JSON.parse(localStorage.getItem("subjectDetails")) || [];
    const totalFiles = parseInt(localStorage.getItem("totalFiles")) || 0;
    const totalViews = Object.values(JSON.parse(localStorage.getItem("folderOpenCounts")) || {}).reduce((sum, count) => sum + count, 0);

    // تحديث الكروت
    document.getElementById("total-subjects").textContent = folders.length;
    document.getElementById("total-files").textContent = totalFiles;
    document.getElementById("total-views").textContent = totalViews;

    const subjectsDetailsElement = document.getElementById("subjects-details");
    subjectsDetailsElement.innerHTML = subjectDetails.map(detail => `
        <tr>
            <td>${detail.name}</td>
            <td>${detail.views}</td>
            <td>${detail.filesCount}</td>
        </tr>
    `).join("");

    // تحديث الرسوم البيانية
    if (filesChart) {
        filesChart.data.labels = subjectDetails.map(detail => detail.name);
        filesChart.data.datasets[0].data = subjectDetails.map(detail => detail.filesCount);
        filesChart.update();
    }

    if (viewsChart) {
        viewsChart.data.labels = subjectDetails.map(detail => detail.name);
        viewsChart.data.datasets[0].data = subjectDetails.map(detail => detail.views);
        viewsChart.update();
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // إعداد الرسوم البيانية عند التحميل لأول مرة
    const filesChartCtx = document.getElementById("filesChart").getContext("2d");
    filesChart = new Chart(filesChartCtx, {
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                label: "عدد الملفات",
                data: [],
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1
            }]
        }
    });

    const viewsChartCtx = document.getElementById("viewsChart").getContext("2d");
    viewsChart = new Chart(viewsChartCtx, {
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                label: "عدد المشاهدات",
                data: [],
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        }
    });

    if (navigator.onLine) {
        await updateStatistics();
    } else {
        loadFromLocalStorage();
    }


    setInterval(async () => {
        if (navigator.onLine) {
            await updateStatistics();
        }
    }, 1000);
});


// تحديث الإحصائيات
async function updateStatistics() {
    const folderOpenCounts = JSON.parse(localStorage.getItem("folderOpenCounts")) || {};
    let totalViews = Object.values(folderOpenCounts).reduce((sum, count) => sum + count, 0); // حساب إجمالي المشاهدات

    try {
        const folders = await fetchFolders();
        const folderNames = {};
        let totalFiles = 0;
        const subjectDetails = [];

        for (const folder of folders) {
            folderNames[folder.id] = folder.name;
            const files = await fetchFiles(folder.id);
            totalFiles += files.length;

            // إعداد تفاصيل المادة
            subjectDetails.push({
                name: folder.name,
                views: folderOpenCounts[folder.id] || 0,
                filesCount: files.length,
            });
        }

        // حساب المجلد الأكثر مشاهدة
        const mostViewedFolderId = Object.keys(folderOpenCounts).reduce((a, b) =>
            folderOpenCounts[a] > folderOpenCounts[b] ? a : b, null);
        const mostViewedFolderName = folderNames[mostViewedFolderId] || "لايوجد";

        // حفظ البيانات في localStorage
        localStorage.setItem("folders", JSON.stringify(folders));
        localStorage.setItem("folderNames", JSON.stringify(folderNames));
        localStorage.setItem("subjectDetails", JSON.stringify(subjectDetails));
        localStorage.setItem("totalFiles", totalFiles);
        localStorage.setItem("totalViews", totalViews);
        localStorage.setItem("mostViewedFolder", mostViewedFolderName);

        // تحديث الكروت
        document.getElementById("total-subjects").textContent = folders.length;
        document.getElementById("total-files").textContent = totalFiles;
        document.getElementById("total-views").textContent = totalViews;
        document.getElementById("most-viewed").textContent = mostViewedFolderName;

        // تحديث الجدول
        const subjectsDetailsElement = document.getElementById("subjects-details");
        subjectsDetailsElement.innerHTML = subjectDetails.map(detail => `
            <tr>
                <td>${detail.name}</td>
                <td>${detail.views}</td>
                <td>${detail.filesCount}</td>
            </tr>
        `).join("");

        // تحديث الرسوم البيانية
        if (filesChart) {
            filesChart.data.labels = subjectDetails.map(detail => detail.name);
            filesChart.data.datasets[0].data = subjectDetails.map(detail => detail.filesCount);
            filesChart.update();
        }

        if (viewsChart) {
            viewsChart.data.labels = subjectDetails.map(detail => detail.name);
            viewsChart.data.datasets[0].data = subjectDetails.map(detail => detail.views);
            viewsChart.update();
        }

    } catch (error) {
        console.error("Error loading statistics:", error);
        loadFromLocalStorage();
    }
}


function loadFromLocalStorage() {
    const folders = JSON.parse(localStorage.getItem("folders")) || [];
    const subjectDetails = JSON.parse(localStorage.getItem("subjectDetails")) || [];
    const totalFiles = parseInt(localStorage.getItem("totalFiles")) || 0;
    const totalViews = parseInt(localStorage.getItem("totalViews")) || 0;
    const mostViewedFolder = localStorage.getItem("mostViewedFolder") || "لايوجد";

    // تحديث الكروت
    document.getElementById("total-subjects").textContent = folders.length;
    document.getElementById("total-files").textContent = totalFiles;
    document.getElementById("total-views").textContent = totalViews;
    document.getElementById("most-viewed").textContent = mostViewedFolder;

    const subjectsDetailsElement = document.getElementById("subjects-details");
    subjectsDetailsElement.innerHTML = subjectDetails.map(detail => `
        <tr>
            <td>${detail.name}</td>
            <td>${detail.views}</td>
            <td>${detail.filesCount}</td>
        </tr>
    `).join("");

    // تحديث الرسوم البيانية
    if (filesChart) {
        filesChart.data.labels = subjectDetails.map(detail => detail.name);
        filesChart.data.datasets[0].data = subjectDetails.map(detail => detail.filesCount);
        filesChart.update();
    }

    if (viewsChart) {
        viewsChart.data.labels = subjectDetails.map(detail => detail.name);
        viewsChart.data.datasets[0].data = subjectDetails.map(detail => detail.views);
        viewsChart.update();
    }
}


//------------------------------------------------------------------------------


async function fetchStatisticsFromAPI() {
    async function updateStatistics() {
        const dataKey = "statisticsData";
        let data;

        if (navigator.onLine) {
            try {
                data = await fetchStatisticsFromAPI();
                setCachedData(dataKey, data);
            } catch (error) {
                console.error("Error fetching data from API:", error);
            }
        } else {
            data = getCachedData(dataKey);
            if (!data) {
                console.warn("No cached data available.");
                return;
            }
        }

        renderStatistics(data);
    }

    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from API. Status: ${response.status}`);
    }
    return await response.json();
}

function setCachedData(key, value, ttl = 600) {
    const statisticsSection = document.getElementById("statistics");
    if (!statisticsSection || statisticsSection.classList.contains("hidden")) return; 

    const expiration = Date.now() + ttl * 1000;
    localStorage.setItem(key, JSON.stringify({ value, expiration }));
}

function getCachedData(key) {
    const statisticsSection = document.getElementById("statistics");
    if (!statisticsSection || statisticsSection.classList.contains("hidden")) return null;

    const cached = localStorage.getItem(key);
    if (cached) {
        const { value, expiration } = JSON.parse(cached);
        if (Date.now() < expiration) return value; 
    }
    return null;
}
