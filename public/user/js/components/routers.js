import { renderMealDetail } from '../homeMeal.js';
import { initHeaderNav } from '../headerNav.js';
import { renderMealSearch } from '../homeMealSearch.js';
import { renderMealRegist } from '../homeMealRegist.js';

export function showMain(meal = null, subpage = null, type = null, userConsumedData = null, registFoodData = null) {
    $('#report').hide();
    $('#main').show();

    // 초기 상태: 모든 하위 뷰 숨기고 시작
    $('#home, #homeMeal, #homeMealSearch, #homeMealRegist').hide();

    if (!meal) {
        $('#home').show(); // /main
        return;
    }

    if (meal && !subpage && !type) {
        if ($('#homeMeal').children().length === 0) {
            // 한 번만 렌더링
            $('#homeMeal').html(renderMealDetail(meal, userConsumedData));
            initHeaderNav($('#homeMeal'));
        }
        $('#homeMeal').show();
    }
    if (meal && subpage === 'regist' && !type) {
        // /main/morning/search
        if ($('#homeMealSearch').children().length === 0) {

            $('#homeMealSearch').html(renderMealSearch(meal));
            initHeaderNav($('#homeMealSearch'));
        }

        $('#homeMealSearch').show();
    }

    if (meal && subpage === 'regist' && type) {
        // /main/morning/search
        if ($('#homeMealRegist').children().length === 0) {
            console.log("=========정보출력=========")
            console.log("userConsumedData = ", userConsumedData);
            console.log("registFoodData = ", registFoodData);
            $('#homeMealRegist').html(renderMealRegist(meal, userConsumedData, registFoodData));
            initHeaderNav($('#homeMealRegist'));
        }

        $('#homeMealRegist').show();
    }
}


export function showReport() {
    $('#main').hide();
    $('#report').show();
}

export function resetHomeMealView() {
    $('#homeMeal').html('');
}

export function resetSearchView() {
    $('#homeMealSearch').html('');
}