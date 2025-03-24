import { getTodaysCPF } from '../todaysCPF.js';

$(document).ready(function () {
    let currentDate = new Date(); 
    let viewMode = 'week';
    let activeDate = formatDate(new Date()); // ✅ 선택된 날짜 기억

    const calorieData = {
        "2025-03-01": { consumed: 1800, target: 2564 },
        "2025-03-02": { consumed: 2500, target: 2400 },
        "2025-03-03": { consumed: 2200, target: 2564 },
        "2025-03-04": { consumed: 1200, target: 2564 },
        "2025-03-05": { consumed: 2600, target: 2564 },
        "2025-03-06": { consumed: 1700, target: 2564 },
        "2025-03-07": { consumed: 1900, target: 2564 },
        "2025-03-08": { consumed: 1800, target: 2564 },
        "2025-03-09": { consumed: 2500, target: 2564 },
        "2025-03-10": { consumed: 2600, target: 2564 },
        "2025-03-11": { consumed: 2200, target: 2564 },
        "2025-03-12": { consumed: 2200, target: 2564 },
        "2025-03-13": { consumed: 2200, target: 2564 },
        "2025-03-14": { consumed: 2200, target: 2420 },
        "2025-03-15": { consumed: 2200, target: 2420 },
        "2025-03-16": { consumed: 2521, target: 2420 },
        "2025-03-17": { consumed: 2200, target: 2420 },
        "2025-03-18": { consumed: 2200, target: 2420 },
        "2025-03-19": { consumed: 2200, target: 2420 },
        "2025-03-20": { consumed: 2400, target: 2420 },
        "2025-03-21": { consumed: 2200, target: 2420 },
        "2025-03-22": { consumed: 2600, target: 2420 },
        "2025-03-23": { consumed: 2500, target: 2420 },
        "2025-03-24": { consumed: 1500, target: 2420 },
        "2025-03-25": { consumed: 2100, target: 2420 },
        "2025-03-26": { consumed: 2200, target: 2420 },
        "2025-03-27": { consumed: 1600, target: 2420 },
        "2025-03-28": { consumed: 2600, target: 2420 },
        "2025-03-29": { consumed: 2500, target: 2420 },
        "2025-03-30": { consumed: 2400, target: 2420 },
        "2025-03-31": { consumed: 1650, target: 2420 }
      }
      

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

        // ⬇️ 클릭 이벤트 시 percent도 넘겨줌
        $(".day").click(function () {
            if ($(this).hasClass("disabled")) return;
            $(".day").removeClass("active");
            $(this).addClass("active");

            const selected = $(this).data("date");
            activeDate = selected;
            currentDate = new Date(selected);

            const info = getCalorieInfo(selected);
            $("#todaysCPF").html(getTodaysCPF(selected, info.target, info.rawPercent, info.percent, info.consumed));
        });

        // ⬇️ 초기 렌더 시에도 같이 넘겨줌
        const initialInfo = getCalorieInfo(activeDate);
        $("#todaysCPF").html(getTodaysCPF(activeDate, initialInfo.target, initialInfo.rawPercent, initialInfo.percent, initialInfo.consumed));


    }

    function getCalorieInfo(dateStr) {
        const data = calorieData[dateStr];
        if (!data) {
            return {
                rawPercent: 0,
                percent: 0,
                color: "#EBEBEB",
                isGradient: false,
                target: null
            };
        }
    
        const { consumed, target } = data;
        const rawPercent = Math.round((consumed / target) * 100);
    
        // 실제 SVG 계산에 쓸 percent는 최대 100까지만 (게이지 길이 제한용)
        const percent = Math.min(100, rawPercent);
    
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
    
        return { rawPercent, percent, color, isGradient, target , consumed};
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

        const { percent, color, isGradient, target } = getCalorieInfo(dateStr);

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