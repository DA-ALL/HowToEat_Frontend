//연과 월에 따라 일 변경
export function updateDays() {
    var selectedMonth = parseInt($('#month-text').attr('data-text')) || 0;
    var selectedYear = parseInt($('#year-text').attr('data-text')) || 0;
    var daysInMonth = 31;

    if (selectedMonth === 2) {
        if (selectedYear && ((selectedYear % 4 === 0 && selectedYear % 100 !== 0) || selectedYear % 400 === 0)) {
            daysInMonth = 29;
        } else {
            daysInMonth = 28;
        }
    } else if ([4, 6, 9, 11].includes(selectedMonth)) {
        daysInMonth = 30;
    }

    populateDays(daysInMonth);
}

//연과 월에 따라 변경된 일을 다시 채워주는 함수
export function populateDays(days) {
    $('#day-dropdown').empty();
    for (var day = 1; day <= days; day++) {
        $('#day-dropdown').append('<div class="dropdown-item" data-value="' + day + '">' + day + '일</div>');
    }
}

//클릭 시 드롭다운 토글 나오도록 하는 함수
export function birthDropDown() {
    var currentYear = new Date().getFullYear();
    for (var year = 1950; year <= currentYear; year++) {
        $('#year-dropdown').append('<div class="dropdown-item" data-value="' + year + '">' + year + '년</div>');
    }
    
    for (var month = 1; month <= 12; month++) {
        $('#month-dropdown').append('<div class="dropdown-item" data-value="' + month + '">' + month + '월</div>');
    }
    
    $('.date-box').on('click', function () {
        $('.date-box').removeClass('open');
        $(this).toggleClass('open');
    });

    $('.date-box span').on('blur', function () {
        validateDateInput($(this));
    });
}

// 올바른 날짜 선택 시, valid 클래스 추가, 에러시 error 클래스 추가
export function validateDateInput($element) {
    if($element != undefined) {
        var value = $element.attr('data-text').trim();
        var $wrapper = $element.closest('.date-box');
        if (value) {
            $wrapper.addClass('valid');
        }

    }
}