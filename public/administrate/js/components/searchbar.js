
import { onPopstate,  updateQueryParam, removeQueryParam, getCurrentContent, syncSearchbarWithURL} from '/administrate/js/router.js';

let searchHandler = null;

export function loadSearchBar(onSearch = null) {
    let placeholder = $('.searchbar').data('placeholder'); // HTML의 data-placeholder 값 가져오기
    searchHandler = onSearch; 

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
    let searchValue = $(this).closest('.searchbar').find('input').val();

    console.log("검색 버튼 click", searchValue);
    // TODO: - 검색 백엔드 호출
    
    if(searchValue){
        if(currentContent !== 'trainerInfo') {
            updateQueryParam({'search': searchValue});
        }
    } else {
        removeQueryParam('search');
    }

    if (typeof searchHandler === 'function') {
        searchHandler();
    }
});


$(document).on('keyup', '.searchbar input', function (event) {
    if (event.which === 13) { // 13 = Enter key
        $(this).closest('.searchbar').find('.button-search').click();
    }
});

onPopstate(loadSearchBar);