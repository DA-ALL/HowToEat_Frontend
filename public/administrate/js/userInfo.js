import { registerPopstateHandler, updateURL, getCurrentContent, registerViewLoader } from '/administrate/js/router.js';
import { renderUserTable, renderTableWithOptionalPagination } from '/administrate/js/user-management/userTable.js';
import { renderCalorieTable, renderCalorieTableWithOptionalPagination } from '/administrate/js/components/dailyCalorieTable.js';
import { getUser, getUserDetail, getUserDailyCalories, getDailySummaryInfo} from './api.js';

export async function renderUserInfo() {
    const data = await getUserDataForUserInfo();

    let userInfoHtml = `
        <div class="nav-top">
            <div class="back-button-wrapper">
                <div class="icon-back">
                    <img src="/administrate/images/icon_arrow_back_black.png">
                </div>
                <div class="label-back">뒤로가기</div>
            </div>
        </div>
        <div class="user-info-container">
            <div class="user-info-wrapper">
                <div class="user-profile-image">
                    <img src="${data.profileImageUrl}">
                </div>

                <div class="user-name">${data.name}</div>

                <div class="user-meta-wrapper">
                    <div class="email">${data.email}</div>
                    <div class="divider"></div>
                    <div class="birth">${data.birth}</div>
                </div>

                <div class="user-goal-wrapper">
                    <div class="text-wrapper">
                        <div class="value">${formatUserGoal(data.userGoal)}</div>
                        <div class="label">유저 목표</div>
                    </div>

                    <div class="divider"></div>                    

                    <div class="text-wrapper">
                        <div class="value">${data.targetKcal}</div>
                        <div class="label">목표 Kcal</div>
                    </div>

                    <div class="divider"></div>

                    <div class="streak-wrapper">
                        <div class="value">${data.streakDays}</div>
                        <div class="label">연속 기록</div>
                    </div>
                </div>
            </div>
        
            <div id="userInfoTable"></div>

            <div id="dailyCalorieTable"></div>
        </div>
    
    `;

    
    let userInfo = $('#userInfo');
    userInfo.html(userInfoHtml);

    loadUserInfoTable();
    loadDailyCalorieTable();
}

$(document).on('click', `#userInfo .back-button-wrapper`, function () {
    const prev = sessionStorage.getItem('previousContent');

    if (prev) {
        updateURL(prev);
    } else {
        window.history.back();
    }
});

function formatUserGoal(userGole){
    switch (userGole){
        case 'LOSE_WEIGHT' :
            return "체중감량";
        case 'MAINTAIN_WEIGHT' : 
            return "체중유지";
        case 'GAIN_WEIGHT':
            return "체중증량";
        case 'GAIN_MUSCLE':
            return "근육증량";
        default:
            return '';
    }
}


function loadUserInfoTable() {
    const containerId = 'userInfoTable';
    const bodyId = 'userInfoTableBody';
    const contentId = 'ptUserManagement';

    renderUserTable(containerId, bodyId);
    renderTableWithOptionalPagination({
        getData: getUserData,
        bodyId: bodyId,
        contentId: contentId,
        enablePagination: false
    })
}

function loadDailyCalorieTable(){
    const containerId = 'dailyCalorieTable';
    const bodyId = 'dailyCalorieTableBody';
    const contentId = 'ptUserManagement';

    renderCalorieTable(containerId, bodyId);
    renderCalorieTableWithOptionalPagination({
        getData: getDailyCaloriData,
        bodyId,
        contentId,
        tableId: containerId,
        enablePagination: true
    })
}

export async function getUserData() {
    const userId = getUserIdFromUrl();
    try {
        const response = await getUser(userId);
        const data = {
            content: [response.data],
            page: 0,
            totalElements: 1,
        }
        return data;
    } catch (err) {
        console.error("Error fetching user data:", err);
    }
}

async function getUserDataForUserInfo() {
    const userId = getUserIdFromUrl();
    try {
        const response = await getUserDetail(userId);
        // console.log("User Detail data:", response);
        
        return response.data;
    } catch (err) {
        console.error("Error fetching user data:", err);
    }
}

