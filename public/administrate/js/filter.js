$(document).ready(function () {
    let filterParams = new URLSearchParams(window.location.search);

    function renderFilters() {
        $('.filter-group').children().each(function () {
            let $filter = $(this);
            let type = $filter.data('type');
            let filterTemplate = '';

            switch (type) {
                case 1:
                    filterTemplate = `
                        <div class="filter-title">조회 기준</div>
                        <div class="filter-option-wrapper">
                            <div class="filter-option" data-query="desc">최신순</div>
                            <div class="filter-option" data-query="asc">과거순</div>
                        </div>
                    `;
                    break;

                case 2:
                    filterTemplate = `
                        <div class="filter-title">넥스트짐 등록 여부</div>
                        <div class="filter-option-wrapper">
                            <div class="filter-option" data-query="all">전체</div>
                            <div class="filter-option" data-query="registered">등록</div>
                            <div class="filter-option" data-query="unregistered">미등록</div>
                        </div>
                    `;
                    break;

                case 3:
                    filterTemplate = `
                        <div class="filter-title">권한</div>
                        <div class="filter-option-wrapper">
                            <div class="filter-option" data-query="all">전체</div>
                            <div class="filter-option" data-query="user">유저</div>
                            <div class="filter-option" data-query="admin">관리자</div>
                        </div>
                    `;
                    break;

                case 4:
                    filterTemplate = `
                        <div class="filter-title">데이터 출처 필터</div>
                        <div class="filter-option-wrapper">
                            <div class="filter-option" data-query="all">전체</div>
                            <div class="filter-option" data-query="processed">가공식품DB</div>
                            <div class="filter-option" data-query="food">음식DB</div>
                            <div class="filter-option" data-query="raw">원재료DB</div>
                            <div class="filter-option" data-query="user">유저 등록</div>
                        </div>
                    `;
                    break;

                case 5:
                    filterTemplate = `
                        <div class="filter-title">추천 음식 필터</div>
                        <div class="filter-option-wrapper">
                            <div class="filter-option" data-query="all">전체</div>
                            <div class="filter-option" data-query="recommended">추천음식</div>
                        </div>
                    `;
                    break;

                case 6:
                    filterTemplate = `
                        <div class="filter-title">관리자 DB 공유 여부</div>
                        <div class="filter-option-wrapper">
                            <div class="filter-option" data-query="shared">관리자 DB 공유</div>
                            <div class="filter-option" data-query="user">관리자 DB 미공유</div>
                        </div>
                    `;
                    break;

                case 7:
                    filterTemplate = `
                        <div class="filter-title">조회 기준</div>
                        <div class="filter-option-wrapper">
                            <div class="filter-option" data-query="kcal">칼로리</div>
                            <div class="filter-option" data-query="carbohydrate">탄수화물</div>
                            <div class="filter-option" data-query="protein">단백질</div>
                            <div class="filter-option" data-query="province">지방</div>
                        </div>
                    `;
                    break;
            }

            $filter.html(filterTemplate);
        });

        applyFilterFromURL();
    }

    function applyFilterFromURL() {
        $('.filter-option-wrapper').each(function () {
            let $wrapper = $(this);
            let type = $wrapper.parent().data('type');
            let queryKey = getQueryKey(type);
            let queryValue = filterParams.get(queryKey);

            if (!queryValue) {
                // URL에 값이 없으면 첫 번째 옵션을 기본으로 설정
                let $defaultOption = $wrapper.find('.filter-option').first();
                queryValue = $defaultOption.data('query');
            }

            $wrapper.find('.filter-option').removeClass('active');
            $wrapper.find(`.filter-option[data-query="${queryValue}"]`).addClass('active');
        });
    }

    function getQueryKey(type) {
        switch (type) {
            case 1: return 'orderby';
            case 2: return 'next-gym';
            case 3: return 'user-role';
            case 4: return 'data-source';
            case 5: return 'recommend';
            case 6: return 'admin-share';
            case 7: return 'option';
            default: return '';
        }
    }

    $(document).on('click', '.filter-option', function () {
        let $parent = $(this).closest('.filter-option-wrapper');
        let type = $parent.parent().data('type');
        let queryKey = getQueryKey(type);
        let queryValue = $(this).data('query');

        if (queryKey) {
            filterParams.set(queryKey, queryValue);
            updateURL();
        }

        $parent.find('.filter-option').removeClass('active');
        $(this).addClass('active');
    });

    function updateURL() {
        const newURL = `${window.location.pathname}?${filterParams.toString()}`;
        window.history.pushState({}, '', newURL);
        renderFilters();
    }

    // 🔥 **뒤로가기 / 앞으로가기 시 필터 상태 렌더링**
    window.addEventListener('popstate', function () {
        filterParams = new URLSearchParams(window.location.search);
        renderFilters();  // 필터 UI를 새로 렌더링
    });

    renderFilters();
});