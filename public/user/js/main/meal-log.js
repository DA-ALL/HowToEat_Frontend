export function getMealLog(date, info) {
    let target = info.targetKcal || 0;

    let breakfastTarget = Math.round(target * 0.3); // 3 / 10
    let lunchTarget = Math.round(target * 0.4);     // 4 / 10
    let dinnerTarget = target - breakfastTarget - lunchTarget; // 나머지

    let breakfastKcal = Math.round(info.breakfastKcal);
    let lunchKcal = Math.round(info.lunchKcal);
    let dinnerKcal = Math.round(info.dinnerKcal);
    let snackKcal = Math.round(info.snackKcal);

    return `
        <div class="meal-log-title">식사기록</div>
        <div class="log-container">
            <div class="log-wrapper" data-date="${date}">
                <div class="meal-time">아침</div>
                <div class="meal-kcal-wrapper">
                    <div class="consumed-kcal">${breakfastKcal}</div>
                    <div class="divide">/</div>
                    <div class="target-kcal">${breakfastTarget}kcal</div>
                    <div class="icon-arrow">
                        <img src="/user/images/icon_arrow_front.png">
                    </div>
                </div>
            </div>
            <div class="log-wrapper" data-date="${date}">
                <div class="meal-time">점심</div>
                <div class="meal-kcal-wrapper">
                    <div class="consumed-kcal">${lunchKcal}</div>
                    <div class="divide">/</div>
                    <div class="target-kcal">${lunchTarget}kcal</div>
                    <div class="icon-arrow">
                        <img src="/user/images/icon_arrow_front.png">
                    </div>
                </div>
            </div>
            <div class="log-wrapper" data-date="${date}">
                <div class="meal-time">저녁</div>
                <div class="meal-kcal-wrapper">
                    <div class="consumed-kcal">${dinnerKcal}</div>
                    <div class="divide">/</div>
                    <div class="target-kcal">${dinnerTarget}kcal</div>
                    <div class="icon-arrow">
                        <img src="/user/images/icon_arrow_front.png">
                    </div>
                </div>
            </div>
            <div class="log-wrapper" data-date="${date}">
                <div class="meal-time">간식</div>
                <div class="meal-kcal-wrapper">
                    <div class="consumed-kcal">${snackKcal}</div>
                    <div class="divide">/</div>
                    <div class="target-kcal">240kcal</div>
                    <div class="icon-arrow">
                        <img src="/user/images/icon_arrow_front.png">
                    </div>
                </div>
            </div>
        
        </div>
    `;
}
