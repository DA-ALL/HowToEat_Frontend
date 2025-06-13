import { updateURL, registerPopstateHandler, registerViewLoader } from '../router.js';
import { loadSearchBar } from '/administrate/js/components/searchbar.js';
import { loadFilter } from '/administrate/js/components/filter.js';
import { renderNoticeTable, renderTableWithOptionalPagination } from '/administrate/js/notice/noticeTable.js';
import { loadNoticeDetail } from '/administrate/js/notice/noticeDetail.js';
import { getNoticeList } from '../api.js';

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
    
    loadSearchBar('notice', loadNoticeTable);
    loadFilter('notice', loadNoticeTable);
    
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

async function getNoticeDatas() {
    const params = getParamsFromUrl();
    console.log("Fetching notice list with params:", params);
    try {
        const response = await getNoticeList(params.page, params.title, params.orderBy);
        console.log(response);
        return response;

    } catch (error) {
        console.error("공지사항 목록을 불러오는 중 오류 발생:", error);
    }
}

function getParamsFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);

    return {
        page: parseInt(urlParams.get('page')) || 1,
        title: urlParams.get('search') || '',
        orderBy: urlParams.get('orderby') || ''
    };
}


$(document).on('click', `#noticeTableBody tr`, function () {
    const noticeId = $(this).find('.td-id').text();
    const page = `notice/${noticeId}`;
    updateURL(page);
});

$(document).on('click', `#addNoticeButton`, function () {
    console.log('create notice');
    updateURL('notice/add');
});


registerPopstateHandler('notice', loadContent);
registerViewLoader('notice', loadContent);