async function getDailySummaryData(selectedDate) {
    const userId = getUserIdFromUrl();
    try {
        const response = await getDailySummaryInfo(userId, selectedDate);
        
        return response.data;
    } catch (err) {
        console.error("Error fetching user data:", err);
    }
}



async function getDailyCaloriData() {
    const page = getPageFromURL();
    const userId = getUserIdFromUrl();
    try {
        const response = await getUserDailyCalories(userId, page);
        // console.log("칼로리 데이터:", response)        
        return response;
    } catch (err) {
        console.error("Error fetching user data:", err);
    }
}


function getPageFromURL() { 
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('page')) || 1;
}

registerPopstateHandler('userInfo',loadDailyCalorieTable);
registerViewLoader('userInfo', renderUserInfo);



let dateArr = {};

// 칼로리 테이블 row 클릭
$(document).on('click', `#dailyCalorieTable tr`, async function () {
    // console.log("칼로리 row 클릭됨", $(this).find('.td-id').text());
    let currentDateStr = $(this).data("date");
    const data = await getDailySummaryData(currentDateStr);
    dateArr = data.dates;

    console.log(dateArr);

    //이전 다음날짜가 없을 경우 < > 버튼 disabled처리
    
    let calorieDetailHtml = `
      <div id="calorieDetail">
        <div class="detail-wrapper">
          <div class="profile-wrapper">
            <div class="profile-image">
              <img src="/administrate/images/icon_human_red.png">
            </div>
            <div class="name-wrapper">
              <div class="profile-name">하잇</div>
              <div class="name-label">님</div>
            </div>
          </div>
    
          <div class="date-wrapper">
            <div class="prev-image nav-button">
              <img class="prev-date-button" src="/administrate/images/icon_arrow_back_black.png">
            </div>
            <div class="date">${currentDateStr}</div>
            <div class="next-image nav-button">
              <img class="next-date-button" src="/administrate/images/icon_arrow_front_black.png">
            </div>
          </div>
    
          <div id="consumedDataWrapper"></div>
          <div id="consumedMealDataWrapper"></div>
        </div>
      </div>
    `;

    $("body").append(calorieDetailHtml);
    updateDateAndConsumedData(data.macros);
    updatePrevNextButtonState();
});


/////////////////////////    START   ///////////////////////////////
//[[consumedDataWrapper]] 영역 코드 - 전체 칼로리 및 전체 탄단지 섭취 그래프//
///////////////////////////////////////////////////////////////////

