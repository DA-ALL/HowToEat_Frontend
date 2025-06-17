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
    showCurrentContent();
    updateURLWithState();
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
    const sortOrder = ["search", "trainer", "gym", "orderBy", "isNextGym", "userRole", "dataSource", "recommend", "adminShare", "option", "page"];
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
        'food-management/add': 'foodDetail',
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
            { pattern: /^food-management\/\d+$/, id: 'foodDetail' },
            { pattern: /^food-management\/user-regist\/\d+$/, id: 'foodDetail' },
            { pattern: /^food-management\/recommend\/\d+$/, id: 'foodDetail' },
    
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

function getDetailTypeFromUrl(){
    const urlPath = window.location.pathname;

    if (/\/admin\/admin-management\/add$/.test(urlPath)) {
        return "add"; // 관리자 계정 추가
    } else if (/\/admin\/admin-management\/\d+$/.test(urlPath)) {
        return "edit"; // 관리자 계정 수정 (숫자 ID)
    } else {
        return null; // 그 외는 처리 안 함
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

export function syncFiltersWithURL(){
    let params = new URLSearchParams(window.location.search);

    // 파라미터가 없으면 
    if(params.size == 0){        
        $(`#${currentContent}`).find('.filter-option-wrapper').each(function(){
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
        $(`#${currentContent}`).find('.filter-option-wrapper').each(function(){            
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
    showCurrentContent();
});
