import { showMain, showReport, showMyPage, resetHomeMealView, resetSearchView, resetRegistView } from './routers.js';

window.lastMainPath = '/main';
window.lastUsersPath = '/users';

export function setLastMainPath(path) {
    window.lastMainPath = path;
}

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
    '/users': {
        selector: '.item-wrapper.mypage',
        defaultIcon: '/user/images/icon_mypage.png',
        activeIcon: '/user/images/icon_mypage_active.png'
    }
};

// 뷰 전환 함수
export function showPage(path, userConsumedData = null, registFoodData = null) {
    if (path.startsWith('/main')) {
        lastMainPath = path;
        $('#main').show();

        const parts = path.split('/');
        const meal = parts[2];      // morning
        const regist = parts[3];   // regist 등
        const type = parts[4];     // ingredient 등

        showMain(meal, regist, type, userConsumedData, registFoodData);
    }
    else if (path.startsWith('/report')) {
        showReport();
    }
    else if (path.startsWith('/users')) {
        const parts = path.split('/');
        const subpath = parts[2]; // set-time, notice 등
        showMyPage(subpath);
    }

    updateNavActive(path);
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

$(document).ready(function () {
    let lastMainPath = '/main';

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

    // 아침 점심 저녁 별 섭취햇던 칼로리 데이터 이 데이터를 나중에 Ajax로 호출
    const userConsumedData = {
        date: "2025-04-09",
        carbo: { consumed: 70, target: 220 },
        protein: { consumed: 42, target: 90 },
        fat: { consumed: 20, target: 50 }
    }

    $(document).on('click', '.log-wrapper', function () {
        const mealKor = $(this).find('.meal-time').text(); // '아침' 등
        const mealMap = { '아침': 'morning', '점심': 'lunch', '저녁': 'dinner', '간식': 'snack' };
        const meal = mealMap[mealKor] || 'morning';
        const newPath = `/main/${meal}`;
        const selectedDate = $('.day.active').data('date') || userConsumedData.date;
        const updatedConsumedData = {
            ...userConsumedData,
            date: selectedDate
        };
        resetHomeMealView();
        resetSearchView();
        resetRegistView();
        history.pushState({ view: 'main', meal }, '', newPath);
        showPage(newPath, updatedConsumedData);
    });

    // nav 클릭 이벤트
    Object.entries(navMap).forEach(([key, { selector }]) => {
        $(selector).on('click', function (e) {
            e.preventDefault();
            const currentPath = window.location.pathname;

            if (key === '/main') {
                if (currentPath.startsWith('/main')) {
                    if (currentPath === lastMainPath && currentPath !== '/main') {
                        lastMainPath = '/main';
                        history.pushState({ view: 'main' }, '', '/main');
                        showPage('/main');
                        resetHomeMealView();
                        resetSearchView();
                        resetRegistView();
                        return;
                    } else {
                        lastMainPath = currentPath;
                    }
                } else {
                    history.pushState({ view: 'main' }, '', lastMainPath);
                    showPage(lastMainPath);
                }
            } else {
                if (currentPath.startsWith('/main')) {
                    lastMainPath = currentPath;
                }
            
                if (key === '/users') {
                    if (currentPath.startsWith('/users')) {
                        if (currentPath === lastUsersPath && currentPath !== '/users') {
                            // ✅ 두 번 클릭 시 /users로 초기화
                            lastUsersPath = '/users';
                            history.pushState({ view: 'users' }, '', '/users');
                            showPage('/users');
                            return;
                        } else {
                            lastUsersPath = currentPath;
                        }
                    }
                
                    history.pushState({ view: 'users' }, '', lastUsersPath);
                    showPage(lastUsersPath);
                } else {
                    history.pushState({ view: key.slice(1) }, '', key);
                    showPage(key);
                }
            }
            
        });
    });

    // 뒤로가기 이벤트 처리
    window.addEventListener('popstate', () => {
        const path = window.location.pathname;

        // 강제 초기화 -> 안하면 페이지 새로 안그려줌
        if (path.includes('/regist')) {
            $('#homeMealRegist').empty();
        }

        if (path.startsWith('/main')) {
            lastMainPath = path;
        }

        showPage(path);
    });


    $(document).on('click', '.next-button.active', function () {
        let $btn = $(this);
        const currentPath = window.location.pathname; // ex: /main/morning
        const parts = currentPath.split('/');

        if (parts.length < 3) return;

        const meal = parts[2]; // 'morning', 'lunch', etc

        // ---------------------------------------------
        // 1. /main/{meal}/regist → from home-meal
        // ---------------------------------------------
        if ($btn.hasClass('home-meal')) {
            const newPath = `/main/${meal}/regist`;
            history.pushState({ view: 'main', meal }, '', newPath);
            showPage(newPath);
        }

        // ---------------------------------------------
        // 2. /main/{meal}/regist/{id} → from home-meal-regist
        // ---------------------------------------------
        else if ($btn.hasClass('home-meal-search')) {
            const registFoodData = {
                id: $btn.attr('data-id'),
                type: $btn.attr('data-type'),
                name: $btn.attr('data-name'),
                weight: $btn.attr('data-weight'),
                kcal: $btn.attr('data-kcal'),
                carbo: $btn.attr('data-carbo'),
                protein: $btn.attr('data-protein'),
                fat: $btn.attr('data-fat'),
            };

            if (!registFoodData.id || !registFoodData.type) return;

            // `_food` 제거
            const pureType = registFoodData.type.replace('_food', '');

            const newPath = `/main/${meal}/regist/${pureType}/${registFoodData.id}`;
            history.pushState({ view: 'main', meal, itemId: registFoodData.id }, '', newPath);
            showPage(newPath, userConsumedData, registFoodData);
        }

    });


    // 초기 렌더링
    showPage(currentPath);
});
