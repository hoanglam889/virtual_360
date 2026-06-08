// Khởi tạo biến lưu trạng thái tự động xoay
let isAutoRotating = true;
const autoRotateSpeed = -2; // Tốc độ xoay tự động (giá trị âm: xoay từ trái qua phải)

/* ==========================================================================
   Khởi tạo Pannellum Viewer với Multi-scenes (Đa cảnh)
   ========================================================================== */
const viewer = pannellum.viewer('panorama-viewer', {
    "default": {
        "firstScene": "ga_thu_thiem",
        "sceneFadeDuration": 1000, // Hiệu ứng chuyển cảnh mờ dần mượt mà 1 giây
        "author": "Hoanglam889"
    },
    
    "scenes": {
        // Cảnh 1: Ga Thủ Thiêm (Cảnh chính mặc định)
        "ga_thu_thiem": {
            "title": "Ga Thủ Thiêm",
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
                    "pitch": -1.2864,
                    "yaw": 156.6523,
                    "type": "scene",
                    "sceneId": "rach_chiec",
                    "text": "Khu liên hợp TDTT Rạch Chiếc",
                    "cssClass": "custom-arrow"
                },
                {
                    "pitch": -2.3097,
                    "yaw": 124.4251,
                    "type": "scene",
                    "sceneId": "cat_lai",
                    "text": "Nút giao Cát Lái",
                    "cssClass": "custom-arrow"
                }
            ]
        },
        
        // Cảnh 2: Khu liên hợp TDTT Rạch Chiếc
        "rach_chiec": {
            "title": "Khu liên hợp TDTT Rạch Chiếc",
            "type": "equirectangular",
            "panorama": "images/pano_svd_RachChiec.JPG",
            "autoLoad": true,
            "showControls": false,
            "yaw": 0,
            "pitch": 0,
            "hfov": 100,
            "minHfov": 50,
            "maxHfov": 120,
            "hotSpots": [
                {
                    "pitch": -30.2784,
                    "yaw": -15.3309,
                    "type": "scene",
                    "sceneId": "cat_lai",
                    "text": "Nút giao Cát Lái",
                    "cssClass": "custom-arrow"
                },
                {
                    "pitch": -9.1069,
                    "yaw": -61.4145,
                    "type": "scene",
                    "sceneId": "ga_thu_thiem",
                    "text": "Ga Thủ Thiêm",
                    "cssClass": "custom-arrow"
                }
            ]
        },
        
        // Cảnh 3: Nút giao Cát Lái
        "cat_lai": {
            "title": "Nút giao Cát Lái",
            "type": "equirectangular",
            "panorama": "images/pano_catlai.JPG",
            "autoLoad": true,
            "showControls": false,
            "yaw": 0,
            "pitch": 0,
            "hfov": 100,
            "minHfov": 50,
            "maxHfov": 120,
            "hotSpots": [
                {
                    "pitch": -18.3883,
                    "yaw": -168.5283,
                    "type": "scene",
                    "sceneId": "rach_chiec",
                    "text": "Khu liên hợp TDTT Rạch Chiếc",
                    "cssClass": "custom-arrow"
                },
                {
                    "pitch": -3.8590,
                    "yaw": -118.8417,
                    "type": "scene",
                    "sceneId": "ga_thu_thiem",
                    "text": "Ga Thủ Thiêm",
                    "cssClass": "custom-arrow"
                }
            ]
        }
    }
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
const musicBtn = document.getElementById('music-btn');
const musicIcon = document.getElementById('music-icon');

/* ==========================================================================
   Khởi tạo Âm thanh thuyết minh (Voice Narration)
   ========================================================================== */
const audioPlayer = new Audio();
audioPlayer.loop = true; // Lặp nhạc thuyết minh làm nền
let isMusicPlaying = false; // Trạng thái phát nhạc (mặc định tắt ban đầu)

// Danh sách tệp âm thanh tương ứng với từng Scene ID
const sceneAudios = {
    "ga_thu_thiem": "musics/GA THỦ THIÊM VOICE.MP3",
    "rach_chiec": "musics/RẠCH CHIẾC VOICE.MP3",
    "cat_lai": "musics/CÁT LÁI VOI.MP3"
};

// Đóng mở bảng thông tin (Collapsible Header Overlay)
const headerOverlay = document.getElementById('header-overlay');
const infoToggleBtn = document.getElementById('info-toggle-btn');
const infoToggleIcon = document.getElementById('info-toggle-icon');
const instructionText = document.getElementById('instruction-text');

/* ==========================================
   1. Kiểm tra Thiết bị Di động (Mobile Optimization)
   ========================================== */
if (window.innerWidth <= 768) {
    headerOverlay.classList.add('collapsed');
    updateToggleIcon();
}

if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    if (instructionText) {
        instructionText.innerText = "Vuốt để xoay / Kéo 2 ngón tay để zoom";
    }
}

