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
    const commonHeader = `
        <div id="headerNav" data-title="${consumedFoodData.foodName}" data-type="2"></div>

        <div class="consumed-food-detail-container padding">
            <div class="text-wrapper">
                <div class="title">${consumedFoodData.foodName}</div>
                <div class="sub-title truncate">${Math.round(consumedFoodData.weight)}g</div>
            </div>
            <div class="image-container">
                <img class="new-image" src="${consumedFoodData.foodImageUrl}">
                <img class="preview-image" src="/user/images/icon_camera.png">
                <input type="file" accept="image/*" class="image-input" style="display: none;">
            </div>
            <div class="food-info-container">
                <div class="food-info-wrapper">
                    <span class="title">칼로리</span>
                    <span class="amount kcal">${(consumedFoodData.kcal).toFixed(1)}kcal</span>
                </div>

                <div class="divider column"></div>

                <div class="food-info-wrapper">
                    <span class="title">탄수화물</span>
                    <span class="amount carbo">${(consumedFoodData.carbo).toFixed(1)}g</span>
                </div>

                <div class="divider column"></div>

                <div class="food-info-wrapper">
                    <span class="title">단백질</span>
                    <span class="amount protein">${(consumedFoodData.protein).toFixed(1)}g</span>
                </div>

                <div class="divider column"></div>

                <div class="food-info-wrapper">
                    <span class="title">지방</span>
                    <span class="amount fat">${(consumedFoodData.fat).toFixed(1)}g</span>
                </div>
            </div>
        </div>
        <div class="button-container">
            ${consumedFoodData.favoriteFoodId == null
                ? '<div id="createFavoriteFoodButton" class="button-format active">즐겨찾기 추가</div>'
                : '<div id="deleteFavoriteFoodButton" class="button-format active">즐겨찾기 삭제</div>'
            }
            <div id="deleteConsumedFoodButton" class="button-format active">삭제</div>
        </div>
        
    `;
    return `
        ${commonHeader}
    `;
}