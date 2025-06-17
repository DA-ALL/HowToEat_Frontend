
import { loadTotalUserTable } from '/administrate/js/user-management/totalUserTable.js';
import { loadSearchBar } from '/administrate/js/components/searchbar.js';
import { loadFilter } from '/administrate/js/components/filter.js';
import { registerPopstateHandler, registerViewLoader } from '/administrate/js/router.js';


function loadContent() {
    const container = $("#userManagement");

    let totalUserManagementHTML = `        
        <div class="title">전체 유저 관리</div>
        <div id="userManagementSearchbar" class="searchbar" data-placeholder="유저명 검색"></div>

        <div class="filter-group">
            <div id="filter" data-type="1"></div>
            <div id="filter" data-type="2"></div>
            <div id="filter" data-type="3"></div>
        </div>

        <div id="totalUserTable"></div>
    `;

    container.html(totalUserManagementHTML);
    loadTotalUserTable();
    loadSearchBar('userManagement', loadTotalUserTable);
    loadFilter('userManagement', loadTotalUserTable);
}

registerPopstateHandler('userManagement', loadContent);
registerViewLoader('userManagement', loadContent);