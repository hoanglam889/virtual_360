// Khởi tạo biến lưu trạng thái tự động xoay
let isAutoRotating = true;
const autoRotateSpeed = -2; // Tốc độ xoay tự động (giá trị âm: xoay từ trái qua phải)

// 2D Viewer State
let is2DMode = false;
let scale = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;
let returnScene = "rach_chiec";

const viewer2D = document.getElementById('viewer-2d');
const img2D = document.getElementById('img-2d');
const svgOverlay2D = document.getElementById('svg-overlay-2d');

/**
 * Hiệu ứng phóng to / bay camera vào một tọa độ chỉ định trong không gian 3D
 * @param {number} pitch - Vĩ độ đích
 * @param {number} yaw - Kinh độ đích
 * @param {number} targetHfov - Độ thu phóng mục tiêu (mặc định 45)
 * @param {number} duration - Thời gian bay (ms, mặc định 1200ms)
 * @param {function} onComplete - Hàm gọi sau khi zoom xong
 */
function zoomToTarget3D(pitch, yaw, targetHfov = 45, duration = 1200, onComplete) {
    if (!viewer) return;
    viewer.stopAutoRotate();
    viewer.lookAt(pitch, yaw, targetHfov, duration);
    if (onComplete) {
        setTimeout(onComplete, duration);
    }
}

/**
 * Hàm xử lý sự kiện click của hotspot để chuyển cảnh 3D có kèm hiệu ứng zoom-in
 */
function handleSceneTransitionHotspot(event, args) {
    const { pitch, yaw, targetSceneId } = args;
    zoomToTarget3D(pitch, yaw, 45, 1200, () => {
        const loading = document.getElementById('loading-overlay');
        if (loading) {
            loading.style.display = 'flex';
            loading.style.opacity = '1';
        }
        setTimeout(() => {
            viewer.loadScene(targetSceneId);
        }, 150);
    });
}

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
                    "type": "info",
                    "text": "Khu liên hợp TDTT Rạch Chiếc",
                    "cssClass": "custom-arrow",
                    "clickHandlerFunc": handleSceneTransitionHotspot,
                    "clickHandlerArgs": { "pitch": -1.2864, "yaw": 156.6523, "targetSceneId": "rach_chiec" }
                },
                {
                    "pitch": -2.3097,
                    "yaw": 124.4251,
                    "type": "info",
                    "text": "Nút giao Cát Lái",
                    "cssClass": "custom-arrow",
                    "clickHandlerFunc": handleSceneTransitionHotspot,
                    "clickHandlerArgs": { "pitch": -2.3097, "yaw": 124.4251, "targetSceneId": "cat_lai" }
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
                    "type": "info",
                    "text": "Nút giao Cát Lái",
                    "cssClass": "custom-arrow",
                    "clickHandlerFunc": handleSceneTransitionHotspot,
                    "clickHandlerArgs": { "pitch": -30.2784, "yaw": -15.3309, "targetSceneId": "cat_lai" }
                },
                {
                    "pitch": -9.1069,
                    "yaw": -61.4145,
                    "type": "info",
                    "text": "Ga Thủ Thiêm",
                    "cssClass": "custom-arrow",
                    "clickHandlerFunc": handleSceneTransitionHotspot,
                    "clickHandlerArgs": { "pitch": -9.1069, "yaw": -61.4145, "targetSceneId": "ga_thu_thiem" }
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
                    "type": "info",
                    "text": "Khu liên hợp TDTT Rạch Chiếc",
                    "cssClass": "custom-arrow",
                    "clickHandlerFunc": handleSceneTransitionHotspot,
                    "clickHandlerArgs": { "pitch": -18.3883, "yaw": -168.5283, "targetSceneId": "rach_chiec" }
                },
                {
                    "pitch": -3.8590,
                    "yaw": -118.8417,
                    "type": "info",
                    "text": "Ga Thủ Thiêm",
                    "cssClass": "custom-arrow",
                    "clickHandlerFunc": handleSceneTransitionHotspot,
                    "clickHandlerArgs": { "pitch": -3.8590, "yaw": -118.8417, "targetSceneId": "ga_thu_thiem" }
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
        
        if (is2DMode) {
            // Quay lại cảnh 3D trước khi vào 2D, thay vì luôn trả về Ga Thủ Thiêm
            exit2DScene();
        } else {
            // Nếu đang ở cảnh khác, tải lại cảnh Ga Thủ Thiêm
            if (viewer.getScene() !== 'ga_thu_thiem') {
                viewer.loadScene('ga_thu_thiem');
            } else {
                // Nếu đã ở Ga Thủ Thiêm, reset góc nhìn về mặc định mượt mà
                viewer.lookAt(0, 0, 100, 1000);
            }
        }
    });
}

