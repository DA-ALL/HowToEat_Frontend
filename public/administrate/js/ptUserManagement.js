import { loadSearchBar } from '/administrate/js/components/searchbar.js';
import { loadFilter } from '/administrate/js/components/filter.js';
import { loadSearchDropdown } from '/administrate/js/components/searchDropdown.js';
import { loadPtUserTable } from '/administrate/js/ptUserTable.js';

$(document).ready(function () {
    loadContent();
});

function loadContent() {
    const container = $("#ptUserManagement");

    let ptUserManagementHTML = `
        <div class="title">PT 회원 관리</div>
        <div id="searchTool">
            <div id="searchDropdown"></div>
            <div class="searchbar" data-placeholder="회원명 검색"></div>
        </div>
        
        <div class="filter-group">
            <div id="filter" data-type="1"></div>
            <div id="filter" data-type="3"></div>       
        </div>      

        <div id="ptUserTable"></div>
    `;

    container.html(ptUserManagementHTML);

    loadSearchBar();
    loadFilter();
    loadPtUserTable();
    loadSearchDropdown();
}
