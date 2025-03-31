import { loadSearchBar } from '/administrate/js/searchbar.js';
import { loadFilter } from '/administrate/js/filter.js';
import { loadSearchDropdown } from '/administrate/js/searchDropdown.js';

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
    `;

    container.html(ptUserManagementHTML);

    loadSearchBar();
    loadFilter();
    loadSearchDropdown();
}
