import { showPage } from '../components/nav-bottom.js'
import { showPopup } from '../components/popup.js'


export function renderMyPage(callback) {
    const userBasicInfo = $.ajax({
        method: "GET",
        url: `${window.DOMAIN_URL}/users/basic-info`,
    });

    $.when(userBasicInfo).done(function (userBasicInfoRes) {
        const userBasicInfoData = userBasicInfoRes.data;
        const myPageHTML = renderMyPageHTML(userBasicInfoData);
        // console.log(userBasicInfoData)
        callback(myPageHTML);
    });

}

export function renderMyPageHTML(userBasicInfoData) {
    let goalText = '';

    switch (userBasicInfoData.userGoal) {
        case 'LOSE_WEIGHT':
            goalText = '체중 감량';
            break;
        case 'MAINTAIN_WEIGHT':
            goalText = '체중 유지';
            break;
        case 'GAIN_WEIGHT':
            goalText = '체중 증량';
            break;
        case 'GAIN_MUSCLE':
            goalText = '근육 증량';
            break;
        default:
            goalText = '목표 없음';
            break;
    }
    return `
        <div class="flex-container">
            <div class="mypage-info-container">
                <div class="mypage-info-goal-wrapper" data-path="info">
                    <div class="mypage-info-wrapper">

                        <div class="profile-image">
                            <img src="${userBasicInfoData.imageUrl}">
                        </div>

                        <div class="info-wrapper">
                            <div class="name-wrapper">
                                <div class="name">${userBasicInfoData.name}</div>
                                <div class="icon">
                                    <img src="/user/images/icon_arrow_light_gray.png">
                                </div>
                            </div>
                            <div class="message">오늘도 힘내요!</div>
                        </div>
                    </div>

                    <div class="mypage-goal-wrapper">
                        <div class="goal-type">
                            <div class="type-title">${goalText}</div>
                            <div class="sub">나의 목표</div>
                        </div>

                        <div class="divider"></div>

                        <div class="goal-kcal">
                            <div class="kcal-amount">${Math.floor(userBasicInfoData.targetKcal)}kcal</div>
                            <div class="sub">목표 kcal</div>
                        </div>

                        <div class="divider"></div>

                        <div class="goal-streak">
                            <div class="streak-day">${userBasicInfoData.streakDay}일째</div>
                            <div class="sub">연속 기록</div>
                        </div>
                    </div>
            
                </div>
            </div>

            <!-- 추후 작업
            <div class="mypage-alarm-container option-container">
                <div class="title">알람 설정</div>
                <div class="set-time item-option" data-path="set-time">
                    <div class="option-title">식사 시간 설정</div>
                    <div class="icon"><img src="/user/images/icon_arrow_light_gray.png"></div>
                </div>
                <div class="set-alarm item-option">
                    <div class="option-title">알람 권한</div>
                    <div class="alarm-toggle"></div>
                </div>
            </div>
            --!>

            <div class="mypage-customer-service-container option-container">
                <div class="title">고객 센터</div>
                <div class="notice item-option" data-path="notice">
                    <div class="option-title">공지사항</div>
                    <div class="icon"><img src="/user/images/icon_arrow_light_gray.png"></div>
                </div>
                <!-- 추후 작업
                <div class="question item-option" data-path="question">
                    <div class="option-title">문의</div>
                    <div class="icon"><img src="/user/images/icon_arrow_light_gray.png"></div>
                </div>
                --!>
            </div>

            <div class="mypage-TermsAndPolicies-container option-container">
                <div class="title">약관 및 정책</div>
                <div class="terms-of-use item-option" data-path="terms">
                    <div class="option-title">약관 및 이용동의</div>
                    <div class="icon"><img src="/user/images/icon_arrow_light_gray.png"></div>
                </div>
                <div class="privacy-policy item-option" data-path="privacy">
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
        </div>


        <div class="button-wrapper">
            <div class="user-button-container">
                <div id="logoutButton" class="logout-button">로그아웃</div>
            </div>
            <div class="text-container">
                <div class="delete-text">회원탈퇴를 원하시면 &nbsp;</div>
                <div class="delete-button">여기</div>
                <div class="delete-text">를 클릭해 주세요.</div>
            </div>
        </div>
    `;
}

$(document).on('click', '.alarm-toggle', function () {
    $(this).toggleClass('active');

    // 상태 확인용 로그 (on/off)
    const isOn = $(this).hasClass('active');
});


$(document).on('click', '.item-option[data-path]', function () {
    const path = $(this).data('path');
    const newPath = `/users/${path}`;

    window.lastUsersPath = newPath;

    history.pushState({ view: 'users', path }, '', newPath);
    showPage(newPath);
});

$(document).on('click', '.mypage-info-goal-wrapper', function () {
    const path = $(this).data('path');
    const newPath = `/users/${path}`;

    window.lastUsersPath = newPath; 

    history.pushState({ view: 'users', path }, '', newPath);
    showPage(newPath);
});

$(document).on('click', '#logoutButton', function () {
    showPopup("#my", 4, "로그아웃 하시겠어요?", "").then((confirmed) => {
        if(confirmed) {
            $.ajax({
                url: `${window.DOMAIN_URL}/logout`,
                type: 'POST',
                success: function (res) {
                    window.location.href = "/login-page";   
                }
            });
            return;
        }
    });
});


$(document).on('click', '.delete-button', function () {
    const path = $(this).data('path');
    const newPath = `/users/withdraw`;

    window.lastUsersPath = newPath
    history.pushState({ view: 'users', path }, '', newPath);
    showPage(newPath);
});