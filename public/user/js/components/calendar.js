// calendar.js
import { getTodaysCPF } from '../main/todaysCPF.js';
import { getMealLog } from '../main/meal-log.js';

let currentDate = new Date();
let viewMode = 'week';
let activeDate = formatDate(new Date());
let calorieData = {};
let macrosData = {};
let hasRenderedCPFOnce = false;

export function initCalendarPage() {
    hasRenderedCPFOnce = false;
    let shouldUpdateGraph = (activeDate === formatDate(new Date()) && !hasRenderedCPFOnce);
    const signupRequest = $.ajax({
        url: `${window.DOMAIN_URL}/users/signup-date`,
        method: 'GET'
    });

    if(shouldUpdateGraph) {
        // 그래프 두번 그려주기 방지
        $('#kcalGraphPath').attr('d', '');

        // 그래프 두번 그려주기 방지
        $('style').each(function () {
            const content = this.innerHTML;
            if (/@keyframes fillBar-(carbo|protein|fat)/.test(content)) {
                this.remove();
            }
        });

        // 그래프 두번 그려주기 방지
        $('style').filter((_, el) =>
            /@keyframes fillArc/.test(el.innerHTML)
        ).remove();
    }

    $.when(signupRequest).done(function (res) {
        const signupDateStr = res.data.createdAt;

        // 1. visible date 계산
        const visibleDates = getVisibleDates(signupDateStr);
        if (visibleDates.length === 0) {
            renderCalendarWithSignupLimit(signupDateStr);
            return;
        }

        const start = visibleDates[0];
        const end = visibleDates[visibleDates.length - 1];

        // 2. 먼저 kcal 데이터를 채우고
        $.get(`${window.DOMAIN_URL}/daily-summary/kcals`, {
            start_date: start,
            end_date: end
        }, function (kcalRes) {
            kcalRes.data.forEach(item => {
                calorieData[item.date] = {
                    target: item.targetKcal,
                    consumed: item.consumedKcal
                };
            });

            // 3. 그 다음 캘린더 렌더
            renderCalendarWithSignupLimit(signupDateStr);
        });

        // ✅ prev/next/toggle 버튼은 기존 그대로
        $("#prev").off('click').on("click", function () {
            if (viewMode === 'week') {
                currentDate.setDate(currentDate.getDate() - 7);
            } else {
                currentDate.setMonth(currentDate.getMonth() - 1);
            }
            updateCalendar(signupDateStr);
            getVisibleDateRangeFromCalendar(signupDateStr);
        });

        $("#next").off('click').on("click", function () {
            if (viewMode === 'week') {
                currentDate.setDate(currentDate.getDate() + 7);
            } else {
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
            updateCalendar(signupDateStr);
            getVisibleDateRangeFromCalendar(signupDateStr);
        });

        $("#toggle-view").off('click').on("click", function () {
            if (viewMode === 'week') {
                viewMode = 'month';
                $(this).text('월단위');
            } else {
                viewMode = 'week';
                $(this).text('주단위');
                currentDate = new Date(activeDate);
            }
            updateCalendar(signupDateStr);
            getVisibleDateRangeFromCalendar(signupDateStr);
        });
    });

}

// ✅ 캘린더에서 렌더 대상 날짜 목록 추출
function getVisibleDates(signupDateStr) {
    const validDates = [];

    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();
    let temp = new Date(year, month, 1);

    const todayStr = formatDate(new Date());

    if (viewMode === 'week') {
        const weekStart = new Date(currentDate);
        weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + i);
            const str = formatDate(date);
            if (str >= signupDateStr && str <= todayStr) {
                validDates.push(str);
            }
        }
    } else {
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const startDay = (firstDay === 0) ? 6 : firstDay - 1;

        for (let i = 1; i <= lastDate; i++) {
            temp.setDate(i);
            const str = formatDate(temp);
            if (str >= signupDateStr && str <= todayStr) {
                validDates.push(str);
            }
        }
    }

    return validDates;
}


function updateCalendar(signupDateStr) {

    renderCalendarWithSignupLimit(signupDateStr);
}

