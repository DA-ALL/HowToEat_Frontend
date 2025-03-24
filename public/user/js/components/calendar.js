$(document).ready(function () {
    let currentDate = new Date(); 
    let viewMode = 'week';
    let activeDate = formatDate(new Date()); // ✅ 선택된 날짜 기억

    const targetCalories = 2564;
    const calorieData = {
        "2025-03-01": 1800,
        "2025-03-02": 2500,
        "2025-03-03": 2400,
        "2025-03-04": 2500,
        "2025-03-05": 2700,
        "2025-03-06": 2500,
        "2025-03-07": 2400,
        "2025-03-08": 2500,
        "2025-03-09": 2564,
        "2025-03-10": 2200,
        "2025-03-11": 1420,
        "2025-03-12": 1740,
        "2025-03-13": 2540,
        "2025-03-14": 0,
        "2025-03-16": 1740,
        "2025-03-17": 2740,
        "2025-03-18": 2440,
        "2025-03-19": 2540,
        "2025-03-20": 2140,
        "2025-03-21": 2440,
        "2025-03-22": 2540,
        "2025-03-24": 2140,
    };

    function updateCalendar() {
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth();
        $("#current-date").text(`${year}년 ${String(month + 1).padStart(2, '0')}월`);
        $("#calendar").empty();

        let daysHtml = '<div class="calendar-grid">';
        let weekDays = ['월', '화', '수', '목', '금', '토', '일'];

        daysHtml += '<div class="week-header">';
        weekDays.forEach(day => {
            if (day === '토') {
                daysHtml += `<div class="day-header saturday">${day}</div>`;    
            } else if (day === '일') {
                daysHtml += `<div class="day-header sunday">${day}</div>`;    
            } else {
                daysHtml += `<div class="day-header">${day}</div>`;
            }
        });
        daysHtml += '</div>';

        let today = new Date();
        let todayStr = formatDate(today);

        if (viewMode === 'week') {
            let weekStart = new Date(currentDate);
            weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
            daysHtml += '<div class="week-row">';
            for (let i = 0; i < 7; i++) {
                let tempDate = new Date(weekStart);
                tempDate.setDate(weekStart.getDate() + i);
                let dateStr = formatDate(tempDate);
                let disabledClass = (dateStr > todayStr) ? 'disabled' : '';
                let isActive = (dateStr === activeDate) ? 'active' : '';
                daysHtml += createDayHTML(tempDate, disabledClass, isActive);
            }
            daysHtml += '</div>';
        } else {
            let firstDay = new Date(year, month, 1).getDay();
            let lastDate = new Date(year, month + 1, 0).getDate();
            let startDay = (firstDay === 0) ? 6 : firstDay - 1;

            let tempDate = new Date(year, month, 1);
            daysHtml += '<div class="month-grid">';
            for (let i = 0; i < startDay; i++) {
                daysHtml += '<div class="day empty"></div>';
            }

            for (let i = 1; i <= lastDate; i++) {
                tempDate.setDate(i);
                let dateStr = formatDate(tempDate);
                let disabledClass = (dateStr > todayStr) ? 'disabled' : '';
                let isActive = (dateStr === activeDate) ? 'active' : '';
                daysHtml += createDayHTML(tempDate, disabledClass, isActive);
            }
            daysHtml += '</div>';
        }

        daysHtml += '</div>';
        $("#calendar").html(daysHtml);

        // ✅ 날짜 클릭 시 activeDate 갱신
        $(".day").click(function () {
            if ($(this).hasClass("disabled")) return;
            $(".day").removeClass("active");
            $(this).addClass("active");

            const selected = $(this).data("date");
            activeDate = selected;
            currentDate = new Date(selected); // 선택한 날짜 기준으로 currentDate 이동
        });
    }

    function getCalorieInfo(dateStr) {
        const consumed = calorieData[dateStr] || 0;
        const rawPercent = (consumed / targetCalories) * 100;
        const percent = Math.min(100, Math.round(rawPercent));
    
        let color = "#EBEBEB";
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
    
        return { percent, color, isGradient };
    }

    function createDayHTML(date, disabledClass, isActive) {
        const dateStr = formatDate(date);
        const todayStr = formatDate(new Date());

        if (dateStr > todayStr) {
            return `
                <div class="day disabled ${isActive}" data-date="${dateStr}">
                    <span>${date.getDate()}</span>
                </div>`;
        }

        const { percent, color, isGradient } = getCalorieInfo(dateStr);

        const centerX = 14;
        const centerY = 14;
        const radius = 11;
        const arcStartAngle = -30;
        const arcEndAngle = 210;
        const dynamicEnd = arcStartAngle + (arcEndAngle - arcStartAngle) * (percent / 100);
        
        const pathD = describeArc(centerX, centerY, radius, arcStartAngle, dynamicEnd);
        const backgroundArc = describeArc(centerX, centerY, radius, arcStartAngle, arcEndAngle);

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
            <div class="day ${disabledClass} ${isActive}" data-date="${dateStr}">
                <svg width="30" height="30" viewBox="0 0 30 30">
                    ${isGradient ? gradientDef : ""}
                    ${pathElement}
                </svg>
                <span>${date.getDate()}</span>
            </div>`;
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

    // 이전/다음 버튼
    $("#prev").click(function () {
        if (viewMode === 'week') {
            currentDate.setDate(currentDate.getDate() - 7);
        } else {
            currentDate.setMonth(currentDate.getMonth() - 1);
        }
        updateCalendar();
    });

    $("#next").click(function () {
        if (viewMode === 'week') {
            currentDate.setDate(currentDate.getDate() + 7);
        } else {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        updateCalendar();
    });

    // [월단위]/[주단위] 전환
    $("#toggle-view").click(function () {
        if (viewMode === 'week') {
            // 주단위 → 월단위: currentDate 유지
            viewMode = 'month';
            $(this).text('월단위');
        } else {
            // 월단위 → 주단위: activeDate 기준으로 이동
            viewMode = 'week';
            $(this).text('주단위');
            currentDate = new Date(activeDate);
        }
    
        updateCalendar();
    });
    

    function formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    updateCalendar();
});
