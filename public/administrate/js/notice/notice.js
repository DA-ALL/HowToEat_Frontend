import { updateURL, registerPopstateHandler } from '/administrate/js/router.js';
import { loadSearchBar } from '/administrate/js/components/searchbar.js';
import { loadFilter } from '/administrate/js/components/filter.js';
import { renderNoticeTable, renderTableWithOptionalPagination } from '/administrate/js/notice/noticeTable.js';
import { loadNoticeDetail } from '/administrate/js/notice/noticeDetail.js';

$(document).ready(function () {
    loadContent();
});

function loadContent() {
    const container = $("#notice");

    let adminFoodHTML = `
        <div class="add-title-wrapper">
            <div class="add-title">공지사항 전체보기</div>
            <div id="addNoticeButton" class="add-button-wrapper">
                <div class="label">추가하기</div>
                <div class="icon-add">
                    <img src="/administrate/images/icon_add_red.png">
                </div>
            </div>
        </div>

        <div id="noticeSearchbar" class="searchbar" data-placeholder="공지사항 제목 검색"></div>

        <div class="filter-group">
            <div id="filter" data-type="1"></div>
        </div>

        <div id="noticeTable"></div>
    `;

    container.html(adminFoodHTML);
    
    loadSearchBar('notice');
    loadFilter('notice');
    
    loadNoticeTable();
}


function loadNoticeTable(){
    const containerId = 'noticeTable';
    const bodyId = 'noticeTableBody';
    const contentId = 'notice';

    renderNoticeTable(containerId, bodyId);
    renderTableWithOptionalPagination({
        getData: getNoticeDatas,
        bodyId,
        contentId,
        enablePagination: true
    });
}

function getNoticeDatas() {
    return Array.from({ length: 3 }, (_, i) => ({
        id: i + 1,
        noticeType: "공지사항",
        noticeTitle: "공지사항 제목" + (i + 1),
        createdAt: "2023-10-01",
    }));
}



$(document).on('click', `#noticeTableBody tr`, function () {
    const noticeId = $(this).find('.td-id').text();
    const page = `notice/${noticeId}`;
    updateURL(page);
    
    // load notice detail
    loadNoticeDetail({type:'edit'});
});

$(document).on('click', `#addNoticeButton`, function () {
    console.log('create notice');
    updateURL('notice/add');

    loadNoticeDetail({type:'add'});
});


registerPopstateHandler('notice', loadContent);