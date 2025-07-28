export function updateButtonState(pageNumber) {
    var allValid = false;
    if(pageNumber === 1) {
        allValid = $('.input.valid').length === 1 && $('.date-box.valid').length === 3;
    } else if(pageNumber === 2) {
        allValid = $('.input.valid').length === 2;

    } else if(pageNumber === 3) {
        allValid = $('.select-item.valid').length === 1;
        
    } else if(pageNumber === 4) {
        allValid = $('.select-item.valid').length === 1;
        
    } else if(pageNumber === 5) {
        allValid = $('.select-wrapper.valid').length === 1;
    
    } else if(pageNumber === 6) {
        allValid = $('.select-item.valid').length === 1;
    }


    if (allValid) {
        $('.next-button').removeClass('disabled');
        $('.next-button').addClass('active');
    } else {
        $('.next-button').removeClass('active');
        $('.next-button').addClass('disabled');
    }
}

export function updateButtonStateFavoriteFood(pageNumber) {
    var allValid = false;
    if(pageNumber === 1) {
        allValid = $('.input.valid').length === 1 && $('.date-box.valid').length === 3;
    } else if(pageNumber === 2) {
        allValid = $('.input.valid').length === 2;

    } else if(pageNumber === 3) {
        allValid = $('.select-item.valid').length === 1;
        
    } else if(pageNumber === 4) {
        allValid = $('.select-item.valid').length === 1;
        
    } else if(pageNumber === 5) {
        allValid = $('.select-wrapper.valid').length === 1;
    
    } else if(pageNumber === 6) {
        allValid = $('.select-item.valid').length === 1;
    }


    if (allValid) {
        $('.next-button').removeClass('disabled');
        $('.next-button').addClass('active');
    } else {
        $('.next-button').removeClass('active');
        $('.next-button').addClass('disabled');
    }
}

export function validateInput($input) {
    var $inputType = $input;
    var $inputId = $inputType.attr('id');
    var value = $inputType.val().trim();
    var $wrapper = $inputType.closest('.input');
    var $parent = $inputType.closest('.input').parent();
    var nameRegex = /^[가-힣a-zA-Z\s]+$/; // 한글, 영문, 공백 허용
    var numberRegex = /^[0-9]+(\.[0-9]+)?$/; // 소수점 허용
    var errorType = null;

    // 이름 인풋 에러 처리
    if($inputId === 'name') {
        if (value.length === 0) {// 공백 입력 시 에러타입 1
            errorType = 1;
        } else if (value.length === 1 || !nameRegex.test(value)) { // 한 글자 입력 시 에러타입 2
            errorType = 2;
        } 

        if (errorType === 1) {
            $wrapper.removeClass('valid').addClass('error').attr('data-error', '1');
            showErrorMessage($parent, errorType, $inputId);
        } else if (errorType === 2) {
            $wrapper.removeClass('valid').addClass('error').attr('data-error', '2');
            showErrorMessage($parent, errorType, $inputId);
        } else {
            $wrapper.removeClass('error').addClass('valid').removeAttr('data-error');
            $parent.find('.error-wrapper').remove();  // 에러 메시지 제거
        }
    } 
    
    else if($inputId === 'height') {
        if (value.length === 0) { // 공백 입력 시 에러타입 1
            errorType = 1;
        } else if (value < 100 || !numberRegex.test(value) || value > 250) { // 키 제한 || 숫자 이외 입력시
            errorType = 2;
        }


        if (errorType === 1) {
            $wrapper.removeClass('valid').addClass('error').attr('data-error', '1');
            showErrorMessage($parent, errorType, $inputId);
        } else if (errorType === 2) {
            $wrapper.removeClass('valid').addClass('error').attr('data-error', '2');
            showErrorMessage($parent, errorType, $inputId);
        } else {
            $wrapper.removeClass('error').addClass('valid').removeAttr('data-error');
            $parent.find('.error-wrapper').remove();  // 에러 메시지 제거
        }
    }
        
    else if($inputId === 'weight') {
        if (value.length === 0) { // 공백 입력 시 에러타입 1
            errorType = 1;
        } else if (value < 10 || !numberRegex.test(value) || value > 200) { // 몸무게 제한 || 숫자 이외 입력시
            errorType = 2;
        }


        if (errorType === 1) {
            $wrapper.removeClass('valid').addClass('error').attr('data-error', '1');
            showErrorMessage($parent, errorType, $inputId);
        } else if (errorType === 2) {
            $wrapper.removeClass('valid').addClass('error').attr('data-error', '2');
            showErrorMessage($parent, errorType, $inputId);
        } else {
            $wrapper.removeClass('error').addClass('valid').removeAttr('data-error');
            $parent.find('.error-wrapper').remove();  // 에러 메시지 제거
        }
    }

    else if($inputId === 'foodName') {
        if (value.length === 0) { // 공백 입력 시 에러타입 1
            errorType = 1;
        } else if (!nameRegex.test(value)) { // 음시ㄱ 이런식으로 입력시 에러
            errorType = 2;
        }


        if (errorType === 1) {
            $wrapper.removeClass('valid').addClass('error').attr('data-error', '1');
            showErrorMessage($parent, errorType, $inputId);
        } else if (errorType === 2) {
            $wrapper.removeClass('valid').addClass('error').attr('data-error', '2');
            showErrorMessage($parent, errorType, $inputId);
        } else {
            $wrapper.removeClass('error').addClass('valid').removeAttr('data-error');
            $parent.find('.error-wrapper').remove();  // 에러 메시지 제거
        }
    }

    updateButtonState();
}

