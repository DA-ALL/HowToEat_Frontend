import { renderMealDetail } from '../homeMeal.js';
import { initHeaderNav } from '../headerNav.js';
import { renderMealSearch } from '../homeMealSearch.js';
import { renderMealRegist } from '../homeMealRegist.js';

const userConsumedData = {
    date: "2025-04-04",
    carbo: { consumed: 70, target: 220 },
    protein: { consumed: 42, target: 90 },
    fat: { consumed: 20, target: 50 }
}

export function showMain(meal = null, subpage = null, type = null, userConsumedData = null, newMeal = null) {
    $('#report').hide();
    $('#main').show();

    // 초기 상태: 모든 하위 뷰 숨기고 시작
    $('#home, #homeMeal, #homeMealSearch').hide();

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

            $('#homeMealRegist').html(renderMealRegist(meal, userConsumedData, newMeal));
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