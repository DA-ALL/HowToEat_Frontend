import { showMain, showReport } from './routers.js';

$(document).ready(function () {
    let lastMainPath = '/main';
    const navMap = {
        '/main': {
            selector: '.item-wrapper.home',
            defaultIcon: '/user/images/icon_home.png',
            activeIcon: '/user/images/icon_home_active.png'
        },
        '/report': {
            selector: '.item-wrapper.report',
            defaultIcon: '/user/images/icon_report.png',
            activeIcon: '/user/images/icon_report_active.png'
        },
        '/my-page': {
            selector: '.item-wrapper.mypage',
            defaultIcon: '/user/images/icon_mypage.png',
            activeIcon: '/user/images/icon_mypage_active.png'
        }
    };

    // 이미지 프리로드
    Object.values(navMap).forEach(({ defaultIcon, activeIcon }) => {
        new Image().src = defaultIcon;
        new Image().src = activeIcon;
    });

    // 초기 상태 기억
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/main')) {
        lastMainPath = currentPath;
    }

    // 활성 nav 설정
    function updateNavActive(path) {
        Object.entries(navMap).forEach(([key, { selector, defaultIcon, activeIcon }]) => {
            const $el = $(selector);
            const isActive = path.startsWith(key);
            $el.toggleClass('active', isActive);
            $el.find('.icon img').attr('src', isActive ? activeIcon : defaultIcon);
        });
    }

    // 뷰 전환 함수
    function showPage(path) {
        $('#main, #report').hide();
    
        if (path.startsWith('/main')) {
            lastMainPath = path;
            $('#main').show();
    
            const parts = path.split('/');
            const meal = parts[2];      // morning
            const subpage = parts[3];   // search 등
    
            showMain(meal, subpage);
        } 
        else if (path.startsWith('/report')) {
            $('#report').show();
            showReport();
        }
    
        updateNavActive(path);
    }
    

    $(document).on('click', '.log-wrapper', function () {
        const mealKor = $(this).find('.meal-time').text(); // '아침' 등
        const mealMap = { '아침': 'morning', '점심': 'lunch', '저녁': 'dinner', '간식': 'snack' };
        const meal = mealMap[mealKor] || 'morning';
        const newPath = `/main/${meal}`;

        history.pushState({ view: 'main', meal }, '', newPath);
        showPage(newPath);
    });

    // nav 클릭 이벤트
    Object.entries(navMap).forEach(([key, { selector }]) => {
        $(selector).on('click', function (e) {
            e.preventDefault();
            const currentPath = window.location.pathname;
            let targetPath;

            if (key === '/main') {
                // 👇 여기에 두 번 눌렀을 때 /main 이동 조건 추가
                if (currentPath.startsWith('/main')) {
                    if (currentPath === lastMainPath && currentPath !== '/main') {
                        // 두 번 눌렀을 때 초기화
                        lastMainPath = '/main';
                        history.pushState({ view: 'main' }, '', '/main');
                        showPage('/main');
                        return;
                    }
                }

                if (!currentPath.startsWith('/main')) {
                    const savedLastMainPath = lastMainPath;

                    history.replaceState({ view: 'main' }, '', '/main');

                    const parts = savedLastMainPath.split('/');
                    const meal = parts[2];
                    const subpage = parts[3];

                    if (meal && subpage) {
                        const basePath = `/main/${meal}`;
                        history.pushState({ view: 'main' }, '', basePath);
                        history.pushState({ view: 'main' }, '', savedLastMainPath);
                    } else {
                        history.pushState({ view: 'main' }, '', savedLastMainPath);
                    }

                    showPage(savedLastMainPath);
                } else {
                    // 그냥 다시 진입
                    history.pushState({ view: 'main' }, '', lastMainPath);
                    showPage(lastMainPath);
                }
            } else {
                history.pushState({ view: key.slice(1) }, '', key);
                showPage(key);
            }
        });
    });

    

    // 뒤로가기 이벤트 처리
    window.addEventListener('popstate', () => {
        const path = window.location.pathname;
        if (path.startsWith('/main')) {
            lastMainPath = path;
        }
        showPage(path);
    });

    $(document).on('click', '.next-button.active', function () {
        const currentPath = window.location.pathname; // ex: /main/morning
        const parts = currentPath.split('/');
        
        if (parts.length < 3) return; // 예외 처리
        
        const meal = parts[2]; // 'morning', 'lunch', etc
        const newPath = `/main/${meal}/search`;

        history.pushState({ view: 'main', meal }, '', newPath);
        showPage(newPath); // ⬅︎ 기존 showPage 재사용 (아래 수정 있음)
    });


    // 초기 렌더링
    showPage(currentPath);
});
