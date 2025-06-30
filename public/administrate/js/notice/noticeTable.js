import { showCustomAlert } from '/administrate/js/components/customAlert.js';
import { updateQueryParam } from '/administrate/js/router.js';
import { renderPagination } from '/administrate/js/components/pagination.js';
import { deleteNotice } from '../api.js';

const usersPerPage = 20;

function createRows({ id, title, noticeType, createdAt }) {
    return `
        <tr>
            <td class="td-id">${id}</td>
            <td class="td-notice-type">${convertNoticeType(noticeType)}</td>
            <td class="td-notice-title">${title}</td>
            <td class="td-created-at">${createdAt}</td>
            <td class="td-delete">
                <div class="delete-notice-button-wrapper">
                    <div class="delete-notice-button" data-notice-id="${id}">삭제</div>
                </div>
            </td>
        </tr>
    `;
}

function convertNoticeType(noticeType) {
    switch (noticeType) {
        case 'NOTICE':
            return '공지';
        case 'BUGFIX':
            return '버그수정';
        case 'UPDATE':
            return '업데이트';
        default:
            return '알 수 없음';
    }
}

export function renderNoticeTable(containerId, bodyId) {
    const tableHTML = `
        <table class="notice-table">
            <thead>
                <tr>
                    <th class="th-id">ID</th>
                    <th class="th-notice-type">타입</th>
                    <th class="th-notice-title">제목</th>
                    <th class="th-created-at">작성일자</th>   
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
$(document).on('click', '.delete-notice-button', function (e) {
    e.stopPropagation();
    const noticeId = $(this).data('notice-id');
    console.log(`notice ID ${noticeId} 삭제 요청`);

    // TODO: 실제 삭제 API 호출
    showCustomAlert({
        type: 5,
        onCancel: () => {
            console.log("삭제 취소");
        },
        onNext: async () => {
            console.log("삭제 확인");
            try {
                const response = await deleteNotice(noticeId);
                showCustomAlert({
                    type: 3,
                    message: response.message,
                    onNext: function () {
                        //새로고침 
                        location.reload();
                    }
                });

            } catch (error) {
                console.error("공지사항 삭제 중 오류 발생:", error);
            }
        }
    });
});