
import { renderPagination } from '/administrate/js/components/pagination.js';


let usersPerPage = 100;

function createRows({ id, foodName, foodCode, representativeName, kcal, carbo, protein, fat, foodWeight, unit, foodType }) {
    return `
        <tr>
            <td class="td-id">${id}</td>
            <td class="td-source ${foodType}">
                <div class="source-label">
                    ${foodType === 'PROCESSED' ? '가공식품' :
                        foodType === 'COOKED' ? '음식' :
                        foodType === 'INGREDIENT' ? '원재료' :
                        foodType === 'CUSTOM' ? '유저 등록' : ''}
                </div>
            </td>
            <td class="td-food-name">${foodName}</td>
            <td class="td-main-food-name">${representativeName}</td>
            <td class="td-food-code">${foodCode}</td>
            <td class="td-calorie">${kcal}kcal</td>
            <td class="td-carbo">${carbo}g</td>
            <td class="td-protein">${protein}g</td>
            <td class="td-fat">${fat}g</td>
            <td class="td-food-weight">${foodWeight}${unit}</td>
        </tr>
    `;
}

export function renderRecommendFoodTable(containerId, bodyId) {
    const tableHTML = `
        <table class="recommend-food-table">
            <thead>
                <tr>
                    <th class="th-id">ID</th>
                    <th class="th-source">데이터출처</th>
                    <th class="th-food-name">식품명</th>
                    <th class="th-main-food-name">대표식품명</th>
                    <th class="th-food-code">식품코드</th>
                    <th class="th-calorie">칼로리</th>
                    <th class="th-carbo">탄수화물</th>
                    <th class="th-protein">단백질</th>
                    <th class="th-fat">지방</th>
                    <th class="th-food-weight">식품중량</th>
                </tr>
            </thead>
            <tbody id="${bodyId}"></tbody>
        </table>
        <div class="pagination"></div>`;

    $(`#${containerId}`).html(tableHTML);
}

export async function renderTableWithOptionalPagination({
    data,         // 데이터 함수
    bodyId,
    contentId,
    enablePagination = false
}) {
    
    const page = 0;
    const rows = data;

    $(`#${bodyId}`).html(rows.map(createRows).join(""));

    if (enablePagination) {
        renderPagination({
            contentId,
            totalItems: 0,
            itemsPerPage: 0,
            currentPage: page,
            onPageChange: (newPage) => {
                updateQueryParam({ page: newPage });
                renderTableWithOptionalPagination({
                    data,
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
