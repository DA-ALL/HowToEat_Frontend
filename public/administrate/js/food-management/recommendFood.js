import { updateURL, registerPopstateHandler } from '/administrate/js/router.js';
import { loadFilter } from '/administrate/js/components/filter.js';
import { loadFoodDetail } from '/administrate/js/food-management/foodDetail.js';
import { renderRecommendFoodTable, renderTableWithOptionalPagination } from '/administrate/js/food-management/recommendFoodTable.js';

$(document).ready(function () {
    loadRecommendFood();
});

function loadRecommendFood() {
    const container = $("#recommendFood");

    let adminFoodHTML = `
        <div class="title">추천 음식</div>

        <div class="filter-group">
            <div id="filter" data-type="7"></div>
        </div>

        <div class="table-title">10 ~ 100kcal</div>
        <div id="recommendFoodTable100"></div>
        <div class="table-title">101 ~ 200kcal</div>
        <div id="recommendFoodTable200"></div>
        <div class="table-title">201 ~ 300kcal</div>
        <div id="recommendFoodTable300"></div>

    `;

    container.html(adminFoodHTML);
    
    loadFilter('recommendFood');
    loadRecommendFoodTable100();
    loadRecommendFoodTable200();
    loadRecommendFoodTable300();
}

function loadRecommendFoodTable100() { 
    const containerId = 'recommendFoodTable100';
    const bodyId = 'recommendFoodTable100Body';
    const contentId = 'recommendFood';

    renderRecommendFoodTable(containerId, bodyId);
    renderTableWithOptionalPagination({
        getData: getRecommendFoodDatas,
        bodyId,
        contentId,
        enablePagination: false
    });
}

function loadRecommendFoodTable200() { 
    const containerId = 'recommendFoodTable200';
    const bodyId = 'recommendFoodTable200Body';
    const contentId = 'recommendFood';

    renderRecommendFoodTable(containerId, bodyId);
    renderTableWithOptionalPagination({
        getData: getRecommendFoodDatas,
        bodyId,
        contentId,
        enablePagination: false
    });
}

function loadRecommendFoodTable300() { 
    const containerId = 'recommendFoodTable300';
    const bodyId = 'recommendFoodTable300Body';
    const contentId = 'recommendFood';

    renderRecommendFoodTable(containerId, bodyId);
    renderTableWithOptionalPagination({
        getData: getRecommendFoodDatas,
        bodyId,
        contentId,
        enablePagination: false
    });
}


function getRecommendFoodDatas() {
    const foodNames = [
        "사과", "바나나", "딸기", "포도", "오렌지", "키위", "수박", "참외", "복숭아", "자두",
        "망고", "파인애플", "레몬", "체리", "블루베리", "라즈베리", "멜론", "감", "배", "귤", "잇메이트 닭가슴살 도시락 닭가슴살 소시지볶음밥 고추맛 & 스팀 닭가슴살 오리지널"
    ];

    return Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        foodName: foodNames[Math.floor(Math.random() * foodNames.length)],
        foodCode: `F${String(i + 1).padStart(3, "0")}`,
        mainFoodName: "과일",
        calorie: Math.floor(Math.random() * 500),
        carbo: Math.floor(Math.random() * 100),
        protein: Math.floor(Math.random() * 50),
        fat: Math.floor(Math.random() * 30),
        foodWeight: Math.floor(Math.random() * 200),
        foodWeightUnit: ["g", "ml"][Math.floor(Math.random() * 2)],
        isRecommended: ["O", "X"][Math.floor(Math.random() * 2)],
        source: ["custom", "ingredient", "cooked", "processed"][Math.floor(Math.random() * 4)],
    }));
}


$(document).on('click', `.recommend-food-table tbody tr`, function () {
    const foodId = $(this).find('.td-id').text();
    const page = `food-management/recommend/${foodId}`;
    updateURL(page);
});


registerPopstateHandler('recommendFood', loadRecommendFood);