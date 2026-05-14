document.addEventListener('DOMContentLoaded', () => {
    const enterBtn = document.querySelector('#enter-btn');
    const landingPage = document.querySelector('#landing-page');
    const mainContent = document.querySelector('#main-content');
    const themeToggle = document.querySelector('#theme-toggle');
    const circleFlash = document.querySelector('#circle-flash');
    const catBubble = document.querySelector('#cat-bubble');

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
});