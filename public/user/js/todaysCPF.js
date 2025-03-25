export function getTodaysCPF(date, target, rawPercent = 0, percent = 0, consumed = 0, caloriesLeft = 0) {
    const todayStr = new Date().toISOString().slice(0, 10);

    if (target === null) target = 0;
    const formattedTarget = target.toLocaleString();
    const formattedConsumed = consumed.toLocaleString();
    let messageFormat = ``;

    if(rawPercent > 105) {
        messageFormat = `
            <span class="cpf-kcal-left-message">목표를 <span class="over">${-1 * caloriesLeft}</span> 초과했어요❗️</span>
        `
    } else if (rawPercent > 95 && rawPercent <= 105) {
        messageFormat = `
            <span class="cpf-kcal-left-message">목표를 달성했어요!🎉</span>
        `
    } else if(rawPercent > 0 && rawPercent <= 95) {
        messageFormat = `
            <span class="cpf-kcal-left-message">목표까지 <span>${caloriesLeft}</span> 남았어요! 💪</span>
        `
    }



    const svg = createCalorieArc(rawPercent, percent);
    const backgroundSvg = createBackgroundSvg(rawPercent, percent);

    const [year, month, day] = date.split("-");
    const title = (date === todayStr)
        ? `오늘의 탄단지`
        : `${year}년 ${month}월 ${day}일`;


    if (percent === 0) {
        return `
        <div class="cpf-title">${title}</div>
        <div class="cpf-target-kcal-wrapper">
            <div class="sub">일일권장</div>
            <div class="cpf-target-kcal">${formattedTarget}</div>
        </div>
        <div class="cpf-kcal-bar-wrapper">
            <div class="cpf-kcal-bar background">${backgroundSvg}</div>
            <div class="cpf-kcal-consumed-wrapper">
                <div class="cpf-kcal-consumed">${formattedConsumed}</div>
                <div class="sub">kcal</div>
            </div>
        </div>
    `;
    } else {
        if(date === todayStr) {
            return `
                <div class="cpf-title">${title}</div>
                <div class="cpf-target-kcal-wrapper">
                    <div class="sub">일일권장</div>
                    <div class="cpf-target-kcal">${formattedTarget}</div>
                </div>
                <div class="cpf-kcal-left-message-wrapper">
                    ${messageFormat}
                    <div class="cpf-kcal-tail-svg">
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
                    </div>
                </div>
    
                <div class="cpf-kcal-bar-wrapper">
                    <div class="cpf-kcal-bar">${svg}</div>
                    <div class="cpf-kcal-bar background">${backgroundSvg}</div>
                    <div class="cpf-kcal-consumed-wrapper">
                        <div class="cpf-kcal-consumed">${formattedConsumed}</div>
                        <div class="sub">kcal</div>
                    </div>
                </div>
            `;
        } else {
            return `
            <div class="cpf-title">${title}</div>
            <div class="cpf-target-kcal-wrapper">
                <div class="sub">일일권장</div>
                <div class="cpf-target-kcal">${formattedTarget}</div>
            </div>

            <div class="cpf-kcal-bar-wrapper">
                <div class="cpf-kcal-bar">${svg}</div>
                <div class="cpf-kcal-bar background">${backgroundSvg}</div>
                <div class="cpf-kcal-consumed-wrapper">
                    <div class="cpf-kcal-consumed">${formattedConsumed}</div>
                    <div class="sub">kcal</div>
                </div>
            </div>
        `;
        }
    }
}


function createBackgroundSvg() {
    const centerX = 14;
    const centerY = 14;
    const radius = 11;
    const arcStartAngle = -35;
    const arcEndAngle = 215;
    const backgroundArc = describeArc(centerX, centerY, radius, arcStartAngle, arcEndAngle);

    const pathElement = `<path d="${backgroundArc}" fill="none" stroke="#F0F0F0" stroke-width="4.5" stroke-linecap="round"/>`

    return `
        <svg width="100%" height="100%" viewBox="0 0 30 30">
            ${pathElement}
        </svg>
    `;
}

function createCalorieArc(rawPercent, percent) {
    const centerX = 14;
    const centerY = 14;
    const radius = 11;
    const arcStartAngle = -35;
    const arcEndAngle = 215;
    const dynamicEnd = arcStartAngle + (arcEndAngle - arcStartAngle) * (percent / 100);

    const pathD = describeArc(centerX, centerY, radius, arcStartAngle, dynamicEnd);
    const backgroundArc = describeArc(centerX, centerY, radius, arcStartAngle, arcEndAngle);

    let color = "#F0F0F0";
    let isGradient = false;

    if (rawPercent === 0) {
        color = "#EBEBEB";
    } else if (rawPercent > 0 && rawPercent <= 95) {
        // color = "url(#calorieGradient)";
        color = "#ED7777";
        // isGradient = true;
    } else if (rawPercent > 95 && rawPercent <= 105) {
        color = "url(#calorieGradient)";
        isGradient = true;
    } else if (rawPercent > 105) {
        color = "#814949";
    }

    const gradientDef = `
        <defs>
            <linearGradient id="calorieGradient" x1="27.6665" y1="0.572756" x2="-1.03143" y2="1.32184" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#ED7777"/>
                <stop offset="71.52%" stop-color="#E387B3"/>
                <stop offset="100%" stop-color="#D896EF"/>
            </linearGradient>
        </defs>
    `;

    const pathElement = percent === 0
        ? `<path d="${backgroundArc}" fill="none" stroke="#EBEBEB" stroke-width="4.5" stroke-linecap="round"/>`
        : `<path d="${pathD}" fill="none" stroke="${color}" stroke-width="4.5" stroke-linecap="round"/>`;

    return `
        <svg width="100%" height="100%" viewBox="0 0 30 30">
            ${isGradient ? gradientDef : ""}
            ${pathElement}
        </svg>
    `;
}

function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
}

function polarToCartesian(cx, cy, r, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 180) * Math.PI / 180.0;
    return {
        x: cx + r * Math.cos(angleInRadians),
        y: cy + r * Math.sin(angleInRadians)
    };
}