/* ==========================================
   8. Sự kiện Thay đổi Cảnh (Scene Change Listener)
   Cập nhật thông tin tiêu đề/mô tả tương ứng với cảnh hiện tại
   ========================================== */
viewer.on('scenechange', function(sceneId) {
    // Nếu đang ở 2D và cảnh thay đổi, thoát 2D
    if (is2DMode) {
        exit2DScene(sceneId);
    }

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

/* ==========================================================================
   9. Tích hợp vẽ Đa giác & Highlight dự án Mặt bằng Rạch Chiếc
   ========================================================================== */

// 6 điểm tọa độ được lấy chính xác từ công cụ coords.html
const rachChiecPolyCoords = [
  [-31.9508, 75.8140],
  [-31.9272, 78.9108],
  [-32.3646, 83.9927],
  [-33.5762, 85.1341],
  [-43.7412, 79.5336],
  [-40.4566, 67.5875]
];

// Khởi tạo các điểm đỉnh ẩn vào cảnh 'rach_chiec' để làm điểm neo định vị
function polyVertexTooltipFunc(hotSpotDiv, args) {
    hotSpotDiv.setAttribute('data-point-id', args.id);
    // Ẩn hoàn toàn điểm neo nhưng giữ lại trong layout để lấy vị trí màn hình
    hotSpotDiv.style.width = '0px';
    hotSpotDiv.style.height = '0px';
    hotSpotDiv.style.opacity = '0';
    hotSpotDiv.style.pointerEvents = 'none';
}

rachChiecPolyCoords.forEach((coord, index) => {
    const pointId = `rach-chiec-poly-vertex-${index}`;
    viewer.addHotSpot({
        id: pointId,
        pitch: coord[0],
        yaw: coord[1],
        type: 'info',
        cssClass: 'poly-vertex-marker',
        createTooltipFunc: polyVertexTooltipFunc,
        createTooltipArgs: { id: pointId }
    }, 'rach_chiec');
});

// Lấy các phần tử DOM phục vụ tương tác highlight đa giác
const polyRachChiec = document.getElementById('poly-rach-chiec');
const polyTooltip = document.getElementById('poly-tooltip');

if (polyRachChiec && polyTooltip) {
    // Khi di chuột vào đa giác: Tô màu viền và nền nổi bật
    polyRachChiec.addEventListener('mouseenter', () => {
        polyRachChiec.setAttribute('fill', 'rgba(255, 8, 68, 0.35)');
        polyRachChiec.setAttribute('stroke', '#ff0844');
        polyRachChiec.setAttribute('stroke-width', '3.5');
        polyRachChiec.style.filter = 'drop-shadow(0 0 8px rgba(255, 8, 68, 0.8))';
        
        polyTooltip.innerText = "SVĐ Rạch Chiếc (Xem Sơ đồ 2D)";
        polyTooltip.style.borderColor = "#ff0844";
        polyTooltip.style.display = 'block';
        setTimeout(() => {
            polyTooltip.style.opacity = '1';
        }, 10);
    });
    
    // Di chuyển tooltip theo con trỏ chuột
    polyRachChiec.addEventListener('mousemove', (e) => {
        const container = document.getElementById('tour-container');
        const containerRect = container.getBoundingClientRect();
        const x = e.clientX - containerRect.left;
        const y = e.clientY - containerRect.top;
        
        polyTooltip.style.left = `${x}px`;
        polyTooltip.style.top = `${y - 12}px`;
    });
    
    // Khi di chuột ra ngoài: Khôi phục lại trạng thái mặc định mờ hơn
    polyRachChiec.addEventListener('mouseleave', () => {
        polyRachChiec.setAttribute('fill', 'rgba(255, 8, 68, 0.05)');
        polyRachChiec.setAttribute('stroke', 'rgba(255, 8, 68, 0.5)');
        polyRachChiec.setAttribute('stroke-width', '2');
        polyRachChiec.style.filter = 'drop-shadow(0 0 3px rgba(255, 8, 68, 0.3))';
        
        polyTooltip.style.opacity = '0';
        setTimeout(() => {
            polyTooltip.style.display = 'none';
        }, 200);
    });

    // Khi click vào đa giác 3D: Phóng to (zoom) và chuyển sang Sơ đồ 2D của Sân bóng
    polyRachChiec.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Tâm của đa giác Rạch Chiếc nằm khoảng: Pitch -35.6, Yaw 78.5
        zoomToTarget3D(-35.6, 78.5, 45, 1200, () => {
            // Hiện loading overlay mượt mà
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.style.display = 'flex';
                loadingOverlay.style.opacity = '1';
            }
            
            setTimeout(() => {
                switchTo2DScene("images/2D/SANBONG.jpg", "rach_chiec");
                
                // Ẩn loading overlay sau khi chuyển đổi xong
                if (loadingOverlay) {
                    setTimeout(() => {
                        loadingOverlay.style.opacity = '0';
                        setTimeout(() => {
                            loadingOverlay.style.display = 'none';
                        }, 600);
                    }, 400);
                }
            }, 300);
        });
    });
}

