const calorieData = {
    "2025-03-01": { consumed: 1800, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 225, consumedProtein: 135, consumedFat: 40 },
    "2025-03-02": { consumed: 2500, target: 2400, targetCarbo: 300, targetProtein: 180, targetFat: 53, consumedCarbo: 313, consumedProtein: 188, consumedFat: 56 },
    "2025-03-03": { consumed: 2200, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 275, consumedProtein: 165, consumedFat: 49 },
    "2025-03-04": { consumed: 1200, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 150, consumedProtein: 90, consumedFat: 27 },
    "2025-03-05": { consumed: 2600, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 325, consumedProtein: 195, consumedFat: 58 },
    "2025-03-06": { consumed: 1700, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 213, consumedProtein: 128, consumedFat: 38 },
    "2025-03-07": { consumed: 1952, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 244, consumedProtein: 146, consumedFat: 43 },
    "2025-03-08": { consumed: 1832, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 229, consumedProtein: 137, consumedFat: 41 },
    "2025-03-09": { consumed: 2530, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 316, consumedProtein: 190, consumedFat: 56 },
    "2025-03-10": { consumed: 2662, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 333, consumedProtein: 200, consumedFat: 59 },
    "2025-03-11": { consumed: 2673, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 334, consumedProtein: 200, consumedFat: 59 },
    "2025-03-12": { consumed: 2262, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 283, consumedProtein: 170, consumedFat: 50 },
    "2025-03-13": { consumed: 2552, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 319, consumedProtein: 191, consumedFat: 57 },
    "2025-03-14": { consumed: 2573, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 322, consumedProtein: 193, consumedFat: 57 },
    "2025-03-15": { consumed: 2445, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 306, consumedProtein: 183, consumedFat: 54 },
    "2025-03-16": { consumed: 2521, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 315, consumedProtein: 189, consumedFat: 56 },
    "2025-03-17": { consumed: 2200, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 275, consumedProtein: 165, consumedFat: 49 },
    "2025-03-18": { consumed: 2200, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 275, consumedProtein: 165, consumedFat: 49 },
    "2025-03-19": { consumed: 2252, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 282, consumedProtein: 169, consumedFat: 50 },
    "2025-03-20": { consumed: 2415, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 302, consumedProtein: 181, consumedFat: 54 },
    "2025-03-21": { consumed: 2681, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 335, consumedProtein: 201, consumedFat: 60 },
    "2025-03-22": { consumed: 2624, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 328, consumedProtein: 197, consumedFat: 58 },
    "2025-03-23": { consumed: 2551, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 319, consumedProtein: 191, consumedFat: 57 },
    "2025-03-24": { consumed: 1593, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 199, consumedProtein: 119, consumedFat: 35 },
    "2025-03-25": { consumed: 2545, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 318, consumedProtein: 191, consumedFat: 57 },
    "2025-03-26": { consumed: 2400, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 300, consumedProtein: 180, consumedFat: 53 },
    "2025-03-27": { consumed: 1656, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 207, consumedProtein: 124, consumedFat: 37 },
    "2025-03-28": { consumed: 2662, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 333, consumedProtein: 200, consumedFat: 59 },
    "2025-03-29": { consumed: 2556, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 320, consumedProtein: 192, consumedFat: 57 },
    "2025-03-30": { consumed: 2462, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 308, consumedProtein: 185, consumedFat: 55 },
    "2025-03-31": { consumed: 1646, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 206, consumedProtein: 123, consumedFat: 37 },
    "2025-04-01": { consumed: 1646, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 206, consumedProtein: 123, consumedFat: 37 },
    "2025-04-02": { consumed: 2415, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 302, consumedProtein: 181, consumedFat: 54 },
    "2025-04-03": { consumed: 2415, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 302, consumedProtein: 181, consumedFat: 54 },
    "2025-04-04": { consumed: 1593, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 199, consumedProtein: 119, consumedFat: 35 },
    "2025-04-05": { consumed: 1646, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 206, consumedProtein: 123, consumedFat: 37 },
    "2025-04-06": { consumed: 2415, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 302, consumedProtein: 181, consumedFat: 54 },
    "2025-04-07": { consumed: 2415, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 302, consumedProtein: 181, consumedFat: 54 },
    "2025-04-09": { consumed: 1646, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 206, consumedProtein: 123, consumedFat: 37 },
    "2025-04-10": { consumed: 1646, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 206, consumedProtein: 123, consumedFat: 37 },
    "2025-04-11": { consumed: 1646, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 206, consumedProtein: 123, consumedFat: 37 },
    "2025-04-12": { consumed: 1646, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 206, consumedProtein: 123, consumedFat: 37 },
    "2025-04-13": { consumed: 2415, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 302, consumedProtein: 181, consumedFat: 54 },
    "2025-04-14": { consumed: 2415, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 302, consumedProtein: 181, consumedFat: 54 },
    "2025-04-15": { consumed: 1646, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 206, consumedProtein: 123, consumedFat: 37 },
    "2025-04-16": { consumed: 1646, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 206, consumedProtein: 123, consumedFat: 37 }
};


export function renderReportPage() {
    return `
        <div class="user-name">하잇님</div>
        <div class="toggle-report-wrapper">
            <div class="toggle-meal-report toggle-report active">식사기록</div>
            <div class="toggle-weight-report toggle-report">몸무게</div>
        </div>

        <div id="mealReport">
            <div class="date">2025.04.30</div>
            <div class="amount-wrapper">
                <div class="amount">1,652</div>
                <div class="unit">kcal</div>
            </div>
            <div class="feedback-comment">조금 더 드셔야 해요</div>
            <div class="recommend-wrapper">
                <div class="recommend-food">추천음식 보러가기</div>
                <div class="icon">
                    <img src="/user/images/icon_arrow_red.png">
                </div>
            </div>
        </div>


        <div id="weightReport" style="display:none">
            <div class="date">2025.04.30</div>
            <div class="amount-wrapper">
                <div class="amount">74</div>
                <div class="unit">kg</div>
            </div>
            <div class="feedback-comment">조금 더 드셔야 해요</div>
            <div class="recommend-wrapper">
                <div class="recommend-food">뭄무게 기록하기</div>
                <div class="icon">
                    <img src="/user/images/icon_arrow_red.png">
                </div>
            </div>
        </div>
    `;
}

//식사기록 / 몸무게 토글 클릭시 그래프 뷰 변경
$(document).on('click', '.toggle-report', function () {
    $('.toggle-report').removeClass('active');
    
    $(this).addClass('active');

    if ($(this).hasClass('toggle-meal-report')) {
        $('#mealReport').show();
        $('#weightReport').hide();
    } else if ($(this).hasClass('toggle-weight-report')) {
        $('#weightReport').show();
        $('#mealReport').hide();
    }
});