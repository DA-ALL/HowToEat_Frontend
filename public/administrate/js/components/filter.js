import { updateQueryParam, syncFiltersWithURL} from '../router.js';
import { getAllGymList } from '../api.js';

export async function renderFilters(contentId, onclick = null) {
    let gyms =  [];
    if(contentId == 'trainerManagement' || contentId == 'ptUserManagement'){
        gyms = await getGyms();
    }
    // onclick 함수 저장
    $(`#${contentId} .filter-group`).data('onclick', onclick);
    

    $(`#${contentId} .filter-group`).children().each(function () {
        let $filter = $(this);
        let type = $filter.data('type');
        let filterTemplate = '';        

        switch (type) {
            case 1:
                filterTemplate = `
                        <div class="filter-title">조회 기준</div>
                        <div class="filter-option-wrapper" data-key="orderBy">
                            <div class="filter-option" data-query="desc">최신순</div>
                            <div class="filter-option" data-query="asc">과거순</div>
                        </div>
                    `;
                break;

            case 2:
                filterTemplate = `
                        <div class="filter-title">넥스트짐 등록 여부</div>
                        <div class="filter-option-wrapper" data-key="isNextGym">
                            <div class="filter-option" data-query="all">전체</div>
                            <div class="filter-option" data-query="true">등록</div>
                            <div class="filter-option" data-query="false">미등록</div>
                        </div>
                    `;
                break;

            case 3:
                filterTemplate = `
                        <div class="filter-title">권한</div>
                        <div class="filter-option-wrapper" data-key="userRole">
                            <div class="filter-option" data-query="all">전체</div>
                            <div class="filter-option" data-query="USER">유저</div>
                            <div class="filter-option" data-query="ADMIN">관리자</div>
                        </div>
                    `;
                break;

            case 4:
                filterTemplate = `
                        <div class="filter-title">데이터 출처 필터</div>
                        <div class="filter-option-wrapper" data-key="foodType">
                            <div class="filter-option" data-query="all">전체</div>
                            <div class="filter-option" data-query="PROCESSED">가공식품DB</div>
                            <div class="filter-option" data-query="COOKED">음식DB</div>
                            <div class="filter-option" data-query="INGREDIENT">원재료DB</div>
                            <div class="filter-option" data-query="CUSTOM">유저 등록</div>
                        </div>
                    `;
                break;

            case 5:
                filterTemplate = `
                        <div class="filter-title">추천 음식 필터</div>
                        <div class="filter-option-wrapper" data-key="recommendation">
                            <div class="filter-option" data-query="all">전체</div>
                            <div class="filter-option" data-query="recommended">추천음식</div>
                        </div>
                    `;
                break;

            case 6:
                filterTemplate = `
                        <div class="filter-title">관리자 DB 공유 여부</div>
                        <div class="filter-option-wrapper" data-key="adminShared">
                            <div class="filter-option" data-query="all">전체</div>
                            <div class="filter-option" data-query="true">관리자 DB 공유</div>
                            <div class="filter-option" data-query="false">관리자 DB 미공유</div>
                        </div>
                    `;
                break;

            case 7:
                filterTemplate = `
                        <div class="filter-title">조회 기준</div>
                        <div class="filter-option-wrapper" data-key="option">
                            <div class="filter-option" data-query="kcal">칼로리</div>
                            <div class="filter-option" data-query="carbo">탄수화물</div>
                            <div class="filter-option" data-query="protein">단백질</div>
                            <div class="filter-option" data-query="province">지방</div>
                        </div>
                    `;
                break;
            case 8:
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

$(document).on('click', '.filter-option', async function () {
    let $parent = $(this).closest('.filter-option-wrapper');
    let queryKey = $parent.data('key')
    let queryValue = $(this).data('query');

    if (queryKey) {
        updateQueryParam({[queryKey] : queryValue});
    }

    $parent.find('.filter-option').removeClass('active');
    $(this).addClass('active');
    
    const $filterGroup = $(this).closest('.filter-group');
    const onclick = $filterGroup.data('onclick');
    
    if (typeof onclick === 'function') {
        await onclick();
    }
});


export async function loadFilter(contentId, onclick = null) {
    await renderFilters(contentId, onclick);
    syncFiltersWithURL();
}


async function getGyms(){
    try{
        const response = await getAllGymList();
        let totalTrainerCount = 0;
        response.data.forEach(gym => {
            totalTrainerCount += gym.trainerCount;
        });

        const gyms = [{ id: 0, name: "전체" , trainerCount: totalTrainerCount}, ...response.data];
        return gyms;
    } catch (err) {
        console.error("헬스장 목록을 불러오는 중 오류 발생:", err);
    }
}
