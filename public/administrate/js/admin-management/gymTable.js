import { showCustomAlert } from '/administrate/js/components/customAlert.js';
import { updateQueryParam } from '/administrate/js/router.js';
import { renderPagination } from '/administrate/js/components/pagination.js';
import { deleteGym } from '../api.js';

const usersPerPage = 20;

export function createRows({ id, name, createdAt }) {
    return `
        <tr>
            <td class="td-id">${id}</td>
            <td class="td-gym-name">${name}</td>
            <td class="td-created-at">${createdAt}</td>
            <td class="td-delete">
                <div class="table-delete-button-wrapper">
                    <div class="table-delete-button" data-id="${id}">삭제</div>
                </div>
            </td>
        </tr>
    `;
}

export function renderGymTable(containerId, bodyId) {
    const tableHTML = `
        <table class="gym-table">
            <thead>
                <tr>
                    <th class="th-id">ID</th>
                    <th class="th-gym-name">지점</th>
                    <th class="th-created-at">등록일</th>
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
    const response = await getData();
    const page = response.page + 1;
    const rows = response.content; 

    $(`#${bodyId}`).html(rows.map(createRows).join(""));

    if (enablePagination) {
        renderPagination({
            contentId,
            totalItems: response.totalElements,
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

// 삭제 버튼 클릭 시
$(document).on('click', '#gymTable .table-delete-button', function (e) {
    e.stopPropagation();
    const gymId = $(this).data('id');
    console.log(`gym ID ${gymId} 삭제 요청`);

    // TODO: 실제 삭제 API 호출
    showCustomAlert({
        type: 5,
        onCancel: () => {
            console.log("삭제 취소");
        },
        onNext: async () => {
            try {
                const response = await deleteGym(gymId);
                showCustomAlert({
                    type: 3,
                    message: response.message,
                    onNext: function () {
                        //새로고침 
                        location.reload();
                    }
                });
            } catch (error) {
                console.error(error);
            }
        }
    });
});