import { showCustomAlert } from '/administrate/js/components/customAlert.js';
import { loadSearchBar } from '/administrate/js/components/searchbar.js';

import { updateURL, registerPopstateHandler } from '/administrate/js/router.js';
import { renderGymTable, renderTableWithOptionalPagination } from '/administrate/js/admin-management/gymTable.js';
import { loadGymDetail } from '/administrate/js/admin-management/gymDetail.js';

$(document).ready(function () {
    loadContent();
});

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
    loadSearchBar('gymManagement');
    
    loadTable();
}

function loadTable(){
    const containerId = 'gymTable';
    const bodyId = 'gymTableBody';
    const contentId = 'gymManagement';

    renderGymTable(containerId, bodyId);
    renderTableWithOptionalPagination({
        getData: getDatas,
        bodyId,
        contentId,
        enablePagination: true
    });
}

function getDatas() {
    return Array.from({ length: 7 }, (_, i) => ({
        id: i + 1,
        gymName: ['용인기흥구청점', '용인기흥구청점', '처인구청점', '수원권선동점', '이천마장점', '이천중앙점', '평택미전점'][i],
        createdAt:"2025.03.16"
    }));
}


$(document).on('click', `#gymTableBody tr`, function () {
    const gymId = $(this).find('.td-id').text();
    const page = `admin-management/gym/${gymId}`;
    updateURL(page);
    
    // load admin account detail
    loadGymDetail({type: 'edit'});
});

// 추가하기 버튼 클릭
$(document).on('click', `#addGymButton`, function () {
    console.log('헬스장 생성');
    updateURL('admin-management/gym/add');
    
    loadGymDetail({type: 'add'});
});


registerPopstateHandler('gymManagement', loadContent);