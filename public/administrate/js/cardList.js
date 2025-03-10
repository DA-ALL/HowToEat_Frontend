$(document).ready(function () {
    function createCard({ title, value, trend, unit, comparison, icon, trendIcon }) {
        return `
            <div id="cardItem">
                <div class="card-content-wrapper">
                    <div class="title-card">${title}</div>
                    <div class="value-card">${value}</div>
                    <div class="trend-difference-wrapper">
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

    function renderCards(cards) {
        const container = $("#cardList");
        container.html(cards.map(createCard).join(""));
    }

    const cardData = [
        {
            title: "전체 회원수",
            value: 423,
            trend: 131234123412,
            unit: "명",
            comparison: "어제보다",
            icon: "/administrate/images/icon_users.png",
            trendIcon: "/administrate/images/icon_trending_up.png",
        },
        {
            title: "신규 가입자",
            value: 56,
            trend: 5,
            unit: "명",
            comparison: "어제보다",
            icon: "/administrate/images/icon_users.png",
            trendIcon: "/administrate/images/icon_trending_up.png",
        }
    ];

    renderCards(cardData);
});