// 칼로리 테이블 그래프 렌더링
function renderConsumedData(
    date,                   //날짜
    target,                 //목표 칼로리
    rawPercent = 0,         //실제 섭취량 (%)
    percent = 0,            //최대값 변환 섭취량 (%)
    consumed = 0,           //섭취 칼로리
    caloriesLeft = 0,       //남은 칼로리
    targetCarbo = 0,        //목표 탄수화물
    targetProtein = 0,      //목표 단백질
    targetFat = 0,          //목표 지방
    consumedCarbo = 0,      //섭취 탄수화물
    consumedProtein = 0,    //섭취 단백질
    consumedFat = 0,        //섭취 지방
    carboRawPercent = 0,    //실제 탄수화물 섭취량 (%)
    carboPercent = 0,       //최대값 변환 탄수화물 섭취량 (%)
    proteinRawPercent = 0,  //실제 단백질 섭취량 (%)
    proteinPercent = 0,     //최대값 변환 단백질 섭취량 (%)
    fatRawPercent = 0,      //실제 지방 섭취량 (%)
    fatPercent = 0          //최대값 변환 지방 섭취량 (%)
) {
    if (target === null) target = 0;
    console.log("consumed = " ,consumed)
    const formattedTarget = Math.floor(target).toLocaleString();         //숫자에 , 넣기 위해서
    const formattedConsumed =  Math.floor(consumed).toLocaleString();     //숫자에 , 넣기 위해서

    const backgroundSvg = createBackgroundSvg();
    const svg = createCalorieArc(rawPercent, percent);
    const barContainer = `
        <div class="cpf-bar-container">
            ${createBar("carbo", Math.floor(consumedCarbo), Math.floor(targetCarbo), carboPercent, carboRawPercent)}
            ${createBar("protein", Math.floor(consumedProtein), Math.floor(targetProtein), proteinPercent, proteinRawPercent)}
            ${createBar("fat", Math.floor(consumedFat), Math.floor(targetFat), fatPercent, fatRawPercent)}        
        </div>
    `;

    return `
    <div class="cpf-kcal-bar-container">
        <div class="cpf-kcal-bar-wrapper">
            ${percent === 0
                ? `<div class="cpf-kcal-bar background">${backgroundSvg}</div>`
                : `<div class="cpf-kcal-bar">${svg}</div><div class="cpf-kcal-bar background">${backgroundSvg}</div>`}
            <div class="cpf-kcal-consumed-wrapper">
                <div class="cpf-kcal-consumed">${formattedConsumed}</div>
                <div class="sub">kcal</div>
            </div>
            <div class="target-kcal-wrapper">
                <div class="target-label">목표 칼로리</div>
                <div class="target-kcal">${formattedTarget}</div>
            </div>
        </div>
        
        ${barContainer}
    </div>
    `
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

//
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

//정보 percent로 가공
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


// 날짜와 ConsumedData 업데이트
function updateDateAndConsumedData(data) {
    const info = getDailyMacrosInfo(data);

    $('#consumedDataWrapper').html(renderConsumedData(
        data.date,    // 요것도 문자열
        info.targetKcal, 
        info.rawPercent,
        info.percent,
        info.consumedKcal,
        info.caloriesLeft,
        info.targetCarbo,
        info.targetProtein,
        info.targetFat,
        info.consumedCarbo,
        info.consumedProtein,
        info.consumedFat,
        info.carboRawPercent,
        info.carboPercent,
        info.proteinRawPercent,
        info.proteinPercent,
        info.fatRawPercent,
        info.fatPercent
    ));
}

/////////////////////////     END    ///////////////////////////////
//[[consumedDataWrapper]] 영역 코드 - 전체 칼로리 및 전체 탄단지 섭취 그래프//
///////////////////////////////////////////////////////////////////






/////////////////////////    START   ///////////////////////////////
//[[consumedMealDataWrapper]] 영역 코드 - 아침 점심 저녁별 탄단지 그래프 영역//
///////////////////////////////////////////////////////////////////

function getUserIdFromUrl() {
    const pathSegments = window.location.pathname.split('/');
    const userId = parseInt(pathSegments[pathSegments.length - 1], 10);
    return userId;
}

// $(document).ready(function () {
//     const userId = getUserIdFromUrl();

//     if(getCurrentContent() == 'userInfo' && userId ) {
//         renderUserInfo(getUserDataForUserInfo());
//     }
// });


// calorieDetail 날짜 < > 버튼 클릭 시
$(document).on('click', '.prev-date-button', async function () {
    $('.date').text(dateArr[0]);
    const data = await getDailySummaryData(dateArr[0]);
    dateArr = data.dates;
    
    updatePrevNextButtonState()

    updateDateAndConsumedData(data.macros);
});


$(document).on('click', '.next-date-button', async function () {
    $('.date').text(dateArr[1]);
    const data = await getDailySummaryData(dateArr[1]);
    dateArr = data.dates;

    updatePrevNextButtonState();

    updateDateAndConsumedData(data.macros);
});


function updatePrevNextButtonState() {
    if(dateArr[1] == null) {
        $(".next-date-button").addClass("disabled");
    } else {
        $(".next-date-button").removeClass("disabled");
    }

    if(dateArr[0] == null) {
        $(".prev-date-button").addClass("disabled");
    } else {
        $(".prev-date-button").removeClass("disabled");
    }
}
