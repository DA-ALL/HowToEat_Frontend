export function renderPagination({ contentId, totalItems, itemsPerPage, currentPage, onPageChange }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let paginationHTML = "<div class='pagination-wrapper'>";

    paginationHTML += `<div class="pagination-button" data-page="${Math.max(1, currentPage - 10)}"><<</div>`;
    paginationHTML += `<div class="pagination-button" data-page="${Math.max(1, currentPage - 1)}"><</div>`;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
        startPage = 1;
        endPage = Math.min(5, totalPages);
    } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(1, totalPages - 4);
        endPage = totalPages;
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<div class="pagination-button ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</div>`;
    }

    paginationHTML += `<div class="pagination-button" data-page="${Math.min(totalPages, currentPage + 1)}">></div>`;
    paginationHTML += `<div class="pagination-button" data-page="${Math.min(totalPages, currentPage + 10)}">>></div>`;
    paginationHTML += "</div>";

    $(`#${contentId} .pagination`).html(paginationHTML);

    $(`#${contentId} .pagination-button`).click(function () {
        const newPage = parseInt($(this).data("page"));
        if (newPage !== currentPage) {
            onPageChange(newPage);
        }
    });
}