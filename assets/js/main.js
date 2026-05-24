document.addEventListener('DOMContentLoaded', () => {
    // 1. 開場動畫時序
    initOpeningAnimation();

    // 2. 點擊進入
    initEnterTransition();

    // 3. 深色模式切換
    initDarkMode();

    // 4. 滾動揭示
    initScrollReveal();

    // 5. 計數器功能
    initCounterModule();

    // 6. 跑馬燈功能
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        cloneMarquee(marqueeTrack);  
    }

    // 7. 預約彈窗功能
    initBookingModal();


    // 8. 星星視差效果
    initStarParallax();

    // 9. 技術佔比統計圖表初始化 
    initTechChart();

    // 10. 導航欄滾動縮放與巨型菜單行動端點擊切換功能
    initNavbarInteraction();

    // 11. 拖曳排序瀑布流功能
    initDraggableMasonry();
});

// 開場動畫模組化
function initOpeningAnimation() {
    const catBubble = document.querySelector('#cat-bubble');
    const typewriter = document.querySelector('#typewriter-text');
    const enterBtn = document.querySelector('#enter-btn');

    setTimeout(() => {
        if (catBubble) catBubble.textContent = "喵！準備好冒險了嗎？";
        if (typewriter) typewriter.classList.add('start-typing');
        
        setTimeout(() => { 
            if (enterBtn) {
                enterBtn.style.opacity = '1';
                enterBtn.style.transition = 'opacity 0.5s ease';
            }
        }, 3200);
    }, 1000);
}

// 點擊進入模組化
function initEnterTransition() {
    const enterBtn = document.querySelector('#enter-btn');
    const landingPage = document.querySelector('#landing-page');
    const mainContent = document.querySelector('#main-content');
    const themeToggle = document.querySelector('#theme-toggle');
    const circleFlash = document.querySelector('#circle-flash');
    const catBubble = document.querySelector('#cat-bubble');
    const catNavigator = document.querySelector('#cat-navigator');
    const themeTooltip = document.querySelector('#theme-tooltip');

    if (!enterBtn) return;

    enterBtn.addEventListener('click', () => {
        if (catNavigator) catNavigator.classList.add('cat-dash');
        if (catBubble) catBubble.style.opacity = '0';
        if (circleFlash) circleFlash.classList.add('active');
        
        setTimeout(() => {
            document.body.classList.add('main-reveal');
            if (landingPage) landingPage.classList.add('warp-exit');
            if (mainContent) mainContent.style.display = 'block';
            if (themeToggle) themeToggle.style.display = 'flex';
            if (themeTooltip) themeTooltip.classList.add('is-visible');
            
            setTimeout(() => { 
                if (mainContent) mainContent.style.opacity = '1'; 
            }, 50);
        }, 600);

        // 徹底清理開場層以釋放效能
        setTimeout(() => {
            if (landingPage) landingPage.style.display = 'none';
        }, 2000);
    });
}

// 深色模式切換模組化
function initDarkMode() {
    const themeToggle = document.querySelector('#theme-toggle');
    const themeTooltip = document.querySelector('#theme-tooltip');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        if (themeTooltip) {
            themeTooltip.style.animation = 'none'; // 停止漂浮動畫
            themeTooltip.style.opacity = '0';
            themeTooltip.style.transform = 'translateY(15px)';
            setTimeout(() => themeTooltip.remove(), 400); // 400ms 後從 DOM 移除
        }

        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggle.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
        }
    });
}

// 滾動揭示模組化
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
}

// 計數器模組化
function initCounterModule() {
    let counter = 0;
    const display = document.getElementById('counterDisplay');
    const btnMinus = document.getElementById('decrease');
    const btnAdd = document.getElementById('increase');
    const btnReset = document.getElementById('reset');

    // 內部渲染函式
    const render = () => {
        if (display) display.textContent = counter;
    };

    // 邏輯處理
    const updateCounter = (action) => {
        if (action === 'add') counter++;
        else if (action === 'subtract') counter--;
        else if (action === 'reset') counter = 0;
        render();
    };

    // 事件監聽 (使用條件判斷確保元素存在)
    if (btnAdd) btnAdd.addEventListener('click', () => updateCounter('add'));
    if (btnMinus) btnMinus.addEventListener('click', () => updateCounter('subtract'));
    if (btnReset) btnReset.addEventListener('click', () => updateCounter('reset'));

    // 初始化顯示
    render();
}

