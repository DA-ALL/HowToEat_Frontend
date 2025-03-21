$(document).ready(function () {
    showWelcomeMessage();
    triggerConfettiEffect();
});

function showWelcomeMessage() {
    $("#signupComplete").html(createWelcomeMessage());
    setTimeout(showGoalMessage, 3000);
}

function showGoalMessage() {
    $(".welcome-text").fadeOut(1000, function () {
        $(this).replaceWith(createGoalMessage());
        $(".goal-text-container").hide().fadeIn(2000, animateKcalCounter);
    });
}

const createWelcomeMessage = () => `<div class="welcome-text">환영합니다</div>`;

const createGoalMessage = () => `
    <div class="goal-text-container">
        <div class="goal-text-wrapper">
            <div class="goal-text-name">김예현</div>
            <div class="goal-text">님의 목표 달성을 위해선</div>
        </div>
        <div class="goal-kcal-wrapper"></div>
        <div class="goal-text-sub"></div>
    </div>
`;

function animateKcalCounter() {
    let targetValue = 2562, duration = 2500, startTime = performance.now();

    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -15 * t);
    }

    function updateCounter(currentTime) {
        let progress = Math.min((currentTime - startTime) / duration, 1);
        let currentValue = Math.floor(easeOutExpo(progress) * targetValue);
        $(".kcal").text(formatNumber(currentValue) + " Kcal");
        if (progress < 1) requestAnimationFrame(updateCounter);
        else setTimeout(showAdditionalMessage, 600);
    }

    $(".goal-text-container .goal-kcal-wrapper").append(`<div class="kcal">0 Kcal</div>`);
    requestAnimationFrame(updateCounter);
}

function formatNumber(number) {
    return number.toLocaleString();
}

function showAdditionalMessage() {
    $(".goal-text-container .goal-text-sub").append(`<div class="sub-text">가 필요해요</div>`)
        .find(".sub-text").hide().fadeIn(1000, function() {
            setTimeout(fadeOutGoalSection, 500);
        });
}

function fadeOutGoalSection() {
    $(".goal-text-wrapper, .sub-text").fadeOut(1000, function () {
        $(".goal-text-wrapper").html(createMotivationMessage1());
        $(".goal-text-sub").html(createMotivationMessage2());
        $(".goal-text-wrapper, .goal-text-sub").hide().fadeIn(1000);
    });
    setTimeout(fadeOutFinalMessage, 4000);
}

function fadeOutFinalMessage() {
    $(".goal-text-wrapper, .sub-text").fadeOut(1000, function () {
        $(".goal-text-wrapper").html(createFinalMessage1());
        $(".goal-text-sub").html(createFinalMessage2());
        $(".goal-text-wrapper, .goal-text-sub").hide().fadeIn(1000);
    });
}

const createMotivationMessage1 = () => `
    <div class="goal-text-name">하잇</div>
    <div class="goal-text">과 함께라면</div>
`;

const createMotivationMessage2 = () => `<div class="sub-text">매일 건강하게 채울 수 있어요</div>`;

const createFinalMessage1 = () => `
    <div class="goal-text-name">김예현</div>
    <div class="goal-text">님의 건강한 목표달성을 위해</div>
`;

const createFinalMessage2 = () => `<div class="sub-text">하잇과 함께 끝까지 노력해요!</div>`;

function triggerConfettiEffect() {
    confetti({
        startVelocity: 40,
        spread: 120,
        ticks: 260,
        gravity: 0.7,
        origin: { y: 0.55 },
        particleCount: 80
    });
}