export function validateInputFavoriteFood($input) {
    var $inputType = $input;
    var $inputId = $inputType.attr('id');
    var value = $inputType.val().trim();
    var $wrapper = $inputType.closest('.input');
    var $parent = $inputType.closest('.input').parent();
    var nameRegex = /^[가-힣a-zA-Z\s]+$/; // 한글, 영문, 공백 허용
    var numberRegex = /^[0-9]+(\.[0-9]+)?$/; // 소수점 허용
    var errorType = null;

    // 
    if($inputId === 'foodName') {
        if (value.length === 0) { // 공백 입력 시 에러타입 1
            errorType = 1;
        } else if (!nameRegex.test(value)) { // 음시ㄱ 이런식으로 입력시 에러
            errorType = 2;
        }

        if (errorType === 1) {
            $wrapper.removeClass('valid').addClass('error').attr('data-error', '1');
            showErrorMessage($parent, errorType, $inputId);
        } else if (errorType === 2) {
            $wrapper.removeClass('valid').addClass('error').attr('data-error', '2');
            showErrorMessage($parent, errorType, $inputId);
        } else {
            $wrapper.removeClass('error').addClass('valid').removeAttr('data-error');
            $parent.find('.error-wrapper').remove();  // 에러 메시지 제거
        }
    }

    if($inputId === 'kcal' || $inputId === 'carbo' || $inputId === 'protein' || $inputId === 'fat') {
        if (value.length === 0) { // 공백 입력 시 에러타입 1
            errorType = 1;
        } else if (!numberRegex.test(value)) { // 음시ㄱ 이런식으로 입력시 에러
            errorType = 2;
        }

        if (errorType === 1) {
            $wrapper.removeClass('valid').addClass('error').attr('data-error', '1');
            showErrorMessage($parent, errorType, $inputId);
        } else if (errorType === 2) {
            $wrapper.removeClass('valid').addClass('error').attr('data-error', '2');
            showErrorMessage($parent, errorType, $inputId);
        } else {
            $wrapper.removeClass('error').addClass('valid').removeAttr('data-error');
            $parent.find('.error-wrapper').remove();  // 에러 메시지 제거
        }
    }


    if($inputId === 'foodWeight') {
        if (value.length === 0) { // 공백 입력 시 에러타입 1
            errorType = 1;
        } if (!numberRegex.test(value)) { // 음시ㄱ 이런식으로 입력시 에러
            errorType = 2;
        }

        if (errorType === 1) {
            $wrapper.removeClass('valid').addClass('error').attr('data-error', '1');
            showErrorMessage($parent, errorType, $inputId);
        } else if (errorType === 2) {
            $wrapper.removeClass('valid').addClass('error').attr('data-error', '2');
            showErrorMessage($parent, errorType, $inputId);
        } else {
            $wrapper.removeClass('error').addClass('valid').removeAttr('data-error');
            $parent.find('.error-wrapper').remove();  // 에러 메시지 제거
        }
    }

    updateButtonStateFavoriteFood();
}


export function showErrorMessage($wrapper, errorType, inputId) {
    $wrapper.find('.error-wrapper').remove();

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

    //[height input]인 경우
    if (inputId === 'height') {
        // 에러 메시지 설정
        switch (errorType) {
            case 1:
                errorMessage = '필수 항목이에요';
                break;
            case 2:
                errorMessage = '키를 다시 확인해주세요';
                break;
        }
    }

    //[weight input]인 경우
    if (inputId === 'weight') {
        // 에러 메시지 설정
        switch (errorType) {
            case 1:
                errorMessage = '필수 항목이에요';
                break;
            case 2:
                errorMessage = '몸무게를 다시 확인해주세요';
                break;
        }
    }

    if (inputId === 'foodName') {
        // 에러 메시지 설정
        switch (errorType) {
            case 1:
                errorMessage = '필수 항목이에요';
                break;
            case 2:
                errorMessage = '음식 이름을 다시 확인해주세요';
                break;
        }
    }

    if (inputId === 'kcal') {
        // 에러 메시지 설정
        switch (errorType) {
            case 1:
                errorMessage = '필수 항목이에요';
                break;
            case 2:
                errorMessage = '칼로리를 다시 확인해주세요';
                break;
        }
    }

    if (inputId === 'carbo') {
        // 에러 메시지 설정
        switch (errorType) {
            case 1:
                errorMessage = '필수 항목이에요';
                break;
            case 2:
                errorMessage = '탄수화물을 다시 확인해주세요';
                break;
        }
    }

    if (inputId === 'protein') {
        // 에러 메시지 설정
        switch (errorType) {
            case 1:
                errorMessage = '필수 항목이에요';
                break;
            case 2:
                errorMessage = '단백질를 다시 확인해주세요';
                break;
        }
    }

    if (inputId === 'fat') {
        // 에러 메시지 설정
        switch (errorType) {
            case 1:
                errorMessage = '필수 항목이에요';
                break;
            case 2:
                errorMessage = '지방 다시 확인해주세요';
                break;
        }
    }

    if (inputId === 'foodWeight') {
        // 에러 메시지 설정
        switch (errorType) {
            case 1:
                errorMessage = '필수 항목이에요';
                break;
            case 2:
                errorMessage = '무게를 다시 확인해주세요';
                break;
        }
    }

    // 에러 메시지 추가
    $wrapper.append(
        '<div class="error-wrapper">' +
            '<div class="error-icon">' + 
                '<img src="/user/images/icon_warning.png">' + 
            '</div>' + 
            '<div class="error-message">' + errorMessage + '</div>' + 
        '</div>'
    );
}


export function checkInput($input) {
    var $inputType = $input;
    var $inputId = $inputType.attr('id');
    var value = $inputType.val();
    var $wrapper = $inputType.closest('.input');
    // console.log(value);

    if (value !== null && value !== undefined && String(value).length > 0) {
        $wrapper.addClass('valid');
    }
}