import { setupAjaxAuthInterceptor } from '../utils/auth-interceptor.js';

$(document).ready(async function () {
    setupAjaxAuthInterceptor();

    const data = await getUserBasicInfoData();
    showWelcomeMessage(data);
    triggerConfettiEffect();

    $(".next-button.signup").on('click', function(){
        window.location.href = '/main';
    });
});

function showWelcomeMessage(data) {
    $("#signupComplete").html(createWelcomeMessage());
    setTimeout(function () {
        showGoalMessage(data);
    }, 3000);
}

function showGoalMessage(data) {
    let name = data.name;
    $(".welcome-text").fadeOut(1000, function () {
        $(this).replaceWith(createGoalMessage(name));
        $(".goal-text-container").hide().fadeIn(2000, function () {
            animateKcalCounter(data);
        });
        
    });
}

const createWelcomeMessage = () => `<div class="welcome-text">환영합니다</div>`;

const createGoalMessage = (name) => `
    <div class="goal-text-container">
        <div class="goal-text-wrapper">
            <div class="goal-text-name">${name}</div>
            <div class="goal-text">님의 목표 달성을 위해선</div>
        </div>
        <div class="goal-kcal-wrapper"></div>
        <div class="goal-text-sub"></div>
    </div>
`;

function animateKcalCounter(data) {
    let targetValue = data.targetKcal, duration = 3000, startTime = performance.now();

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
        $(".goal-text-wrapper, .goal-text-sub").hide().fadeIn(1000, function () {
            setTimeout(showFinalButton, 2000);
        });
    });
}


function buttonTemplate() {
    return `
        <div class="button-container bottom">
            <div class="next-button signup">식단 관리하러 가기</div>
        </div>
    `;
}

function showFinalButton() {
    console.log("button");
    const $button = $(buttonTemplate()).hide(); // 버튼을 숨긴 상태에서 생성
    $('#signupComplete').append($button);
    $button.fadeIn(1000); // 1초 동안 서서히 나타나도록 설정

    $(document).on('click', '.next-button.signup', function () {
        window.location.href = '/main';
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

async function getUserBasicInfoData() {
    try {
        const response = await $.ajax({ type: "GET", url: `${window.DOMAIN_URL}/users/basic-info`, contentType: "application/json"});
        return response.data;
    } catch (err) {
        console.log(err);
    }
}