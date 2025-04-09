import { renderMealDetail } from '../homeMeal.js';
import { initHeaderNav } from '../headerNav.js';
import { renderMealSearch } from '../homeMealSearch.js';
import { renderIncreaseCPFbar, renderMealRegist, renderMealAdjust, runAllCountAnimations } from '../homeMealRegist.js';

const userConsumedDataTest = {
    date: "2025-04-09",
    carbo: { consumed: 70, target: 220 },
    protein: { consumed: 42, target: 90 },
    fat: { consumed: 20, target: 50 }
} 

const registFoodDataTest = {
    id: 42,
    type: "ingredient_food",
    name: "소고기 채끝살 (생것)",
    detail: "수입산(미국산)",
    weight: 100,
    kcal: 217,
    carbo: 442,
    protein: 26,
    fat: 12
}

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
            console.log("userConsumedData = ", userConsumedDataTest);
            console.log("registFoodData = ", registFoodDataTest);
            $('#homeMealRegist').html(renderIncreaseCPFbar(meal, userConsumedDataTest, registFoodDataTest));
            $('#homeMealRegist').append(renderMealRegist(meal, userConsumedDataTest, registFoodDataTest));
            $('#homeMealRegist').append(renderMealAdjust(meal, userConsumedDataTest, registFoodDataTest));
            initHeaderNav($('#homeMealRegist'));
            runAllCountAnimations();
            $('html, body').scrollTop(0); 
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