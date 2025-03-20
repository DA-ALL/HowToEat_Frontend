
import { loadTotalUserTable } from '/administrate/js/totalUserTable.js';
import { loadSearchBar } from '/administrate/js/searchbar.js';
import { renderFilters } from '/administrate/js/filter.js';

$(document).ready(function () {
    loadContent();
});

function loadContent() {
    const container = $("#userManagement");

    let totalUserManagementHTML = `        
        <div class="title">전체 유저 관리</div>
        <div id="searchbar" data-placeholder="유저명 검색"></div>

        <div class="filter-group">
            <div id="filter" data-type="1"></div>
            <div id="filter" data-type="2"></div>
            <div id="filter" data-type="3"></div>
        </div>

        <div id="totalUserTable"></div>
    `;

    container.html(totalUserManagementHTML);
    loadTotalUserTable();
    loadSearchBar();
    renderFilters();
}

// onPopstate(loadContent);