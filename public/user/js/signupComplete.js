$(document).ready(function () {
    showWelcomeMessage();
    launchConfetti();
});

// "환영합니다" 문구 표시
function showWelcomeMessage() {
    $("#signupComplete").html(getWelcomeTemplate());
    setTimeout(showNextMessage, 3000); // 3초 후 다음 단계로
}

// "김예현님의 목표 달성을 위해선" 문구 표시
function showNextMessage() {
    $(".welcome-text").fadeOut(1000, function () {
        $(this).replaceWith(getGoalTemplate());
        $(".goal-text-wrapper").hide().fadeIn(1000, startKcalAnimation);
    });
}

const getWelcomeTemplate = () => `<div class="welcome-text">환영합니다</div>`;

const getGoalTemplate = () => `
    <div class="goal-text-container">
        <div class="goal-text-wrapper">
            <div class="goal-text-name">김예현</div>
            <div class="goal-text">님의 목표 달성을 위해선</div>
        </div>
        <div class="goal-kcal-wrapper"></div>
        <div class="goal-text-sub"></div>
    </div>
`;

// 숫자 증가 애니메이션 (처음에는 빠르게, 끝에서는 천천히)
function startKcalAnimation() {
    let targetValue = 2562, duration = 3000, startTime = performance.now();

    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -15 * t);
    }

    function formatNumberWithComma(number) {
        return number.toLocaleString(); // 천단위 콤마 추가
    }

    function updateNumber(currentTime) {
        let progress = Math.min((currentTime - startTime) / duration, 1);
        let currentValue = Math.floor(easeOutExpo(progress) * targetValue);

        $(".kcal").text(formatNumberWithComma(currentValue) + " Kcal");

        if (progress < 1) requestAnimationFrame(updateNumber);
        else setTimeout(showSubText, 600);
    }

    $(".goal-text-container .goal-kcal-wrapper").append(`<div class="kcal">0 Kcal</div>`);
    requestAnimationFrame(updateNumber);
}

// "가 필요해요" 문구 표시
function showSubText() {
    $(".goal-text-container .goal-text-sub").append(`<div class="sub-text">가 필요해요</div>`).find(".sub-text").hide().fadeIn(1000, function() {
        // "가 필요해요" 애니메이션 끝난 후 goal-text-container fadeOut
        setTimeout(fadeOutGoalText, 1000); // 2초 후 goal-text-container fadeOut
    });
}

function fadeOutGoalText() {
    $(".goal-text-wrapper, .sub-text").fadeOut(1000, function () {
        // goal-text-container가 사라진 후 getGoalTemplate2를 삽입
        $(".goal-text-wrapper").html(getGoalTemplate2());
        $(".goal-text-sub").html(getGoalTemplate3());
        $(".goal-text-wrapper").hide().fadeIn(1000); // 새로운 문구 애니메이션
        $(".goal-text-sub").hide().fadeIn(1000); // 새로운 문구 애니메이션
    });
}

// 새로운 템플릿 (하잇과 함께해요 추가)
const getGoalTemplate2 = () => `
    <div class="goal-text-name">하잇</div>
    <div class="goal-text">과 함께라면</div>
    
`;

// 새로운 템플릿 (하잇과 함께해요 추가)
const getGoalTemplate3 = () => `
    <div class="sub-text">매일 건강하게 채울 수 있어요</div>
`;

// 콘페티 효과
function launchConfetti() {
    confetti({
        startVelocity: 40,
        spread: 120,
        ticks: 260,
        gravity: 0.7,
        origin: { y: 0.6 },
        particleCount: 80
    });
}