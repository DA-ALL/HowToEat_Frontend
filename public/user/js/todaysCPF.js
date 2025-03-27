// 리팩터링된 getTodaysCPF.js 전체 코드

export function getTodaysCPF(
    date, target, rawPercent = 0, percent = 0, consumed = 0, caloriesLeft = 0,
    targetCarbo = 0, targetProtein = 0, targetFat = 0,
    consumedCarbo = 0, consumedProtein = 0, consumedFat = 0,
    carboRawPercent = 0, carboPercent = 0,
    proteinRawPercent = 0, proteinPercent = 0,
    fatRawPercent = 0, fatPercent = 0
) {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (target === null) target = 0;

    const formattedTarget = target.toLocaleString();
    const formattedConsumed = consumed.toLocaleString();
    const isToday = date === todayStr;
    const [year, month, day] = date.split("-");
    const title = isToday ? "오늘의 탄단지" : `${year}년 ${month}월 ${day}일`;

    const messageFormat = getMessageFormat(rawPercent, caloriesLeft);
    const svg = createCalorieArc(rawPercent, percent);
    const backgroundSvg = createBackgroundSvg();

    const barContainer = `
        <div class="cpf-bar-container">
            ${createBar("carbo", consumedCarbo, targetCarbo, carboPercent, carboRawPercent)}
            ${createBar("protein", consumedProtein, targetProtein, proteinPercent, proteinRawPercent)}
            ${createBar("fat", consumedFat, targetFat, fatPercent, fatRawPercent)}
        </div>
    `;

    return `
        <div class="cpf-title">${title}</div>
        <div class="cpf-target-kcal-wrapper">
            <div class="sub">일일권장</div>
            <div class="cpf-target-kcal">${formattedTarget}</div>
        </div>
        ${isToday ? `
            <div class="cpf-kcal-left-message-wrapper">
                ${messageFormat}
                <div class="cpf-kcal-tail-svg">${getTailSvg()}</div>
            </div>
        ` : ""}
        <div class="cpf-kcal-bar-wrapper">
            ${percent === 0
                ? `<div class="cpf-kcal-bar background">${backgroundSvg}</div>`
                : `<div class="cpf-kcal-bar">${svg}</div><div class="cpf-kcal-bar background">${backgroundSvg}</div>`}
            <div class="cpf-kcal-consumed-wrapper">
                <div class="cpf-kcal-consumed">${formattedConsumed}</div>
                <div class="sub">kcal</div>
            </div>
        </div>
        ${barContainer}
    `;
}

function getMessageFormat(rawPercent, caloriesLeft) {
    if (rawPercent > 105) {
        return `<span class="cpf-kcal-left-message">목표를 <span class="over">${-1 * caloriesLeft}</span> 초과했어요❗️</span>`;
    }
    if (rawPercent > 95) {
        return `<span class="cpf-kcal-left-message">목표를 달성했어요!🎉</span>`;
    }
    if (rawPercent >= 0) {
        return `<span class="cpf-kcal-left-message">목표까지 <span>${caloriesLeft}</span> 남았어요! 💪</span>`;
    }
    return "";
}

function createBar(type, consumed, target, percent, rawPercent) {
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
        <div class="cpf-bar-wrapper ${type}">
            <div class="cpf-bar-title ${type}">${label}</div>
            <div class="cpf-bar">
                <span class="consumed ${type}" style="color: ${fontColor}">${consumed}g</span>
                <span class="divide">/</span>
                <span class="target ${type}">${target}g</span>
            </div>
            <div class="bar-wrapper">
                <div class="bar-back"></div>
                <div class="bar-front ${type}" style="width: 0%; background: ${color}; animation: fillBar-${type} 1s forwards;"></div>
            </div>
            <style>
                @keyframes fillBar-${type} {
                    from { width: 0%; }
                    to { width: ${percent}%; }
                }
            </style>
        </div>
    `;
}

function getTailSvg() {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="26" viewBox="0 0 28 26" fill="none">
            <g filter="url(#filter0_d_600_9777)">
                <path d="M15.1547 15.3682C14.6415 16.2571 13.3585 16.2571 12.8453 15.3682L6.49445 4.36816C5.98125 3.47927 6.62275 2.36816 7.64915 2.36816L20.3509 2.36816C21.3773 2.36816 22.0188 3.47928 21.5056 4.36816L15.1547 15.3682Z" fill="white"/>
            </g>
            <defs>
                <filter id="filter0_d_600_9777" x="0.980631" y="0.704831" width="26.0387" height="24.3332" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="3.67"/>
                    <feGaussianBlur stdDeviation="2.66667"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.14 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_600_9777"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_600_9777" result="shape"/>
                </filter>
            </defs>
        </svg>
    `;
}

function createBackgroundSvg() {
    const centerX = 14;
    const centerY = 14;
    const radius = 11;
    const arcStartAngle = -35;
    const arcEndAngle = 215;
    const backgroundArc = describeArc(centerX, centerY, radius, arcStartAngle, arcEndAngle);

    return `<svg width="100%" height="100%" viewBox="0 0 30 30">
        <path d="${backgroundArc}" fill="none" stroke="#F0F0F0" stroke-width="4.5" stroke-linecap="round"/>
    </svg>`;
}

function createCalorieArc(rawPercent, percent) {
    const centerX = 14;
    const centerY = 14;
    const radius = 11;
    const arcStartAngle = -35;
    const arcEndAngle = 215;
    const dynamicEnd = arcStartAngle + (arcEndAngle - arcStartAngle) * (percent / 100);
    const pathD = describeArc(centerX, centerY, radius, arcStartAngle, dynamicEnd);

    const isGradient = rawPercent > 95 && rawPercent <= 105;
    const color = rawPercent === 0 ? '#EBEBEB' : rawPercent > 105 ? '#814949' : isGradient ? 'url(#calorieGradient)' : '#ED7777';

    const tempSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const tempPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    tempPath.setAttribute("d", pathD);
    tempSvg.appendChild(tempPath);
    document.body.appendChild(tempSvg);
    const pathLength = tempPath.getTotalLength();
    document.body.removeChild(tempSvg);

    const gradientDef = `
        <defs>
            <linearGradient id="calorieGradient" x1="27.6665" y1="0.572756" x2="-1.03143" y2="1.32184" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#ED7777"/>
                <stop offset="71.52%" stop-color="#E387B3"/>
                <stop offset="100%" stop-color="#D896EF"/>
            </linearGradient>
        </defs>`;

    return `<svg width="100%" height="100%" viewBox="0 0 30 30">
        ${isGradient ? gradientDef : ''}
        <path d="${pathD}"
              fill="none"
              stroke="${color}"
              stroke-width="4.5"
              stroke-linecap="round"
              stroke-dasharray="${pathLength}"
              stroke-dashoffset="${pathLength}"
              style="animation: fillArc 1.0s ease-out forwards;" />
        <style>
            @keyframes fillArc {
                to {
                    stroke-dashoffset: 0;
                }
            }
        </style>
    </svg>`;
}

function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, startAngle);
    const end = polarToCartesian(x, y, radius, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
    ].join(" ");
}

function polarToCartesian(cx, cy, r, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 180) * Math.PI / 180.0;
    return {
        x: cx + r * Math.cos(angleInRadians),
        y: cy + r * Math.sin(angleInRadians)
    };
}
