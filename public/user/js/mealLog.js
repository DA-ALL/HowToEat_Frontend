export function getMealLog() {
    return `
        <div class="meal-log-title">식사기록</div>
        <div class="log-container">
            <div class="log-wrapper">
                <div class="meal-time">아침</div>
                <div class="meal-kcal-wrapper">
                    <div class="consumed-kcal">542</div>
                    <div class="divide">/</div>
                    <div class="target-kcal">612kcal</div>
                    <div class="icon-arrow">
                        <img src="/user/images/icon_arrow_front.png">
                    </div>
                </div>
            </div>
            <div class="log-wrapper">
                <div class="meal-time">점심</div>
                <div class="meal-kcal-wrapper">
                    <div class="consumed-kcal">542</div>
                    <div class="divide">/</div>
                    <div class="target-kcal">612kcal</div>
                    <div class="icon-arrow">
                        <img src="/user/images/icon_arrow_front.png">
                    </div>
                </div>
            </div>
            <div class="log-wrapper">
                <div class="meal-time">저녁</div>
                <div class="meal-kcal-wrapper">
                    <div class="consumed-kcal">542</div>
                    <div class="divide">/</div>
                    <div class="target-kcal">612kcal</div>
                    <div class="icon-arrow">
                        <img src="/user/images/icon_arrow_front.png">
                    </div>
                </div>
            </div>
            <div class="log-wrapper">
                <div class="meal-time">간식</div>
                <div class="meal-kcal-wrapper">
                    <div class="consumed-kcal">542</div>
                    <div class="icon-arrow">
                        <img src="/user/images/icon_arrow_front.png">
                    </div>
                </div>
            </div>
        
        </div>
    `;
}
$(document).ready(function () {
// ✅ log-wrapper 클릭 → /main/{meal}
$(document).on('click', '.log-wrapper', function () {
    const mealKor = $(this).find('.meal-time').text(); // '아침' 등
    const mealMap = { '아침': 'morning', '점심': 'lunch', '저녁': 'dinner', '간식': 'snack' };
    const meal = mealMap[mealKor] || 'morning';
    const newPath = `/main/${meal}`;

    history.pushState({ view: 'main', meal }, '', newPath);
    showPage(newPath);
});
});