import { updateURL, registerPopstateHandler, registerViewLoader } from '/administrate/js/router.js';
import { loadSearchBar } from '/administrate/js/components/searchbar.js';
import { loadFilter } from '/administrate/js/components/filter.js';
import { renderTable, renderTableWithOptionalPagination } from '/administrate/js/food-management/adminFoodTable.js';
import { loadFoodDetail } from '/administrate/js/food-management/foodDetail.js';
import { getFoodList } from '../api.js';

const adminFoodConfig = {
    containerId: 'adminFoodTable',
    bodyId: 'adminFoodTableBody',
    contentId: 'adminFood',
};

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
    renderTable(adminFoodConfig.containerId, adminFoodConfig.bodyId);
    loadAdminFoodTable() 
}

function loadAdminFoodTable() {
    renderTableWithOptionalPagination({
        getData: getAdminFoodDatas,
        bodyId: adminFoodConfig.bodyId,
        contentId: adminFoodConfig.containerId,
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
});


registerPopstateHandler('adminFood', loadContent );
registerViewLoader('adminFood', loadContent );