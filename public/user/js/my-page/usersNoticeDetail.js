export function renderUsersNoticeDetail(id) {
    return `
        <div class="set-container">
            <div id="headerNav" data-title="공지사항" data-type="2"></div>
            <div class="item-container">
                <div class="title">아침</div>
                <div class="time breakfast">08:15</div>
            </div>
            <div class="item-container">
                <div class="title">점심</div>
                <div class="time lunch">12:45</div>
            </div>
            <div class="item-container">
                <div class="title">저녁</div>
                <div class="time dinner">19:35</div>
            </div>
            <div class="recommend-container">
                <div class="text-wrapper">
                    <div class="title">추천 시간으로 설정</div>
                    <div class="sub-title">하잇에서 추천해 주는 식사 시간으로 설정돼요</div>
                </div>
                <div class="recommend-set-time-toggle"></div>
            </div>
        </div>
    `;
} 