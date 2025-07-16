import { registerPopstateHandler, updateURL, getCurrentContent, registerViewLoader } from '/administrate/js/router.js';
import { renderUserTable, renderTableWithOptionalPagination } from '/administrate/js/user-management/userTable.js';
import { renderCalorieTable, renderCalorieTableWithOptionalPagination } from '/administrate/js/components/dailyCalorieTable.js';
import { getUser, getUserDetail, getUserDailyCalories} from './api.js';

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
        console.log("User data fetched:", response);
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
        console.log("User Detail data:", response);
        
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
        console.log("칼로리 데이터:", response)        
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








const calorieData = {
    "2025-04-01": { consumed: 1800, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 225, consumedProtein: 135, consumedFat: 40 },
    "2025-04-02": { consumed: 2500, target: 2400, targetCarbo: 300, targetProtein: 180, targetFat: 53, consumedCarbo: 313, consumedProtein: 188, consumedFat: 56 },
    "2025-04-03": { consumed: 2200, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 275, consumedProtein: 165, consumedFat: 49 },
    "2025-04-04": { consumed: 1200, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 150, consumedProtein: 90, consumedFat: 27 },
    "2025-04-05": { consumed: 2600, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 325, consumedProtein: 195, consumedFat: 58 },
    "2025-04-06": { consumed: 1700, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 213, consumedProtein: 128, consumedFat: 38 },
    "2025-04-07": { consumed: 1952, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 244, consumedProtein: 146, consumedFat: 43 },
    "2025-04-08": { consumed: 1832, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 229, consumedProtein: 137, consumedFat: 41 },
    "2025-04-09": { consumed: 2530, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 316, consumedProtein: 190, consumedFat: 56 },
    "2025-04-10": { consumed: 2662, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 333, consumedProtein: 200, consumedFat: 59 },
    "2025-04-11": { consumed: 2673, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 334, consumedProtein: 200, consumedFat: 59 },
    "2025-04-12": { consumed: 2262, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 283, consumedProtein: 170, consumedFat: 50 },
    "2025-04-13": { consumed: 2552, target: 2564, targetCarbo: 321, targetProtein: 192, targetFat: 57, consumedCarbo: 319, consumedProtein: 191, consumedFat: 57 },
    "2025-04-14": { consumed: 2573, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 322, consumedProtein: 193, consumedFat: 57 },
    "2025-04-15": { consumed: 2445, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 306, consumedProtein: 183, consumedFat: 54 },
    "2025-04-16": { consumed: 2521, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 315, consumedProtein: 189, consumedFat: 56 },
    "2025-04-17": { consumed: 2200, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 275, consumedProtein: 165, consumedFat: 49 },
    "2025-04-18": { consumed: 2200, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 275, consumedProtein: 165, consumedFat: 49 },
    "2025-04-19": { consumed: 2252, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 282, consumedProtein: 169, consumedFat: 50 },
    "2025-04-20": { consumed: 2415, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 302, consumedProtein: 181, consumedFat: 54 },
    "2025-04-21": { consumed: 2681, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 335, consumedProtein: 201, consumedFat: 60 },
    "2025-04-22": { consumed: 2624, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 328, consumedProtein: 197, consumedFat: 58 },
    "2025-04-23": { consumed: 2551, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 319, consumedProtein: 191, consumedFat: 57 },
    "2025-04-24": { consumed: 1593, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 199, consumedProtein: 119, consumedFat: 35 },
    "2025-04-25": { consumed: 2545, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 318, consumedProtein: 191, consumedFat: 57 },
    "2025-04-26": { consumed: 2400, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 300, consumedProtein: 180, consumedFat: 53 },
    "2025-04-27": { consumed: 1656, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 207, consumedProtein: 124, consumedFat: 37 },
    "2025-04-28": { consumed: 2662, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 333, consumedProtein: 200, consumedFat: 59 },
    "2025-04-29": { consumed: 2556, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 320, consumedProtein: 192, consumedFat: 57 },
    "2025-04-30": { consumed: 2462, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 308, consumedProtein: 185, consumedFat: 55 },
    "2025-04-31": { consumed: 1646, target: 2420, targetCarbo: 303, targetProtein: 182, targetFat: 54, consumedCarbo: 206, consumedProtein: 123, consumedFat: 37 },
};

