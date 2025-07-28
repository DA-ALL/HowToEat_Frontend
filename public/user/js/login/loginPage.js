$(document).ready(function () {
    //카카오 로그인
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

    // 로그인 페이지 진입 시, 토큰 삭제 처리
    if (window.location.pathname.includes('login-page')) {
        localStorage.removeItem("Authorization");
    }
});