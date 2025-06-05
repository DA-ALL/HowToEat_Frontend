import { showCustomAlert } from '/administrate/js/components/customAlert.js';
import { loadSearchBar } from '/administrate/js/components/searchbar.js';

import { updateURL, registerPopstateHandler } from '/administrate/js/router.js';
import { renderGymTable, renderTableWithOptionalPagination } from '../admin-management/gymTable.js';
import { loadGymDetail } from '/administrate/js/admin-management/gymDetail.js';
import { getGymList } from '../api.js';
import { registerViewLoader } from '/administrate/js/router.js';

function loadContent() {
    const container = $("#gymManagement");

    let gymManagementHTML = `
        <div class="add-title-wrapper">
            <div class="add-title">헬스장 관리</div>
            <div id="addGymButton" class="add-button-wrapper">
                <div class="label">추가하기</div>
                <div class="icon-add">
                    <img src="/administrate/images/icon_add_red.png">
                </div>
            </div>
        </div>

        <div id="gymSearchbar" class="searchbar" data-placeholder="헬스장 검색"></div>
        
        <div id="gymTable"></div>
    `;

    container.html(gymManagementHTML);
    loadSearchBar('gymManagement', loadTable);
    
    loadTable();
}

function loadTable(){
    const containerId = 'gymTable';
    const bodyId = 'gymTableBody';
    const contentId = 'gymManagement';

    renderGymTable(containerId, bodyId);
    renderTableWithOptionalPagination({
        getData: getGymDatas,
        bodyId,
        contentId,
        enablePagination: true
    });
}

async function getGymDatas() {
    const page = getPageFromURL();
    const searchValue = getSearchValueFromURL();
    try {
        const response = await getGymList(page, searchValue);
        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
    }
}


function getPageFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('page')) || 1;
}

function getSearchValueFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('search');
}

$(document).on('click', `#gymTableBody tr`, function () {
    const gymId = $(this).find('.td-id').text();
    const page = `admin-management/gym/${gymId}`;
    updateURL(page);
});

// 추가하기 버튼 클릭
$(document).on('click', `#addGymButton`, function () {
    console.log('헬스장 생성');
    updateURL('admin-management/gym/add');
});


registerPopstateHandler('gymManagement', loadContent);
registerViewLoader('gymManagement', loadContent);