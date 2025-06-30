import { getDailyReport } from './api.js';

$(document).ready(async function () {
    const data  = await getDailyReportData();
    function createCard({ title, value, trend, unit, comparison, icon, trendIcon, type }) {
        return `
            <div id="cardItem">
                <div class="card-content-wrapper">
                    <div class="title-card">${title}</div>
                    <div class="value-card">${value}</div>
                    
                    <!--
                    <div class="trend-difference-wrapper ${type}">
                        <div class="icon-trending">
                            <img src="${trendIcon}">
                        </div>
                        <div class="trend-difference-value">${trend}</div>
                        <div class="trend-difference-unit">${unit}</div>
                        <div class="trend-difference-comparison">${comparison}</div>
                    </div>
                    --!>

                </div>
                <div class="icon-card">
                    <img src="${icon}">
                </div>
            </div>
        `;
    }

    // 카드의 trend가 없을시 숨기기
    if($(".trend-difference-wrapper").hasClass(".trend")){
        $(this).show();
    } else {
        $(this).hide();
    }

    function renderCards(cards) {
        const container = $("#cardList");
        container.html(cards.map(createCard).join(""));
    }

    function getCardTemplate() {
        const path = window.location.pathname;

        if (path.includes("dashboard")) {
            return [
                { title: "전체 회원수", value: data.totalUserCount.toLocaleString(), icon: "/administrate/images/card_01.png", trendIcon: "/administrate/images/icon_increase.png", type: "trend" },
                { title: "오늘 가입한 회원수", value: data.todayRegisteredUserCount.toLocaleString(), trend: 4.3, unit: "%", comparison: "어제보다", icon: "/administrate/images/card_02.png", trendIcon: "/administrate/images/icon_increase.png", type: "trend" },
                { title: "전체 음식", value: data.totalFoodCount.toLocaleString(), trend: 1.3, unit: "%", comparison: "어제보다", icon: "/administrate/images/card_08.png", trendIcon: "/administrate/images/icon_increase.png", type: "trend" },
                { title: "전체 식단 등록수", value: data.totalConsumedFoodCount.toLocaleString(), trend: 0, unit: "", comparison: "", icon: "/administrate/images/card_09.png", trendIcon: "", type: "" },
            ];
        } else if (path.includes("user-management")) {
            return [
                { title: "전체 회원수", value: data.totalUserCount.toLocaleString(), trend: 13, unit: "명", comparison: "어제보다", icon: "/administrate/images/card_01.png", trendIcon: "/administrate/images/icon_increase.png", type: "trend" },
                { title: "남자 회원수", value: data.maleUserCount.toLocaleString(), trend: 4.3, unit: "%", comparison: "어제보다", icon: "/administrate/images/card_03.png", trendIcon: "/administrate/images/icon_increase.png", type: "trend" },
                { title: "여자 회원수", value: data.femaleUserCount.toLocaleString(), trend: 1.3, unit: "%", comparison: "어제보다", icon: "/administrate/images/card_04.png", trendIcon: "/administrate/images/icon_increase.png", type: "trend" },
                { title: "넥스트짐 회원수", value: data.nextGymMemberCount.toLocaleString(), trend: 0, unit: "", comparison: "", icon: "/administrate/images/card_05.png", trendIcon: "", type: "" },
            ];
        } else if (path.includes("food-management")) {
            return [
                { title: "전체 음식", value: data.totalFoodCount.toLocaleString(), trend: 8, unit: "개", comparison: "어제보다", icon: "/administrate/images/card_06.png", trendIcon: "/administrate/images/icon_increase.png", type: "trend" },
                { title: "관리자 음식 DB", value: data.totalAdminFoodCount.toLocaleString(), trend: 2, unit: "개", comparison: "어제보다", icon: "/administrate/images/card_07.png", trendIcon: "/administrate/images/icon_increase.png", type: "trend" },
                { title: "유저 레시피", value: data.totalUserFoodCount.toLocaleString(), trend: 6, unit: "개", comparison: "어제보다", icon: "/administrate/images/card_08.png", trendIcon: "/administrate/images/icon_increase.png", type: "trend" },
            ];
        } 
        else {
            return [];
        }
    }

    async function renderPage() {
        const cards = await getCardTemplate();
        renderCards(cards);
    }

    // 최초 실행
    renderPage();

    // URL 변경 감지 (뒤로 가기, 앞으로 가기)
    window.addEventListener("popstate", renderPage);

    (function () {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function () {
            originalPushState.apply(this, arguments);
            window.dispatchEvent(new Event("pushstate"));
        };

        history.replaceState = function () {
            originalReplaceState.apply(this, arguments);
            window.dispatchEvent(new Event("replacestate"));
        };

        window.addEventListener("pushstate", renderPage);
        window.addEventListener("replacestate", renderPage);
    })();

});

async function getDailyReportData(){
    try {
        const response = await getDailyReport();
        console.log(response);
        return response.data;
    } catch(err){
        console.log(err);
    }
}