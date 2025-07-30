import { showToast } from '../components/toast.js';
import { showPopup } from '../components/popup.js';
import { showPage } from '../components/nav-bottom.js';

export function renderConsumedFoodInfo(consumedFoodId, callback) {
    const consumedFoodDataRequest = $.ajax({
        url: `${window.DOMAIN_URL}/consumed-foods/${consumedFoodId}`,
        method: 'GET'
    });

    $.when(consumedFoodDataRequest).done(function (consumedFoodRes) {
        const consumedFoodData = consumedFoodRes.data;
        const consumedFoodHTML = renderConsumedFoodDetail(consumedFoodData);
        console.log(consumedFoodData)
        callback(consumedFoodHTML);
    });

}


function renderConsumedFoodDetail(consumedFoodData) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const urlParts = window.location.pathname.split('/');
    const selectedDate = urlParts[3]; // 3번째가 YYYY-MM-DD

    // 오늘이면 active, 아니면 disabled
    const deleteBtnClass = (selectedDate === todayStr) ? 'active' : 'disabled';

    const commonHeader = `
        <div id="headerNav" data-title="${consumedFoodData.foodName}" data-type="2"></div>

        <div class="consumed-food-detail-container padding">
            <div class="text-wrapper">
                <div class="title">${consumedFoodData.foodName}</div>
                <div class="sub-title-weight truncate">${Math.round(consumedFoodData.weight)}g</div>
            </div>
            <div class="image-container">
                <img class="new-image" src="${consumedFoodData.foodImageUrl}" style="${consumedFoodData.foodImageUrl ? 'display: inline;' : ''}">
                <img class="preview-image" src="/user/images/icon_camera.png" style="${consumedFoodData.foodImageUrl ? 'display: none;' : ''}">
                <input type="file" accept="image/*" class="image-input" style="display: none;">
            </div>
            <div class="food-info-container">
                <div class="consumed-food-info-wrapper">
                    <span class="title">칼로리</span>
                    <span class="amount kcal">${(consumedFoodData.kcal).toFixed(1)}kcal</span>
                </div>

                <div class="divider column"></div>

                <div class="consumed-food-info-wrapper">
                    <span class="title">탄수화물</span>
                    <span class="amount carbo">${(consumedFoodData.carbo).toFixed(1)}g</span>
                </div>

                <div class="divider column"></div>

                <div class="consumed-food-info-wrapper">
                    <span class="title">단백질</span>
                    <span class="amount protein">${(consumedFoodData.protein).toFixed(1)}g</span>
                </div>

                <div class="divider column"></div>

                <div class="consumed-food-info-wrapper">
                    <span class="title">지방</span>
                    <span class="amount fat">${(consumedFoodData.fat).toFixed(1)}g</span>
                </div>
            </div>
        </div>
        <div class="button-container">
            ${
                consumedFoodData.favoriteFoodId == null 
                ? `<div id="createFavoriteFoodButton" class="button-format active">즐겨찾기 추가</div>
                   <div id="deleteFavoriteFoodButton" data-favorite-food-id="${consumedFoodData.favoriteFoodId}" class="button-format active hidden">즐겨찾기 삭제</div>`
                : `<div id="createFavoriteFoodButton" class="button-format active hidden">즐겨찾기 추가</div>
                   <div id="deleteFavoriteFoodButton" data-favorite-food-id="${consumedFoodData.favoriteFoodId}" class="button-format active">즐겨찾기 삭제</div>`
            }
            <div id="deleteConsumedFoodButton" class="button-format ${deleteBtnClass}">삭제</div>
        </div>
    `;
    return `${commonHeader}`;
}


// favorite 버튼 클릭 시
$(document).on('click', '#createFavoriteFoodButton', function () {
    const pathParts = window.location.pathname.split("/");
    const consumedFoodId = pathParts[5];

    const requestData = {
        consumedFoodId: consumedFoodId
    };

    $.ajax({
        type: 'POST',
        url: `${window.DOMAIN_URL}/favorite-foods`,
        contentType: "application/json",
        data: JSON.stringify(requestData),
        success: function (res) {
            const favoriteFoodId = res.data.favoriteFoodId;
            // console.log(res);
            showToast("즐겨찾기에 추가되었습니다.", "#consumedFoodDetail")
            $("#createFavoriteFoodButton").addClass("hidden");
            $("#deleteFavoriteFoodButton").removeClass("hidden");
            $("#deleteFavoriteFoodButton").data("favorite-food-id", favoriteFoodId);
        }
    }); 
});


$(document).on('click', '#deleteFavoriteFoodButton', function () {
    const favoriteFoodId = $(this).data("favorite-food-id");

    $.ajax({
        type: 'DELETE',
        url: `${window.DOMAIN_URL}/favorite-foods/${favoriteFoodId}`,
        contentType: "application/json",
        success: function (res) {
            showToast("즐겨찾기에서 삭제되었습니다.", "#consumedFoodDetail")
            $("#deleteFavoriteFoodButton").addClass("hidden");
            $("#createFavoriteFoodButton").removeClass("hidden");
        }
    });
});

$(document).on('click', '#deleteConsumedFoodButton', function () {
    const pathParts = window.location.pathname.split("/");
    const mealTime = pathParts[2];
    const selectedDate = pathParts[3];
    const consumedFoodId = pathParts[5];
    showPopup("#main", 2, "삭제하시겠어요?", "").then((confirmed) => {
        if (confirmed) {
            $.ajax({
                type: 'DELETE',
                url: `${window.DOMAIN_URL}/consumed-foods/${consumedFoodId}`,
                contentType: "application/json",
                success: function () {
                    const newPath = `/main/${mealTime}/${selectedDate}`;
                    history.pushState({ view: 'main', mealTime, date: selectedDate }, '', newPath);
                    showPage(`/main/${mealTime}/${selectedDate}`);
                }
            });
        }
    });
});