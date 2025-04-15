import { onPopstate, updateQueryParam, syncFiltersWithURL} from '/administrate/js/router.js';

export function renderFilters() {
    $('.filter-group').children().each(function () {
        let $filter = $(this);
        let type = $filter.data('type');
        let filterTemplate = '';

        switch (type) {
            case 1:
                filterTemplate = `
                        <div class="filter-title">조회 기준</div>
                        <div class="filter-option-wrapper" data-key="orderby">
                            <div class="filter-option" data-query="desc">최신순</div>
                            <div class="filter-option" data-query="asc">과거순</div>
                        </div>
                    `;
                break;

            case 2:
                filterTemplate = `
                        <div class="filter-title">넥스트짐 등록 여부</div>
                        <div class="filter-option-wrapper" data-key="next-gym">
                            <div class="filter-option" data-query="all">전체</div>
                            <div class="filter-option" data-query="registered">등록</div>
                            <div class="filter-option" data-query="unregistered">미등록</div>
                        </div>
                    `;
                break;

            case 3:
                filterTemplate = `
                        <div class="filter-title">권한</div>
                        <div class="filter-option-wrapper" data-key="user-role">
                            <div class="filter-option" data-query="all">전체</div>
                            <div class="filter-option" data-query="user">유저</div>
                            <div class="filter-option" data-query="admin">관리자</div>
                        </div>
                    `;
                break;

            case 4:
                filterTemplate = `
                        <div class="filter-title">데이터 출처 필터</div>
                        <div class="filter-option-wrapper" data-key="data-source">
                            <div class="filter-option" data-query="all">전체</div>
                            <div class="filter-option" data-query="processed">가공식품DB</div>
                            <div class="filter-option" data-query="cooked">음식DB</div>
                            <div class="filter-option" data-query="ingredient">원재료DB</div>
                            <div class="filter-option" data-query="custom">유저 등록</div>
                        </div>
                    `;
                break;

            case 5:
                filterTemplate = `
                        <div class="filter-title">추천 음식 필터</div>
                        <div class="filter-option-wrapper" data-key="recommend">
                            <div class="filter-option" data-query="all">전체</div>
                            <div class="filter-option" data-query="recommended">추천음식</div>
                        </div>
                    `;
                break;

            case 6:
                filterTemplate = `
                        <div class="filter-title">관리자 DB 공유 여부</div>
                        <div class="filter-option-wrapper" data-key="admin-share">
                            <div class="filter-option" data-query="shared">관리자 DB 공유</div>
                            <div class="filter-option" data-query="user">관리자 DB 미공유</div>
                        </div>
                    `;
                break;

            case 7:
                filterTemplate = `
                        <div class="filter-title">조회 기준</div>
                        <div class="filter-option-wrapper" data-key="option">
                            <div class="filter-option" data-query="kcal">칼로리</div>
                            <div class="filter-option" data-query="carbohydrate">탄수화물</div>
                            <div class="filter-option" data-query="protein">단백질</div>
                            <div class="filter-option" data-query="province">지방</div>
                        </div>
                    `;
                break;
            case 8:

                const gyms = getGyms();

                filterTemplate = `
                        <div class="filter-title">헬스장</div>
                        <div class="filter-option-wrapper" data-key="gym">
                            ${gyms.map(gym => `
                                <div class="filter-option" data-query="${gym.name == '전체' ? 'all' : gym.name}">${gym.name}(${gym.trainerCount})</div>
                            `).join('')}
                        </div>
                    `;
                break;
        }

        $filter.html(filterTemplate);
    });

}

$(document).on('click', '.filter-option', function () {
    let $parent = $(this).closest('.filter-option-wrapper');
    let queryKey = $parent.data('key')
    let queryValue = $(this).data('query');

    if (queryKey) {
        updateQueryParam({[queryKey] : queryValue});
    }

    $parent.find('.filter-option').removeClass('active');
    $(this).addClass('active');
});


export function loadFilter(){
    renderFilters();
    syncFiltersWithURL();
    // updateURLWithActiveFilters();
}

onPopstate(loadFilter);  


function getGyms(){

    return [
        { name: '전체', trainerCount: 28},
        { name: '용인기흥구청점', trainerCount: 7},
        { name: '처인구청점', trainerCount: 6},
        { name: '수원권선동점', trainerCount: 3},
        { name: '이천마장점', trainerCount: 4},
        { name: '이천중앙점', trainerCount: 5},
        { name: '평택미전점', trainerCount: 6}
    ]
}