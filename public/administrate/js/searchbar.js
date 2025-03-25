
import { onPopstate,  updateQueryParam, removeQueryParam} from '/administrate/js/router.js';

export function loadSearchBar() {
    let placeholder = $('#searchbar').data('placeholder'); // HTML의 data-placeholder 값 가져오기

    $('#searchbar').html(`
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
}

$(document).on('click', '.button-search', function () {
    let searchValue = $('#searchbar input').val(); // input 값 가져오기
    // console.log(searchValue);
    // TODO: - 검색 백엔드 호출
    
    if(searchValue){
        updateQueryParam('username', searchValue);
    } else {
        removeQueryParam('username');
    }
});
