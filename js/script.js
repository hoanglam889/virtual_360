// Khởi tạo biến lưu trạng thái tự động xoay
let isAutoRotating = true;
const autoRotateSpeed = -2; // Tốc độ xoay tự động (giá trị âm: xoay từ trái qua phải)

/* ==========================================================================
   Khởi tạo Pannellum Viewer
   ========================================================================== */
const viewer = pannellum.viewer('panorama-viewer', {
    "type": "equirectangular",
    "panorama": "images/pano.jpg",
    "autoLoad": true,
    "showControls": false, 
    "autoRotate": autoRotateSpeed,
    "yaw": 0,
    "pitch": 0,
    "hfov": 100,
    "minHfov": 50,
    "maxHfov": 120,
    "hotSpots": [
        {
            "pitch": -0.6452,
            "yaw": 144.5234,
            "type": "info",
            "text": "Khu liên hợp TDTT Rạch Chiếc",
            "cssClass": "custom-arrow"
        },
        {
            "pitch": -2.3097,
            "yaw": 124.4251,
            "type": "info",
            "text": "Nút giao Cát Lái",
            "cssClass": "custom-arrow"
        }
    ]
});

// Lấy các phần tử DOM phục vụ tương tác điều khiển
const loadingOverlay = document.getElementById('loading-overlay');
const zoomInBtn = document.getElementById('zoom-in-btn');
const zoomOutBtn = document.getElementById('zoom-out-btn');
const autoRotateBtn = document.getElementById('auto-rotate-btn');
const rotateIcon = document.getElementById('rotate-icon');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const tourContainer = document.getElementById('tour-container');
const homeBtn = document.getElementById('home-btn');

// Đóng mở bảng thông tin (Collapsible Header Overlay)
const headerOverlay = document.getElementById('header-overlay');
const infoToggleBtn = document.getElementById('info-toggle-btn');
const infoToggleIcon = document.getElementById('info-toggle-icon');
const instructionText = document.getElementById('instruction-text');

/* ==========================================
   1. Kiểm tra Thiết bị Di động (Mobile Optimization)
   ========================================== */
// Nếu mở trên điện thoại (màn hình <= 768px), tự động thu gọn bảng thông tin để tránh che mất hình ảnh 360
if (window.innerWidth <= 768) {
    headerOverlay.classList.add('collapsed');
    updateToggleIcon();
}

// Thay đổi dòng text hướng dẫn tùy thuộc vào thiết bị cảm ứng hay máy tính
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    if (instructionText) {
        instructionText.innerText = "Vuốt để xoay / Kéo 2 ngón tay để zoom";
    }
}

/* ==========================================
   2. Xử lý Trạng thái Tải ảnh (Loading)
   ========================================== */
viewer.on('load', function() {
    loadingOverlay.style.opacity = '0';
    setTimeout(() => {
        loadingOverlay.style.display = 'none';
    }, 600);
});

/* ==========================================
   3. Tính năng Zoom In / Zoom Out
   ========================================== */
zoomInBtn.addEventListener('click', () => {
    const currentHfov = viewer.getHfov();
    viewer.setHfov(Math.max(50, currentHfov - 10));
});

zoomOutBtn.addEventListener('click', () => {
    const currentHfov = viewer.getHfov();
    viewer.setHfov(Math.min(120, currentHfov + 10));
});

/* ==========================================
   4. Tính năng Bật/Tắt Tự động xoay (Auto-rotate)
   ========================================== */
autoRotateBtn.addEventListener('click', () => {
    if (isAutoRotating) {
        viewer.stopAutoRotate();
        isAutoRotating = false;
        autoRotateBtn.setAttribute('data-tooltip', 'Tự động quay');
        rotateIcon.innerHTML = `
            <polygon points="5,3 19,12 5,21" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></polygon>
        `;
    } else {
        viewer.startAutoRotate(autoRotateSpeed);
        isAutoRotating = true;
        autoRotateBtn.setAttribute('data-tooltip', 'Tạm dừng quay');
        rotateIcon.innerHTML = `
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
        `;
    }
});

/* ==========================================
   5. Tính năng Toàn màn hình (Fullscreen)
   ========================================== */
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        tourContainer.requestFullscreen().catch(err => {
            console.error("Lỗi khi chuyển chế độ Fullscreen: ", err.message);
        });
    } else {
        document.exitFullscreen();
    }
});

document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        fullscreenBtn.setAttribute('data-tooltip', 'Thoát toàn màn hình');
        fullscreenBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 14h6v6m10-6h-6v6M4 10h6V4m10 6h-6V4"></path>
            </svg>
        `;
    } else {
        fullscreenBtn.setAttribute('data-tooltip', 'Toàn màn hình');
        fullscreenBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
        `;
    }
});

/* ==========================================
   6. Tính năng đóng/mở Header Info Panel
   ========================================== */
infoToggleBtn.addEventListener('click', (e) => {
    // Ngăn chặn sự kiện click lan xuống WebGL canvas bên dưới
    e.stopPropagation();
    
    headerOverlay.classList.toggle('collapsed');
    updateToggleIcon();
});

// Cập nhật SVG Icon cho nút Đóng / Mở Info Panel
function updateToggleIcon() {
    if (headerOverlay.classList.contains('collapsed')) {
        // Biểu tượng chữ "i" (Thông tin)
        infoToggleBtn.setAttribute('data-tooltip', 'Hiện thông tin');
        infoToggleIcon.innerHTML = `
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
        `;
    } else {
        // Biểu tượng dấu "X" (Đóng)
        infoToggleBtn.setAttribute('data-tooltip', 'Ẩn thông tin');
        infoToggleIcon.innerHTML = `
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        `;
    }
}

/* ==========================================
   7. Tính năng nút Home (Về Ga Thủ Thiêm)
   ========================================== */
if (homeBtn) {
    homeBtn.addEventListener('click', (e) => {
        // Ngăn chặn sự kiện lan xuống WebGL
        e.stopPropagation();
        
        // Lia camera quay về góc nhìn mặc định ban đầu mượt mà
        viewer.lookAt(0, 0, 100, 1000);
    });
}
