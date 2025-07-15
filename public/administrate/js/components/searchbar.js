
import { updateQueryParam, removeQueryParam, getCurrentContent, syncSearchbarWithURL} from '/administrate/js/router.js';

export function loadSearchBar(contentId, onSearch = null) {
    let placeholder = $(`#${contentId} .searchbar`).data('placeholder'); // HTML의 data-placeholder 값 가져오기

    // onSearch 함수를 해당 DOM에 data로 저장
    const $searchbar = $(`#${contentId} .searchbar`);
    $searchbar.data('onSearch', onSearch);

    $(`#${contentId} .searchbar`).html(`
        <div class="searchbar-wrapper">
            <div class="image-search">
                <img src="/administrate/images/icon_search.png">
            </div>
            <div class="input-search">
                <input placeholder="${placeholder}">
            </div>
        </div>
        <div class="button-search">검색</div>
    `);

    syncSearchbarWithURL();
}

$(document).on('click', '.button-search', function () {
    let currentContent = getCurrentContent();
    let $searchbar = $(this).closest('.searchbar');
    let searchValue = $searchbar.find('input').val();

    // TODO: - 검색 백엔드 호출
    if(searchValue){
        if(currentContent !== 'trainerInfo') {
            updateQueryParam({'search': searchValue});
        }
    } else {
        removeQueryParam('search');
    }
    
    const handler = $searchbar.data('onSearch');
    if (typeof handler === 'function') {
        if($searchbar.hasClass('popup')) {
            handler(searchValue);
        } else {
            handler();
        }
    }
});


let isSearching = false;

$(document).on('keydown', '.searchbar input', function (event) {
    if (event.which === 13 && !isSearching) {
        isSearching = true;
        event.preventDefault();
        $(this).closest('.searchbar').find('.button-search').click();
    }
});

$(document).on('keyup', '.searchbar input', function (event) {
    if (event.which === 13) {
        isSearching = false;
    }
});