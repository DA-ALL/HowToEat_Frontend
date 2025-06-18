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

    // 이벤트 바인딩 (SPA에서도 작동하도록 매번 재바인딩)
    $headerNav.find('.button-prev').on('click', function () {
        const currentPath = window.location.pathname;
    
        if (currentPath.startsWith('/users')) {
            const stack = window.usersHistoryStack || ['/users'];
        
            if (stack.length > 1) {

                stack.pop();
                const prev = stack[stack.length - 1];
                window.usersHistoryStack = stack; // 다시 저장

                // if ($container.attr('id') === 'usersNotice') {
                //     $('#usersNotice #noticeListContainer').empty();
                // }

                history.pushState({ view: 'users' }, '', prev);
                showPage(prev);
                return;
            }
        }
    
        if (currentPath.startsWith('/main/')) {
            const parts = currentPath.split('/');
            if (parts.length === 4) {
                // 예: /main/morning → 홈으로
                history.pushState({ view: 'main' }, '', '/main');
                showPage('/main');
                return;
            } else if (parts.length === 5) {
                    const mealTime = parts[2];
                    const selectedDate = parts[3];
    
                    const newPath = `/main/${mealTime}/${selectedDate}`;
                    history.pushState({ view: 'main', mealTime, date: selectedDate }, '', newPath);
                    showPage(`/main/${mealTime}/${selectedDate}`);
                    return;
                    
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
