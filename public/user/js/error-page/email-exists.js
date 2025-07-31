import { initHeaderNav } from '/user/js/components/header-nav.js';

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const provider = urlParams.get("provider");

    $('#emailExistsPage').html(renderEmailExists(provider));
    initHeaderNav();

    $("#SS0-KAKAO").on("click", function() {
        window.location.href = `${window.DOMAIN_URL}/oauth2/authorization/kakao`;
    });

    //네이버 로그인
    $("#SS0-NAVER").on("click", function() {
        window.location.href = `${window.DOMAIN_URL}/oauth2/authorization/naver`;
    });

    //애플 로그인
    $("#SS0-APPLE").on("click", function() {
        window.location.href = `${window.DOMAIN_URL}/oauth2/authorization/apple`;
    });
});


function renderEmailExists(provider) {
    const providerTextMap = {
        APPLE: '애플 로그인',
        KAKAO: '카카오 로그인',
        NAVER: '네이버 로그인',
    };

    const buttonHTMLMap = {
        APPLE: `
            <div id="SS0-APPLE" class="SSO-button apple">
                <div class="sso-logo"><img class="apple" src="/user/images/logo_apple.png"></div>
                <div class="sso-name apple">Apple로 로그인</div>
            </div>
        `,
        KAKAO: `
            <div id="SS0-KAKAO" class="SSO-button kakao">
                <div class="sso-logo"><img class="kakao" src="/user/images/logo_kakao.png"></div>
                <div class="sso-name kakao">카카오로 로그인</div>
            </div>
        `,
        NAVER: `
            <div id="SS0-NAVER" class="SSO-button naver">
                <div class="sso-logo"><img class="naver" src="/user/images/logo_naver.png"></div>
                <div class="sso-name naver">네이버로 로그인</div>
            </div>
        `
    };

    const providerText = providerTextMap[provider] || '소셜 로그인';
    const buttonHTML = buttonHTMLMap[provider] || '';

    return `
        <div id="headerNav" class="survey-form" data-title="" data-type="2"></div>

        <div id="emailExistsContainer">

        <div class="title-wrapper">
            <div class="title">이미 가입한 이메일입니다.</div>

            <div class="description-wrapper">
                <div class="description default">해당 이메일 주소는 이미 다른 경로로<br>회원가입이 완료된 상태입니다.</div>
                <div class="description default">회원님이 가입하신 경로는<br><span class="bold">${providerText}</span> 입니다.</div>
            </div>
            </div>

            <div id="SSO-LOGIN">
                ${buttonHTML}
            </div>
        </div>
    `;
}
