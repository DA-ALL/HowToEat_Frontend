$(document).ready(function () {
    $('#survey').html(`
        <div class="survey-title">
            아래의 정보가 맞나요?
        </div>

        <div class="input-container">
            <div class="input-wrapper">
                <div class="input-label">이름</div>
                <div class="input">
                    <input type="text" id="name" name="name" placeholder="이름" ime-mode="active" data-text="">
                </div>
            </div>

            <div class="input-wrapper">
                <div class="input-label">생년월일</div>
                
                <div class="date-picker">
                    <div class="date-box" id="year-box">
                        <span id="year-text" data-text="">년도</span>
                        <div class="dropdown" id="year-dropdown"></div>
                    </div>
                    <div class="date-box" id="month-box">
                        <span id="month-text" data-text="">월</span>
                        <div class="dropdown" id="month-dropdown"></div>
                    </div>
                    <div class="date-box" id="day-box">
                        <span id="day-text" data-text="">일</span>
                        <div class="dropdown" id="day-dropdown"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="button-container">
            <div class="next-button">다음</div>
        </div>
    `);

    function updateButtonState() {
        var nameValue = $('#name').attr('data-text').trim();
        var yearValue = $('#year-text').attr('data-text').trim();
        var monthValue = $('#month-text').attr('data-text').trim();
        var dayValue = $('#day-text').attr('data-text').trim();

        if (nameValue && yearValue && monthValue && dayValue) {
            $('.next-button').addClass('active');
        } else {
            $('.next-button').removeClass('active');
        }
    }

    // 이름 입력 시 data-text 업데이트 및 버튼 상태 확인
    $('#name').on('input', function() {
        var value = $(this).val();
        $(this).attr('data-text', value);
        updateButtonState();
    });

    // 년도 드롭다운 채우기
    var currentYear = new Date().getFullYear();
    for (var year = 1950; year <= currentYear; year++) {
        $('#year-dropdown').append('<div class="dropdown-item" data-value="' + year + '">' + year + '년</div>');
    }

    // 월 드롭다운 채우기
    for (var month = 1; month <= 12; month++) {
        $('#month-dropdown').append('<div class="dropdown-item" data-value="' + month + '">' + month + '월</div>');
    }

    // 일 드롭다운 미리 채우기 (기본 1~31일)
    function populateDays(days) {
        $('#day-dropdown').empty();
        for (var day = 1; day <= days; day++) {
            $('#day-dropdown').append('<div class="dropdown-item" data-value="' + day + '">' + day + '일</div>');
        }
    }
    populateDays(31); // 기본 31일까지 표시

    // 월 선택 시 해당 월의 최대 일수를 반영
    function updateDays() {
        var selectedMonth = parseInt($('#month-text').attr('data-text')) || 0;
        var selectedYear = parseInt($('#year-text').attr('data-text')) || 0;
        var daysInMonth = 31; // 기본값

        if (selectedMonth === 2) { // 2월 처리 (윤년 고려)
            if (selectedYear && ((selectedYear % 4 === 0 && selectedYear % 100 !== 0) || selectedYear % 400 === 0)) {
                daysInMonth = 29;
            } else {
                daysInMonth = 28;
            }
        } else if ([4, 6, 9, 11].includes(selectedMonth)) { // 30일인 달
            daysInMonth = 30;
        }

        populateDays(daysInMonth); // 날짜 갱신
    }

    // 날짜 선택 후 텍스트 및 data-text 업데이트 후 버튼 상태 확인
    $(document).on('click', '.dropdown-item', function() {
        var value = $(this).data('value');
        var parentBox = $(this).closest('.date-box');
        parentBox.removeClass('open');

        if (parentBox.attr('id') === 'year-box') {
            $('#year-text').text(value + '년').attr('data-text', value);
        } else if (parentBox.attr('id') === 'month-box') {
            $('#month-text').text(value + '월').attr('data-text', value);
            updateDays(); // 월이 변경되면 일 업데이트
        } else if (parentBox.attr('id') === 'day-box') {
            $('#day-text').text(value + '일').attr('data-text', value);
        }

        updateButtonState();
    });

    // 날짜 박스 열기/닫기
    $('.date-box').on('click', function() {
        $('.date-box').removeClass('open');
        $(this).toggleClass('open');
    });

    $(document).on('click', function(event) {
        if (!$(event.target).closest('.date-picker').length) {
            $('.date-box').removeClass('open'); // 모든 날짜 박스 닫기
        }
    });

});