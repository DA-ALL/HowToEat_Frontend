import { updateQueryParam , getCurrentContent} from '/administrate/js/router.js';
import { renderPagination } from '/administrate/js/components/pagination.js';

const usersPerPage = 20;

export function createTrainerRow({ id, imageURL, name, gym, memberCount, createdAt }) {
    return `
        <tr>
            <td class="td-id">${id}</td>
            <td class="td-user-profile">
                <div class="td-user-profile-wrapper">
                    <div class="image-user">
                        <img src=${imageURL || '/administrate/images/icon_human_red.png'}>
                    </div>
                    <div class="user-name">${name}</div>
                </div>
            </td>
            <td class="td-gym-branch">${gym.name}</td>
            <td class="td-member-count">${memberCount}</td>
            <td class="td-account-created-at">${createdAt}</td>
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

export async function renderTableWithOptionalPagination({
    getData,         // 데이터 함수
    bodyId,
    contentId,
    enablePagination = true
}) {
    const data = await getData();
    const page = data.page + 1;
    const rows = data.content;
    

    $(`#${bodyId}`).html(rows.map(createTrainerRow).join(""));

    if (enablePagination) {
        renderPagination({
            contentId,
            totalItems: data.totalElements,
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
