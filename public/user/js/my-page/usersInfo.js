import { updateButtonState, validateInput, checkInput } from '/user/js/components/input-validate.js';
import { showNumericInput } from '/user/js/components/numericInput.js';

export function renderUsersInfo(callback) {
    const userDetailInfo = $.ajax({
        method: "GET",
        url: `${window.DOMAIN_URL}/users/detail-info`,
    });

    $.when(userDetailInfo).done(function (userDetailInfoRes) {
        const userDetailInfoData = userDetailInfoRes.data;
        const userInfoPageHTML = renderMyPageHTML(userDetailInfoData);
        console.log(userDetailInfoData)
        callback(userInfoPageHTML);
    });

}



let initialGoal = null;
let initialActivity = null;

function renderMyPageHTML(userDetailInfoData) {
    initialGoal = userDetailInfoData.userGoal;
    initialActivity = userDetailInfoData.userActivityLevel;

    let goal = initialGoal;
    let activity = initialActivity;
    // 유틸 함수로 valid 클래스 조건 처리
    const isValid = (label) => goal === label ? 'valid' : '';
    const isActivityValid = (label) => activity === label ? 'valid' : '';
    const image = userDetailInfoData.imageUrl != null ? userDetailInfoData.imageUrl : '/user/images/icon_human_red.png';

    return `
        <div id="headerNav" data-title="나의 정보" data-type="2"></div>
        <div class="profile-container">
            <div class="profile-image">
                <img class="new-image" src="">
                <img class="preview-image" src="${image}">
                <input type="file" accept="image/*" class="profile-image-input" style="display: none;">
            </div>
            <div class="profile-name">${userDetailInfoData.name}</div>
            <div class="profile-email">${userDetailInfoData.email}</div>
        </div>

        <div class="body-stats-container container-format">
            <div class="info-title">나의 키와 몸무게</div>

            <div class="select-container inner-container-format">
                <div class="body-stat-wrapper">
                    <div class="input-label">키</div>
                    <div class="select-item numeric-input-view" data-text="1" data-type="height">${userDetailInfoData.height}cm</div>
                </div>

                <div class="body-stat-wrapper">
                    <div class="input-label">몸무게</div>
                    <div class="select-item numeric-input-view" data-text="2" data-type="weight">${userDetailInfoData.weight}kg</div>
                </div>
                
            </div>

            <!--
            <div class="input-container inner-container-format">
                <div class="input-wrapper">
                    <div class="input-label">키</div>
                    <div class="input">
                        <input type="text" inputmode="decimal" id="height" name="height" placeholder="키" maxlength="5" data-text="">
                    </div>
                </div>

                <div class="input-wrapper">
                    <div class="input-label">몸무게</div>
                    <div class="input">
                        <input type="text" inputmode="decimal" id="weight" name="weight" placeholder="몸무게" maxlength="5" data-text="">
                    </div>
                </div>
            </div> 
            --!>

            
        </div>


        <div class="goal-container container-format">
            <div class="info-title">나의 목표</div>
            <div class="select-container my-goal inner-container-format">
                <div class="select-item weight-loss ${isValid("LOSE_WEIGHT")}" data-text="LOSE_WEIGHT">체중 감량</div>
                <div class="select-item weight-maintain ${isValid("MAINTAIN_WEIGHT")}" data-text="MAINTAIN_WEIGHT">체중 유지</div>
                <div class="select-item weight-gain ${isValid("GAIN_WEIGHT")}" data-text="GAIN_WEIGHT">체중 증량</div>
                <div class="select-item muscle-gain ${isValid("GAIN_MUSCLE")}" data-text="GAIN_MUSCLE">근육 증량</div>
            </div>
        </div>

        <div class="activity-container container-format">
            <div class="info-title">나의 활동량</div>
            <div class="select-container my-activity activity inner-container-format">
                <div class="select-wrapper very-active ${isActivityValid("VERY_HIGH")}" data-text="VERY_HIGH">
                    <div class="main-text">매우 활동적</div>
                    <div class="sub-text">주 6~7회 이상 고강도 운동 (운동 선수) <br> 업무 형태가 활동적</div>
                </div>
                <div class="select-wrapper active ${isActivityValid("HIGH")}" data-text="HIGH">
                    <div class="main-text">활동적</div>
                    <div class="sub-text">주 4~6회 운동 (웨이트 트레이닝) <br> 주 150분 이상 유산소 운동</div>
                </div>
                <div class="select-wrapper moderate ${isActivityValid("NORMAL")}" data-text="NORMAL">
                    <div class="main-text">보통</div>
                    <div class="sub-text">주 2~3회 운동 (유산소 + 웨이트 트레이닝)</div>
                </div>
                <div class="select-wrapper low ${isActivityValid("LOW")}" data-text="LOW">
                    <div class="main-text">적음</div>
                    <div class="sub-text">주 2회 미만의 운동 <br> 웨이트 트레이닝 / 유산소 운동 선택적 진행</div>
                </div>
                <div class="select-wrapper very-low ${isActivityValid("VERY_LOW")}" data-text="VERY_LOW">
                    <div class="main-text">매우 적음</div>
                    <div class="sub-text">평소 운동을 하지 않음 <br> 업무 형태가 주로 앉아서 진행</div>
                </div>
            </div>
        </div>

        <div class="button-container">
            <div id="editUserInfoButton" class="next-button disabled">수정하기</div>
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



let compressedFile = '';

$(document).off('change', '.profile-image-input').on('change', '.profile-image-input', async function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const $container = $(this).closest('.profile-image');
    const $newImage = $container.find('.new-image');
    const $previewImage = $container.find('.preview-image');

    const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 720,
        useWebWorker: true,
        maxIteration: 5,
        initialQuality: 0.7
    };

    try {
        compressedFile = await imageCompression(file, options);
        const compressedDataUrl = await imageCompression.getDataUrlFromFile(compressedFile);

        $newImage.attr('src', compressedDataUrl).show();
        $previewImage.hide();

        console.log("압축 성공:", (compressedFile.size / 1024).toFixed(1), "KB");
    } catch (err) {
        console.error("압축 실패:", err);
        return;
    }

    console.log("압축된 파일:", compressedFile);

    const formData = new FormData();
    formData.append('profileImageFile', compressedFile);

    $.ajax({
        url: `${window.DOMAIN_URL}/users/profile-image`,
        type: 'PATCH',
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
            console.log("프로필 이미지 업데이트 성공:", res);
        },
        error: function (err) {
            console.error("프로필 이미지 업데이트 실패:", err);
        }
    });
});



$(document).on('click', '.numeric-input-view', function (e) {
    const type = $(this).data('type'); // "height" or "weight"
    const valueText = $(this).text();  // 예: "176.2cm" or "64.2kg"

    // 숫자만 추출
    const value = parseFloat(valueText);

    showNumericInput("#my", type, value);
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
    

    // 버튼 상태도 초기 상태 기준으로 업데이트
    // updateNextButtonState();
}


function updateNextButtonState() {
    const currentGoal = $('.goal-container .my-goal .valid').data('text');
    const currentActivity = $('.activity-container .my-activity .valid').data('text');

    const $nextButton = $('.next-button');

    // 현재 선택값이 초기값과 동일하면 비활성화
    console.log(initialGoal);
    console.log(initialActivity);
    if (
        (currentGoal === initialGoal) &&
        (currentActivity === initialActivity)
    ) {
        $nextButton.removeClass('active').addClass('disabled');
        return;
    }

    // 현재 선택이 둘 다 되어 있고, 초기값과 다르면 활성화
    const goalValid = !!currentGoal;
    const activityValid = !!currentActivity;

    if (goalValid && activityValid) {
        $nextButton.removeClass('disabled').addClass('active');
    } else {
        $nextButton.removeClass('active').addClass('disabled');
    }
}