// Vòng lặp liên tục đồng bộ đa giác SVG theo góc xoay/zoom của WebGL
function updateTourOverlay() {
    const activeScene = viewer.getScene();
    const svgOverlay = document.getElementById('tour-svg-overlay');
    
    if (activeScene === 'rach_chiec') {
        svgOverlay.style.display = 'block';
        
        const container = document.getElementById('panorama-viewer');
        const containerRect = container.getBoundingClientRect();
        
        const points = [];
        
        rachChiecPolyCoords.forEach((coord, index) => {
            const div = document.querySelector(`[data-point-id="rach-chiec-poly-vertex-${index}"]`);
            if (div) {
                const rect = div.getBoundingClientRect();
                const x = rect.left - containerRect.left;
                const y = rect.top - containerRect.top;
                points.push(`${x},${y}`);
            }
        });
        
        if (points.length > 2) {
            polyRachChiec.setAttribute('points', points.join(' '));
            polyRachChiec.style.display = 'block';
        } else {
            polyRachChiec.style.display = 'none';
        }
    } else {
        svgOverlay.style.display = 'none';
    }
    
    requestAnimationFrame(updateTourOverlay);
}

// Bắt đầu chạy đồng bộ SVG overlay
updateTourOverlay();

/* ==========================================================================
   10. Tương tác và Điều khiển sơ đồ 2D Sân bóng (SANBONG.jpg)
   ========================================================================== */

const sanBongPolyCoords = [
  [269, 341],
  [291, 341],
  [312, 342],
  [324, 356],
  [330, 384],
  [331, 403],
  [319, 422],
  [293, 431],
  [267, 432],
  [244, 425],
  [229, 408],
  [217, 376],
  [229, 353],
  [249, 345]
];

