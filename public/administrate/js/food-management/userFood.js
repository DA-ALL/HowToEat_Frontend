import { updateURL, registerPopstateHandler, registerViewLoader } from '/administrate/js/router.js';
import { loadSearchBar } from '/administrate/js/components/searchbar.js';
import { loadFilter } from '/administrate/js/components/filter.js';
import { renderUserFoodTable, renderTableWithOptionalPagination } from '/administrate/js/food-management/userFoodTable.js';
import { loadFoodDetail } from '/administrate/js/food-management/foodDetail.js';
import { getFavoriteFoodList } from '../api.js';

function loadUserFood() {
    const container = $("#userFood");

    let adminFoodHTML = `
        <div class="title">유저 등록 음식</div>
        <div id="userFoodSearchbar" class="searchbar" data-placeholder="음식명 검색"></div>

        <div class="filter-group">
            <div id="filter" data-type="1"></div>
            <div id="filter" data-type="6"></div>
        </div>

        <div id="userFoodTable"></div>
    `;

    container.html(adminFoodHTML);
    
    loadSearchBar('userFood', loadUserFoodTable);
    loadFilter('userFood', loadUserFoodTable);
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


async function getUserFoodDatas() {
    const params = getParamsFromURL();
    
    try {
        const response = await getFavoriteFoodList(params);
        // console.log("유저등록음식들: ", response);
        
        return response;
    } catch (err) {
        console.error("Error fetching user data:", err);
    }
}

function getParamsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        page: parseInt(urlParams.get('page')) || 1,
        size: 20,
        name: urlParams.get('search') || '',
        orderBy: urlParams.get('orderBy') || '',
        adminShared: urlParams.get('adminShared') || '',
    };
}

$(document).on('click', `#userFoodTableBody tr`, function () {
    const foodId = $(this).find('.td-id').text();
    const page = `food-management/user-regist/${foodId}`;
    updateURL(page);
});

registerPopstateHandler('userFood',loadUserFood);
registerViewLoader('userFood', loadUserFood);