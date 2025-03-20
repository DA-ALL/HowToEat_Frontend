// URL 변경 및 파라미터 추가
export function changePage(page, params = {}) {
    let newUrl = `/admin/${page}`;
    const queryString = new URLSearchParams(params).toString();
    if (queryString) newUrl += `?${queryString}`;

    history.pushState({ page, params }, "", newUrl);

    hideAllContents();
    showCurrentContent();
}

// 현재 URL에서 특정 파라미터 추가/수정
export function updateQueryParam(key, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    history.pushState({}, "", url);
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
        callback();
        hideAllContents();
        showCurrentContent();
    });
}



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

function hideAllContents() {
    $('.content-wrapper').children().each(function (index) {
        $(this).css('display', 'none');
        // console.log($(this))
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

    const currentContent = contentMap[currentPage];

    if (currentContent) {
        $(`#${currentContent}`).css('display', 'flex');
    } else {
        console.warn('Unknown page:', currentPage);
    }
}

$(document).ready(function () {
    hideAllContents();
    showCurrentContent();
});

