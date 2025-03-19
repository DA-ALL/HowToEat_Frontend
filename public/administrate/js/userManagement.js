
import { loadTotalUserTable } from '/administrate/js/totalUserTable.js';
import { loadSearchBar } from '/administrate/js/searchbar.js';
import { renderFilters } from '/administrate/js/filter.js';

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

let ptUserManagementHTML = `
<div class="title">PT 회원 관리</div>
<div id="searchbar" data-placeholder="회원명 검색"></div>

<div class="filter-group">
    <div id="filter" data-type="1"></div>
    <div id="filter" data-type="3"></div>
</div>
`;

$(document).ready(function () {
    loadContent();
});

const container = $("#userManagement");

function loadContent() {
    const path = window.location.pathname;

    if (path === "/admin/user-management") {
        container.html(totalUserManagementHTML);

        loadTotalUserTable();

    } else if (path === "/admin/user-management/pt") {
        container.html(ptUserManagementHTML);
    }

    loadSearchBar();
    renderFilters();
}


//  URL 변경 감지 (pushState, replaceState 감지)
(function () {
    let pushState = history.pushState;
    let replaceState = history.replaceState;

    function handleUrlChange() {
        loadContent();
        // renderFilters();
    }

    history.pushState = function () {
        pushState.apply(history, arguments);
        handleUrlChange();
    };

    history.replaceState = function () {
        replaceState.apply(history, arguments);
        handleUrlChange();
    };

    // 🚀 popstate 이벤트 강제 실행 코드 제거
    window.addEventListener("popstate", () => {
        handleUrlChange();
    });
})();
