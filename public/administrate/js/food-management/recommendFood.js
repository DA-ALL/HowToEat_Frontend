import { updateURL, registerPopstateHandler, registerViewLoader } from '/administrate/js/router.js';
import { loadFilter } from '/administrate/js/components/filter.js';
import { loadFoodDetail } from '/administrate/js/food-management/foodDetail.js';
import { renderRecommendFoodTable, renderTableWithOptionalPagination } from '/administrate/js/food-management/recommendFoodTable.js';
import { getRecommendFoodList } from '../api.js';

let recommendFoods = null;

async function loadRecommendFood() {
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
    

    loadFilter('recommendFood', loadTables);
    loadTables();
}

async function loadTables(){
    recommendFoods = await getRecommendFoodDatas();
    loadRecommendFoodTable100();
    loadRecommendFoodTable200();
    loadRecommendFoodTable300();
}

function loadRecommendFoodTable100() { 
    const containerId = 'recommendFoodTable100';
    const bodyId = 'recommendFoodTable100Body';
    const contentId = 'recommendFood';

    renderRecommendFoodTable(containerId, bodyId);

    const filtered = filterFoodsByCalorieRange(recommendFoods, 0, 100);

    renderTableWithOptionalPagination({
        data: filtered,
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
    
    const filtered = filterFoodsByCalorieRange(recommendFoods, 101, 200);

    renderTableWithOptionalPagination({
        data: filtered,
        bodyId,
        contentId,
        enablePagination: false
    });
}

function loadRecommendFoodTable300() { 
    const containerId = 'recommendFoodTable300';
    const bodyId = 'recommendFoodTable300Body';
    const contentId = 'recommendFood';

    const filtered = filterFoodsByCalorieRange(recommendFoods, 201, 600);

    renderRecommendFoodTable(containerId, bodyId);
    renderTableWithOptionalPagination({
        data: filtered,
        bodyId,
        contentId,
        enablePagination: false
    });
}

function filterFoodsByCalorieRange(foods, min, max) {
    return foods.filter(food => {
        const kcal = food.kcal ?? 0;
        return kcal >= min && kcal <= max;
    });
}

async function getRecommendFoodDatas() {
    const params = getParamsFromURL();
    try {
        const response = await getRecommendFoodList(params);
        console.log("추천음식 조회: ", response);
        
        return response.data;
    } catch (err) {
        console.error(err);
    }
}

function getParamsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        sortBy: urlParams.get('sortBy') || 'kcal'
    };
}


$(document).on('click', `.recommend-food-table tbody tr`, function () {
    const foodId = $(this).find('.td-id').text();
    const page = `food-management/recommend/${foodId}`;
    updateURL(page);
});


registerPopstateHandler('recommendFood', loadRecommendFood);
registerViewLoader('recommendFood', loadRecommendFood);