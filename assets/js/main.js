
document.addEventListener('DOMContentLoaded', () => {
    let counter = 0; 
    const enterBtn = document.querySelector('#enter-btn');
    const landingPage = document.querySelector('#landing-page');
    const mainContent = document.querySelector('#main-content');
    const themeToggle = document.querySelector('#theme-toggle');
    const circleFlash = document.querySelector('#circle-flash');
    const catBubble = document.querySelector('#cat-bubble');
    const value = document.getElementById('counterDisplay');
    const minus = document.getElementById("decrease");
    const add = document.getElementById("increase");
    const reset = document.getElementById("reset");
    const countButton = document.getElementById('buttonGroup');

    // 1. 開場動畫時序
    setTimeout(() => {
        catBubble.textContent = "喵！準備好冒險了嗎？"; // 變更對話文字
        document.querySelector('#typewriter-text').classList.add('start-typing');
        setTimeout(() => { 
            enterBtn.style.opacity = '1';
            enterBtn.style.transition = 'opacity 0.5s ease';
        }, 3200);
    }, 1000);

    // 2. 點擊進入
    enterBtn.addEventListener('click', () => {
        document.querySelector('#cat-navigator').classList.add('cat-dash');
        catBubble.style.opacity = '0'; // 衝刺時對話框消失
        circleFlash.classList.add('active');
        
        setTimeout(() => {
            document.body.classList.add('main-reveal');
            landingPage.classList.add('warp-exit');
            mainContent.style.display = 'block';
            themeToggle.style.display = 'flex';
            setTimeout(() => { mainContent.style.opacity = '1'; }, 50);
        }, 600);

        // 清理效能
        setTimeout(() => {
            landingPage.style.display = 'none';
        }, 2000);
    });

    // 3. 深色模式切換
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

    // 4. 滾動揭示
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

    // 5. 計數器功能
    initCounterModule();
});

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