const userConsumedMealData = {
    "2025-04-20" : { mealType:"breakfast", id:2, type: "cooked", name:"소고기 채끝살(생것)", providedBy:"수입산(미국산)", foodWeight:85, unit:"g", kcal:230, carbo: 237, protein: 16, fat: 15, targetCarbo: 90 },
    "2025-04-20" : { mealType:"breakfast",carbo:{consumed:237,target:220},protein:{consumed:84,target:90},fat:{consumed:24,target:24}} ,
    "2025-04-20" : { mealType:"breakfast",carbo:{consumed:237,target:220},protein:{consumed:84,target:90},fat:{consumed:24,target:24}} ,
    "2025-04-20" : { mealType:"lunch",carbo:{consumed:219,target:220},protein:{consumed:73,target:90},fat:{consumed:19,target:24}} ,
    "2025-04-20" : { mealType:"lunch",carbo:{consumed:219,target:220},protein:{consumed:73,target:90},fat:{consumed:19,target:24}} ,
    "2025-04-20" : { mealType:"lunch",carbo:{consumed:219,target:220},protein:{consumed:73,target:90},fat:{consumed:19,target:24}} ,
    "2025-04-20" : { mealType:"dinner",carbo:{consumed:198,target:220},protein:{consumed:93,target:90},fat:{consumed:23,target:24}} ,
    "2025-04-20" : { mealType:"dinner",carbo:{consumed:198,target:220},protein:{consumed:93,target:90},fat:{consumed:23,target:24}} ,
    "2025-04-20" : { mealType:"dinner",carbo:{consumed:198,target:220},protein:{consumed:93,target:90},fat:{consumed:23,target:24}} ,
    "2025-04-20" : { mealType:"snack",carbo:{consumed:191,target:220},protein:{consumed:85,target:90},fat:{consumed:25,target:24}} ,
    "2025-04-20" : { mealType:"snack",carbo:{consumed:191,target:220},protein:{consumed:85,target:90},fat:{consumed:25,target:24}} ,
    "2025-04-20" : { mealType:"snack",carbo:{consumed:191,target:220},protein:{consumed:85,target:90},fat:{consumed:25,target:24}} ,
    "2025-04-21" : { mealType:"breakfast",carbo:{consumed:217,target:220},protein:{consumed:98,target:90},fat:{consumed:25,target:24}} ,
    "2025-04-21" : { mealType:"lunch",carbo:{consumed:230,target:220},protein:{consumed:85,target:90},fat:{consumed:20,target:24}} ,
    "2025-04-21" : { mealType:"dinner",carbo:{consumed:235,target:220},protein:{consumed:83,target:90},fat:{consumed:24,target:24}} ,
    "2025-04-21" : { mealType:"snack",carbo:{consumed:232,target:220},protein:{consumed:91,target:90},fat:{consumed:20,target:24}} ,
    "2025-04-22" : { mealType:"breakfast",carbo:{consumed:192,target:220},protein:{consumed:80,target:90},fat:{consumed:24,target:24}} ,
    "2025-04-22" : { mealType:"lunch",carbo:{consumed:238,target:220},protein:{consumed:98,target:90},fat:{consumed:19,target:24}} ,
    "2025-04-22" : { mealType:"dinner",carbo:{consumed:229,target:220},protein:{consumed:95,target:90},fat:{consumed:25,target:24}} ,
    "2025-04-22" : { mealType:"snack",carbo:{consumed:228,target:220},protein:{consumed:74,target:90},fat:{consumed:25,target:24}} ,
    "2025-04-23" : { mealType:"breakfast",carbo:{consumed:206,target:220},protein:{consumed:90,target:90},fat:{consumed:20,target:24}} ,
    "2025-04-23" : { mealType:"lunch",carbo:{consumed:193,target:220},protein:{consumed:87,target:90},fat:{consumed:26,target:24}} ,
    "2025-04-23" : { mealType:"dinner",carbo:{consumed:201,target:220},protein:{consumed:84,target:90},fat:{consumed:24,target:24}} ,
    "2025-04-23" : { mealType:"snack",carbo:{consumed:192,target:220},protein:{consumed:72,target:90},fat:{consumed:25,target:24}} ,
    "2025-04-24" : { mealType:"breakfast",carbo:{consumed:210,target:220},protein:{consumed:96,target:90},fat:{consumed:26,target:24}} ,
    "2025-04-24" : { mealType:"lunch",carbo:{consumed:191,target:220},protein:{consumed:85,target:90},fat:{consumed:20,target:24}} ,
    "2025-04-24" : { mealType:"dinner",carbo:{consumed:240,target:220},protein:{consumed:99,target:90},fat:{consumed:19,target:24}} ,
    "2025-04-24" : { mealType:"snack",carbo:{consumed:205,target:220},protein:{consumed:99,target:90},fat:{consumed:19,target:24}} ,
    "2025-04-25" : { mealType:"breakfast",carbo:{consumed:231,target:220},protein:{consumed:91,target:90},fat:{consumed:22,target:24}} ,
    "2025-04-25" : { mealType:"lunch",carbo:{consumed:232,target:220},protein:{consumed:74,target:90},fat:{consumed:20,target:24}} ,
    "2025-04-25" : { mealType:"dinner",carbo:{consumed:226,target:220},protein:{consumed:99,target:90},fat:{consumed:26,target:24}} ,
    "2025-04-25" : { mealType:"snack",carbo:{consumed:224,target:220},protein:{consumed:84,target:90},fat:{consumed:19,target:24}} ,
    "2025-04-26" : { mealType:"breakfast",carbo:{consumed:233,target:220},protein:{consumed:86,target:90},fat:{consumed:24,target:24}} ,
    "2025-04-26" : { mealType:"lunch",carbo:{consumed:217,target:220},protein:{consumed:73,target:90},fat:{consumed:21,target:24}} ,
    "2025-04-26" : { mealType:"dinner",carbo:{consumed:230,target:220},protein:{consumed:82,target:90},fat:{consumed:24,target:24}} ,
    "2025-04-26" : { mealType:"snack",carbo:{consumed:230,target:220},protein:{consumed:76,target:90},fat:{consumed:22,target:24}} ,
    "2025-04-27" : { mealType:"breakfast",carbo:{consumed:205,target:220},protein:{consumed:85,target:90},fat:{consumed:19,target:24}} ,
    "2025-04-27" : { mealType:"lunch",carbo:{consumed:211,target:220},protein:{consumed:85,target:90},fat:{consumed:25,target:24}} ,
    "2025-04-27" : { mealType:"dinner",carbo:{consumed:231,target:220},protein:{consumed:84,target:90},fat:{consumed:20,target:24}} ,
    "2025-04-27" : { mealType:"snack",carbo:{consumed:180,target:220},protein:{consumed:83,target:90},fat:{consumed:20,target:24}} ,
    "2025-04-28" : { mealType:"breakfast",carbo:{consumed:176,target:220},protein:{consumed:74,target:90},fat:{consumed:19,target:24}} ,
    "2025-04-28" : { mealType:"lunch",carbo:{consumed:234,target:220},protein:{consumed:76,target:90},fat:{consumed:26,target:24}} ,
    "2025-04-28" : { mealType:"dinner",carbo:{consumed:187,target:220},protein:{consumed:75,target:90},fat:{consumed:19,target:24}} ,
    "2025-04-28" : { mealType:"snack",carbo:{consumed:238,target:220},protein:{consumed:74,target:90},fat:{consumed:22,target:24}} ,
    "2025-04-29" : { mealType:"breakfast",carbo:{consumed:242,target:220},protein:{consumed:95,target:90},fat:{consumed:20,target:24}} ,
    "2025-04-29" : { mealType:"lunch",carbo:{consumed:200,target:220},protein:{consumed:80,target:90},fat:{consumed:22,target:24}} ,
    "2025-04-29" : { mealType:"dinner",carbo:{consumed:224,target:220},protein:{consumed:83,target:90},fat:{consumed:26,target:24}} ,
    "2025-04-29" : { mealType:"snack",carbo:{consumed:177,target:220},protein:{consumed:86,target:90},fat:{consumed:26,target:24}} ,
    "2025-04-30" : { mealType:"breakfast",carbo:{consumed:199,target:220},protein:{consumed:94,target:90},fat:{consumed:24,target:24}} ,
    "2025-04-30" : { mealType:"lunch",carbo:{consumed:231,target:220},protein:{consumed:82,target:90},fat:{consumed:21,target:24}} ,
    "2025-04-30" : { mealType:"dinner",carbo:{consumed:181,target:220},protein:{consumed:89,target:90},fat:{consumed:24,target:24}} ,
    "2025-04-30" : { mealType:"snack",carbo:{consumed:198,target:220},protein:{consumed:81,target:90},fat:{consumed:25,target:24}}
};





