$(document).ready(function () {
    //  [type에 따른 header 구성]
    //  - type 1 =  뒤로가기 O / 타이틀 X  / 추가하기버튼 X
    //  - type 2 =  뒤로가기 O / 타이틀 O / 추가하기버튼 X
    //  - type 3 =  뒤로가기 O / 타이틀 O / 추가하기버튼 O

    let $headerNav = $('#headerNav');
    let title = $headerNav.data('title');
    let type = $headerNav.data('type');

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
                <div class="header-nav">
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

        default:
            headerTemplate = `
                <div class="header-nav">
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

    // 뒤로가기 버튼 클릭 이벤트 처리
    $('.button-prev').on('click', function () {
        window.history.back(); // 이전 페이지로 돌아가기
    });
});