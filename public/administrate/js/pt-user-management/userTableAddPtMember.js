
import { renderPagination } from '/administrate/js/components/pagination.js';

const usersPerPage = 10;

export function createUserRow({ id, profileImageUrl, name, createdAt, isNextGym, userRole }) {
    return `
        <tr>
            <td class="td-id">${id}</td>
            <td class="td-user-profile">
                <div class="td-user-profile-wrapper">
                    <div class="image-user">
                        <img src=${profileImageUrl}>
                    </div>
                    <div class="user-name">${name}</div>
                </div>
            </td>
            <td class="td-account-created-at">${createdAt}</td>
            <td class="td-gym-user">
                ${isNextGym ? `<div class="image-gym-user-read"><img src="/administrate/images/logo_nextgym_02.png"></div>` : `<div class="image-gym-user">-</div>`}
            </td>
            <td class="td-user-role">
                <div class="user-role-wrapper">
                    <div class="user-role-button-read ${userRole}">${formatUserRole(userRole)}</div>
                </div>
            </td>
        </tr>
    `;
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

export function renderUserTable(containerId, bodyId) {
    const tableHTML = `
        <table class="user-table-add-pt-member popup">
            <thead>
                <tr>
                    <th class="th-id">ID</th>
                    <th class="th-user-profile">회원명</th>
                    <th class="th-account-created-at">가입일</th>
                    <th class="th-gym-user">넥스트짐 등록 여부</th>
                    <th class="th-user-role">권한</th>
                </tr>
            </thead>
            <tbody id="${bodyId}"></tbody>
        </table>
        <div class="pagination"></div>`;

    $(`#${containerId}`).html(tableHTML);
}

export async function renderTableWithOptionalPagination({
    getData,
    bodyId,
    contentId,
    enablePagination = false
}) {
    const data = await getData();
    const page = data.page + 1;
    const rows = data.content;

    $(`#${bodyId}`).html(rows.map(createUserRow).join(""));

    if (enablePagination) {
        renderPagination({
            contentId,
            totalItems: data.totalElements,
            itemsPerPage: usersPerPage,
            currentPage: page,
            onPageChange: (newPage) => {
                const searchValue = $(`#${contentId} .searchbar input`).val();
                const newgetData = (sv = searchValue, p = newPage) => getData(sv, p);
                
                renderTableWithOptionalPagination({
                    getData: newgetData,
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