// 跑馬燈模組化
function cloneMarquee(track) {
    
    if (!track) {
        return;
    }

    const viewport = track.parentElement;
    const sourceItems = Array.from(track.children).filter((item) => !item.hasAttribute('data-marquee-clone'));

    if (!sourceItems.length) {
        return;
    }

    const buildSegment = (repeatCount, hidden = false) => {
        const fragment = document.createDocumentFragment();

        for (let repeatIndex = 0; repeatIndex < repeatCount; repeatIndex += 1) {
            sourceItems.forEach((item) => {
                const clone = item.cloneNode(true);
                if (hidden) {
                    clone.setAttribute('aria-hidden', 'true');
                }
                clone.setAttribute('data-marquee-clone', 'true');
                fragment.appendChild(clone);
            });
        }

        return fragment;
    };

    const render = () => {
        track.replaceChildren();

        const baseline = buildSegment(1, false);
        track.appendChild(baseline);

        const baseWidth = track.scrollWidth || 1;
        const viewportWidth = viewport?.clientWidth || window.innerWidth;
        const repeatCount = Math.max(1, Math.ceil((viewportWidth * 1.2) / baseWidth));

        track.replaceChildren();
        track.appendChild(buildSegment(repeatCount, false));
        track.appendChild(buildSegment(repeatCount, true));
    };

    render();
    window.addEventListener('resize', () => {
        window.requestAnimationFrame(render);
    }, { passive: true });

    track.dataset.marqueeReady = 'true';
}

// 預約彈窗初始化模組 
function initBookingModal() {
    const reserveBtn = document.getElementById('reserve-btn');
    const bookingModal = document.getElementById('booking-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const confirmBtn = document.getElementById('modal-confirm-btn');

    if (!reserveBtn || !bookingModal) return;

    const openModal = () => {
        bookingModal.classList.add('is-active');
    };

    const closeModal = () => {
        bookingModal.classList.remove('is-active');
    };

    // 點擊卡片背面的預約按鈕
    reserveBtn.addEventListener('click', (e) => {
        // e.stopPropagation() 很關鍵！
        // 它可以防止點擊事件往上傳導，避免點了按鈕後卡片又傻傻翻回正面。
        e.stopPropagation(); 
        openModal();
    });

    // 點擊關閉 X 按鈕
    closeBtn?.addEventListener('click', closeModal);
    
    // 點擊確認「好耶！一定準時到」按鈕
    confirmBtn?.addEventListener('click', closeModal);

    // 點擊灰色半透明背景遮罩區域，直接關閉
    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            closeModal();
        }
    });
}

