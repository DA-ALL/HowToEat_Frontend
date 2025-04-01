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

        // 🆕 여기에 항상 업데이트
        if (path.startsWith('/main')) {
            lastMainPath = path;
            $('#main').show();
            const meal = path.split('/')[2]; // e.g. 'morning'
            showMain(meal);
        } else if (path.startsWith('/report')) {
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
                //  현재 리포트 등 외부에서 진입하는 경우
                if (!currentPath.startsWith('/main')) {
                    // 이 시점의 lastMainPath를 복구용으로 써야 하므로 백업
                    const savedLastMainPath = lastMainPath;
    
                    // 히스토리상으로는 /main → (뒤로가기 하면 여기로)
                    history.replaceState({ view: 'main' }, '', '/main');
    
                    // 보여줄 건 원래 작업하던 곳
                    history.pushState({ view: 'main' }, '', savedLastMainPath);
                    showPage(savedLastMainPath);
                } else {
                    //  main 내부에서 홈을 또 눌렀을 때
                    if (currentPath === lastMainPath && currentPath !== '/main') {
                        lastMainPath = '/main';
                        history.pushState({ view: 'main' }, '', '/main');
                        showPage('/main');
                    } else {
                        history.pushState({ view: 'main' }, '', lastMainPath);
                        showPage(lastMainPath);
                    }
                }
            } else {
                //  report, my-page는 그냥 push
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

    // 초기 렌더링
    showPage(currentPath);
});
