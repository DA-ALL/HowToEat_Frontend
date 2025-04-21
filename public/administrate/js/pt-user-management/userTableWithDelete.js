import { updateQueryParam , getCurrentContent} from '/administrate/js/router.js';
import { showCustomAlert } from '/administrate/js/components/customAlert.js';
import { renderPagination } from '/administrate/js/components/pagination.js';

const usersPerPage = 20;

export function createUserRow({ id, imageURL, name, mealCount, joined, left, gymUser, role }) {
    return `
        <tr>
            <td class="td-id">${id}</td>
            <td class="td-user-profile">
                <div class="td-user-profile-wrapper">
                    <div class="image-user">
                        <img src=${imageURL}>
                    </div>
                    <div class="user-name">${name}</div>
                </div>
            </td>
            <td class="td-meal-log-count">${mealCount}</td>
            <td class="td-account-created-at">${joined}</td>
            <td class="td-account-closed-at">${left}</td>
            <td class="td-gym-user">
                ${gymUser ? `<div class="image-gym-user"><img src="/administrate/images/logo_nextgym_02.png"></div>` : `<div class="image-gym-user">-</div>`}
            </td>
            <td class="td-user-role">
                <div class="user-role-wrapper">
                    <div class="user-role-button ${role}">${role == 'super-user' ? 'SuperUser' : role.charAt(0).toUpperCase() + role.slice(1)}</div>
                </div>
            </td>
            <td class="td-delete">
                <div class="delete-user-button-wrapper">
                    <div class="delete-user-button" data-user-id="${id}">삭제</div>
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

    $(`#${bodyId}`).html(rows.map(createUserRow).join(""));

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


function getPageFromURL(contentId) {
    const urlParams = new URLSearchParams(window.location.search);
    if(getCurrentContent() == contentId) {
        return parseInt(urlParams.get('page')) || 1;
    } else {
        return 1;
    }
}


// 삭제 버튼 클릭 시
$(document).on('click', '.delete-user-button', function (e) {
    e.stopPropagation();
    const userId = $(this).data('user-id');
    console.log(`사용자 ID ${userId} 삭제 요청`);

    // TODO: 실제 삭제 API 호출
    
    showCustomAlert({
        type: 2,
        onCancel: () => {
            console.log("삭제 취소");
        },
        onNext: () => {
            console.log("삭제 확인");
        }
    }); 
    // 예시: 삭제 후 테이블 다시 렌더링할 경우 필요한 콜백 추가 가능
});