// 星星視差模組化
function initStarParallax() {
    const container = document.getElementById('stars-container');
    if (!container) return;

    // 定義 3 個圖層：[圖層樣式, 滾動速度比率, 星星數量, 尺寸範圍]
    const layers = [
        { class: 'stars-layer-slow', speed: 0.08, count: 160, sizeRange: [0.8, 1.6] }, // 遠景
        { class: 'stars-layer-med', speed: 0.22, count: 85, sizeRange: [1.6, 2.6] },  // 中景
        { class: 'stars-layer-fast', speed: 0.42, count: 35, sizeRange: [2.6, 4.2] }  // 近景
    ];

    const layerElements = [];

    layers.forEach(layerCfg => {
        const layerDiv = document.createElement('div');
        layerDiv.className = `stars-layer ${layerCfg.class}`;
        
        for (let i = 0; i < layerCfg.count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // 隨機讓大約 60% 的星星帶有閃爍動畫，且隨機延遲使閃爍不規律
            if (Math.random() > 0.4) {
                star.classList.add('star-blink');
                star.style.animationDelay = `${Math.random() * 4}s`;
                star.style.animationDuration = `${2 + Math.random() * 3}s`;
            }

            // 星星的位置分佈在 300% 的高度範圍（適應滾動長度）
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 300}%`;

            // 設定隨機大小
            const size = Math.random() * (layerCfg.sizeRange[1] - layerCfg.sizeRange[0]) + layerCfg.sizeRange[0];
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // 星星的顏色隨機（大部分白，偶爾帶有綠極光色、黃色微光）
            const randColor = Math.random();
            if (randColor > 0.9) {
                star.style.backgroundColor = 'var(--accent-color)'; // 溫暖星光色
            } else if (randColor > 0.78) {
                star.style.backgroundColor = 'var(--aurora-2)'; // 極光亮綠色
                star.style.boxShadow = '0 0 8px rgba(0, 245, 212, 0.8)';
            } else {
                star.style.backgroundColor = '#ffffff';
                star.style.boxShadow = `0 0 ${size * 1.5}px rgba(255, 255, 255, 0.5)`;
            }

            layerDiv.appendChild(star);
        }

        container.appendChild(layerDiv);
        layerElements.push({ el: layerDiv, speed: layerCfg.speed });
    });

    // 視差滾動事件
    const handleScroll = () => {
        // 優化：只在深色模式下計算，不浪費淺色模式的運算效能
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (!isDark) return;

        const scrollY = window.scrollY;
        layerElements.forEach(item => {
            // 利用 translateY 創造與滾動速度相反的位移比率，實現超完美 3D 視差
            item.el.style.transform = `translateY(${-scrollY * item.speed}px)`;
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
}

// 技術佔比統計圖表模組化
function initTechChart() {
    const chartSvg = document.getElementById('pie-chart');
    const legendContainer = document.getElementById('chart-legend');
    const centerLabel = document.getElementById('chart-center-label');
    const centerValue = document.getElementById('chart-center-value');

    if (!chartSvg || !legendContainer) return;

    // 定義技術佔比數據集 (與妳的主題色完美契合)
    const techData = [
        { label: 'JavaScript', value: 31.9, color: 'var(--primary-color)' }, // 綠
        { label: 'CSS Styles', value: 40.4, color: 'var(--accent-color)' },  // 黃
        { label: 'HTML', value: 27.7, color: 'var(--aurora-2)' }       // 青綠
    ];

    let accumulatedPercent = 0;
    const paths = [];

    // 1. 動態繪製 SVG 甜甜圈扇形區段
    techData.forEach((slice, index) => {
        const startPercent = accumulatedPercent;
        accumulatedPercent += slice.value / 100;
        const endPercent = accumulatedPercent;

        // 計算弧線起點與終點角度 (將起點減去 0.25 即 -90度，讓它從正上方12點鐘方向開始繪製)
        const startAngle = (startPercent - 0.25) * 2 * Math.PI;
        const endAngle = (endPercent - 0.25) * 2 * Math.PI;

        // 設定甜甜圈內徑與外徑
        const rIn = 65;
        const rOut = 95;

        // 計算四個端點的幾何坐標
        const x1_in = Math.cos(startAngle) * rIn;
        const y1_in = Math.sin(startAngle) * rIn;
        const x1_out = Math.cos(startAngle) * rOut;
        const y1_out = Math.sin(startAngle) * rOut;

        const x2_in = Math.cos(endAngle) * rIn;
        const y2_in = Math.sin(endAngle) * rIn;
        const x2_out = Math.cos(endAngle) * rOut;
        const y2_out = Math.sin(endAngle) * rOut;

        // 當單一佔比大於 50% 時，大弧標記 (large-arc-flag) 設為 1，否則為 0
        const largeArcFlag = (slice.value > 50) ? 1 : 0;

        // 拼接 SVG Path 幾何軌跡
        const pathData = [
            `M ${x1_in} ${y1_in}`,                     // 移至內圈起點
            `L ${x1_out} ${y1_out}`,                   // 畫直線至外圈起點
            `A ${rOut} ${rOut} 0 ${largeArcFlag} 1 ${x2_out} ${y2_out}`, // 順時針畫外圈圓弧
            `L ${x2_in} ${y2_in}`,                     // 畫直線至內圈終點
            `A ${rIn} ${rIn} 0 ${largeArcFlag} 0 ${x1_in} ${y1_in}`,   // 逆時針畫內圈圓弧
            `Z`                                        // 封閉路徑
        ].join(' ');

        // 建立 SVG Path 元素
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', slice.color);
        path.setAttribute('id', `chart-slice-${index}`);
        chartSvg.appendChild(path);
        paths.push(path);

        // 2. 建立右側對應圖例項目
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.id = `legend-item-${index}`;
        legendItem.innerHTML = `
            <span class="legend-color" style="background-color: ${slice.color}"></span>
            <span class="legend-label">${slice.label}</span>
            <span class="legend-percent">${slice.value}%</span>
        `;
        legendContainer.appendChild(legendItem);

        // 3. 雙向綁定互動事件 (滑鼠移入、移出、點擊)
        const highlightSlice = () => {
            // 💡 懸停動態效果：向扇形平分角方向彈出 8px，並加上發光陰影
            const midAngle = (startAngle + endAngle) / 2;
            const dx = Math.cos(midAngle) * 8;
            const dy = Math.sin(midAngle) * 8;
            
            path.style.transform = `translate(${dx}px, ${dy}px)`;
            path.style.filter = 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))';
            
            // 更新甜甜圈中央提示字樣
            if (centerLabel) {
                centerLabel.textContent = slice.label;
                centerLabel.style.color = slice.color;
            }
            if (centerValue) {
                centerValue.textContent = `${slice.value}%`;
                centerValue.style.color = slice.color;
            }

            legendItem.classList.add('is-active');
        };

        const resetSlice = () => {
            // 還原狀態
            path.style.transform = 'none';
            path.style.filter = 'none';

            if (centerLabel) {
                centerLabel.textContent = '總計';
                centerLabel.style.color = 'var(--text-secondary)';
            }
            if (centerValue) {
                centerValue.textContent = '100%';
                centerValue.style.color = 'var(--text-dark)';
            }

            legendItem.classList.remove('is-active');
        };

        // 綁定圓餅圖扇區事件
        path.addEventListener('mouseenter', highlightSlice);
        path.addEventListener('mouseleave', resetSlice);

        // 綁定圖例清單事件
        legendItem.addEventListener('mouseenter', highlightSlice);
        legendItem.addEventListener('mouseleave', resetSlice);
    });
}

// 導航欄滾動縮放與巨型菜單行動端點擊切換模組
function initNavbarInteraction() {
    const header = document.getElementById('main-header');
    const megaTrigger = document.getElementById('mega-trigger');
    const megaMenu = document.getElementById('mega-menu');
    const megaReserveShortcut = document.getElementById('mega-reserve-shortcut');

    if (!header) return;

    // A. 監聽滾動以調整導航欄透明度與高度
    const checkScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll(); // 初始化量測

    // B. 行動端點擊開關巨型選單（防止觸控螢幕上 hover 無效）
    if (megaTrigger) {
        megaTrigger.addEventListener('click', (e) => {
            // 僅在寬度小於或等於 1024px (行動/平板裝置) 時啟用 click 切換
            if (window.innerWidth <= 1024) {
                // 如果點擊的是選單內部的連結，則不干擾
                if (e.target.closest('.mega-menu')) return;
                
                e.preventDefault();
                megaTrigger.classList.toggle('is-active');
            }
        });

        // 點擊其他空白處自動關閉行動端巨型菜單
        document.addEventListener('click', (e) => {
            if (!megaTrigger.contains(e.target)) {
                megaTrigger.classList.remove('is-active');
            }
        });
    }

    // C. 巨型菜單特色卡片中的按鈕，點擊時直接觸發新宿卡片的預約彈窗！
    if (megaReserveShortcut) {
        megaReserveShortcut.addEventListener('click', (e) => {
            e.preventDefault();
            // 先關閉巨型選單
            if (megaTrigger) megaTrigger.classList.remove('is-active');
            
            // 平滑滾動到卡片區塊
            const spotSection = document.getElementById('spot-section');
            if (spotSection) {
                spotSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            // 直接觸發預約彈窗 (模擬點擊卡片背面的預約按鈕)
            setTimeout(() => {
                const reserveBtn = document.getElementById('reserve-btn');
                if (reserveBtn) {
                    reserveBtn.click();
                }
            }, 500); // 稍微等待滾動動畫完成
        });
    }
}

// 拖曳排序瀑布流模組化
function initDraggableMasonry() {
    const grid = document.getElementById('draggable-masonry');
    if (!grid) return;

    // 監聽拖曳開始事件
    grid.addEventListener('dragstart', (e) => {
        const targetCard = e.target.closest('.masonry-item');
        if (targetCard) {
            targetCard.classList.add('dragging');
            // 設定拖曳時的游標與特效
            e.dataTransfer.effectAllowed = 'move';
            // 💡 為了在某些瀏覽器上完美支援，設定一個空資料以啟用拖曳
            e.dataTransfer.setData('text/plain', '');
        }
    });

    // 監聽拖曳結束事件
    grid.addEventListener('dragend', (e) => {
        const targetCard = e.target.closest('.masonry-item');
        if (targetCard) {
            targetCard.classList.remove('dragging');
        }
    });

    // 監聽拖曳經過事件（計算放置位置）
    grid.addEventListener('dragover', (e) => {
        e.preventDefault(); // 必須 preventDefault 才能觸發 drop
        
        const draggingItem = grid.querySelector('.dragging');
        if (!draggingItem) return;

        // 取得網格內除當前拖曳項目的所有卡片
        const siblings = Array.from(grid.querySelectorAll('.masonry-item:not(.dragging)'));

        // 利用幾何學中點距離演算法，找出滑鼠游標最靠近的明信片兄弟節點
        const nextSibling = siblings.find(sibling => {
            const box = sibling.getBoundingClientRect();
            // 💡 在瀑布流中，我們以卡片的中軸線高度作為判定標準，滑鼠 Y 軸小於卡片中點就插在前方
            return e.clientY <= box.top + box.height / 2;
        });

        // 動態將卡片插到新位置，實現極度流暢的物理磁力滑入感
        if (nextSibling) {
            grid.insertBefore(draggingItem, nextSibling);
        } else {
            grid.appendChild(draggingItem);
        }
    });
}