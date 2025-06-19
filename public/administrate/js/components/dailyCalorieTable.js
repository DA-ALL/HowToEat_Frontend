import { updateQueryParam } from '/administrate/js/router.js';
import { renderPagination } from '/administrate/js/components/pagination.js';

const itemsPerPage = 20;

export function createCalorieRow({ id, createdAt, breakfastKcal, lunchKcal, dinnerKcal, snackKcal, totalKcal }) {
    return `
        <tr>
            <td class="td-id">${id}</td>
            <td class="td-date">${createdAt}</td>
            <td class="td-breakfast">${breakfastKcal} Kcal</td>
            <td class="td-lunch">${lunchKcal} Kcal</td>
            <td class="td-dinner">${dinnerKcal} Kcal</td>
            <td class="td-snack">${snackKcal} Kcal</td>
            <td class="td-total">${totalKcal} Kcal</td>
        </tr>
    `;
}

export function renderCalorieTable(containerId, bodyId) {
    const tableHTML = `
        <table class="daily-calorie-table">
            <thead>     
                <tr>
                    <th class="th-id">ID</th>
                    <th class="th-date">날짜</th>
                    <th class="th-breakfast">아침</th>
                    <th class="th-lunch">점심</th>
                    <th class="th-dinner">저녁</th>
                    <th class="th-snack">간식</th>
                    <th class="th-total">Total</th>
                </tr>
            </thead>
            <tbody id="${bodyId}"></tbody>
        </table>
        <div class="pagination"></div>`;

    $(`#${containerId}`).html(tableHTML);
}

export async function renderCalorieTableWithOptionalPagination({
    getData,         
    bodyId,
    contentId,
    tableId,
    enablePagination = true
}) {
    const data = await getData();
    const page = data.page + 1;
    const rows = data.content;

    $(`#${bodyId}`).html(rows.map(createCalorieRow).join(""));

    if (enablePagination) {
        renderPagination({
            contentId: tableId,
            totalItems: data.totalElements,
            itemsPerPage: itemsPerPage,
            currentPage: page,
            onPageChange: (newPage) => {
                updateQueryParam({ page: newPage });
                renderCalorieTableWithOptionalPagination({
                    getData,
                    bodyId,
                    contentId,
                    tableId,
                    enablePagination
                });
            }
        });
    } else {
        $(`#${bodyId}`).closest('table').parent().find('.pagination').remove();
    }
}


export function getPageFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    return parseInt(urlParams.get('page')) || 1;
    
}
