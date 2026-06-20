// 宣告全域行程表陣列
let itineraryList = [];

document.addEventListener('DOMContentLoaded', () => {
    // 1. 開場動畫時序
    initOpeningAnimation();

    // 2. 點擊進入
    initEnterTransition();

    // 3. 深色模式切換
    initDarkMode();

    // 4. 滾動揭示
    initScrollReveal();

    // 5. 跑馬燈功能
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        initMarquee(marqueeTrack);  
    }

    // 6. 各國深度探索彈窗功能 (內建行程聯動與拖拽綁定機制)
    initExploreModal();

    // 7. 星星視差效果
    initStarParallax();

    // 8. 技術佔比統計圖表初始化 
    initTechChart();

    // 9. 導航欄滾動縮放與巨型菜單行動端點擊切換功能
    initNavbarInteraction();

    // 💡 10. 初始化行程規劃牆的拖拽事件監聽 (動態資料庫雙向綁定引擎)
    initItineraryDragAndDrop();

    initScrollProgressBar();
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
            themeTooltip.style.animation = 'none'; 
            themeTooltip.style.opacity = '0';
            themeTooltip.style.transform = 'translateY(15px)';
            setTimeout(() => themeTooltip.remove(), 400); 
        }

        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    });
}

// 滾動揭示模組化
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));
}

// 跑馬燈模組化
function initMarquee(track) {
    const viewport = track.parentElement;
    let sourceItems = Array.from(track.children).filter(item => !item.hasAttribute('data-marquee-clone'));
    
    if (!sourceItems.length && track.children.length > 0) {
        sourceItems = Array.from(track.children);
        sourceItems.forEach(item => {
            item.removeAttribute('data-marquee-clone');
            item.removeAttribute('aria-hidden');
        });
    }

    if (!sourceItems.length) return;

    const render = () => {
        track.replaceChildren();

        const fragment = document.createDocumentFragment();
        sourceItems.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('data-marquee-clone', 'true');
            fragment.appendChild(clone);
        });

        track.appendChild(fragment.cloneNode(true));
        track.appendChild(fragment.cloneNode(true));
        
        let safeGuard = 0;
        while (track.scrollWidth > 0 && track.scrollWidth < window.innerWidth * 2 && safeGuard < 15) {
            track.appendChild(fragment.cloneNode(true));
            safeGuard++;
        }
    };

    render();
    window.addEventListener('resize', () => {
        window.requestAnimationFrame(render);
    }, { passive: true });

    const enterBtn = document.querySelector('#enter-btn');
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            setTimeout(render, 650); 
        });
    }

    track.dataset.marqueeReady = 'true';
}

