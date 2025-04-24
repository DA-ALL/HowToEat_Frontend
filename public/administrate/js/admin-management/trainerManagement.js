import { showCustomAlert } from '/administrate/js/components/customAlert.js';
import { loadFilter } from '/administrate/js/components/filter.js';
import { loadSearchBar } from '/administrate/js/components/searchbar.js';

import { updateURL, registerPopstateHandler } from '/administrate/js/router.js';
import { renderAdminTrainerTable, renderTableWithOptionalPagination } from '/administrate/js/admin-management/adminTrainerTable.js';
import { loadTrainertDetail } from '/administrate/js/admin-management/trainerDetail.js';

$(document).ready(function () {
    loadContent();
});

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
    loadSearchBar('trainerManagement');
    loadFilter('trainerManagement');
    loadTable();
}

function loadTable(){
    const containerId = 'adminTrainerTable';
    const bodyId = 'adminTrainerTableBody';
    const contentId = 'trainerManagement';

    renderAdminTrainerTable(containerId, bodyId);
    renderTableWithOptionalPagination({
        getData: getDatas,
        bodyId,
        contentId,
        enablePagination: true
    });
}

function getDatas() {
    return Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        imageURL: "/administrate/images/icon_human_red.png",
        name: `트레이너 ${i + 1}`,
        gymBranch: ['용인기흥구청점', '용인기흥구청점', '처인구청점', '수원권선동점', '이천마장점', '이천중앙점', '평택미전점'][Math.floor(Math.random() * 7)],
        memberCount: Math.floor(Math.random() * 20),
        joined: "2025.03.16"
    }));
}


$(document).on('click', `#adminTrainerTableBody tr`, function () {
    const adminAccountId = $(this).find('.td-id').text();
    const page = `admin-management/trainer/${adminAccountId}`;
    updateURL(page);
    
    // load admin account detail
    loadTrainertDetail({type:'edit'});
});

// 추가하기 버튼 클릭
$(document).on('click', `#addTrainerButton`, function () {
    console.log('trainer 생성');
    updateURL('admin-management/trainer/add');

    loadTrainertDetail({type:'add'});
});


registerPopstateHandler('trainerManagement', loadContent);