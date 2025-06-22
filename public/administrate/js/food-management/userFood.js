import { updateURL, registerPopstateHandler } from '/administrate/js/router.js';
import { loadSearchBar } from '/administrate/js/components/searchbar.js';
import { loadFilter } from '/administrate/js/components/filter.js';
import { renderUserFoodTable, renderTableWithOptionalPagination } from '/administrate/js/food-management/userFoodTable.js';
import { loadFoodDetail } from '/administrate/js/food-management/foodDetail.js';

$(document).ready(function () {
    loadUserFood();
});

function loadUserFood() {
    const container = $("#userFood");

    let adminFoodHTML = `
        <div class="title">유저 등록 음식</div>
        <div id="userFoodSearchbar" class="searchbar" data-placeholder="유저명 검색"></div>

        <div class="filter-group">
            <div id="filter" data-type="1"></div>
            <div id="filter" data-type="6"></div>
        </div>

        <div id="userFoodTable"></div>
    `;

    container.html(adminFoodHTML);
    
    loadSearchBar('userFood');
    loadFilter('userFood');
    loadUserFoodTable()
}


function loadUserFoodTable(){
    const containerId = 'userFoodTable';
    const bodyId = 'userFoodTableBody';
    const contentId = 'userFood';

    renderUserFoodTable(containerId, bodyId);
    renderTableWithOptionalPagination({
        getData: getUserFoodDatas,
        bodyId,
        contentId,
        enablePagination: true
    });
}



function getUserFoodDatas() {
    const foodNames = [
        "사과", "바나나", "딸기", "포도", "오렌지", "키위", "수박", "참외", "복숭아", "자두",
        "망고", "파인애플", "레몬", "체리", "블루베리", "라즈베리", "멜론", "감", "배", "귤", "잇메이트 닭가슴살 도시락 닭가슴살 소시지볶음밥 고추맛 & 스팀 닭가슴살 오리지널"
    ];

    return Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        foodName: foodNames[Math.floor(Math.random() * foodNames.length)],
        imageURL: "/administrate/images/icon_human_green.png",
        username: `사용자${i + 1}`,
        calorie: Math.floor(Math.random() * 500),
        carbo: Math.floor(Math.random() * 100),
        protein: Math.floor(Math.random() * 50),
        fat: Math.floor(Math.random() * 30),
        foodWeight: Math.floor(Math.random() * 200),
        foodWeightUnit: ["g", "ml"][Math.floor(Math.random() * 2)],
        sharedAt: Math.random() > 0.5 ? "2025.03.16" : null
    }));
}


$(document).on('click', `#userFoodTableBody tr`, function () {
    const foodId = $(this).find('.td-id').text();
    const page = `food-management/user-regist/${foodId}`;
    updateURL(page);
});

registerPopstateHandler('userFood',loadUserFood);