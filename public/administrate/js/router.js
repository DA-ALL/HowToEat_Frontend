let currentContent = "";
const popstateHandlers = {};
const viewLoaders = {};

// 뷰 별로 뷰 초기화 및 데이터 로딩 함수 등록
export function registerViewLoader(contentId, callback) {
    viewLoaders[contentId] = callback;
}

export function getCurrentContent(){
    return currentContent
}

export function registerPopstateHandler(contentId, callback) {
    popstateHandlers[contentId] = callback;
}

window.addEventListener('popstate', function (event) {
    hideAllContents();
    showCurrentContent();
    
    if (popstateHandlers[currentContent]) {
        popstateHandlers[currentContent](event);
        console.log("popstate 발생");
        updateURLWithState();
    }
    
    popstateHandlers['sidebar'](event);
});


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
    const currentContentAndType = showCurrentContent();
    updateURLWithState();
    runViewLoder(currentContentAndType);
}

function updateURLParams(params, useReplaceState = false) {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    let hasChanges = false;

    const removeValues = ['all', 'desc', 'kcal'];

    // params 순회
    Object.entries(params).forEach(([key, value]) => {
        const stringValue = String(value);

        if (removeValues.includes(stringValue)) {
            if (searchParams.has(key)) {
                searchParams.delete(key);
                hasChanges = true;
            }
        } else {
            if (searchParams.get(key) !== stringValue) {
                searchParams.set(key, stringValue);
                hasChanges = true;
            }
        }
    });

    if (!hasChanges) return;

    const sortOrder = ["search", "trainer", "gym", "orderBy", "isNextGym", "userRole", "foodType", "recommendation", "adminShared", "sortBy", "page"];
    const sortedParams = new URLSearchParams();

    sortOrder.forEach(param => {
        if (searchParams.has(param)) {
            sortedParams.set(param, searchParams.get(param));
        }
    });

    const newUrl = `${url.pathname}?${sortedParams.toString()}`;

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

function hideAllContents() {
    $('.content-wrapper').children().each(function (index) {
        $(this).css('display', 'none');
    });

    $('#detailPage').children().each(function (index) {
        $(this).css('display', 'none');
    });
}

function showCurrentContent() {
    const pathSegments = window.location.pathname.split("/").slice(2);
    const fullPath = pathSegments.join("/");

    // 간단한 경로
    const contentMap = {
        'dashboard': 'dashboardChart',
        'user-management': 'userManagement',
        'user-management/pt': 'ptUserManagement',
        'food-management': 'adminFood',
        'food-management/user-regist': 'userFood',
        'food-management/recommend': 'recommendFood',
        'notice': 'notice',
        'admin-management': 'adminManagement',
        'admin-management/trainer': 'trainerManagement',
        'admin-management/gym': 'gymManagement',
    };

    currentContent = contentMap[fullPath];
    let contentType = '';
    if (!currentContent) {

        const patterns = [
            // user-management
            { pattern: /^user-management\/user\/\d+$/, id: 'userInfo' },
            { pattern: /^user-management\/pt\/\d+$/, id: 'trainerInfo' },
            { pattern: /^user-management\/pt\/\d+\/user\/\d+$/, id: 'userInfo' },
    
            // food-management
            { pattern: /^food-management\/\d+$/, id: 'foodDetail', type: 'edit'},
            { pattern: /^food-management\/user-regist\/\d+$/, id: 'foodDetail' , type: 'share'},
            { pattern: /^food-management\/recommend\/\d+$/, id: 'foodDetail' , type: 'edit'},
            { pattern: /^food-management\/add$/, id: 'foodDetail', type: 'add'},
    
            // notice
            { pattern: /^notice\/\d+$/, id: 'noticeDetail' , type: 'edit'},
            { pattern: /^notice\/add$/, id: 'noticeDetail', type: 'add' },
    
            // admin-management
            { pattern: /^admin-management\/\d+$/, id: 'adminAccountDetail', type: 'edit' },
            { pattern: /^admin-management\/add$/, id: 'adminAccountDetail', type: 'add' },
    
            { pattern: /^admin-management\/trainer\/\d+$/, id: 'trainerDetail', type: 'edit' },
            { pattern: /^admin-management\/trainer\/add$/, id: 'trainerDetail', type: 'add' },
    
            { pattern: /^admin-management\/gym\/\d+$/, id: 'gymDetail', type: 'edit' },
            { pattern: /^admin-management\/gym\/add$/, id: 'gymDetail', type: 'add' },
        ];
    
        for (const { pattern, id, type } of patterns) {
            if (pattern.test(fullPath)) {
                currentContent = id;
                contentType = type;
                break;
            }
        }
    }

    if (!currentContent) {
        console.log("currentContent is null");
        return;
    }

    if(currentContent == 'userInfo' || currentContent == 'trainerInfo'){
        $('.content-section').css('display', 'none');
        $('#detailPage').css('display', 'block');
    } else {
        $('.content-section').css('display', 'block');
        $('#detailPage').css('display', 'none');
    }
    
    $(`#${currentContent}`).css('display', 'flex');

    return {currentContent, contentType};
    
}

function runViewLoder({currentContent, contentType}){
    // 뷰 초기화 및 데이터 로딩
    if(viewLoaders[currentContent]) {
        if(contentType) {
            viewLoaders[currentContent]({type: contentType});
        } 
        else {
            viewLoaders[currentContent]();
        }
    }
}


/*
================================================
    화면이동시 활성화된 요소로 url에 반영
*/


function updateURLWithState() {
    syncFiltersWithURL();
    syncPageWithURL();
    syncSearchbarWithURL();
    syncSearchDropdownWithURL();
}

export function syncFiltersWithURL() {
    const params = new URLSearchParams(window.location.search);

    $(`#${currentContent}`).find('.filter-option-wrapper').each(function () {
        const $wrapper = $(this);
        const key = $wrapper.data('key');
        const urlValue = params.get(key);

        const $filterOptions = $wrapper.find('.filter-option');
        const defaultQuery = $filterOptions.first().data('query');

        if (urlValue) {
            // URL에 해당 key 파라미터가 있으면 -> UI에 반영
            $filterOptions.removeClass('active');
            $filterOptions.filter(`[data-query="${urlValue}"]`).addClass('active');
        } else {
            // 파라미터가 없다면 -> UI 상태를 보고 URL을 업데이트
            const $activeOption = $filterOptions.filter('.active');
            const uiValue = $activeOption.data('query');

            if (!$activeOption.length) {
                // 아무것도 선택 안 되어 있으면 default 선택
                $filterOptions.removeClass('active');
                $filterOptions.filter(`[data-query="${defaultQuery}"]`).addClass('active');
            }

            // 기본값이 의미 없는 경우는 URL에 반영 안 함
            if (uiValue != null && !['all', 'desc', 'kcal'].includes(uiValue)) {
                replaceQueryParam({ [key]: uiValue });
            }
        }
    });
}


export function syncPageWithURL(){
    let params = new URLSearchParams(window.location.search);

    // page
    const activePageButton = $(`#${currentContent}`).find('.pagination-button.active');
    if(!params.has('page') && activePageButton.length && activePageButton.data('page') != 1){
        replaceQueryParam({'page': activePageButton.data('page')});
    }
}

export function syncSearchbarWithURL(){
    let params = new URLSearchParams(window.location.search);

    // searchBar
    const searchBar = $(`#${currentContent}`).find('.searchbar input');
    
    if(!params.has('search') && searchBar.val()){
        replaceQueryParam({'search': searchBar.val()});
    } else if(params.has('search')){
        searchBar.val(params.get('search'));
    }
}

export function syncSearchDropdownWithURL(){
    let params = new URLSearchParams(window.location.search);

    //searchDropdown
    if(currentContent == 'ptUserManagement'){
        const searchDropdown = $(`#${currentContent}`).find('#searchDropdown .dropdown-text');
        if(!params.has('trainer') && !params.has('gym') && searchDropdown.data('trainer') && searchDropdown.data('trainer') != '전체' && searchDropdown.data('gym') != '전체'){
            replaceQueryParam({'trainer': searchDropdown.data('trainer'), 'gym': searchDropdown.data('gym')});
        }
    }
}

$(document).ready(function () {
    hideAllContents();
    const currentContentAndType = showCurrentContent();
    runViewLoder(currentContentAndType);
});