// 深度探索動態渲染彈窗功能 (含行程添加聯動)
function initExploreModal() {
    const bookingModal = document.getElementById('booking-modal');
    const modalBody = document.getElementById('modal-dynamic-body');
    const closeBtn = document.getElementById('modal-close-btn');

    if (!bookingModal || !modalBody) return;

    const closeModal = () => {
        bookingModal.classList.remove('is-active');
    };

    // 監聽彈窗內部「加入行程」按鈕的點擊事件
    modalBody.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.modal-add-city-btn');
        if (addBtn) {
            const country = addBtn.getAttribute('data-country');
            const city = addBtn.getAttribute('data-city');
            const iconClass = addBtn.getAttribute('data-icon');

            addCityToItinerary(country, city, iconClass);

            // 更新按鈕當前狀態為「已加入」
            addBtn.classList.add('added');
            addBtn.setAttribute('disabled', 'true');
            addBtn.innerHTML = '<i class="fa-solid fa-check"></i> 已加入';
        }
    });

    // 監聽景點「了解更多」開啟彈窗的點擊
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.reserve-btn');
        if (!btn) return;

        e.stopPropagation(); // 阻斷事件冒泡，防止 3D 卡片翻轉干擾

        // 讀取各國大數據屬性
        const country = btn.getAttribute('data-country');
        const iconClass = btn.getAttribute('data-icon');
        const cities = btn.getAttribute('data-cities');
        
        let moreCities = [];
        try {
            moreCities = JSON.parse(btn.getAttribute('data-more'));
        } catch(err) {
            moreCities = [];
        }

        // 動態拼裝帶有「加入行程」互動按鈕的清單 DOM
        let cityItemsHtml = '';
        moreCities.forEach(city => {
            // 檢查該城市是否已被規劃在行程表中
            const isAdded = itineraryList.some(item => item.city === city && item.country === country);
            const btnText = isAdded ? '<i class="fa-solid fa-check"></i> 已加入' : '<i class="fa-solid fa-plus"></i> 加入行程';
            const btnClass = isAdded ? 'modal-add-city-btn added' : 'modal-add-city-btn';
            const btnDisabled = isAdded ? 'disabled="true"' : '';

            cityItemsHtml += `
                <div class="modal-city-item">
                    <span><i class="fa-solid fa-location-dot" style="margin-right: 8px; color: var(--primary-color);"></i> ${city}</span>
                    <button class="${btnClass}" data-country="${country}" data-city="${city}" data-icon="${iconClass}" ${btnDisabled}>${btnText}</button>
                </div>
            `;
        });

        // 注入彈窗主體
        modalBody.innerHTML = `
            <span style="font-size: 3.5rem; animation: catFloat 2s infinite ease-in-out; display: inline-block; color: var(--primary-color);">
                <i class="${iconClass}"></i>
            </span>
            <h2 style="margin: 15px 0 10px; font-weight: 800; color: var(--text-dark);">${country}深度探險牆</h2>
            <p style="color: var(--text-secondary); line-height: 1.6; font-size: 1.05rem; max-width: 400px;">
                除了背面的 <b>${cities}</b> 之外，特別為您準備了以下私房景點，您可以直接點擊「加入行程」來規劃：
            </p>
            <div class="modal-city-list">
                ${cityItemsHtml}
            </div>
            <button id="modal-confirm-btn">完成探索喵！</button>
        `;

        // 顯示彈窗
        bookingModal.classList.add('is-active');

        // 綁定彈窗內部新生成「完成探索喵！」按鈕的關閉事件
        document.getElementById('modal-confirm-btn')?.addEventListener('click', closeModal);
    });

    closeBtn?.addEventListener('click', closeModal);
    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) closeModal();
    });
}

// 增加城市到行程表
function addCityToItinerary(country, city, iconClass) {
    if (itineraryList.some(item => item.city === city && item.country === country)) return;
    itineraryList.push({ country, city, iconClass });
    updateItineraryUI();
}

// 從行程表中移除城市
function removeCityFromItinerary(country, city) {
    itineraryList = itineraryList.filter(item => !(item.city === city && item.country === country));
    updateItineraryUI();

    // 如果目前彈窗依然開啟著，動態將對應的按鈕恢復為可點選狀態
    const activeBtn = document.querySelector(`.modal-add-city-btn[data-country="${country}"][data-city="${city}"]`);
    if (activeBtn) {
        activeBtn.classList.remove('added');
        activeBtn.removeAttribute('disabled');
        activeBtn.innerHTML = '<i class="fa-solid fa-plus"></i> 加入行程';
    }
}

