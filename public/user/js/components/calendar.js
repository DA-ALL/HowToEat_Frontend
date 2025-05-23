import { getTodaysCPF } from '../main/todaysCPF.js';
import { getMealLog } from '../main/meal-log.js';

import { setupAjaxAuthInterceptor } from '../utils/auth-interceptor.js';

$(document).ready(function () {
    setupAjaxAuthInterceptor();

    let currentDate = new Date();
    let viewMode = 'week';
    let activeDate = formatDate(new Date()); // ✅ 선택된 날짜 기억
    let calorieData = {};
    // const calorieData = {
    //     "2025-03-01": { consumed: 1800, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 225, consumedProtein: 135, consumedFat: 40 },
    //     "2025-03-02": { consumed: 2500, target: 2400, targetCarbo: 300, targetProtein: 180, targetFat: 53, consumedCarbo: 313, consumedProtein: 188, consumedFat: 56 },
    //     "2025-03-03": { consumed: 2200, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 275, consumedProtein: 165, consumedFat: 49 },
    //     "2025-03-04": { consumed: 1200, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 150, consumedProtein: 90, consumedFat: 27 },
    //     "2025-03-05": { consumed: 2600, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 325, consumedProtein: 195, consumedFat: 58 },
    //     "2025-03-06": { consumed: 1700, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 213, consumedProtein: 128, consumedFat: 38 },
    //     "2025-03-07": { consumed: 1952, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 244, consumedProtein: 146, consumedFat: 43 },
    //     "2025-03-08": { consumed: 1832, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 229, consumedProtein: 137, consumedFat: 41 },
    //     "2025-03-09": { consumed: 2530, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 316, consumedProtein: 190, consumedFat: 56 },
    //     "2025-03-10": { consumed: 2662, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 333, consumedProtein: 200, consumedFat: 59 },
    //     "2025-03-11": { consumed: 2673, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 334, consumedProtein: 200, consumedFat: 59 },
    //     "2025-03-12": { consumed: 2262, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 283, consumedProtein: 170, consumedFat: 50 },
    //     "2025-03-13": { consumed: 2552, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 319, consumedProtein: 191, consumedFat: 57 },
    //     "2025-03-14": { consumed: 2573, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 322, consumedProtein: 193, consumedFat: 57 },
    //     "2025-03-15": { consumed: 2445, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 306, consumedProtein: 183, consumedFat: 54 },
    //     "2025-03-16": { consumed: 2521, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 315, consumedProtein: 189, consumedFat: 56 },
    //     "2025-03-17": { consumed: 2200, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 275, consumedProtein: 165, consumedFat: 49 },
    //     "2025-03-18": { consumed: 2200, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 275, consumedProtein: 165, consumedFat: 49 },
    //     "2025-03-19": { consumed: 2252, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 282, consumedProtein: 169, consumedFat: 50 },
    //     "2025-03-20": { consumed: 2415, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 302, consumedProtein: 181, consumedFat: 54 },
    //     "2025-03-21": { consumed: 2681, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 335, consumedProtein: 201, consumedFat: 60 },
    //     "2025-03-22": { consumed: 2624, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 328, consumedProtein: 197, consumedFat: 58 },
    //     "2025-03-23": { consumed: 2551, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 319, consumedProtein: 191, consumedFat: 57 },
    //     "2025-03-24": { consumed: 1593, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 199, consumedProtein: 119, consumedFat: 35 },
    //     "2025-03-25": { consumed: 2545, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 318, consumedProtein: 191, consumedFat: 57 },
    //     "2025-03-26": { consumed: 2400, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 300, consumedProtein: 180, consumedFat: 53 },
    //     "2025-03-27": { consumed: 1656, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 207, consumedProtein: 124, consumedFat: 37 },
    //     "2025-03-28": { consumed: 2662, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 333, consumedProtein: 200, consumedFat: 59 },
    //     "2025-03-29": { consumed: 2556, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 320, consumedProtein: 192, consumedFat: 57 },
    //     "2025-03-30": { consumed: 2462, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 308, consumedProtein: 185, consumedFat: 55 },
    //     "2025-03-31": { consumed: 1646, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 206, consumedProtein: 123, consumedFat: 37 },
    //     "2025-04-01": { consumed: 1646, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 206, consumedProtein: 123, consumedFat: 37 },
    //     "2025-04-02": { consumed: 2415, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 302, consumedProtein: 181, consumedFat: 54 },
    //     "2025-04-03": { consumed: 2415, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 302, consumedProtein: 181, consumedFat: 54 },
    //     "2025-04-04": { consumed: 1593, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 199, consumedProtein: 119, consumedFat: 35 },
    //     "2025-04-05": { consumed: 1646, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 206, consumedProtein: 123, consumedFat: 37 },
    //     "2025-04-06": { consumed: 2415, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 302, consumedProtein: 181, consumedFat: 54 },
    //     "2025-04-07": { consumed: 2415, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 302, consumedProtein: 181, consumedFat: 54 },
    //     "2025-04-09": { consumed: 1646, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 206, consumedProtein: 123, consumedFat: 37 },
    //     "2025-04-10": { consumed: 1646, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 206, consumedProtein: 123, consumedFat: 37 },
    //     "2025-04-11": { consumed: 1646, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 206, consumedProtein: 123, consumedFat: 37 },
    //     "2025-04-12": { consumed: 1646, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 206, consumedProtein: 123, consumedFat: 37 }
    // };



    function updateCalendar(updateCPF = true) {
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
            $("#todaysCPF").html(getTodaysCPF(
                selected, info.target, info.rawPercent, info.percent, info.consumed, info.caloriesLeft,
                info.targetCarbo, info.targetProtein, info.targetFat,
                info.consumedCarbo, info.consumedProtein, info.consumedFat,
                info.carboRawPercent, info.carboPercent,
                info.proteinRawPercent, info.proteinPercent,
                info.fatRawPercent, info.fatPercent
            ));

            $("#mealLog").html(getMealLog(selected));
        });

        if(updateCPF) {            
            const initialInfo = getCalorieInfo(activeDate);
            $("#todaysCPF").html(getTodaysCPF(
                activeDate, initialInfo.target, initialInfo.rawPercent, initialInfo.percent, initialInfo.consumed, initialInfo.caloriesLeft,
                initialInfo.targetCarbo, initialInfo.targetProtein, initialInfo.targetFat,
                initialInfo.consumedCarbo, initialInfo.consumedProtein, initialInfo.consumedFat,
                initialInfo.carboRawPercent, initialInfo.carboPercent,
                initialInfo.proteinRawPercent, initialInfo.proteinPercent,
                initialInfo.fatRawPercent, initialInfo.fatPercent
            ));
            $("#mealLog").html(getMealLog());
        }


    }

    function getCalorieInfo(dateStr) {
        const data = calorieData[dateStr];
        if (!data) return { rawPercent: 0, percent: 0, target: null };

        const {
            consumed, target,
            consumedCarbo = 0, consumedProtein = 0, consumedFat = 0,
            targetCarbo = Math.round((target * 0.5) / 4),
            targetProtein = Math.round((target * 0.3) / 4),
            targetFat = Math.round((target * 0.2) / 9)
        } = data;

        const rawPercent = Math.round((consumed / target) * 100);
        const percent = Math.min(100, rawPercent);
        const caloriesLeft = target - consumed;

        const carboRawPercent = Math.round((consumedCarbo / targetCarbo) * 100);
        const carboPercent = Math.min(100, carboRawPercent);
        const proteinRawPercent = Math.round((consumedProtein / targetProtein) * 100);
        const proteinPercent = Math.min(100, proteinRawPercent);
        const fatRawPercent = Math.round((consumedFat / targetFat) * 100);
        const fatPercent = Math.min(100, fatRawPercent);

        let color = "#EBEBEB";
        let isGradient = false;
    
        if (rawPercent === 0) {
            color = "#EBEBEB";
        } else if (rawPercent > 0 && rawPercent <= 95) {
            color = "#FFE1E4";
        } else if (rawPercent > 95 && rawPercent <= 105) {
            color = "url(#calorieGradient)";
            isGradient = true;
        } else if (rawPercent > 105) {
            color = "#814949";
        }

        return {
            rawPercent, color, isGradient, percent, target, consumed, caloriesLeft,
            targetCarbo, targetProtein, targetFat,
            consumedCarbo, consumedProtein, consumedFat,
            carboRawPercent, carboPercent,
            proteinRawPercent, proteinPercent,
            fatRawPercent, fatPercent
        };
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
        const svgStyle = isGradient ? `style="filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.25));"` : "";

        const pathElement = percent === 0
            ? `<path d="${backgroundArc}" fill="none" stroke="#EBEBEB" stroke-width="3" stroke-linecap="round"/>`
            : `<path d="${pathD}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>`;

        return `
            <div class="day ${disabledClass} ${isActive}" data-date="${dateStr}">
                <svg width="30" height="30" viewBox="0 0 30 30" ${svgStyle}>
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
        updateCalendar(false);
        getVisibleDateRangeFromCalendar();
    });

    $("#next").click(function () {
        if (viewMode === 'week') {
            currentDate.setDate(currentDate.getDate() + 7);
        } else {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        updateCalendar(false);
        getVisibleDateRangeFromCalendar();
    //     getVisibleDateRangeFromCalendar();
    //         setTimeout(() => {
    //     getVisibleDateRangeFromCalendar();
    // }, 0);
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
        getVisibleDateRangeFromCalendar();
    });


    function formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    updateCalendar();
    getVisibleDateRangeFromCalendar();
    

    function getVisibleDateRangeFromCalendar() {
        const todayStr = formatDate(new Date());
        const validDates = [];
    
        $(".day").each(function () {
            const dateStr = $(this).data("date");
            const isFuture = $(this).hasClass("disabled");
            if (!isFuture && dateStr <= todayStr) {
                validDates.push(dateStr);
            }
        });
    
        if (validDates.length === 0) {
            console.warn("화면에 유효한 날짜가 없습니다.");
            return;
        }
    
        validDates.sort(); // 오름차순 정렬
        const start = validDates[0];
        const end = validDates[validDates.length - 1];
    
        $.ajax({
            type: "GET",
            url: `${window.DOMAIN_URL}/daily-summary/kcals`,
            data: {
                start_date: start,
                end_date: end
            },
            // contentType: "application/json",
            success: function (res) {
                console.log("✅ 성공:", res);
    
                // ⬇️ 여기서 전역 calorieData를 다시 정의
                calorieData = {};
                res.data.forEach(item => {
                    calorieData[item.date] = {
                        target: item.targetKcal,
                        consumed: item.consumedKcal
                    };
                });
    
                updateCalendar(); // 🔁 데이터 갱신 후 다시 렌더링
            },
            error: function (err) {
                // window.location.href="/login-page"
            }
        });
    }
    
    
});