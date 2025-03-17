$(document).ready(function () {
    $('.filter-group').children().each(function () {
        let $filter = $(this);
        let type = $filter.data('type');
        let filterTemplate = '';

        switch (type) {
            case 1:
                filterTemplate = `
                    <div class="filter-title">조회 기준</div>
                    <div class="filter-option-wrapper">
                        <div class="filter-option active" data-query="1">최신순</div>
                        <div class="filter-option" data-query="2">과거순</div>
                    </div>
                `;
                break;

            case 2:
                filterTemplate = `
                    <div class="filter-title">넥스트짐 등록 여부</div>
                    <div class="filter-option-wrapper">
                        <div class="filter-option active" data-query="1">전체</div>
                        <div class="filter-option" data-query="2">등록</div>
                        <div class="filter-option" data-query="3">미등록</div>
                    </div>
                `;
                break;

            case 3:
                filterTemplate = `
                    <div class="filter-title">권한</div>
                    <div class="filter-option-wrapper">
                        <div class="filter-option active" data-query="1">전체</div>
                        <div class="filter-option" data-query="2">유저</div>
                        <div class="filter-option" data-query="3">관리자</div>
                    </div>
                `;
                break;

            case 4:
                filterTemplate = `
                    <div class="filter-title">데이터 출처 필터</div>
                    <div class="filter-option-wrapper">
                        <div class="filter-option active" data-query="1">전체</div>
                        <div class="filter-option" data-query="2">가공식품DB</div>
                        <div class="filter-option" data-query="3">음식DB</div>
                        <div class="filter-option" data-query="4">원재료DB</div>
                        <div class="filter-option" data-query="5">유저 등록</div>
                    </div>
                `;
                break;

            case 5:
                filterTemplate = `
                    <div class="filter-title">추천 음식 필터</div>
                    <div class="filter-option-wrapper">
                        <div class="filter-option active" data-query="1">전체</div>
                        <div class="filter-option" data-query="2">추천음식</div>
                    </div>
                `;
                break;

            case 6:
                filterTemplate = `
                    <div class="filter-title">관리자 DB 공유 여부</div>
                    <div class="filter-option-wrapper">
                        <div class="filter-option active" data-query="1">관리자 DB 공유</div>
                        <div class="filter-option" data-query="2">관리자 DB 미공유</div>
                    </div>
                `;
                break;

            case 7:
                filterTemplate = `
                    <div class="filter-title">조회 기준</div>
                    <div class="filter-option-wrapper">
                        <div class="filter-option active" data-query="1">칼로리</div>
                        <div class="filter-option" data-query="2">탄수화물</div>
                        <div class="filter-option" data-query="3">단백질</div>
                        <div class="filter-option" data-query="4">지방</div>
                    </div>
                `;
                break;
        }

        $filter.html(filterTemplate);
    });

    // 필터 옵션 클릭 이벤트
    $(document).on('click', '.filter-option', function () {
        let $parent = $(this).closest('.filter-option-wrapper');
        $parent.find('.filter-option').removeClass('active');
        $(this).addClass('active');
    });
});
