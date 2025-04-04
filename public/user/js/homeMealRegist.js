export function renderMealRegist(mealKey, data) {
    const mealKor = mealToKor(mealKey);
    const commonHeader = `
        <div id="headerNav" data-title="${mealKor} 등록하기" data-type="2"></div>
        <div class="home-meal-container padding">
            <div class="title-format">${mealKor}의 탄단지</div>
            <div class="cpf-kcal-left-message-wrapper">
                <span class="cpf-kcal-left-message">아래와 같이 추가될 예정이에요!</span>
                <div class="cpf-kcal-tail-svg">${getTailSvg()}</div>
            </div>
            ${createBarContainer(mealKey, data)}
        </div>
        <div class="divider large"></div>
    `;
    return `
        ${commonHeader}
    `;
}

function mealToKor(meal) {
    switch (meal) {
        case 'morning': return '아침';
        case 'lunch': return '점심';
        case 'dinner': return '저녁';
        case 'snack': return '간식';
        default: return '';
    }
}

function createBarContainer(mealKey, data) {
    const types = ['carbo', 'protein', 'fat'];
    return `
        <div class="home-meal-bar-container">
            ${types.map(type => {
        const { consumed, target } = data[type];
        const rawPercent = target > 0 ? (consumed / target) * 100 : 0;
        const percent = Math.min(rawPercent, 100);
        return createBar(mealKey, type, consumed, target, percent.toFixed(1), rawPercent);
    }).join('')}
        </div>
    `;
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
                    <div class="bar-front ${type}" style="width: 0%; background: #ffc0c0; animation: blinkBarOpacity 1.5s infinite ease-in-out, fillBar-${mealKey}-${type}-increase 1s forwards;"></div>
                    <div class="bar-front ${type}" style="width: ${percent}%; background: ${color}; animation: fillBar-${mealKey}-${type} 1s forwards;"></div>
                </div>
                <div class="text-wrapper">
                    <span class="consumed ${type}" style="color: ${fontColor}">${consumed}g</span>
                    <span class="divide">/</span>
                    <span class="target ${type}">${target}g</span>
                </div>
            
            </div>
            <style>
                @keyframes fillBar-${mealKey}-${type}-increase {
                    from { width: 0%; }
                    to { width: 80%; }
                }
                @keyframes blinkBarOpacity {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
            </style>
        </div>
    `;
}

function getTailSvg() {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="26" viewBox="0 0 28 26" fill="none">
            <g>
                <path d="M15.1547 15.3682C14.6415 16.2571 13.3585 16.2571 12.8453 15.3682L6.49445 4.36816C5.98125 3.47927 6.62275 2.36816 7.64915 2.36816L20.3509 2.36816C21.3773 2.36816 22.0188 3.47928 21.5056 4.36816L15.1547 15.3682Z" fill="white"/>
            </g>
            <defs>

            </defs>
        </svg>
    `;
}