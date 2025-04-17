export function renderMyPage() {
    return `
        <div class="mypage-container">
            <div class="mypage-info-goal-wrapper">
                <div class="mypage-info-wrapper">

                    <div class="profile-image">
                        <img src="/user/images/icon_human_red.png">
                    </div>

                    <div class="info-wrapper">
                        <div class="name-wrapper">
                            <div class="name">하잇 님</div>
                            <div class="icon">
                                <img src="/user/images/icon_arrow_light_gray.png">
                            </div>
                        </div>
                        <div class="message">오늘도 힘내요!</div>
                    </div>
                </div>

                <div class="mypage-goal-wrapper">
                    <div class="goal-type">
                        <div class="type-title">근육증량</div>
                        <div class="sub">나의 목표</div>
                    </div>

                    <div class="divider"></div>

                    <div class="goal-kcal">
                        <div class="kcal-amount">2024kcal</div>
                        <div class="sub">목표 kcal</div>
                    </div>

                    <div class="divider"></div>

                    <div class="goal-streak">
                        <div class="streak-day">13일째</div>
                        <div class="sub">연속 기록</div>
                    </div>
                </div>
        
            </div>
        </div>
    `;
} 