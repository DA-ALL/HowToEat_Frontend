import { showCustomAlert } from '/administrate/js/components/customAlert.js';
import { updateQueryParam } from '/administrate/js/router.js';
import { renderPagination } from '/administrate/js/components/pagination.js';
import { deleteTrainer } from '../api.js';

const usersPerPage = 20;

export function createRows({ id, imageUrl, name, gym, memberCount, createdAt }) {
    return `
        <tr>
            <td class="td-id">${id}</td>
            <td class="td-user-profile">
                <div class="td-user-profile-wrapper">
                    <div class="image-user">
                        <img src=${imageUrl ? imageUrl : "/administrate/images/icon_human_red.png"}>
                    </div>
                    <div class="user-name">${name}</div>
                </div>
            </td>
            <td class="td-gym-branch">${gym.name}</td>
            <td class="td-member-count">${memberCount}</td>
            <td class="td-created-at">${createdAt}</td>
            <td class="td-delete">
                <div class="table-delete-button-wrapper">
                    <div class="table-delete-button" data-id="${id}">삭제</div>
                </div>
            </td>
        </tr>
    `;
}

export function renderAdminTrainerTable(containerId, bodyId) {
    const tableHTML = `
        <table class="trainer-table">
            <thead>
                <tr>
                    <th class="th-id">ID</th>
                    <th class="th-user-name">트레이너명</th>
                    <th class="th-gym-branch">지점</th>
                    <th class="th-member-count">담당회원수</th>
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

// 삭제 버튼 클릭 시
$(document).on('click', '#adminTrainerTable .table-delete-button', function (e) {
    e.stopPropagation();
    const trainerId = $(this).data('id');
    // console.log(`trainer ID ${trainerId} 삭제 요청`);

    // TODO: 실제 삭제 API 호출
    showCustomAlert({
        type: 5,
        onCancel: () => {
            // console.log("삭제 취소");
        },
        onNext: async () => {
            try {
                const response = await deleteTrainer(trainerId);
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