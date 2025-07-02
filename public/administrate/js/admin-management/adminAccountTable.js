import { showCustomAlert } from '/administrate/js/components/customAlert.js';
import { updateQueryParam } from '/administrate/js/router.js';
import { renderPagination } from '/administrate/js/components/pagination.js';
import { deleteAdminAccount } from '../api.js';

const usersPerPage = 20;

function createRows({ id, accountId, createdAt, userRole }) {
    return `
        <tr>
            <td class="td-id">${id}</td>
            <td class="td-account-id">${accountId}</td>
            <td class="td-created-at">${createdAt}</td>
            <td class="td-role">
                <div class="role-wrapper">
                    <div class="role-button ${userRole}">${formatUserRole(userRole)}</div>
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

function formatUserRole(userRole) {
    switch (userRole) {
        case 'SUPERUSER':
            return 'SuperUser';
        case 'ADMIN':
            return 'Admin';
        case 'USER':
            return 'User';
        case 'MASTER':
            return 'Master';
        default:
            return '';
    }
    
}

export async function renderTableWithOptionalPagination({
    getData,         // 데이터 함수
    bodyId,
    contentId,
    enablePagination = true
}) {
    const data = await getData();
    const pageFromURL = data.page + 1;
    const rows = data.content;
    
    $(`#${bodyId}`).html(rows.map(createRows).join(""));

    if (enablePagination) {
        renderPagination({
            contentId,
            totalItems: data.totalElements,
            itemsPerPage: usersPerPage,
            currentPage: pageFromURL,
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
            try {
                deleteAdminAccount(adminAccountId);
                showCustomAlert({
                    type: 3,
                    message: "관리자 계정이 삭제되었습니다.",
                    onNext: function () {
                        //새로고침 
                        location.reload();
                    }
                });
            } catch (error) {
                
            }
            console.log("삭제 확인");
        }
    });
});