export function renderMyPage() {
    return `
        <div class="mypage-info-container">
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

        <div class="mypage-alarm-container option-container">
            <div class="title">알람 설정</div>
            <div class="set-time item-option">
                <div class="option-title">식사 시간 설정</div>
                <div class="icon"><img src="/user/images/icon_arrow_light_gray.png"></div>
            </div>
            <div class="set-alarm item-option">
                <div class="option-title">알람 권한</div>
                <div class="alarm-toggle"></div>
            </div>
        </div>

        <div class="mypage-customer-service-container option-container">
            <div class="title">고객 센터</div>
            <div class="notice item-option">
                <div class="option-title">공지사항</div>
                <div class="icon"><img src="/user/images/icon_arrow_light_gray.png"></div>
            </div>
            <div class="question item-option">
                <div class="option-title">문의</div>
                <div class="icon"><img src="/user/images/icon_arrow_light_gray.png"></div>
            </div>
        </div>

        <div class="mypage-TermsAndPolicies-container option-container">
            <div class="title">약관 및 정책</div>
            <div class="terms-of-use item-option">
                <div class="option-title">약관 및 이용동의</div>
                <div class="icon"><img src="/user/images/icon_arrow_light_gray.png"></div>
            </div>
            <div class="privacy-policy item-option">
                <div class="option-title">개인정보 보호정책</div>
                <div class="icon"><img src="/user/images/icon_arrow_light_gray.png"></div>
            </div>
        </div>

        <div class="mypage-app-version-container option-container">
            <div class="title">앱 버전</div>
            <div class="terms-of-use item-option">
                <div class="option-title">1.2v</div>
            </div>
        </div>
    `;
} 

$(document).on('click', '.alarm-toggle', function () {
    $(this).toggleClass('active');
    
    // 상태 확인용 로그 (on/off)
    const isOn = $(this).hasClass('active');
    console.log('알림 권한:', isOn ? 'ON' : 'OFF');
  });
  