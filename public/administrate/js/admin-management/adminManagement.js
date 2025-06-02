import { showCustomAlert } from '/administrate/js/components/customAlert.js';
import { updateURL, registerPopstateHandler } from '/administrate/js/router.js';
import { renderAdminAccountTable, renderTableWithOptionalPagination} from '/administrate/js/admin-management/adminAccountTable.js';
import { loadAdminAccountDetail } from '/administrate/js/admin-management/adminAccountDetail.js';
import { getAdminAccountList } from '/administrate/js/api.js';
import { registerViewLoader } from '/administrate/js/router.js';

function loadAdminManagementView() {
    loadContent(); // 기존 초기화
    loadAdminAccountTable(); // 실제 데이터 로딩
}

registerViewLoader('adminManagement', loadAdminManagementView);

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
}

async function loadAdminAccountTable(){
    const containerId = 'adminAccountTable';
    const bodyId = 'adminAccountTableBody';
    const contentId = 'adminManagement';

    renderAdminAccountTable(containerId, bodyId);
    await renderTableWithOptionalPagination({
        getData: getAdminAccountDatas,
        bodyId,
        contentId,
        enablePagination: true
    });
}

async function getAdminAccountDatas() {
    try {
        const data = await getAdminAccountList(); // Promise가 resolve될 때까지 기다림
        return data.content;
    } catch (err) {
        return [];
    }
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


registerPopstateHandler('adminManagement', loadContent);