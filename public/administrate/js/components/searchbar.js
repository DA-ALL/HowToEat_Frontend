
import { onPopstate,  updateQueryParam, removeQueryParam, getCurrentContent, syncSearchbarWithURL} from '/administrate/js/router.js';

export function loadSearchBar() {
    let placeholder = $('.searchbar').data('placeholder'); // HTML의 data-placeholder 값 가져오기

    $('.searchbar').html(`
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
    let searchValue = $(`#${currentContent} .searchbar input`).val(); // input 값 가져오기
    console.log("검색 버튼 click");
    // TODO: - 검색 백엔드 호출
    
    if(searchValue){
        updateQueryParam({'search': searchValue});
    } else {
        removeQueryParam('search');
    }
});

$(document).on('keypress', '.searchbar input', function (event) {
    if (event.which === 13) { // 13 = Enter key
        $('.button-search').click();
    }
});

onPopstate(loadSearchBar);