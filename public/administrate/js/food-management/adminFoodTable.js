import { updateQueryParam , getCurrentContent} from '/administrate/js/router.js';
import { renderPagination } from '/administrate/js/components/pagination.js';

const usersPerPage = 20;

function createRows({ id, foodName, foodCode, mainFoodName, calorie, carbohydrates, protein, fat, foodWeight, foodWeightUnit, isRecommended, source }) {
    return `
        <tr>
            <td class="td-id">${id}</td>
            <td class="td-food-name">${foodName}</td>
            <td class="td-food-code">${foodCode}</td>
            <td class="td-main-food-name">${mainFoodName}</td>
            <td class="td-calorie">${calorie}kcal</td>
            <td class="td-carbohydrates">${carbohydrates}g</td>
            <td class="td-protein">${protein}g</td>
            <td class="td-fat">${fat}g</td>
            <td class="td-food-weight">${foodWeight}${foodWeightUnit}</td>
            <td class="td-is-recommended">${isRecommended}</td>
            <td class="td-source">${source}</td> 
        </tr>
    `;
}

export function renderTable(containerId, bodyId) {
    const tableHTML = `
        <table class="admin-food-table">
            <thead>
                <tr>
                    <th class="th-id">ID</th>
                    <th class="th-food-name">식품명</th>
                    <th class="th-food-code">식품코드</th>
                    <th class="th-main-food-name">대표식품명</th>
                    <th class="th-calorie">에너지</th>
                    <th class="th-carbohydrates">탄수화물</th>
                    <th class="th-protein">단백질</th>
                    <th class="th-fat">지방</th>
                    <th class="th-food-weight">식품중량</th>
                    <th class="th-is-recommended">추천음식</th>
                    <th class="th-source">데이터출처</th>   
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
