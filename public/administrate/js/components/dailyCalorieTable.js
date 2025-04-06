import { updateQueryParam, getCurrentContent } from '/administrate/js/router.js';
import { renderPagination } from '/administrate/js/components/pagination.js';

const itemsPerPage = 20;

export function createCalorieRow({ id, date, breakfast, lunch, dinner, snack, total }) {
    return `
        <tr>
            <td class="td-id">${id}</td>
            <td class="td-date">${date}</td>
            <td class="td-breakfast">${breakfast} Kcal</td>
            <td class="td-lunch">${lunch} Kcal</td>
            <td class="td-dinner">${dinner} Kcal</td>
            <td class="td-snack">${snack} Kcal</td>
            <td class="td-total">${total} Kcal</td>
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

export function renderCalorieTableWithOptionalPagination({
    getData,         
    bodyId,
    contentId,
    tableId,
    enablePagination = true
}) {
    const allData = getData();
    const pageFromURL = getPageFromURL();
    const page = enablePagination ? pageFromURL : 1;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const rows = enablePagination ? allData.slice(start, end) : allData;

    $(`#${bodyId}`).html(rows.map(createCalorieRow).join(""));

    if (enablePagination) {
        renderPagination({
            contentId: tableId,
            totalItems: allData.length,
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
