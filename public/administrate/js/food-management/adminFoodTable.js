import { showCustomAlert } from '/administrate/js/components/customAlert.js';
import { updateQueryParam , getCurrentContent} from '/administrate/js/router.js';
import { renderPagination } from '/administrate/js/components/pagination.js';

const usersPerPage = 20;

function createRows({ id, foodName, foodCode, mainFoodName, calorie, carbo, protein, fat, foodWeight, foodWeightUnit, isRecommended, source }) {
    return `
        <tr>
            <td class="td-id">${id}</td>
            <td class="td-food-name">${foodName}</td>
            <td class="td-food-code">${foodCode}</td>
            <td class="td-source ${source}">
                <div class="source-label">
                    ${source === 'processed' ? '가공식품' :
                        source === 'cooked' ? '음식' :
                        source === 'ingredient' ? '원재료' :
                        source === 'custom' ? '유저 등록' : ''}
                </div>
            </td>
            <td class="td-main-food-name">${mainFoodName}</td>
            <td class="td-calorie">${calorie}kcal</td>
            <td class="td-carbo">${carbo}g</td>
            <td class="td-protein">${protein}g</td>
            <td class="td-fat">${fat}g</td>
            <td class="td-food-weight">${foodWeight}${foodWeightUnit}</td>
            <td class="td-is-recommended">${isRecommended}</td>
            <td class="td-delete">
                <div class="delete-food-button-wrapper">
                    <div class="delete-food-button" data-food-id="${id}">삭제</div>
                </div>
            </td>
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
                    <th class="th-source">데이터출처</th>   
                    <th class="th-main-food-name">대표식품명</th>
                    <th class="th-calorie">칼로리</th>
                    <th class="th-carbo">탄수화물</th>
                    <th class="th-protein">단백질</th>
                    <th class="th-fat">지방</th>
                    <th class="th-food-weight">식품중량</th>
                    <th class="th-is-recommended">추천음식</th>
                    <th class="th-delete">선택</th>
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

// 삭제 버튼 클릭 시
$(document).on('click', '.delete-food-button', function (e) {
    e.stopPropagation();
    const foodId = $(this).data('food-id');
    console.log(`음식 ID ${foodId} 삭제 요청`);

    // TODO: 실제 삭제 API 호출
    
    // showCustomAlert(2); 
    // 예시: 삭제 후 테이블 다시 렌더링할 경우 필요한 콜백 추가 가능
});