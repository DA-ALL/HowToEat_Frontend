export function updateButtonState() {
    var allValid = $('.input.valid').length === 1 && 
                   $('.date-box.valid').length === 3;

    if (allValid) {
        $('.next-button').addClass('active');
    } else {
        $('.next-button').removeClass('active');
    }
}

export function validateInput($input) {
    var $inputType = $input;
    var $inputId = $inputType.attr('id');
    var value = $inputType.val().trim();
    var $wrapper = $inputType.closest('.input');
    var $parent = $inputType.closest('.input').parent();
    var nameRegex = /^[가-힣a-zA-Z\s]+$/; // 한글, 영문, 공백 허용
    var errorType = null;


    if (value.length === 0) {
        // 공백 입력 시 에러타입 1
        errorType = 1;
    } else if (value.length === 1 || !nameRegex.test(value)) {
        // 한 글자 입력 시 에러타입 2
        errorType = 2;
    } 

    // 이름 인풋 에러 처리
    if($inputId === 'name') {
        if (errorType === 1) {
            $wrapper.removeClass('valid').addClass('error').attr('data-error', '1');
            showErrorMessage($parent, errorType, $inputId);
        } else if (errorType === 2) {
            $wrapper.removeClass('valid').addClass('error').attr('data-error', '2');
            showErrorMessage($parent, errorType, $inputId);
        } else {
            $wrapper.removeClass('error').addClass('valid').removeAttr('data-error');
            $parent.find('.error-message').remove();  // 에러 메시지 제거
        }
    }

    updateButtonState();
}


export function showErrorMessage($wrapper, errorType, inputId) {
    $wrapper.find('.error-message').remove();

    var errorMessage = '';

    //[name input]인 경우
    if (inputId === 'name') {
        // 에러 메시지 설정
        switch (errorType) {
            case 1:
                errorMessage = '필수 항목이에요.';
                break;
            case 2:
                errorMessage = '이름을 다시 확인해주세요.';
                break;
        }
    }

    // 에러 메시지 추가
    $wrapper.append('<div class="error-message">' + errorMessage + '</div>');
}


export function checkInput($input) {
    var $inputType = $input;
    var $inputId = $inputType.attr('id');
    var value = $inputType.val();
    var $wrapper = $inputType.closest('.input');

    console.log(value);

    if(value.length > 0) {
        $wrapper.addClass('valid');
    }
}