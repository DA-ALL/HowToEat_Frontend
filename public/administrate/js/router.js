let currentContent = "";

export function getCurrentContent(){
    return currentContent
}

// URL 변경
export function updateURL(page) {
    const currentUrl = new URL(window.location.href);
    const newUrl = new URL(`/admin/${page}`, window.location.origin);

    // 현재 URL과 변경될 URL이 동일하면 pushState 실행 안 함
    if (currentUrl.pathname === newUrl.pathname) {
        return;
    }
    history.pushState({ page }, "", newUrl.toString());

    hideAllContents();
    showCurrentContent();
    updateURLWithActiveElements(currentContent);
}

function updateURLParams(params, useReplaceState = false) {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    let hasChanges = false; // 변경 여부 체크

    // params 객체를 순회하며 URL 파라미터 업데이트
    Object.entries(params).forEach(([key, value]) => {
        if (searchParams.get(key) !== String(value)) {
            searchParams.set(key, value);
            hasChanges = true;
        }
    });

    // 변경이 없으면 실행 안 함
    if (!hasChanges) return;

    // 파라미터 정렬
    const sortOrder = ["search", "trainer", "gym", "orderby", "next-gym", "user-role", "data-source", "recommend", "admin-share", "option", "page"];
    const sortedParams = new URLSearchParams();
    sortOrder.forEach(param => {
        if (searchParams.has(param)) {
            sortedParams.set(param, searchParams.get(param));
        }
    });

    const newUrl = `${url.pathname}?${sortedParams.toString()}`;

    // pushState 또는 replaceState 한 번만 호출
    if (useReplaceState) {
        console.log("replaceState");
        history.replaceState({}, "", newUrl);
    } else {
        console.log("pushState");
        history.pushState({}, "", newUrl);
    }
}


// 파라미터 변경 pushState 사용
export function updateQueryParam(params) {
    updateURLParams(params, false);
}

// 파라미터 변경 replaceState 사용
export function replaceQueryParam(params) {
    updateURLParams(params, true);
}

// 현재 URL에서 특정 파라미터 삭제
export function removeQueryParam(key) {
    const url = new URL(window.location.href);
    url.searchParams.delete(key);
    history.pushState({}, "", url);
}

// URL에서 모든 파라미터 가져오기
export function getQueryParams() {
    return Object.fromEntries(new URLSearchParams(window.location.search));
}

// popstate 발생시 처리
export function onPopstate(callback){
    window.addEventListener('popstate', function(event) {
        callback(event); 
        hideAllContents();
        showCurrentContent();
    });
}


function hideAllContents() {
    $('.content-wrapper').children().each(function (index) {
        $(this).css('display', 'none');
    });
}

function showCurrentContent() {
    const currentPage = window.location.pathname.split("/").slice(2).join("/"); // user-management/pt or user-management

    const contentMap = {
        'dashboard': 'dashboardChart',
        'user-management': 'userManagement',
        'user-management/pt' : 'ptUserManagement',
        'food-management': 'foodManagement',
        'food-management/user-regist': 'userFoodManagement',
        'food-management/recommend-food': 'recommendFoodManagement',
        'food-management/add-food': 'addFood',
        'notice': 'notice',
        'admin-management': 'adminManagement',
        'admin-management/trainer': 'trainerManagement',
        'admin-management/gym': 'gymManagement',    
    };

    currentContent = contentMap[currentPage];

    if (currentContent) {
        $(`#${currentContent}`).css('display', 'flex');
    } else {
        console.warn('Unknown page:', currentPage);
    }
}


export function updateURLWithActiveElements(contentId) {
    // const currentUrl = new URL(window.location.href).toString();
    let params = new URLSearchParams(window.location.search);

    // 파라미터가 없으면 
    if(params.size == 0){        
        $(`#${contentId}`).find('.filter-option-wrapper').each(function(){
            const activeFilterOption = $(this).find('.filter-option.active');
            let queryValue = activeFilterOption.data('query');
            
            // active 되어있는 요소가 있으면 파라미터에 추가
            if(queryValue && !(queryValue == 'all' || queryValue == 'desc')){
                replaceQueryParam({[$(this).data('key')]: queryValue});
            } else { // active 없으면 초기값으로 설정
                let defaultQuery = $(this).find('.filter-option').first().data('query');
                $(this).find(`.filter-option[data-query="${defaultQuery}"]`).addClass('active');
            }
        });
    } else { // url에 파라미터가 있으면 url대로
        $(`#${contentId}`).find('.filter-option-wrapper').each(function(){            
            const key = $(this).data('key');
            const queryValue = params.get(key);
            
            if(queryValue){
                $(this).find('.filter-option').removeClass('active');
                $(this).find(`.filter-option[data-query="${queryValue}"]`).addClass('active');
            } else {
                let defaultQuery = $(this).find('.filter-option').first().data('query');
                $(this).find(`.filter-option[data-query="${defaultQuery}"]`).addClass('active');
            }
        });
    }


    // page
    const activePageButton = $(`#${contentId}`).find('.pagination-button.active');
    if(!params.has('page') && activePageButton.length && activePageButton.data('page') != 1){
        replaceQueryParam({'page': activePageButton.data('page')});
    }

    // searchBar
    const searchBar = $(`#${contentId}`).find('.searchbar input');
    
    if(!params.has('search') && searchBar.val()){
        replaceQueryParam({'search': searchBar.val()});
    } else if(params.has('search')){
        searchBar.val(params.get('search'));
    }

    //searchDropdown
    if(contentId == 'ptUserManagement'){
        const searchDropdown = $(`#${contentId}`).find('#searchDropdown .dropdown-text');
        if(!params.has('trainer') && !params.has('gym') && searchDropdown.data('trainer') && searchDropdown.data('trainer') != '전체' && searchDropdown.data('gym') != '전체'){
            replaceQueryParam({'trainer': searchDropdown.data('trainer'), 'gym': searchDropdown.data('gym')});
        }
    }
}


$(document).ready(function () {
    hideAllContents();
    showCurrentContent();
});


/*
    1. pushstate - url, param 업데이트시
    2. popstate - 뒤로가기, 앞으로가기 
    3. 새로고침시에는 load~page 등을 활용

    각 파일에서 (url 업데이트 하는 코드, popstate시 처리하는 코드)는 여기서 가져다 씀

    새로고침시에 처리하는 코드는 각 파일에서 만듬
    
    /admin/dashboard        dashboardChart
    /admin/user-management      userManagement
    /admin/user-management/pt       ptUserManagement
    /admin/food-management      foodManagement
    /admin/food-management/user-regist      userFoodManagement
    /admin/food-management/recommend-food       recommendFoodManagement
    /admin/food-management/add-food         addFood
    /admin/notice       notice
    /admin/admin-management     adminManagement
    /admin/admin-management/trainer     trainerManagement
    /admin/admin-management/gym     gymManagement
*/
