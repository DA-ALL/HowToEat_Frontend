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

    // ✅ 이미지 프리로드
    Object.values(navMap).forEach(({ defaultIcon, activeIcon }) => {
        new Image().src = defaultIcon;
        new Image().src = activeIcon;
    });

    // ✅ 초기 상태 기억
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/main')) {
        lastMainPath = currentPath;
    }

    // ✅ 활성 nav 설정
    function updateNavActive(path) {
        Object.entries(navMap).forEach(([key, { selector, defaultIcon, activeIcon }]) => {
            const $el = $(selector);
            const isActive = path.startsWith(key);
            $el.toggleClass('active', isActive);
            $el.find('.icon img').attr('src', isActive ? activeIcon : defaultIcon);
        });
    }

    // ✅ 뷰 전환 함수
    function showPage(path) {
        $('#main, #report').hide();
        if (path.startsWith('/main')) {
            $('#main').show();
            showMain(path.split('/')[2]); // 'morning' 등 전달
        } else if (path.startsWith('/report')) {
            $('#report').show();
            showReport();
        }
        updateNavActive(path);
    }

    // ✅ nav 클릭 이벤트
    Object.entries(navMap).forEach(([key, { selector }]) => {
        $(selector).on('click', function (e) {
            e.preventDefault();

            const targetPath = (key === '/main') ? lastMainPath : key;

            history.pushState({ view: key.slice(1) }, '', targetPath);
            showPage(targetPath);
        });
    });

    // ✅ 뒤로가기 이벤트 처리
    window.addEventListener('popstate', () => {
        const path = window.location.pathname;
        if (path.startsWith('/main')) {
            lastMainPath = path;
        }
        showPage(path);
    });

    // ✅ 초기 렌더링
    showPage(currentPath);
});