// 칼로리 테이블 row 클릭
$(document).on('click', `#dailyCalorieTable tr`, function () {
    console.log("칼로리 row 클릭됨", $(this).find('.td-id').text());
    
    let currentDateStr = "2025-04-23"; // 아작스를 통해서 date를 가져온것 예시
    let currentDate = parseDateFromText(currentDateStr); // 문자열을 Date로 변환
    

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
                    <div class="prev-image nav-button"><img class="prev-date-button" src="/administrate/images/icon_arrow_back_black.png"></div>
                    <div class="date">${formatDate(currentDate)}</div> <!-- ✅ 여기 Date로 변환된 것 -->
                    <div class="next-image nav-button"><img class="next-date-button" src="/administrate/images/icon_arrow_front_black.png"></div>
                </div>

                <div id="consumedDataWrapper"></div>
                <div id="consumedMealDataWrapper"></div>
            
            </div>
        </div>
    `;

    $("body").append(calorieDetailHtml);
    updateDateAndConsumedData(currentDate);
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

    const formattedTarget = target.toLocaleString();         //숫자에 , 넣기 위해서
    const formattedConsumed = consumed.toLocaleString();     //숫자에 , 넣기 위해서

    const backgroundSvg = createBackgroundSvg();
    const svg = createCalorieArc(rawPercent, percent);
    const barContainer = `
        <div class="cpf-bar-container">
            ${createBar("carbo", consumedCarbo, targetCarbo, carboPercent, carboRawPercent)}
            ${createBar("protein", consumedProtein, targetProtein, proteinPercent, proteinRawPercent)}
            ${createBar("fat", consumedFat, targetFat, fatPercent, fatRawPercent)}
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

// 날짜와 ConsumedData 업데이트
function updateDateAndConsumedData(newDate) {
    const formattedDate = formatDate(newDate); // 여기서 formattedDate는 yyyy-MM-dd 문자열

    $('.date').text(formattedDate); // 날짜 텍스트 업데이트

    const info = getCalorieInfo(formattedDate); // 요걸 꼭 formattedDate로 넘겨야 함!
    console.log(info);

    $('#consumedDataWrapper').html(renderConsumedData(
        formattedDate,    // 요것도 문자열
        info.target, 
        info.rawPercent, 
        info.percent, 
        info.consumed, 
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

// 날짜 포맷을 Date 객체로 변환하는 함수
function parseDateFromText(dateText) {
    const [year, month, day] = dateText.split('-').map(num => parseInt(num, 10));
    return new Date(year, month - 1, day);
}

// 날짜를 yyyy-MM-dd 포맷으로 변환하는 함수
function formatDate(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// calorieDetail 날짜 < > 버튼 클릭 시
$(document).on('click', '.prev-date-button', function () {
    let dateText = $('.date').text(); // 현재 표시된 날짜 가져오기
    let parsedDate = parseDateFromText(dateText);

    parsedDate.setDate(parsedDate.getDate() - 1); // 하루 빼기

    updateDateAndConsumedData(parsedDate);
});

$(document).on('click', '.next-date-button', function () {
    let dateText = $('.date').text();
    let parsedDate = parseDateFromText(dateText);

    parsedDate.setDate(parsedDate.getDate() + 1); // 하루 더하기

    updateDateAndConsumedData(parsedDate);
});

