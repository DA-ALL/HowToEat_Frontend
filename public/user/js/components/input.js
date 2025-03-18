export function validateNameInput() {
    var $input = $('#name');
    var value = $input.val().trim();
    var $wrapper = $input.closest('.input');
    var $parent = $input.closest('.input').parent();
    var nameRegex = /^[가-힣a-zA-Z\s]+$/; // 한글, 영문, 공백 허용
    var errorType = null;
    
    // 공백 입력 시 에러타입 1
    if (value.length === 0) {
        errorType = 1;
    }
    // 한 글자 입력 시 에러타입 2
    else if (value.length === 1) {
        errorType = 2;
    } else if(!/^[가-힣]+$/.test(value)) {
        errorType = 4;
    // 숫자나 특수문자 포함 시 에러타입 3
    } else if (!nameRegex.test(value)) {
        errorType = 3;
    }
    
    // 에러 처리
    if (errorType === 1) {
        $wrapper.removeClass('valid').addClass('error').attr('data-error', '1');
        showErrorMessage($parent, 1);
    } else if (errorType === 2) {
        $wrapper.removeClass('valid').addClass('error').attr('data-error', '2');
        showErrorMessage($parent, 2);
    } else if (errorType === 3) {
        $wrapper.removeClass('valid').addClass('error').attr('data-error', '3');
        showErrorMessage($parent, 3);
    } else if (errorType === 4) {
        $wrapper.removeClass('valid').addClass('error').attr('data-error', '4');
        showErrorMessage($parent, 4);
    } else {
        $wrapper.removeClass('error').addClass('valid').removeAttr('data-error');
        $wrapper.find('.error-message').remove();  // 에러 메시지 제거
    }

    updateButtonState();
}

$(document).on('blur', '#name', function() {
    validateNameInput();
});

function showErrorMessage($wrapper, errorType) {
    $wrapper.find('.error-message').remove();

    var errorMessage = '';
    switch (errorType) {
        case 1:
            errorMessage = '필수 항목이에요';
            break;
        case 2:
            errorMessage = '이름을 다시 확인해주세요';
            break;
        case 3:
            errorMessage = '숫자나 특수문자는 사용이 불가능해요';
            break;
        case 4:
            errorMessage = '이름을 다시 확인해주세요';
            break;
    }

    $wrapper.append('<div class="error-message">' + errorMessage + '</div>');
}
function updateButtonState() {
    var allValid = $('.input.valid').length === 1 && 
                   $('.date-box.valid').length === 3;

    if (allValid) {
        $('.next-button').addClass('active');
    } else {
        $('.next-button').removeClass('active');
    }
}