import { updateQueryParam } from '/administrate/js/router.js';
import { showCustomAlert } from '/administrate/js/components/customAlert.js';
import { renderPagination } from '/administrate/js/components/pagination.js';
import { deletePtMember } from '../api.js';
const usersPerPage = 20;

export function createUserRow({ ptMemberId, user}) {
    return `
        <tr>
            <td class="td-id">${user.id}</td>
            <td class="td-user-profile">
                <div class="td-user-profile-wrapper">
                    <div class="image-user">
                        <img src=${user.imageURL ? user.imageURL : '/administrate/images/icon_human_green.png'}>
                    </div>
                    <div class="user-name">${user.name}</div>
                </div>
            </td>
            <td class="td-meal-log-count">${user.consumedFoodCount}</td>
            <td class="td-account-created-at">${user.createdAt}</td>
            <td class="td-account-closed-at">${user.deletedAt ? deletedAt : '-'}</td>
            <td class="td-gym-user">
                ${user.isNextGym ? `<div class="image-gym-user"><img src="/administrate/images/logo_nextgym_02.png"></div>` : `<div class="image-gym-user">-</div>`}
            </td>
            <td class="td-user-role">
                <div class="user-role-wrapper">
                    <div class="user-role-button ${user.userRole}">${formatUserRole(user.userRole)}</div>
                </div>
            </td>
            <td class="td-delete">
                <div class="delete-user-button-wrapper">
                    <div class="delete-user-button" data-pt-member-id="${ptMemberId}">삭제</div>
                </div>
            </td>

        </tr>
    `;
}

export function renderUserTable(containerId, bodyId) {
    const tableHTML = `
        <table class="user-table-with-delete">
            <thead>
                <tr>
                    <th class="th-id">ID</th>
                    <th class="th-user-profile">회원명</th>
                    <th class="th-meal-log-count">식단 총 등록 수</th>
                    <th class="th-account-created-at">가입일</th>
                    <th class="th-account-closed-at">탈퇴일</th>
                    <th class="th-gym-user">넥스트짐 등록 여부</th>
                    <th class="th-user-role">권한</th>
                    <th class="th-delete">삭제</th>
                </tr>
            </thead>
            <tbody id="${bodyId}"></tbody>
        </table>
        <div class="pagination"></div>`;

    $(`#${containerId}`).html(tableHTML);
}

export async function renderTableWithOptionalPagination({
    getData,         // 데이터 함수
    bodyId,
    contentId,
    enablePagination = false
}) {
    const response = await getData();
    const page = response.currentPage + 1;
    const rows = response.content;

    $(`#${bodyId}`).html(rows.map(createUserRow).join(""));

    if (enablePagination) {
        renderPagination({
            contentId,
            totalItems: response.totalElements,
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

// 삭제 버튼 클릭 시
$(document).on('click', '.delete-user-button', function (e) {
    e.stopPropagation();
    const ptMemberId = $(this).data('pt-member-id');
    // console.log(`멤버아이디 ${ptMemberId} 삭제 요청`);

    // TODO: 실제 삭제 API 호출
    showCustomAlert({
        type: 2,
        onCancel: () => {
            // console.log("삭제 취소");
        },
        onNext: async () => {
            try {
                const response= await deletePtMember(ptMemberId);
                showCustomAlert({
                    type: 3,
                    message: response.message,
                    onNext: function () {
                        //새로고침 
                        location.reload();
                    }
                });
            } catch (error) {
                console.error("Error while deleting PT member:", error);
            }
        }
    }); 
    // 예시: 삭제 후 테이블 다시 렌더링할 경우 필요한 콜백 추가 가능
});