$(document).ready(function () {
    
    function createCard({ title, value, trend, unit, comparison, icon, trendIcon, type }) {
        return `
            <div id="cardItem">
                <div class="card-content-wrapper">
                    <div class="title-card">${title}</div>
                    <div class="value-card">${value}</div>
                    <div class="trend-difference-wrapper ${type}">
                        <div class="icon-trending">
                            <img src="${trendIcon}">
                        </div>
                        <div class="trend-difference-value">${trend}</div>
                        <div class="trend-difference-unit">${unit}</div>
                        <div class="trend-difference-comparison">${comparison}</div>
                    </div>
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
                { title: "전체 회원수", value: 423, trend: 13, unit: "명", comparison: "어제보다", icon: "/administrate/images/icon_users.png", trendIcon: "/administrate/images/icon_trending_up.png", type: "trend" },
                { title: "오늘 가입한 회원수", value: 14, trend: 4.3, unit: "%", comparison: "어제보다", icon: "/administrate/images/icon_users.png", trendIcon: "/administrate/images/icon_trending_up.png", type: "trend" },
                { title: "전체 음식", value: 15293, trend: 1.3, unit: "%", comparison: "어제보다", icon: "/administrate/images/icon_users.png", trendIcon: "/administrate/images/icon_trending_up.png", type: "trend" },
                { title: "전체 식단 등록수", value: 10323, trend: 0, unit: "", comparison: "", icon: "/administrate/images/icon_users.png", trendIcon: "", type: "" },
            ];
        } else if (path.includes("user-management")) {
            return [
                { title: "전체 회원수", value: 423, trend: 13, unit: "명", comparison: "어제보다", icon: "/administrate/images/icon_users.png", trendIcon: "/administrate/images/icon_trending_up.png", type: "trend" },
                { title: "남자 회원수", value: 14, trend: 4.3, unit: "%", comparison: "어제보다", icon: "/administrate/images/icon_users.png", trendIcon: "/administrate/images/icon_trending_up.png", type: "trend" },
                { title: "여자 회원수", value: 17, trend: 1.3, unit: "%", comparison: "어제보다", icon: "/administrate/images/icon_users.png", trendIcon: "/administrate/images/icon_trending_up.png", type: "trend" },
                { title: "넥스트짐 회원수", value: 5, trend: 0, unit: "", comparison: "", icon: "/administrate/images/icon_users.png", trendIcon: "", type: "" },
            ];
        } else if (path.includes("food-management")) {
            return [
                { title: "전체 음식", value: 120, trend: 8, unit: "개", comparison: "어제보다", icon: "/administrate/images/icon_users.png", trendIcon: "/administrate/images/icon_trending_up.png", type: "trend" },
                { title: "관리자 음식 DB", value: 45, trend: 2, unit: "개", comparison: "어제보다", icon: "/administrate/images/icon_users.png", trendIcon: "/administrate/images/icon_trending_up.png", type: "trend" },
                { title: "유저 레시피", value: 75, trend: 6, unit: "개", comparison: "어제보다", icon: "/administrate/images/icon_users.png", trendIcon: "/administrate/images/icon_trending_up.png", type: "trend" },
            ];
        } 
        else {
            return [];
        }
    }

    function renderPage() {
        const cards = getCardTemplate();
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

