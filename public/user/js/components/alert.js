export function initAlert($container, type) {
    const $alertContainer = $container.find('#alert');
    const $alertBg = $container.find('#alertBackground');

    let alertTemplate = '';

    switch (type) {
        case "time":
            alertTemplate = `
                <div class="alert-container">
                    <div class="alert-title">알람설정</div>

                    <div class="set-time-wrapper">
                        <div id="hourPicker" class="time-wrapper">
                            <span id="hour">08</span>
                            <div class="dropdown hour-dropdown"></div>
                        </div>

                        <div class="colon">:</div>
                        <div id="minutePicker" class="time-wrapper">
                            <span id="minute">20</span>
                            <div class="dropdown minute-dropdown"></div>
                        </div>
                    </div>

                    <div class="alert-button-container flex-row">
                        <div class="cancel-button">취소</div>
                        <div class="next-button">확인</div>
                    </div>

                </div>
            `;
            break;
    }

    $alertContainer.html(alertTemplate);

    $alertContainer.css('display', 'block');
    $alertBg.css('display', 'block');
}

function generateTimeDropdown($dropdown, type) {
    $dropdown.empty();

    let max = type === 'hour' ? 12 : 59;
    const currentValue = type === 'hour' ? $('#hour').text() : $('#minute').text();

    for (let i = 0; i <= max; i++) {
        const value = i.toString().padStart(2, '0');
        const isActive = value === currentValue ? ' active' : '';
        $dropdown.append(`<div class="dropdown-item${isActive}" data-value="${value}">${value}</div>`);
    }
}


// 열기
$(document).on('click', '#hourPicker', function () {
    $('.dropdown').hide(); // 다른 드롭다운 닫기
    $('.hour-dropdown').toggle().css('top', 'calc(100% + 8px)');
    generateTimeDropdown($('.hour-dropdown'), 'hour');
});
$(document).on('click', '#minutePicker', function () {
    $('.dropdown').hide();
    $('.minute-dropdown').toggle().css('top', 'calc(100% + 8px)');
    generateTimeDropdown($('.minute-dropdown'), 'minute');
});

// 값 선택
$(document).on('click', '.dropdown-item', function (e) {
    e.stopPropagation();
    const value = $(this).data('value');
    const $dropdown = $(this).closest('.dropdown');

    if ($dropdown.hasClass('hour-dropdown')) {
        $('#hour').text(value);
    } else if ($dropdown.hasClass('minute-dropdown')) {
        $('#minute').text(value);
    }

    $dropdown.hide();
});


$('#usersSetTime').on('click', function (e) {
    if (!$(e.target).closest('.time-wrapper, .dropdown').length) {
        $(this).find('.dropdown').hide();
    }
});