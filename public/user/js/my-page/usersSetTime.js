import { initAlert } from '../components/alert.js';

export function renderUsersSetTime() {
    return `
    <div id="alert"></div>
    <div id="alertBackground"></div>
    <div class="set-container">
        <div id="headerNav" data-title="식사 시간 설정" data-type="2"></div>
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

$(document).on('click', '.recommend-set-time-toggle', function () {
    const $toggle = $(this);
    const isOn = $toggle.hasClass('active');

    if (!isOn) {
        // 토글 ON → 추천 시간 적용
        $('.time.breakfast').each(function () {
            const $el = $(this);
            $el.data('original', $el.text()); // 기존 값 저장
            $el.addClass('disabled').text('08:00');
        });

        $('.time.lunch').each(function () {
            const $el = $(this);
            $el.data('original', $el.text());
            $el.addClass('disabled').text('13:00');
        });

        $('.time.dinner').each(function () {
            const $el = $(this);
            $el.data('original', $el.text());
            $el.addClass('disabled').text('18:00');
        });

        $toggle.addClass('active');
    } else {
        // 토글 OFF → 원래 값 복원
        $('.time.breakfast').each(function () {
            const $el = $(this);
            $el.removeClass('disabled').text($el.data('original') || '08:00');
        });

        $('.time.lunch').each(function () {
            const $el = $(this);
            $el.removeClass('disabled').text($el.data('original') || '08:00');
        });

        $('.time.dinner').each(function () {
            const $el = $(this);
            $el.removeClass('disabled').text($el.data('original') || '08:00');
        });

        $toggle.removeClass('active');
    }
});

$(document).on('click', '.time', function () {
    if (!$(this).hasClass('disabled')) {
        const timeText = $(this).text();
        const [hour, minute] = timeText.split(':');
        const $target = $(this);

        initAlert($('#usersSetTime'), "time", hour, minute, $target);
    }
});