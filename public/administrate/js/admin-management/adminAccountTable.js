import { showCustomAlert } from '/administrate/js/components/customAlert.js';
import { updateQueryParam } from '/administrate/js/router.js';
import { renderPagination } from '/administrate/js/components/pagination.js';

const usersPerPage = 20;

function createRows({ id, accountId, createdAt, role }) {
    return `
        <tr>
            <td class="td-id">${id}</td>
            <td class="td-account-id">${accountId}</td>
            <td class="td-created-at">${createdAt}</td>
            <td class="td-role">
                <div class="role-wrapper">
                    <div class="role-button ${role}">${role == 'super-user' ? 'SuperUser' : role.charAt(0).toUpperCase() + role.slice(1)}</div>
                </div>
            </td>
            <td class="td-delete">
                <div class="table-delete-button-wrapper">
                    <div class="table-delete-button" data-id="${id}">삭제</div>
                </div>
            </td>
        </tr>
    `;
}

export function renderAdminAccountTable(containerId, bodyId) {
    const tableHTML = `
        <table class="admin-account-table">
            <thead>
                <tr>
                    <th class="th-id">ID</th>
                    <th class="th-account-id">아이디</th>
                    <th class="th-created-at">생성일자</th>
                    <th class="th-role">권한</th>
                    <th class="th-delete">선택</th>
                </tr>
            </thead>
            <tbody id="${bodyId}"></tbody>
        </table>
        <div class="pagination"></div>`;

    $(`#${containerId}`).html(tableHTML);
}

export function renderTableWithOptionalPagination({
    getData,         // 데이터 함수
    bodyId,
    contentId,
    enablePagination = true
}) {
    const allData = getData();
    const pageFromURL = getPageFromURL(contentId);
    const page = enablePagination ? pageFromURL : 1;
    const start = (page - 1) * usersPerPage;
    const end = start + usersPerPage;
    const rows = enablePagination ? allData.slice(start, end) : allData;

    $(`#${bodyId}`).html(rows.map(createRows).join(""));

    if (enablePagination) {
        renderPagination({
            contentId,
            totalItems: allData.length,
            itemsPerPage: usersPerPage,
            currentPage: page,
            onPageChange: (newPage) => {
                updateQueryParam({ page: newPage });
                renderTableWithOptionalPagination({
                    getData,
                    bodyId,
                    contentId,
                    enablePagination
                });
            }
        });
    } else {
        $(`#${bodyId}`).closest('table').parent().find('.pagination').remove();
    }
}


function getPageFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('page')) || 1;
}



// 삭제 버튼 클릭 시
$(document).on('click', '#adminAccountTable .table-delete-button', function (e) {
    e.stopPropagation();
    const adminAccountId = $(this).data('id');
    console.log(`adminAccount ID ${adminAccountId} 삭제 요청`);

    // TODO: 실제 삭제 API 호출
    showCustomAlert({
        type: 5,
        onCancel: () => {
            console.log("삭제 취소");
        },
        onNext: () => {
            console.log("삭제 확인");
        }
    });
});