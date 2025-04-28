import { updateButtonState, validateInput, checkInput } from '/user/js/components/input-validate.js';

export function renderUsersInfo() {
    let goal = "체중감량";
    let height = 176;
    let weight = 74;
    let activity = "very-active";
    // 유틸 함수로 valid 클래스 조건 처리
    const isValid = (label) => goal === label ? 'valid' : '';
    const isActivityValid = (label) => activity === label ? 'valid' : '';

    return `
        <div id="headerNav" data-title="나의 정보" data-type="2"></div>
        <div class="profile-container">
            <div class="profile-image">
                <img class="new-image" src="">
                <img class="preview-image" src="/user/images/icon_human_red.png">
                <input type="file" accept="image/*" class="profile-image-input" style="display: none;">
            </div>
            <div class="profile-name">김예현</div>
            <div class="profile-email">insidesy4@gmail.com</div>
        </div>

        <div class="goal-container container-format">
            <div class="info-title">나의 목표</div>
            <div class="select-container inner-container-format">
                <div class="select-item weight-loss ${isValid("체중감량")}" data-text="1">체중 감량</div>
                <div class="select-item weight-maintain ${isValid("체중유지")}" data-text="2">체중 유지</div>
                <div class="select-item weight-gain ${isValid("체중증량")}" data-text="3">체중 증량</div>
                <div class="select-item muscle-gain ${isValid("근육증량")}" data-text="4">근육 증량</div>
            </div>
        </div>

        <div class="body-stats-container container-format">
            <div class="info-title">나의 키와 몸무게</div>
            <div class="input-container inner-container-format">
                <div class="input-wrapper">
                    <div class="input-label">키</div>
                    <div class="input">
                        <input type="number" inputmode="numeric" id="height" name="height" placeholder="키" ime-mode="active" data-text="" value=${height}>
                    </div>
                </div>

                <div class="input-wrapper">
                    <div class="input-label">몸무게</div>
                    <div class="input">
                        <input type="number" inputmode="numeric" id="weight" name="weight" placeholder="몸무게" ime-mode="active" data-text="" value=${weight}>
                    </div>
                </div>
            </div> 
        </div>

        <div class="activity-container container-format">
            <div class="info-title">나의 활동량</div>
            <div class="select-container activity inner-container-format">
                <div class="select-wrapper very-active ${isActivityValid("very-active")}" data-text="5">
                    <div class="main-text">매우 활동적</div>
                    <div class="sub-text">주 6~7회 이상 고강도 운동 (운동 선수) <br> 업무 형태가 활동적</div>
                </div>
                <div class="select-wrapper active ${isActivityValid("active")}" data-text="4">
                    <div class="main-text">활동적</div>
                    <div class="sub-text">주 4~6회 운동 (웨이트 트레이닝) <br> 주 150분 이상 유산소 운동</div>
                </div>
                <div class="select-wrapper moderate ${isActivityValid("moderate")}" data-text="3">
                    <div class="main-text">보통</div>
                    <div class="sub-text">주 2~3회 운동 (유산소 + 웨이트 트레이닝)</div>
                </div>
                <div class="select-wrapper low ${isActivityValid("low")}" data-text="2">
                    <div class="main-text">적음</div>
                    <div class="sub-text">주 2회 미만의 운동 <br> 웨이트 트레이닝 / 유산소 운동 선택적 진행</div>
                </div>
                <div class="select-wrapper very-low ${isActivityValid("very-low")}" data-text="1">
                    <div class="main-text">매우 적음</div>
                    <div class="sub-text">평소 운동을 하지 않음 <br> 업무 형태가 주로 앉아서 진행</div>
                </div>
            </div>
        </div>

        <div class="button-container">
            <div class="next-button disabled">수정하기</div>
        </div>
    `;
}


// 이미지 클릭 시 파일 선택창 열기
$(document).on('click', '.profile-image', function (e) {
    const $input = $(this).find('.profile-image-input');
    if ($input.length > 0) {
        $input[0].click(); // 직접 DOM 메서드 호출 (trigger 보다 안전)
    }
    e.stopPropagation(); // 꼭 버블 차단
});

// 이미지 선택 시 미리보기 렌더링
$(document).off('change', '.profile-image-input').on('change', 'profile-image-input', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const $container = $(this).closest('.profile-image');
    const $newImage = $container.find('.new-image');
    const $previewImage = $container.find('.preview-image');

    reader.onload = () => {
        $newImage.attr('src', reader.result).show();
        $previewImage.hide();
    };

    reader.readAsDataURL(file);
});

// 나의 키와 몸무게
let originalInputValue = {};

$(document).on('click', '.goal-container .select-item', function () {
    $('.goal-container .select-item').removeClass('valid');
    $(this).addClass('valid');
    updateNextButtonState();
});

$(document).on('click', '.select-wrapper', function () {
    $('.select-wrapper').removeClass('valid');
    $(this).addClass('valid');
    updateNextButtonState();

    // updateButtonState(currentPage);
});


//키와 몸무게 인풋 확인 함수
export function bindUsersInfoEvents() {
    const originalInputValue = {};

    // focus 시 원래 값 저장
    $('input').off('focus').on('focus', function () {
        const id = $(this).attr('id');
        originalInputValue[id] = $(this).val();
    });

    // blur 시 실제 값이 바뀐 경우에만 처리
    $('input').off('blur').on('blur', function () {
        const $input = $(this);
        const id = $input.attr('id');
        const currentVal = $input.val();

        if (originalInputValue[id] !== currentVal) {
            validateInput($input);
            updateNextButtonState();
        }
    });

    // 진입 시점에 이미 값이 있으면 valid 처리
    checkInput($('#height'));
    checkInput($('#weight'));

    // 버튼 상태도 초기 상태 기준으로 업데이트
    // updateNextButtonState();
}


function updateNextButtonState() {
    const $goalValid = $('.goal-container .select-container .valid').length >= 1;
    const $activityValid = $('.activity-container .select-container .valid').length >= 1;

    const $heightInput = $('#height').closest('.input');
    const $weightInput = $('#weight').closest('.input');
    const $bodyStatsValid = $heightInput.hasClass('valid') && $weightInput.hasClass('valid') &&
                            !$heightInput.hasClass('error') && !$weightInput.hasClass('error');

    const $nextButton = $('.next-button');

    if ($goalValid && $bodyStatsValid && $activityValid) {
        $nextButton.removeClass('disabled').addClass('active');
    } else {
        $nextButton.removeClass('active').addClass('disabled');
    }
}