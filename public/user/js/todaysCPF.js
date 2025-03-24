export function getTodaysCPF(date, target, rawPercent = 0, percent = 0, consumed = 0) {
    const todayStr = new Date().toISOString().slice(0, 10);

    if (target === null) target = 0;
    const formattedTarget = target.toLocaleString();
    const formattedConsumed = consumed.toLocaleString();


    const svg = createCalorieArc(rawPercent, percent);
    const backgroundSvg = createBackgroundSvg(rawPercent, percent);

    const [year, month, day] = date.split("-");
    const title = (date === todayStr)
        ? `오늘의 탄단지`
        : `${year}년 ${month}월 ${day}일의 탄단지`;


    if(percent === 0) {
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


function createBackgroundSvg() {
    const centerX = 14;
    const centerY = 14;
    const radius = 11;
    const arcStartAngle = -30;
    const arcEndAngle = 210;
    const backgroundArc = describeArc(centerX, centerY, radius, arcStartAngle, arcEndAngle);

    const pathElement = `<path d="${backgroundArc}" fill="none" stroke="#F0F0F0" stroke-width="3.5" stroke-linecap="round"/>`

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
    const arcStartAngle = -30;
    const arcEndAngle = 210;
    const dynamicEnd = arcStartAngle + (arcEndAngle - arcStartAngle) * (percent / 100);

    const pathD = describeArc(centerX, centerY, radius, arcStartAngle, dynamicEnd);
    const backgroundArc = describeArc(centerX, centerY, radius, arcStartAngle, arcEndAngle);

    let color = "#F0F0F0";
    let isGradient = false;

    if (rawPercent === 0) {
        color = "#EBEBEB";
    } else if (rawPercent > 0 && rawPercent <= 95) {
        color = "#F9D9D9";
    } else if (rawPercent > 95 && rawPercent <= 105) {
        color = "url(#calorieGradient)";
        isGradient = true;
    } else if (rawPercent > 105) {
        color = "#7C001D";
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
        ? `<path d="${backgroundArc}" fill="none" stroke="#EBEBEB" stroke-width="3" stroke-linecap="round"/>`
        : `<path d="${pathD}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>`;

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

