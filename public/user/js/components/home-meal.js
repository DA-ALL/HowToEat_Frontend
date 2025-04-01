export function renderMealDetail(mealKey, data) {
    const mealKor = mealToKor(mealKey);

    return `
        <div id="headerNav" data-title="${mealKor}식사 등록하기" data-type="2"></div>
        <div class="home-meal-container padding">
            <div class="title-format">${mealKor}의 탄단지</div>

            ${createBarContainer(mealKey, data)}
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
    } else if (rawPercent > 95) {
        color = 'linear-gradient(269deg, #ED7777 0%, #E386B3 71.52%, #D896EF 103.66%)';
        fontColor = 'var(--red500)';
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

  
  function mealToKor(meal) {
    switch (meal) {
      case 'morning': return '아침';
      case 'lunch': return '점심';
      case 'dinner': return '저녁';
      case 'snack': return '간식';
      default: return '';
    }
  }