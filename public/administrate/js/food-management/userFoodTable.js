import { updateQueryParam } from '/administrate/js/router.js';
import { renderPagination } from '/administrate/js/components/pagination.js';

const usersPerPage = 20;

export function createUserFoodRow({ id, foodName, profileImageUrl, userName, kcal, carbo, protein, fat, foodWeight, unit, sharedAt }) {
    return `
        <tr>
            <td class="td-id">${id}</td>
            <td class="td-food-name">${foodName}</td>
            <td class="td-user-profile">
                <div class="td-user-profile-wrapper">
                    <div class="image-user">
                        <img src=${profileImageUrl}>
                    </div>
                    <div class="user-name">${userName}</div>
                </div>
            </td>
            <td class="td-calorie">${kcal}kcal</td>
            <td class="td-carbo">${carbo}g</td>
            <td class="td-protein">${protein}g</td>
            <td class="td-fat">${fat}g</td>
            <td class="td-food-weight">${foodWeight}${unit}</td>
            <td class="td-is-shared">${sharedAt ? "공유중" : "-"}</td>
        </tr>
    `;
}

export function renderUserFoodTable(containerId, bodyId) {
    const tableHTML = `
        <table class="user-food-table">
            <thead>
                <tr>
                    <th class="th-id">ID</th>
                    <th class="th-food-name">식품명</th>
                    <th class="th-user-name">유저명</th>
                    <th class="th-calorie">칼로리</th>
                    <th class="th-carbo">탄수화물</th>
                    <th class="th-protein">단백질</th>
                    <th class="th-fat">지방</th>
                    <th class="th-food-weight">식품중량</th>
                    <th class="th-is-shared">관리자DB</th>
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

    $(`#${bodyId}`).html(rows.map(createUserFoodRow).join(""));

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
