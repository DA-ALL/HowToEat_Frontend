import { onPopstate, updateURL, getCurrentContent } from '/administrate/js/router.js';
import { renderUserTable, renderTableWithOptionalPagination } from '/administrate/js/user-management/userTable.js';
import { renderCalorieTable, renderCalorieTableWithOptionalPagination } from '/administrate/js/components/dailyCalorieTable.js';


export function renderUserInfo({ imageURL, username, email, birth, goal, goalCalorie, streakDay }, previousContent) {
    if (previousContent) {
        sessionStorage.setItem('previousContent', previousContent);
    }

    let userInfoHtml = `
        <div class="nav-top">
            <div class="back-button-wrapper">
                <div class="icon-back">
                    <img src="/administrate/images/icon_arrow_back_black.png"></img>
                </div>
                <div class="label-back">뒤로가기</div>
            </div>
        </div>
        <div class="user-info-container">
            <div class="user-info-wrapper">
                <div class="user-profile-image">
                    <img src="${imageURL}"></img>
                </div>

                <div class="user-name">${username}</div>

                <div class="user-meta-wrapper">
                    <div class="email">${email}</div>
                    <div class="divider"></div>
                    <div class="birth">${birth}</div>
                </div>

                <div class="user-goal-wrapper">
                    <div class="text-wrapper">
                        <div class="value">${goal}</div>
                        <div class="label">유저 목표</div>
                    </div>

                    <div class="divider"></div>                    

                    <div class="text-wrapper">
                        <div class="value">${goalCalorie}</div>
                        <div class="label">목표 Kcal</div>
                    </div>

                    <div class="divider"></div>

                    <div class="streak-wrapper">
                        <div class="value">${streakDay}</div>
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


    $(document).on('click', `#userInfo .back-button-wrapper`, function () {
        const prev = sessionStorage.getItem('previousContent');
        if (prev) {
            updateURL(prev);
        } else {
            // fallback
            window.history.back();
        }
    });

}


function loadUserInfoTable() {
    const containerId = 'userInfoTable';
    const bodyId = 'userInfoTableBody';
    const contentId = 'ptUserManagement';

    renderUserTable(containerId, bodyId);
    renderTableWithOptionalPagination({
        getData: getUserDataForUserInfo,
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

export function getUserInfo() {
    return {
        imageURL: "/administrate/images/icon_human_blue.png",
        username: `김예현`,
        email: "insidesy4@gmail.com",
        birth: "1995.04.30",
        goal: "체중 감량",
        goalCalorie: 2024,
        streakDay: 13
    }
}

function getUserDataForUserInfo() {
    return [{
        id: 1,
        imageURL: "/administrate/images/icon_human_blue.png",
        name: `김예현`,
        mealCount: Math.floor(Math.random() * 200),
        joined: "2025.03.16",
        left: "-",
        gymUser: Math.random() > 0.5,
        role: ["admin", "user", "master", "super-user"][Math.floor(Math.random() * 4)]
    }]
}


function getDailyCaloriData() {
    return [
        { id: 1, date: '2023-10-01', breakfast: 500, lunch: 700, dinner: 800, snack: 200, total: 2200 },
        { id: 2, date: '2023-10-02', breakfast: 600, lunch: 800, dinner: 900, snack: 300, total: 2600 },
        { id: 3, date: '2023-10-03', breakfast: 550, lunch: 750, dinner: 850, snack: 250, total: 2400 },
        { id: 4, date: '2023-10-04', breakfast: 520, lunch: 720, dinner: 820, snack: 270, total: 2330 },
        { id: 5, date: '2023-10-05', breakfast: 580, lunch: 780, dinner: 880, snack: 290, total: 2530 },
        { id: 6, date: '2023-10-06', breakfast: 600, lunch: 800, dinner: 900, snack: 300, total: 2600 },
        { id: 7, date: '2023-10-07', breakfast: 550, lunch: 750, dinner: 850, snack: 250, total: 2400 },
        { id: 8, date: '2023-10-08', breakfast: 520, lunch: 720, dinner: 820, snack: 270, total: 2330 },
        { id: 9, date: '2023-10-09', breakfast: 580, lunch: 780, dinner: 880, snack: 290, total: 2530 },
        { id: 10, date: '2023-10-10', breakfast: 600, lunch: 800, dinner: 900, snack: 300, total: 2600 },
        { id: 11, date: '2023-10-11', breakfast: 550, lunch: 750, dinner: 850, snack: 250, total: 2400 },
        { id: 12, date: '2023-10-12', breakfast: 520, lunch: 720, dinner: 820, snack: 270, total: 2330 },
        { id: 13, date: '2023-10-13', breakfast: 580, lunch: 780, dinner: 880, snack: 290, total: 2530 },
        { id: 14, date: '2023-10-14', breakfast: 600, lunch: 800, dinner: 900, snack: 300, total: 2600 },
        { id: 15, date: '2023-10-15', breakfast: 550, lunch: 750, dinner: 850, snack: 250, total: 2400 },
        { id: 16, date: '2023-10-16', breakfast: 520, lunch: 720, dinner: 820, snack: 270, total: 2330 },
        { id: 17, date: '2023-10-17', breakfast: 580, lunch: 780, dinner: 880, snack: 290, total: 2530 },
        { id: 18, date: '2023-10-18', breakfast: 600, lunch: 800, dinner: 900, snack: 300, total: 2600 },
        { id: 19, date: '2023-10-19', breakfast: 550, lunch: 750, dinner: 850, snack: 250, total: 2400 },
        { id: 20, date: '2023-10-20', breakfast: 520, lunch: 720, dinner: 820, snack: 270, total: 2330 },
        { id: 21, date: '2023-10-21', breakfast: 580, lunch: 780, dinner: 880, snack: 290, total: 2530 },
        { id: 22, date: '2023-10-22', breakfast: 600, lunch: 800, dinner: 900, snack: 300, total: 2600 },
        { id: 23, date: '2023-10-23', breakfast: 550, lunch: 750, dinner: 850, snack: 250, total: 2400 },
        { id: 24, date: '2023-10-24', breakfast: 520, lunch: 720, dinner: 820, snack: 270, total: 2330 },
        { id: 25, date: '2023-10-25', breakfast: 580, lunch: 780, dinner: 880, snack: 290, total: 2530 }
    ];
}


onPopstate(loadDailyCalorieTable);




// 칼로리 테이블 row 클릭
$(document).on('click', `#dailyCalorieTable tr`, function () {
    console.log("칼로리 row 클릭됨", $(this).find('.td-id').text());

    let calorieDetailHtml = `
        <div id="calorieDetail">
            <div class="detail-wrapper">sra</div>
        </div>
    `;

    $("body").append(calorieDetailHtml);

});


$(document).ready(function () {
    const pathSegments = window.location.pathname.split('/');
    const userId = parseInt(pathSegments[pathSegments.length - 1], 10);
        
    if(getCurrentContent() == 'userInfo' && userId ) {     
        renderUserInfo(getUserInfo());
    }
});