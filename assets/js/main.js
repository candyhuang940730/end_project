
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
    cloneMarquee(marqueeTrack);
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
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
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