function switchTo2DScene(imgPath, returnSceneId) {
    returnScene = returnSceneId || "rach_chiec";
    is2DMode = true;
    
    // Dừng tự động xoay
    viewer.stopAutoRotate();
    
    // Ẩn 3D
    document.getElementById('panorama-viewer').style.display = 'none';
    document.getElementById('tour-svg-overlay').style.display = 'none';
    
    // Hiện 2D
    viewer2D.style.display = 'block';
    img2D.src = imgPath;
    
    img2D.onload = function() {
        const containerWidth = viewer2D.clientWidth;
        const containerHeight = viewer2D.clientHeight;
        const imgWidth = img2D.naturalWidth;
        const imgHeight = img2D.naturalHeight;
        
        img2D.style.width = imgWidth + 'px';
        img2D.style.height = imgHeight + 'px';
        svgOverlay2D.style.width = imgWidth + 'px';
        svgOverlay2D.style.height = imgHeight + 'px';
        svgOverlay2D.setAttribute('viewBox', `0 0 ${imgWidth} ${imgHeight}`);
        
        // Thu phóng cho vừa màn hình
        const scaleX = containerWidth / imgWidth;
        const scaleY = containerHeight / imgHeight;
        scale = Math.min(scaleX, scaleY) * 0.8;
        if (scale > 1) scale = 1;
        
        translateX = (containerWidth - imgWidth * scale) / 2;
        translateY = (containerHeight - imgHeight * scale) / 2;
        
        update2DTransform();
        
        // Vẽ đa giác
        const polySanBong = document.getElementById('poly-san-bong');
        if (polySanBong) {
            const pointsStr = sanBongPolyCoords.map(pt => `${pt[0]},${pt[1]}`).join(' ');
            polySanBong.setAttribute('points', pointsStr);
        }
    };
    
    // Cập nhật tiêu đề trên Header
    const title = document.querySelector('.header-overlay h1');
    const desc = document.querySelector('.header-overlay p');
    if (title && desc) {
        title.innerText = "Mặt bằng 2D Sân Bóng";
        desc.innerText = "Sơ đồ mặt bằng chi tiết của Dự án Sân vận động Rạch Chiếc.";
    }
    
    // Cập nhật nhãn nút Home
    const homeBtnSpan = homeBtn.querySelector('span');
    if (homeBtnSpan) {
        homeBtnSpan.innerText = "⬅ Quay lại cảnh 3D";
    }
}

function exit2DScene(targetSceneId) {
    is2DMode = false;
    
    // Ẩn 2D
    viewer2D.style.display = 'none';
    
    // Hiện 3D
    document.getElementById('panorama-viewer').style.display = 'block';
    
    // Khôi phục nhãn nút Home
    const homeBtnSpan = homeBtn.querySelector('span');
    if (homeBtnSpan) {
        homeBtnSpan.innerText = "🏠 Về Ga Thủ Thiêm";
    }
    
    // Chuyển cảnh về 3D tương ứng
    const dest = targetSceneId || returnScene || "ga_thu_thiem";
    viewer.loadScene(dest);
}

// Xử lý kéo kéo (Pan) cho 2D
viewer2D.addEventListener('mousedown', (e) => {
    if (!is2DMode) return;
    if (e.button !== 0) return;
    isDragging = true;
    viewer2D.style.cursor = 'grabbing';
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
});

