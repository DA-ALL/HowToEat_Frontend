import { updateQueryParam , getCurrentContent} from '/administrate/js/router.js';
import { renderPagination } from '/administrate/js/components/pagination.js';

const usersPerPage = 20;

export function createTrainerRow({ id, imageURL, name, gymBranch, memberCount, joined }) {
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
            <td class="td-gym-branch">${gymBranch}</td>
            <td class="td-member-count">${memberCount}</td>
            <td class="td-account-created-at">${joined}</td>
        </tr>
    `;
}

export function renderTrainerTable(containerId, bodyId) {
    const tableHTML = `
        <table class="trainer-table">
            <thead>
                <tr>
                    <th class="th-id">ID</th>
                    <th class="th-user-name">트레이너명</th>
                    <th class="th-gym-branch">지점</th>
                    <th class="th-member-count">담당회원수</th>
                    <th class="th-account-created-at">등록일</th>
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

    $(`#${bodyId}`).html(rows.map(createTrainerRow).join(""));

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
