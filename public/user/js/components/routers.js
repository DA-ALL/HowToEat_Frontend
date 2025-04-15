import { renderMealDetail } from '../main/homeMeal.js';
import { initHeaderNav } from './header-nav.js';
import { renderMealSearch } from '../main/homeMealSearch.js';
import { renderIncreaseCPFbar, renderMealRegist, renderMealAdjust, runAllCountAnimations, updateNextButtonData } from '../main/homeMealRegist.js';

const userConsumedDataTest = {
    date: "2025-04-15",
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
    const saved = localStorage.getItem(`mealData_${meal}`);
    const savedFood = saved ? JSON.parse(saved) : null;
    const merged = mergeConsumedData(userConsumedDataTest, savedFood);
    console.log(merged);


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
            // 저장된 데이터 불러오기

            $('#homeMeal').html(renderMealDetail(meal, merged));
            initHeaderNav($('#homeMeal'));
        }
        $('#homeMeal').show();
    }
    
    

    if (meal && subpage === 'regist' && !type) {
        // /main/morning/search
        if ($('#homeMealSearch').children().length === 0) {

            $('#homeMealSearch').html(renderMealSearch(meal, merged, registFoodDataTest));
            initHeaderNav($('#homeMealSearch'));
        }

        $('#homeMealSearch').show();
    }

    if (meal && subpage === 'regist' && type) {
        if ($('#homeMealRegist').children().length === 0) {
            $('#homeMealRegist').html(renderIncreaseCPFbar(meal, userConsumedDataTest, registFoodDataTest));
            $('#homeMealRegist').append(renderMealRegist(meal, userConsumedDataTest, registFoodDataTest));
            $('#homeMealRegist').append(renderMealAdjust(meal, userConsumedDataTest, registFoodDataTest));
            initHeaderNav($('#homeMealRegist'));
            runAllCountAnimations();
            $(".bar-front.bar-increase").hide();
            $(".bar-front.bar-increase").show();

            $('html, body').scrollTop(0);
            updateNextButtonData();
        }
    
        $('#homeMealRegist').show();
    }
    
}


export function showReport() {
    $('#main').hide();
    $('#report').show();
}

export function resetHomeMealView() {
    $('#homeMeal').empty();
}

export function resetSearchView() {
    $('#homeMealSearch').empty();
}

export function resetRegistView() {
    $('#homeMealRegist').empty();
}

function mergeConsumedData(user, food) {
    if (!food) return user;

    console.log(food);
    return {
        date: user.date,
        carbo: {
            consumed: user.carbo.consumed + food.carbo,
            target: user.carbo.target
        },
        protein: {
            consumed: user.protein.consumed + food.protein,
            target: user.protein.target
        },
        fat: {
            consumed: user.fat.consumed + food.fat,
            target: user.fat.target
        }
    };
}