viewer2D.addEventListener('mousemove', (e) => {
    if (!is2DMode || !isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    update2DTransform();
});

const stopDragging2D = () => {
    if (isDragging) {
        isDragging = false;
        viewer2D.style.cursor = 'grab';
    }
};
viewer2D.addEventListener('mouseup', stopDragging2D);
viewer2D.addEventListener('mouseleave', stopDragging2D);

// Xử lý zoom 2D
viewer2D.addEventListener('wheel', (e) => {
    if (!is2DMode) return;
    e.preventDefault();
    
    const containerRect = viewer2D.getBoundingClientRect();
    const mx = e.clientX - containerRect.left;
    const my = e.clientY - containerRect.top;
    
    const zoomFactor = 1.1;
    let newScale = scale;
    if (e.deltaY < 0) {
        newScale = scale * zoomFactor;
    } else {
        newScale = scale / zoomFactor;
    }
    
    newScale = Math.max(0.1, Math.min(15, newScale));
    
    translateX = mx - (mx - translateX) * (newScale / scale);
    translateY = my - (my - translateY) * (newScale / scale);
    scale = newScale;
    
    update2DTransform();
}, { passive: false });

function update2DTransform() {
    img2D.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    svgOverlay2D.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

// Xử lý tương tác Hover & Click đa giác SVĐ Rạch Chiếc trên 2D
const polySanBong = document.getElementById('poly-san-bong');
if (polySanBong && polyTooltip) {
    polySanBong.addEventListener('mouseenter', () => {
        polySanBong.setAttribute('fill', 'rgba(0, 242, 254, 0.4)');
        polySanBong.setAttribute('stroke-width', '3.5');
        
        polyTooltip.innerText = "SVĐ Rạch Chiếc (Mở tài liệu Drive)";
        polyTooltip.style.borderColor = "#00f2fe";
        polyTooltip.style.display = 'block';
        setTimeout(() => {
            polyTooltip.style.opacity = '1';
        }, 10);
    });
    
    polySanBong.addEventListener('mousemove', (e) => {
        const container = document.getElementById('tour-container');
        const containerRect = container.getBoundingClientRect();
        const x = e.clientX - containerRect.left;
        const y = e.clientY - containerRect.top;
        
        polyTooltip.style.left = `${x}px`;
        polyTooltip.style.top = `${y - 12}px`;
    });
    
    polySanBong.addEventListener('mouseleave', () => {
        polySanBong.setAttribute('fill', 'rgba(0, 242, 254, 0.15)');
        polySanBong.setAttribute('stroke-width', '2.5');
        
        polyTooltip.style.opacity = '0';
        setTimeout(() => {
            polyTooltip.style.display = 'none';
        }, 200);
    });
    
    polySanBong.addEventListener('click', (e) => {
        e.stopPropagation();
        openVideoModal("https://drive.google.com/file/d/1AiF3cfcqJ93X76EhLoK6_xnuiV97Qo9k/preview?autoplay=1");
    });
}

/* ==========================================================================
   11. Điều khiển Video Modal Popup (Phát trực tiếp trên trang)
   ========================================================================== */
const videoModal = document.getElementById('video-modal');
const videoIframe = document.getElementById('video-iframe');
const videoModalClose = document.getElementById('video-modal-close');
const videoModalBackdrop = document.querySelector('.video-modal-backdrop');

let wasMusicPlayingBeforeVideo = false;

function openVideoModal(videoUrl) {
    if (!videoModal || !videoIframe) return;
    
    // Lưu trạng thái âm thanh thuyết minh
    wasMusicPlayingBeforeVideo = isMusicPlaying;
    if (isMusicPlaying) {
        audioPlayer.pause();
    }
    
    // Gán source iframe (chấp nhận cả link YouTube lẫn Google Drive preview)
    videoIframe.src = videoUrl;
    
    // Hiển thị modal
    videoModal.style.display = 'flex';
    setTimeout(() => {
        videoModal.classList.add('show');
    }, 10);
}

function closeVideoModal() {
    if (!videoModal || !videoIframe) return;
    
    // Reset source để tắt video hoàn toàn tránh chạy ngầm
    videoIframe.src = '';
    
    // Ẩn modal
    videoModal.classList.remove('show');
    setTimeout(() => {
        videoModal.style.display = 'none';
    }, 300);
    
    // Phát lại âm thanh thuyết minh nếu đang được bật trước đó
    if (wasMusicPlayingBeforeVideo && isMusicPlaying) {
        audioPlayer.play().catch(err => {
            console.log("Không thể phát lại âm thanh thuyết minh: ", err.message);
        });
    }
}

if (videoModalClose) {
    videoModalClose.addEventListener('click', closeVideoModal);
}
if (videoModalBackdrop) {
    videoModalBackdrop.addEventListener('click', closeVideoModal);
}
