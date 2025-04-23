import { showCustomAlert } from '/administrate/js/components/customAlert.js';
import { updateURL, registerPopstateHandler } from '/administrate/js/router.js';
import { renderAdminAccountTable, renderTableWithOptionalPagination} from '/administrate/js/admin-management/adminAccountTable.js';
import { loadAdminAccountDetail } from '/administrate/js/admin-management/adminAccountDetail.js';

$(document).ready(function () {
    loadContent();
});

function loadContent() {
    const container = $("#adminManagement");

    let adminManagementHTML = `
        <div class="add-title-wrapper">
            <div class="add-title">관리자 계정관리</div>
            <div id="addAdminAccountButton" class="add-button-wrapper">
                <div class="label">추가하기</div>
                <div class="icon-add">
                    <img src="/administrate/images/icon_add_red.png">
                </div>
            </div>
        </div>

        <div id="adminAccountTable"></div>
    `;

    container.html(adminManagementHTML);
    
    loadAdminAccountTable();
}

function loadAdminAccountTable(){
    const containerId = 'adminAccountTable';
    const bodyId = 'adminAccountTableBody';
    const contentId = 'adminManagement';

    renderAdminAccountTable(containerId, bodyId);
    renderTableWithOptionalPagination({
        getData: getAdminAccountDatas,
        bodyId,
        contentId,
        enablePagination: true
    });
}

function getAdminAccountDatas() {
    return Array.from({ length: 3 }, (_, i) => ({
        id: i + 1,
        accountId: "admin"+(i+1),
        createdAt: "2023-10-01",
        role: "admin",
    }));
}


$(document).on('click', `#adminAccountTableBody tr`, function () {
    const adminAccountId = $(this).find('.td-id').text();
    const page = `admin-management/${adminAccountId}`;
    updateURL(page);
    
    // load admin account detail
    loadAdminAccountDetail({type:'edit'});
});

// 추가하기 버튼 클릭
$(document).on('click', `#addAdminAccountButton`, function () {
    console.log('create admin account');
    updateURL('admin-management/add');

    loadAdminAccountDetail({type:'add'});
});


registerPopstateHandler('notice', loadContent);