// 更新我的專屬行程規劃牆 UI
function updateItineraryUI() {
    const emptyEl = document.getElementById('itinerary-empty');
    const gridEl = document.getElementById('itinerary-grid');
    if (!emptyEl || !gridEl) return;

    if (itineraryList.length === 0) {
        emptyEl.style.display = 'block';
        gridEl.style.display = 'none';
        gridEl.innerHTML = '';
    } else {
        emptyEl.style.display = 'none';
        gridEl.style.display = 'grid';

        let cardsHtml = '';
        itineraryList.forEach(item => {
            cardsHtml += `
                <div class="itinerary-card" draggable="true" data-country="${item.country}" data-city="${item.city}" data-icon="${item.iconClass}">
                    <div class="itinerary-card-info">
                        <span class="itinerary-card-tag"><i class="${item.iconClass}"></i> ${item.country}</span>
                        <span class="itinerary-card-title">${item.city}</span>
                    </div>
                    <button class="itinerary-card-remove" data-country="${item.country}" data-city="${item.city}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
        });
        gridEl.innerHTML = cardsHtml;

        // 重新為垃圾桶按鈕綁定移除事件
        gridEl.querySelectorAll('.itinerary-card-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const country = btn.getAttribute('data-country');
                const city = btn.getAttribute('data-city');
                removeCityFromItinerary(country, city);
            });
        });
    }
}

// 💡 全新！我的專屬行程拖曳排序與記憶體資料庫雙向綁定引擎 (Itinerary Drag & Drop Engine)
function initItineraryDragAndDrop() {
    const gridEl = document.getElementById('itinerary-grid');
    if (!gridEl) return;

    // A. 監聽拖曳開始事件
    gridEl.addEventListener('dragstart', (e) => {
        const card = e.target.closest('.itinerary-card');
        if (!card) return;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', ''); // 相容部分瀏覽器
    });

    // B. 監聽拖曳結束事件
    gridEl.addEventListener('dragend', (e) => {
        const card = e.target.closest('.itinerary-card');
        if (card) {
            card.classList.remove('dragging');
        }
        // 💡 核心：當使用者放開滑鼠完成排序，立刻重新讀取 DOM 結構，更新 JS 記憶體中的陣列順序！
        syncItineraryArrayFromDOM();
    });

    // C. 監聽拖曳經過事件 (在 Grid 佈局中進行流暢的磁力座標插入運算)
    gridEl.addEventListener('dragover', (e) => {
        e.preventDefault(); // 必須防預設才能觸發 drop
        const draggingItem = gridEl.querySelector('.itinerary-card.dragging');
        if (!draggingItem) return;

        const siblings = Array.from(gridEl.querySelectorAll('.itinerary-card:not(.dragging)'));
        
        // 幾何中軸距離演算法：在 Grid 網格中計算最適滑入位置
        const nextSibling = siblings.find(sibling => {
            const box = sibling.getBoundingClientRect();
            // 當滑鼠 Y 座標小於卡片中心高度，或是 X 座標小於卡片中心寬度時，判定插入在其前方
            const isMouseBeforeSiblingCenter = e.clientY < box.top + box.height / 2 || 
                                              (e.clientY < box.bottom && e.clientX < box.left + box.width / 2);
            return isMouseBeforeSiblingCenter;
        });

        if (nextSibling) {
            gridEl.insertBefore(draggingItem, nextSibling);
        } else {
            gridEl.appendChild(draggingItem);
        }
    });
}

// 💡 重新抓取網格中卡片的順序，將全新的 DOM 結構順序同步寫回 itineraryList 陣列中！
function syncItineraryArrayFromDOM() {
    const gridEl = document.getElementById('itinerary-grid');
    if (!gridEl) return;
    
    const cards = gridEl.querySelectorAll('.itinerary-card');
    itineraryList = Array.from(cards).map(card => {
        return {
            country: card.getAttribute('data-country'),
            city: card.getAttribute('data-city'),
            iconClass: card.getAttribute('data-icon')
        };
    });
}

// 星星視差效果
function initStarParallax() {
    const container = document.getElementById('stars-container');
    if (!container) return;

    container.innerHTML = '';

    const layers = [
        { class: 'stars-layer-slow', speed: 0.08, count: 160, sizeRange: [0.8, 1.6] },
        { class: 'stars-layer-med', speed: 0.22, count: 85, sizeRange: [1.6, 2.6] },  
        { class: 'stars-layer-fast', speed: 0.42, count: 35, sizeRange: [2.6, 4.2] }  
    ];

    const layerElements = [];

    layers.forEach(layerCfg => {
        const layerDiv = document.createElement('div');
        layerDiv.className = `stars-layer ${layerCfg.class}`;
        
        for (let i = 0; i < layerCfg.count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            if (Math.random() > 0.4) {
                star.classList.add('star-blink');
                star.style.animationDelay = `${Math.random() * 4}s`;
                star.style.animationDuration = `${2 + Math.random() * 3}s`;
            }

            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 300}%`;

            const size = Math.random() * (layerCfg.sizeRange[1] - layerCfg.sizeRange[0]) + layerCfg.sizeRange[0];
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            const randColor = Math.random();
            if (randColor > 0.9) {
                star.style.backgroundColor = 'var(--accent-color)';
                star.style.boxShadow = '0 0 6px rgba(233, 196, 106, 0.7)';
            } else if (randColor > 0.78) {
                star.style.backgroundColor = 'var(--aurora-2)';
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

    const handleScroll = () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (!isDark) return;

        const scrollY = window.scrollY;
        layerElements.forEach(item => {
            item.el.style.transform = `translateY(${-scrollY * item.speed}px)`;
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
}

// 技術佔比統計圖表模組
function initTechChart() {
    const chartSvg = document.getElementById('pie-chart');
    const legendContainer = document.getElementById('chart-legend');
    const centerLabel = document.getElementById('chart-center-label');
    const centerValue = document.getElementById('chart-center-value');

    if (!chartSvg || !legendContainer) return;

    const techData = [
        { label: 'JavaScript', value: 31.9, color: 'var(--primary-color)' }, 
        { label: 'CSS Styles', value: 40.4, color: 'var(--accent-color)' },  
        { label: 'HTML', value: 27.7, color: 'var(--aurora-2)' }       
    ];

    let accumulatedPercent = 0;
    const paths = [];

    techData.forEach((slice, index) => {
        const startPercent = accumulatedPercent;
        accumulatedPercent += slice.value / 100;
        const endPercent = accumulatedPercent;

        const startAngle = (startPercent - 0.25) * 2 * Math.PI;
        const endAngle = (endPercent - 0.25) * 2 * Math.PI;

        const rIn = 65;
        const rOut = 95;

        const x1_in = Math.cos(startAngle) * rIn;
        const y1_in = Math.sin(startAngle) * rIn;
        const x1_out = Math.cos(startAngle) * rOut;
        const y1_out = Math.sin(startAngle) * rOut;

        const x2_in = Math.cos(endAngle) * rIn;
        const y2_in = Math.sin(endAngle) * rIn;
        const x2_out = Math.cos(endAngle) * rOut;
        const y2_out = Math.sin(endAngle) * rOut;

        const largeArcFlag = (slice.value > 50) ? 1 : 0;

        const pathData = [
            `M ${x1_in} ${y1_in}`,
            `L ${x1_out} ${y1_out}`,
            `A ${rOut} ${rOut} 0 ${largeArcFlag} 1 ${x2_out} ${y2_out}`,
            `L ${x2_in} ${y2_in}`,
            `A ${rIn} ${rIn} 0 ${largeArcFlag} 0 ${x1_in} ${y1_in}`,
            `Z`
        ].join(' ');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', slice.color);
        path.setAttribute('id', `chart-slice-${index}`);
        chartSvg.appendChild(path);
        paths.push(path);

        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.id = `legend-item-${index}`;
        legendItem.innerHTML = `
            <span class="legend-color" style="background-color: ${slice.color}"></span>
            <span class="legend-label">${slice.label}</span>
            <span class="legend-percent">${slice.value}%</span>
        `;
        legendContainer.appendChild(legendItem);

        const highlightSlice = () => {
            const midAngle = (startAngle + endAngle) / 2;
            const dx = Math.cos(midAngle) * 8;
            const dy = Math.sin(midAngle) * 8;
            
            path.style.transform = `translate(${dx}px, ${dy}px)`;
            path.style.filter = 'drop-shadow(0 8px 16px rgba(0,0,0,0.25))';
            
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

        path.addEventListener('mouseenter', highlightSlice);
        path.addEventListener('mouseleave', resetSlice);
        legendItem.addEventListener('mouseenter', highlightSlice);
        legendItem.addEventListener('mouseleave', resetSlice);
    });
}

// 導航欄與巨型菜單聯動
function initNavbarInteraction() {
    const header = document.getElementById('main-header');
    const megaTrigger = document.getElementById('mega-trigger');
    const megaReserveShortcut = document.getElementById('mega-reserve-shortcut');

    if (!header) return;

    const checkScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();

    if (megaTrigger) {
        megaTrigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                if (e.target.closest('.mega-menu')) return;
                e.preventDefault();
                megaTrigger.classList.toggle('is-active');
            }
        });

        document.addEventListener('click', (e) => {
            if (!megaTrigger.contains(e.target)) {
                megaTrigger.classList.remove('is-active');
            }
        });
    }

    if (megaReserveShortcut) {
        megaReserveShortcut.addEventListener('click', (e) => {
            e.preventDefault();
            if (megaTrigger) megaTrigger.classList.remove('is-active');
            
            const spotSection = document.getElementById('spot-section');
            if (spotSection) {
                spotSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
}

function initScrollProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;

    // 監聽網頁滾動事件
    window.addEventListener('scroll', () => {
        // 獲取當前滾動距離
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        // 獲取網頁可滾動的總高度（總高度 - 視窗高度）
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        // 計算滾動百分比 (0 ~ 100)
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        
        // 動態改變進度條的寬度
        progressBar.style.width = scrollPercent + '%';
    }, { passive: true });
}