
import { renderPagination } from '/administrate/js/components/pagination.js';

const usersPerPage = 10;

export function createUserRow({ id, imageURL, name, joined, gymUser, role }) {
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
            <td class="td-account-created-at">${joined}</td>
            <td class="td-gym-user">
                ${gymUser ? `<div class="image-gym-user-read"><img src="/administrate/images/logo_nextgym_02.png"></div>` : `<div class="image-gym-user">-</div>`}
            </td>
            <td class="td-user-role">
                <div class="user-role-wrapper">
                    <div class="user-role-button-read ${role}">${role == 'super-user' ? 'SuperUser' : role.charAt(0).toUpperCase() + role.slice(1)}</div>
                </div>
            </td>
        </tr>
    `;
}

export function renderUserTable(containerId, bodyId) {
    const tableHTML = `
        <table class="user-table-add-pt-member">
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

export function renderTableWithOptionalPagination({
    getData,
    bodyId,
    contentId,
    enablePagination = false
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
                // updateQueryParam({ page: newPage });
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
    // if(getCurrentContent() == contentId) {
        return parseInt(urlParams.get('page')) || 1;
    // } else {
        // return 1;
    // }
}
