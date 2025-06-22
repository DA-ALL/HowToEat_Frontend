import { showCustomAlert } from '/administrate/js/components/customAlert.js';
import { updateQueryParam } from '/administrate/js/router.js';
import { renderPagination } from '/administrate/js/components/pagination.js';

const usersPerPage = 20;

function createRows({ id, foodName, foodCode, representativeName, kcal, carbo, protein, fat, foodWeight, unit, isRecommended, foodType }) {
    return `
        <tr>
            <td class="td-id">${id}</td>
            <td class="td-food-name">${foodName}</td>
            <td class="td-food-code">${foodCode}</td>
            <td class="td-source ${foodType}">
                <div class="source-label">
                    ${foodType === 'PROCESSED' ? '가공식품' :
                        foodType === 'COOKED' ? '음식' :
                        foodType === 'INGREDIENT' ? '원재료' :
                        foodType === 'CUSTOM' ? '유저 등록' : ''}
                </div>
            </td>
            <td class="td-main-food-name">${representativeName}</td>
            <td class="td-calorie">${kcal}kcal</td>
            <td class="td-carbo">${carbo}g</td>
            <td class="td-protein">${protein}g</td>
            <td class="td-fat">${fat}g</td>
            <td class="td-food-weight">${foodWeight}${unit}</td>
            <td class="td-is-recommended">${isRecommended ? 'O' : 'X'}</td>
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

export async function renderTableWithOptionalPagination({
    getData,         // 데이터 함수
    bodyId,
    contentId,
    enablePagination = true
}) {
    const data = await getData();
    const page = data.page + 1;
    const rows = data.content;

    $(`#${bodyId}`).html(rows.map(createRows).join(""));

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
    showCustomAlert({
        type: 5,
        onCancel: () => {
            console.log("삭제 취소");
        },
        onNext: () => {
            console.log("삭제 확인");
        }
    });

});