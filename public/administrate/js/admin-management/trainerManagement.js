import { showCustomAlert } from '/administrate/js/components/customAlert.js';
import { loadFilter } from '/administrate/js/components/filter.js';
import { loadSearchBar } from '/administrate/js/components/searchbar.js';

import { updateURL, registerPopstateHandler } from '/administrate/js/router.js';
import { renderAdminTrainerTable, renderTableWithOptionalPagination } from '/administrate/js/admin-management/adminTrainerTable.js';
import { loadTrainertDetail } from '/administrate/js/admin-management/trainerDetail.js';
import { getTrainerList } from '../api.js';
import { registerViewLoader } from '../router.js';

function loadContent() {
    const container = $("#trainerManagement");

    let trainerManagementHTML = `
        <div class="add-title-wrapper">
            <div class="add-title">트레이너 관리</div>
            <div id="addTrainerButton" class="add-button-wrapper">
                <div class="label">추가하기</div>
                <div class="icon-add">
                    <img src="/administrate/images/icon_add_red.png">
                </div>
            </div>
        </div>
        <div id="trainerSearchbar" class="searchbar" data-placeholder="트레이너명 검색"></div>
        <div class="filter-group">
            <div id="filter" data-type="8"></div>
        </div>

        <div id="adminTrainerTable"></div>
    `;

    container.html(trainerManagementHTML);
    loadSearchBar('trainerManagement', loadTable);
    loadFilter('trainerManagement', loadTable);
    loadTable();
}

function loadTable(){
    const containerId = 'adminTrainerTable';
    const bodyId = 'adminTrainerTableBody';
    const contentId = 'trainerManagement';

    renderAdminTrainerTable(containerId, bodyId);
    renderTableWithOptionalPagination({
        getData: getTrainerDatas,
        bodyId,
        contentId,
        enablePagination: true
    });
}

async function getTrainerDatas(){
    const params = getParamsFromURL();

    try{
        const response = await getTrainerList(params.page, params.name, params.gymName);
        // console.log(response);
        return response;
    } catch (error){
        console.error(error);
    }
}

function getParamsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        page: parseInt(urlParams.get('page')) || 1,
        name: urlParams.get('search') || '',
        gymName: urlParams.get('gym') || ''
    };
}

$(document).on('click', `#adminTrainerTableBody tr`, function () {
    const adminAccountId = $(this).find('.td-id').text();
    const page = `admin-management/trainer/${adminAccountId}`;
    updateURL(page);
});

// 추가하기 버튼 클릭
$(document).on('click', `#addTrainerButton`, function () {
    // console.log('trainer 생성');
    updateURL('admin-management/trainer/add');
});


registerPopstateHandler('trainerManagement', loadContent);
registerViewLoader('trainerManagement', loadContent);