/* ==========================================
   2. Xử lý Trạng thái Tải ảnh (Loading) & Phát nhạc đồng bộ
   ========================================== */
// Lắng nghe sự kiện load của Pannellum (khi ảnh panorama tải xong hoàn toàn)
viewer.on('load', function() {
    // Ẩn màn hình loading
    if (loadingOverlay.style.display !== 'none') {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 600);
    }
    
    // Đồng bộ phát âm thanh của cảnh hiện tại chỉ sau khi ảnh tải xong hoàn toàn (để tránh lag)
    const sceneId = viewer.getScene();
    const audioUrl = sceneAudios[sceneId];
    if (audioUrl) {
        const encodedUrl = encodeURI(audioUrl);
        // Cập nhật nguồn âm thanh nếu nguồn hiện tại khác với nguồn của cảnh này
        if (!audioPlayer.src || !audioPlayer.src.endsWith(encodedUrl)) {
            audioPlayer.src = encodedUrl;
            audioPlayer.load();
        }
        
        // Chỉ phát nếu người dùng đã bật chế độ âm thanh
        if (isMusicPlaying) {
            audioPlayer.play().catch(err => {
                console.log("Không thể phát âm thanh thuyết minh tự động: ", err.message);
            });
        }
    }

    // Đồng bộ trạng thái tự động xoay của cảnh mới với trạng thái nút bấm hiện tại
    if (isAutoRotating) {
        viewer.startAutoRotate(autoRotateSpeed);
    } else {
        viewer.stopAutoRotate();
    }
});

// Sự kiện Click bật/tắt nhạc thuyết minh
if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (isMusicPlaying) {
            // Đang phát -> Tắt đi
            audioPlayer.pause();
            isMusicPlaying = false;
            musicBtn.setAttribute('data-tooltip', 'Bật thuyết minh');
            if (musicIcon) {
                musicIcon.innerHTML = `
                    <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                `;
            }
        } else {
            // Đang tắt -> Bật lên
            isMusicPlaying = true;
            musicBtn.setAttribute('data-tooltip', 'Tắt thuyết minh');
            if (musicIcon) {
                musicIcon.innerHTML = `
                    <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                `;
            }
            
            // Lấy nguồn nhạc và phát
            const sceneId = viewer.getScene();
            const audioUrl = sceneAudios[sceneId];
            if (audioUrl) {
                const encodedUrl = encodeURI(audioUrl);
                if (!audioPlayer.src || !audioPlayer.src.endsWith(encodedUrl)) {
                    audioPlayer.src = encodedUrl;
                    audioPlayer.load();
                }
                audioPlayer.play().catch(err => {
                    console.log("Không thể phát âm thanh: ", err.message);
                });
            }
        }
    });
}

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
    e.stopPropagation();
    headerOverlay.classList.toggle('collapsed');
    updateToggleIcon();
});

function updateToggleIcon() {
    if (headerOverlay.classList.contains('collapsed')) {
        infoToggleBtn.setAttribute('data-tooltip', 'Hiện thông tin');
        infoToggleIcon.innerHTML = `
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
        `;
    } else {
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
        e.stopPropagation();
        
        // Nếu đang ở cảnh khác, tải lại cảnh Ga Thủ Thiêm
        if (viewer.getScene() !== 'ga_thu_thiem') {
            viewer.loadScene('ga_thu_thiem');
        } else {
            // Nếu đã ở Ga Thủ Thiêm, reset góc nhìn về mặc định mượt mà
            viewer.lookAt(0, 0, 100, 1000);
        }
    });
}

/* ==========================================
   8. Sự kiện Thay đổi Cảnh (Scene Change Listener)
   Cập nhật thông tin tiêu đề/mô tả tương ứng với cảnh hiện tại
   ========================================== */
viewer.on('scenechange', function(sceneId) {
    // 1. Tạm dừng âm thanh cũ ngay lập tức khi bắt đầu chuyển cảnh để tránh lag và đè tiếng
    audioPlayer.pause();
    
    // 2. Cập nhật nội dung tiêu đề/mô tả
    const title = document.querySelector('.header-overlay h1');
    const desc = document.querySelector('.header-overlay p');
    
    if (!title || !desc) return;
    
    if (sceneId === 'ga_thu_thiem') {
        title.innerText = "Ga Thủ Thiêm 360°";
        desc.innerText = "Trình xem ảnh toàn cảnh Panorama sống động và mượt mà tích hợp WebGL.";
    } else if (sceneId === 'rach_chiec') {
        title.innerText = "Rạch Chiếc 360°";
        desc.innerText = "Khu liên hợp Thể dục Thể thao Rạch Chiếc quy hoạch tương lai.";
    } else if (sceneId === 'cat_lai') {
        title.innerText = "Cát Lái 360°";
        desc.innerText = "Nút giao thông Cát Lái - cửa ngõ Đông TP.HCM sầm uất.";
    }
});
