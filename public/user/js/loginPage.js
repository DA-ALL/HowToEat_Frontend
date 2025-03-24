$(document).ready(function () {
    //카카오 로그인
    $("#SS0-KAKAO").on("click", function() {
        console.log("kakao 로그인");
        window.location.href = '/survey?page=1';
    });

    //네이버 로그인
    $("#SS0-NAVER").on("click", function() {
        console.log("naver 로그인");
        window.location.href = '/survey?page=1';
    });

    //애플 로그인
    $("#SS0-APPLE").on("click", function() {
        console.log("apple 로그인");
        window.location.href = '/survey?page=1';
    });
});