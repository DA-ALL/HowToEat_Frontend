export function renderIncreaseCPFbar(mealKey, userConsumedData, registFoodData) {
    const mealKor = mealToKor(mealKey);
    const commonHeader = `
        <div id="headerNav" data-title="${mealKor} 등록하기" data-type="2"></div>
        <div class="home-meal-container padding">
            <div class="title-format">${mealKor}의 탄단지</div>
            <div class="cpf-kcal-left-message-wrapper">
                ${getMessageFormat(userConsumedData, registFoodData)}
                <div class="cpf-kcal-tail-svg">${getTailSvg()}</div>
            </div>
            ${createBarContainer(mealKey, userConsumedData, registFoodData)}
        </div>
        <div class="divider large"></div>
    `;
    return `
        ${commonHeader}
    `;
}

export function renderMealRegist(mealKey, userConsumedData, registFoodData) {
    const mealKor = mealToKor(mealKey);
    const commonHeader = `
        <div class="home-meal-regist-container padding">
            <div class="title-format">${registFoodData.name}</div>
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

function createBarContainer(mealKey, userConsumedData, registFoodData) {
    const types = ['carbo', 'protein', 'fat'];
    return `
        <div class="home-meal-bar-container">
            ${types.map(type => {
                const consumed = Number(userConsumedData[type]?.consumed || 0);
                const target = Number(userConsumedData[type]?.target || 0);
                const upcoming = Number(registFoodData[type] || 0); // 예정 섭취량
                const newConsumed = consumed + upcoming;

                const rawPercent = target > 0 ? (consumed / target) * 100 : 0;
                const rawIncreasePercent = target > 0 ? (newConsumed / target) * 100 : 0;

                return createBar(
                    mealKey,
                    type,
                    consumed,
                    newConsumed,
                    target,
                    Math.min(rawPercent, 100).toFixed(1),
                    rawPercent,
                    Math.min(rawIncreasePercent, 100).toFixed(1),
                    rawIncreasePercent
                );
            }).join('')}
        </div>
    `;
}


function createBar(mealKey, type, consumed, newConsumed, target, percent, rawPercent, increasedPercent, rawIncreasePercent) {
    const labelMap = {
        carbo: "탄수화물",
        protein: "단백질",
        fat: "지방"
    };

    const label = labelMap[type];

    let color = "var(--red500)";
    let fontColor = "var(--red500)";

    let increaseColor = "#ffc0c0";
    let increaseFontColor = "var(--red500)";

    //현재 섭취한 탄단지 바 색상
    if (rawPercent > 105) {
        color = '#814949';
        fontColor = '#814949';
    } else if (rawPercent >= 0) {
        color = 'var(--red500)';
        fontColor = 'var(--red500)';
    }

    // 등록 후 탄단지 바 색상
    if (rawIncreasePercent > 105) {
        increaseColor = '#aa9595';
        increaseFontColor = '#814949';
    }  else if (rawIncreasePercent >= 0) {
        increaseColor = '#ffc0c0';
        increaseFontColor = 'var(--red500)';
    }

    return `
        <div class="home-meal-bar-wrapper ${type}">
            <div class="meal-title ${type}">${label}</div>
            <div class="meal-bar-wrapper">
                <div class="bar-wrapper">
                    <div class="bar-back"></div>
                    <div class="bar-front bar-increase ${type}" style="width: 0%; background: ${increaseColor}; animation: blinkBarOpacity 1.5s infinite ease-in-out, fillBar-${mealKey}-${type}-increase 1s forwards;"></div>
                    <div class="bar-front ${type}" style="width: ${percent}%; background: ${color};"></div>
                </div>
                <div class="text-wrapper">
                    <span class="consumed ${type}" 
                        data-from="${consumed}" 
                        data-to="${newConsumed}" 
                        data-type="${type}"
                        style="color: ${increaseFontColor};">
                        ${newConsumed}g
                    </span>
                    <span class="divide">/</span>
                    <span class="target ${type}">${target}g</span>
                </div>
            
            </div>
            <style>
                @keyframes fillBar-${mealKey}-${type}-increase {
                    from { width: 0%; }
                    to { width: ${increasedPercent}%; }
                }
                @keyframes blinkBarOpacity {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
                @keyframes blinkFontOpacity {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            </style>
        </div>
    `;
}

function getMessageFormat(userConsumedData, registFoodData) {
    console.log(userConsumedData);
    const types = ['carbo', 'protein', 'fat'];

    for (const type of types) {
        const consumed = Number(userConsumedData[type]?.consumed || 0);
        const added = Number(registFoodData[type] || 0);
        const target = Number(userConsumedData[type]?.target || 0);

        const newConsumed = consumed + added;
        const rawIncreasePercent = target > 0 ? (newConsumed / target) * 100 : 0;

        if (rawIncreasePercent > 105) {
            return `<span class="cpf-kcal-left-message">아침 목표치보다 많아요. 양을 조절해주세요 ❗️</span>`;
        }
    }

    return `<span class="cpf-kcal-left-message">아래와 같이 추가될 거에요</span>`;
}

function animateCountUp($element, from, to, duration = 1200) {
    const start = performance.now();
    
    function update(timestamp) {
        const progress = Math.min((timestamp - start) / duration, 1);
        const current = Math.floor(from + (to - from) * progress);
        $element.text(`${current}g`);
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

export function runAllCountAnimations() {
    $('.home-meal-bar-wrapper .consumed').each(function () {
        const $el = $(this);
        const from = Number($el.data('from'));
        const to = Number($el.data('to'));

        if (!isNaN(from) && !isNaN(to)) {
            animateCountUp($el, from, to);
        }
    });
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