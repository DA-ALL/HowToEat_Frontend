import { updateURL, registerPopstateHandler } from '/administrate/js/router.js';
import { loadSearchBar } from '/administrate/js/components/searchbar.js';
import { loadFilter } from '/administrate/js/components/filter.js';
import { renderTable, renderTableWithOptionalPagination } from '/administrate/js/food-management/adminFoodTable.js';
import { loadFoodDetail } from '/administrate/js/food-management/foodDetail.js';
import { getFoodList } from '../api.js';

$(document).ready(function () {
    loadContent();
});

function loadContent() {
    const container = $("#adminFood");

    let adminFoodHTML = `
        <div class="title">관리자 등록 음식</div>
        <div id="adminFoodSearchbar" class="searchbar" data-placeholder="음식명 검색"></div>

        <div class="filter-group">
            <div id="filter" data-type="1"></div>
            <div id="filter" data-type="4"></div>
            <div id="filter" data-type="5"></div>
        </div>

        <div id="adminFoodTable"></div>
    `;

    container.html(adminFoodHTML);
    
    loadSearchBar('adminFood', loadAdminFoodTable);
    loadFilter('adminFood', loadAdminFoodTable);
    loadAdminFoodTable();
}

function loadAdminFoodTable() {
    const containerId = 'adminFoodTable';
    const bodyId = 'adminFoodTableBody';
    const contentId = 'adminFood';

    renderTable(containerId, bodyId);
    renderTableWithOptionalPagination({
        getData: getAdminFoodDatas,
        bodyId,
        contentId,
        enablePagination: true
    });
}

async function getAdminFoodDatas() {
    const params = getParamsFromURL();
    try {
        const response = await getFoodList(params);
        console.log("User data fetched:", response);
        
        return response;
    } catch (err) {
        console.error("Error fetching user data:", err);
    }
    


    // const foodNames = [
    //     "사과", "바나나", "딸기", "포도", "오렌지", "키위", "수박", "참외", "복숭아", "자두",
    //     "망고", "파인애플", "레몬", "체리", "블루베리", "라즈베리", "멜론", "감", "배", "귤", "잇메이트 닭가슴살 도시락 닭가슴살 소시지볶음밥 고추맛 & 스팀 닭가슴살 오리지널"
    // ];

    // return Array.from({ length: 200 }, (_, i) => ({
    //     id: i + 1,
    //     foodName: foodNames[Math.floor(Math.random() * foodNames.length)],
    //     foodCode: `F${String(i + 1).padStart(3, "0")}`,
    //     mainFoodName: "과일",
    //     calorie: Math.floor(Math.random() * 500),
    //     carbo: Math.floor(Math.random() * 100),
    //     protein: Math.floor(Math.random() * 50),
    //     fat: Math.floor(Math.random() * 30),
    //     foodWeight: Math.floor(Math.random() * 200),
    //     foodWeightUnit: ["g", "ml"][Math.floor(Math.random() * 2)],
    //     isRecommended: ["O", "X"][Math.floor(Math.random() * 2)],
    //     source: ["custom", "ingredient", "cooked", "processed"][Math.floor(Math.random() * 4)],
    // }));
}

function getParamsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        page: parseInt(urlParams.get('page')) || 1,
        size: 20,
        name: urlParams.get('search') || '',
        orderBy: urlParams.get('orderBy') || '',
        foodType: urlParams.get('foodType') || '',
        recommendation: urlParams.get('recommendation') || '',
    };
}

$(document).on('click', `#adminFoodTableBody tr`, function () {
    const foodId = $(this).find('.td-id').text();
    const page = `food-management/${foodId}`;
    updateURL(page);

    loadFoodDetail({
        type: "edit",       
    });
});

registerPopstateHandler('adminFood', loadContent);