function renderCalendarWithSignupLimit(signupDateStr) {
    const today = new Date();
    const todayStr = formatDate(today);
    const shouldUpdateCPF = (activeDate === todayStr && !hasRenderedCPFOnce);

    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();
    $("#current-date").text(`${year}년 ${String(month + 1).padStart(2, '0')}월`);
    $("#calendar").empty();

    let daysHtml = '<div class="calendar-grid">';
    const weekDays = ['월', '화', '수', '목', '금', '토', '일'];
    daysHtml += '<div class="week-header">';
    weekDays.forEach(day => {
        const cls = day === '토' ? 'saturday' : day === '일' ? 'sunday' : '';
        daysHtml += `<div class="day-header ${cls}">${day}</div>`;
    });
    daysHtml += '</div>';

    if (viewMode === 'week') {
        let weekStart = new Date(currentDate);
        weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
        daysHtml += '<div class="week-row">';
        for (let i = 0; i < 7; i++) {
            const tempDate = new Date(weekStart);
            tempDate.setDate(weekStart.getDate() + i);
            const dateStr = formatDate(tempDate);
            const disabledClass = (dateStr > todayStr || dateStr < signupDateStr) ? 'disabled' : '';
            const isActive = dateStr === activeDate ? 'active' : '';
            daysHtml += createDayHTML(tempDate, disabledClass, isActive, signupDateStr);
        }
        daysHtml += '</div>';
    } else {
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const startDay = (firstDay === 0) ? 6 : firstDay - 1;
        let tempDate = new Date(year, month, 1);

        daysHtml += '<div class="month-grid">';
        for (let i = 0; i < startDay; i++) {
            daysHtml += '<div class="day empty"></div>';
        }
        for (let i = 1; i <= lastDate; i++) {
            tempDate.setDate(i);
            const dateStr = formatDate(tempDate);
            const disabledClass = (dateStr > todayStr || dateStr < signupDateStr) ? 'disabled' : '';
            const isActive = dateStr === activeDate ? 'active' : '';
            daysHtml += createDayHTML(tempDate, disabledClass, isActive, signupDateStr);
        }
        daysHtml += '</div>';
    }

    daysHtml += '</div>';
    $("#calendar").html(daysHtml);

    // 날짜 클릭 이벤트
    $(`.day[data-date="${activeDate}"]`).addClass("active");

    $(".day").off('click').on("click", function () {
        if ($(this).hasClass("disabled")) return;
        $(".day").removeClass("active");
        $(this).addClass("active");

        const selected = $(this).data("date");
        activeDate = selected;
        currentDate = new Date(selected);

        $.get(`${window.DOMAIN_URL}/daily-summary/${selected}/macros`, function (res) {
            macrosData = res.data;
            const info = getDailyMacrosInfo(macrosData);
            $("#todaysCPF").html(getTodaysCPF(selected, info.targetKcal, info.rawPercent, info.percent, info.consumedKcal, info.caloriesLeft, info.targetCarbo, info.targetProtein, info.targetFat, info.consumedCarbo, info.consumedProtein, info.consumedFat, info.carboRawPercent, info.carboPercent, info.proteinRawPercent, info.proteinPercent, info.fatRawPercent, info.fatPercent));
            $("#mealLog").html(getMealLog(selected, res.data));
        });
    });

    if (shouldUpdateCPF) {
        hasRenderedCPFOnce = true;

        $.get(`${window.DOMAIN_URL}/daily-summary/${activeDate}/macros`, function (res) {
            macrosData = res.data;
            const info = getDailyMacrosInfo(macrosData);
            $("#todaysCPF").html(getTodaysCPF(activeDate, info.targetKcal, info.rawPercent, info.percent, info.consumedKcal, info.caloriesLeft, info.targetCarbo, info.targetProtein, info.targetFat, info.consumedCarbo, info.consumedProtein, info.consumedFat, info.carboRawPercent, info.carboPercent, info.proteinRawPercent, info.proteinPercent, info.fatRawPercent, info.fatPercent));
            $("#mealLog").html(getMealLog(activeDate, res.data));
        });
    }
}



function getVisibleDateRangeFromCalendar(signupDateStr) {
    const todayStr = formatDate(new Date());
    const validDates = [];
    $(".day").each(function () {
        const dateStr = $(this).data("date");
        if (!$(this).hasClass("disabled") && dateStr <= todayStr) {
            validDates.push(dateStr);
        }
    });

    if (validDates.length === 0) return;

    validDates.sort();
    const start = validDates[0];
    const end = validDates[validDates.length - 1];

    const kcalRequest = $.ajax({
        url: `${window.DOMAIN_URL}/daily-summary/kcals`,
        method: 'GET',
        data: {
            start_date: start,
            end_date: end
        }
    });

    $.when(kcalRequest).done(function (res) {
        res.data.forEach(item => {
            calorieData[item.date] = {
                target: item.targetKcal,
                consumed: item.consumedKcal
            };
        });

        updateCalendar(signupDateStr); // ✅ 데이터 다 들어온 뒤에 실행
    });
}

function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getDailyMacrosInfo(data) {
    if (data === undefined) {
        return {
            targetKcal: 0,
            consumedKcal: 0,
            rawPercent: 0,
            percent: 0,
            caloriesLeft: 0,
            targetCarbo: 0,
            targetProtein: 0,
            targetFat: 0,
            consumedCarbo: 0,
            consumedProtein: 0,
            consumedFat: 0,
            carboRawPercent: 0,
            carboPercent: 0,
            proteinRawPercent: 0,
            proteinPercent: 0,
            fatRawPercent: 0,
            fatPercent: 0
        };
    }

    const rawPercent = Math.round((data.consumedKcal / data.targetKcal) * 100);
    return {
        ...data,
        rawPercent,
        percent: Math.min(100, rawPercent),
        caloriesLeft: data.targetKcal - data.consumedKcal,
        carboRawPercent: Math.round((data.consumedCarbo / data.targetCarbo) * 100),
        carboPercent: Math.min(100, Math.round((data.consumedCarbo / data.targetCarbo) * 100)),
        proteinRawPercent: Math.round((data.consumedProtein / data.targetProtein) * 100),
        proteinPercent: Math.min(100, Math.round((data.consumedProtein / data.targetProtein) * 100)),
        fatRawPercent: Math.round((data.consumedFat / data.targetFat) * 100),
        fatPercent: Math.min(100, Math.round((data.consumedFat / data.targetFat) * 100))
    };
}


function polarToCartesian(cx, cy, r, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 180) * Math.PI / 180.0;
    return {
        x: cx + r * Math.cos(angleInRadians),
        y: cy + r * Math.sin(angleInRadians)
    };
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

function getCalorieInfo(dateStr) {
    const data = calorieData[dateStr];
    if (!data) return { rawPercent: 0, percent: 0, target: null };
    const rawPercent = Math.round((data.consumed / data.target) * 100);
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
        rawPercent,
        percent: Math.min(100, rawPercent),
        color,
        isGradient,
        target: data.target,
        consumed: data.consumed
    };
}

function createDayHTML(date, disabledClass, isActive, signupDateStr) {
    const dateStr = formatDate(date);
    const todayStr = formatDate(new Date());

    if (dateStr > todayStr || dateStr < signupDateStr) {
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
