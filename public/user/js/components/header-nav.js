// headerNav.js
import { showPage } from './nav-bottom.js';

export function initHeaderNav(parentSelector = 'body') {
    const $container = $(parentSelector);
    const $headerNav = $container.find('#headerNav');
    if ($headerNav.length === 0) return;

    const title = $headerNav.data('title');
    const type = $headerNav.data('type');

    let headerTemplate = '';

    switch (type) {
        case 1:
            headerTemplate = `
                <div class="header-nav">
                    <div class="button-prev">
                        <img src="/user/images/icon_arrow_back.png">
                    </div>

                    <div class="title hidden">${title}</div>

                    <div class="button-add hidden">
                        <img src="/user/images/icon_add.png">
                    </div>
                </div>
            `;
            break;

        case 2:
            headerTemplate = `
                <div class="header-nav header-nav-relative">
                    <div class="button-prev">
                        <img src="/user/images/icon_arrow_back.png">
                    </div>

                    <div class="title">${title}</div>

                    <div class="button-add hidden">
                        <img src="/user/images/icon_add.png">
                    </div>
                </div>
            `;
            break;

        default: // type 3
            headerTemplate = `
                <div class="header-nav header-nav-relative">
                    <div class="button-prev">
                        <img src="/user/images/icon_arrow_back.png">
                    </div>

                    <div class="title">${title}</div>

                    <div class="button-add">
                        <img src="/user/images/icon_add.png">
                    </div>
                </div>
            `;
    }

    $headerNav.html(headerTemplate);

    $headerNav.find('.button-add').on('click', function() {
        const currentPath = window.location.pathname;
        const parts = currentPath.split('/');
        const mealTime = parts[2];
        const selectedDate = parts[3];

        const newPath = `/main/${mealTime}/${selectedDate}/regist/favorite-food/add`;
        history.pushState({ view: 'main', mealTime, date: selectedDate }, '', newPath);
        showPage(newPath);
        return;
    });

    // 이벤트 바인딩 (SPA에서도 작동하도록 매번 재바인딩)
    $headerNav.find('.button-prev').on('click', function () {
        const currentPath = window.location.pathname;
    
        if (currentPath.startsWith('/signup')) {
            window.location.href = '/login-page';
            return;
        }
        
        if (currentPath.startsWith('/users')) {
            const stack = window.usersHistoryStack || ['/users'];
            const parts = currentPath.split('/');
        
            if(parts.length > 2) {                
                const newPath = '/users'
                window.lastUsersPath = newPath;
                history.pushState({ view: 'users' }, '', newPath);
                showPage(newPath);
            }
            return;

            // if (stack.length > 1) {

            //     stack.pop();
            //     const prev = stack[stack.length - 1];
            //     window.usersHistoryStack = stack; // 다시 저장

            //     history.pushState({ view: 'users' }, '', prev);
            //     showPage(prev);
            //     return;
            // }
        }
    
        if (currentPath.startsWith('/main/')) {
            const parts = currentPath.split('/');

            if (parts[2] === "favorite-food") {
                const mealTime = parts[2];
                const selectedDate = parts[3];

                const newPath = `/main/${mealTime}/${selectedDate}`;
                history.pushState({ view: 'main', mealTime, date: selectedDate }, '', newPath);
                showPage(`/main/${mealTime}/${selectedDate}`);
                return;
            }

            // http://localhost:3000/main/breakfast/2025-06-19
            if (parts.length === 4) {
                // 예: /main/morning → 홈으로
                history.pushState({ view: 'main' }, '', '/main');
                showPage('/main');
                return;

            // http://localhost:3000/main/breakfast/2025-06-19/regist
            } else if (parts.length === 5) {
                const mealTime = parts[2];
                const selectedDate = parts[3];

                const newPath = `/main/${mealTime}/${selectedDate}`;
                history.pushState({ view: 'main', mealTime, date: selectedDate }, '', newPath);
                showPage(`/main/${mealTime}/${selectedDate}`);
                return;

            // http://localhost:3000/main/breakfast/2025-06-19/consumed-food/63
            } else if (parts[4] === "consumed-food") {
                const mealTime = parts[2];
                const selectedDate = parts[3];

                const newPath = `/main/${mealTime}/${selectedDate}`;
                history.pushState({ view: 'main', mealTime, date: selectedDate }, '', newPath);
                showPage(`/main/${mealTime}/${selectedDate}`);
                return;

            // http://localhost:3000/main/breakfast/2025-06-19/regist/COOKED/3
            } else if (parts.length === 7) {
                const mealTime = parts[2];
                const selectedDate = parts[3];

                const newPath = `/main/${mealTime}/${selectedDate}/regist`;
                history.pushState({ view: 'main', mealTime, date: selectedDate }, '', newPath);
                showPage(`/main/${mealTime}/${selectedDate}/regist`);
                return;
            }
        }
    
        // 기본: 브라우저 히스토리 사용
        window.history.back();
    });
    
}
