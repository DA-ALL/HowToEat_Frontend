// headerNav.js
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
        window.history.back(); // 이전 페이지로 돌아가기
    });
}
