export function renderMealDetail(mealKey, data, callback) {
    const mealKor = mealToKor(mealKey);
    const pathParts = window.location.pathname.split("/");
    const selectedDate = pathParts[3];
    const isToday = isTodayDate(selectedDate);
    const buttonClass = isToday ? 'active' : 'disabled';
    const mealTime = mealKey.toUpperCase();

    $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/daily-summaries/${selectedDate}/meal-time/${mealTime}/macros`,
        success: function (res) {
            const data = res.data;

            const commonHeader = `
                <div id="headerNav" data-title="${mealKor} 등록하기" data-type="2"></div>
                <div class="home-meal-container padding">
                    <div class="second-title-format">${mealKor}의 탄단지</div>
                    ${createBarContainer(mealKey, data)}
                </div>
                <div class="divider large"></div>
            `;

            const content = mealKey === 'snack' ?
                `
                ${commonHeader}
                <div class="meal-list-container padding">
                    <div class="second-title-format">${mealKor} 리스트</div>
                    <div class="meal-list-wrapper"></div>
                </div>
                ` :
                `
                ${commonHeader}
                <div class="meal-list-container padding">
                    <div class="second-title-format">${mealKor}의 식단</div>
                    <div class="meal-list-wrapper"></div>
                </div>
                `;

            callback(content); // ✅ 콜백으로 결과 전달
        }
    });
}



function createBar(mealKey, type, consumed, target, percent, rawPercent) {
    const labelMap = {
        carbo: "탄수화물",
        protein: "단백질",
        fat: "지방"
    };

    const label = labelMap[type];

    let color = "var(--red500)";
    let fontColor = "var(--red500)";

    if (rawPercent > 105) {
        color = '#814949';
        fontColor = '#814949';
    } else if (rawPercent >= 0) {
        color = 'var(--red500)';
        fontColor = 'var(--red500)';
    }

    return `
        <div class="home-meal-bar-wrapper ${type}">
            <div class="meal-title ${type}">${label}</div>
            <div class="meal-bar-wrapper">
                <div class="bar-wrapper">
                    <div class="bar-back"></div>
                    <div class="bar-front ${type}" style="width: 0%; background: ${color}; animation: fillBar-${mealKey}-${type} 1s forwards;"></div>
                </div>
                <div class="text-wrapper">
                    <span class="consumed ${type}" style="color: ${fontColor}">${consumed}g</span>
                    <span class="divide">/</span>
                    <span class="target ${type}">${target}g</span>
                </div>
            
            </div>
            <style>
                @keyframes fillBar-${mealKey}-${type} {
                    from { width: 0%; }
                    to { width: ${percent}%; }
                }
            </style>
        </div>
    `;
}

function createBarContainer(mealKey, data) {
    const types = ['carbo', 'protein', 'fat'];
    console.log(data);
    return `
        <div class="home-meal-bar-container">
            ${types.map(type => {
                const consumed = data[`consumed${capitalize(type)}`];
                const target = data[`target${capitalize(type)}`];
                const rawPercent = target > 0 ? (consumed / target) * 100 : 0;
                const percent = Math.min(rawPercent, 100);

                return createBar(mealKey, type, consumed, target, percent.toFixed(1), rawPercent);
            }).join('')}
        </div>
    `;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


function isTodayDate(dateStr) {
    if (!dateStr) return false;
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    return dateStr === todayStr;
}

function mealToKor(meal) {
    switch (meal) {
        case 'breakfast': return '아침';
        case 'lunch': return '점심';
        case 'dinner': return '저녁';
        case 'snack': return '간식';
        default: return '';
    }
}

// 테스트용 mealData 로부터 리스트 아이템 생성
export function renderMealListHTML(mealKey, selectedDate, mealTime, callback) {
    const isToday = isTodayDate(selectedDate);
    const buttonClass = isToday ? 'active' : 'disabled';

    $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/consumed-foods`,
        data: {
            date: selectedDate,
            meal_time: mealTime
        },
        success: function (res) {
            const listHtml = res.data.map(renderMealListItem).join('');
            const buttonHtml = `
                <div class="button-container">
                    <div class="next-button home-meal ${buttonClass}">추가</div>
                </div>
            `;

            callback(listHtml, buttonHtml); // 🚀 데이터도 버튼도 콜백으로 넘김
        }
    });
}




function renderMealListItem(data) {
    return `
        <div class="meal-list-item">
            <div class="meal-title">${data.foodName}</div>
            <div class="text-wrapper">
                <span class="weight">${data.weight}${data.unit}</span>
                <span class="divide">/</span>
                <span class="kcal">${data.kcal}kcal</span>
                <div class="image-arrow">
                    <img src="/user/images/icon_arrow_front.png">
                </div>
            </div>
        </div>
    `;
}
