import { showCustomAlert } from '/administrate/js/components/customAlert.js';

export function loadTrainertDetail({type}) {
    
    const container = $("#trainerDetail");

    let trainerDetailHTML = ``;

    let gyms = getGyms();
    let gymOptionsHTML = gyms.map((gym, index) => {
        return `<div class="gym-type-option${index === 0 ? ' active' : ''}" data-query="${gym.name}">${gym.name}</div>`;
    }).join('');

    switch (type) {
        case "edit":
            trainerDetailHTML = `
                <div class="title">트레이너 상세보기</div>

                <div class="gym-type-wrapper"> 
                    <div class="gym-type-title">헬스장</div>
                    <div class="gym-type-option-wrapper">
                        ${gymOptionsHTML}
                    </div>
                </div>

                <div class="image-wrapper">
                    <div class="image-title">사진</div>
                    <div class="image">
                        <img src="/administrate/images/icon_human_red.png">
                    </div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title">이름</div>
                    <input type="text" class="input" id="trainerName" placeholder="이름을 입력해주세요" />
                    <div class="input-info">* 필수 항목입니다</div>
                </div>

                <div class="button-wrapper">
                    <div class="button-cancel" id="trainerDetailCancel">취소</div>
                    <div class="button-next" id="trainerDetailEdit">수정하기</div>
                </div>
            `;
            break;
        case "add":
            trainerDetailHTML = `
                <div class="title">트레이너 추가하기</div>

                <div class="gym-type-wrapper"> 
                    <div class="gym-type-title">헬스장</div>
                    <div class="gym-type-option-wrapper">
                        ${gymOptionsHTML}
                    </div>
                </div>

                <div class="image-wrapper">
                    <div class="image-title">사진</div>
                    <div class="image">
                        <img src="/administrate/images/icon_human_red.png">
                    </div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title">이름</div>
                    <input type="text" class="input" id="trainerName" placeholder="이름을 입력해주세요" />
                    <div class="input-info">* 필수 항목입니다</div>
                </div>

                <div class="button-wrapper">
                    <div class="button-cancel" id="trainerDetailCancel">취소</div>
                    <div class="button-next" id="trainerDetailAdd">추가하기</div>
                </div>
            `;
            break;
        default:
            break;
    }

    container.html(trainerDetailHTML);
    
    loadDetailData();
    updateFormNextButton();
}

// 유효성 검사
function isFormValid() {
    let isValid = true;

    $("#trainerDetail .input").each(function () {
        const $input = $(this);
        const value = $input.val().trim();
        const isRequired = this.id === "trainerName"

        // error 클래스가 있는 경우
        if ($input.hasClass("error")) {
            isValid = false;
        }

        // 필수값이 비어있는 경우
        if (isRequired && value === "") {
            isValid = false;
        }
    });

    return isValid;
}

// 버튼 상태 업데이트
function updateFormNextButton() {
    const $editButton = $("#trainerDetail .button-next");
    const valid = isFormValid();

    if (valid) {
        $editButton.removeClass("disabled");
    } else {
        $editButton.addClass("disabled");
    }
}

function getDetailTypeFromUrl() {
    const urlPath = window.location.pathname;

    if (/\/admin\/admin-management\/trainer\/add$/.test(urlPath)) {
        return "add"; // 공지사항 추가
    } else if (/\/admin\/admin-management\/trainer\/\d+$/.test(urlPath)) {
        return "edit"; // 공지사항 수정 (숫자 ID)
    } else {
        return null; // 그 외는 처리 안 함
    }
}

function getIdFromUrl() {
    const urlPath = window.location.pathname;
    const regex = /\/(\d+)$/;  // 마지막 숫자 ID 추출
    const match = urlPath.match(regex);
    return match ? match[1] : null;  // ID가 있으면 반환, 없으면 null
}


function generateDummyData(id) {
    const dummyData = {
        1: {
            id: 1,
            imageURL: "/administrate/images/icon_human_red.png",
            name: `트레이너 1`,
            gymBranch: ['용인기흥구청점', '용인기흥구청점', '처인구청점', '수원권선동점', '이천마장점', '이천중앙점', '평택미전점'][Math.floor(Math.random() * 7)],
            memberCount: Math.floor(Math.random() * 20),
            joined: "2025.03.16"
        },
        2: {
            id: 2,
            imageURL: "/administrate/images/icon_human_red.png",
            name: `트레이너 2`,
            gymBranch: ['용인기흥구청점', '용인기흥구청점', '처인구청점', '수원권선동점', '이천마장점', '이천중앙점', '평택미전점'][Math.floor(Math.random() * 7)],
            memberCount: Math.floor(Math.random() * 20),
            joined: "2025.03.16"
        },
        3: {
            id: 3,
            imageURL: "/administrate/images/icon_human_red.png",
            name: `트레이너 3`,
            gymBranch: ['용인기흥구청점', '용인기흥구청점', '처인구청점', '수원권선동점', '이천마장점', '이천중앙점', '평택미전점'][Math.floor(Math.random() * 7)],
            memberCount: Math.floor(Math.random() * 20),
            joined: "2025.03.16"
        },
    };

    return dummyData[id] || null;
}

function populateDetails(data) {
    if (!data) {
        return;
    }

    const $trainerDetail = $('#trainerDetail');

    // 이름 입력
    $trainerDetail.find('#trainerName').val(data.name || '');

    // 이미지 설정
    $trainerDetail.find('.image img').attr('src', data.imageURL || '/administrate/images/default_image.png');


    const $gymOptions = $trainerDetail.find('.gym-type-option');
    $gymOptions.removeClass('active');
    $gymOptions.each(function () {
        const $option = $(this);
        if ($option.data('query') === data.gymBranch) {
            $option.addClass('active');
        }
    });
}


function getDetailValues(){
    const $trainerDetail = $('#trainerDetail');

    const name = $trainerDetail.find('#trainerName').val().trim();
    const imageURL = $trainerDetail.find('.image img').attr('src');
    const gymBranch = $trainerDetail.find('.gym-type-option.active').data('query');

    return {
        name,
        imageURL,
        gymBranch
    };
}


function loadDetailData() {
    const id = getIdFromUrl();
    if (id) {
        const noticeData = generateDummyData(id);  // ID에 맞는 더미 데이터 가져오기
        populateDetails(noticeData);  // 데이터를 필드에 채우기
    }
}

function getGyms(){

    return [
        { name: '용인기흥구청점', trainerCount: 7},
        { name: '처인구청점', trainerCount: 6},
        { name: '수원권선동점', trainerCount: 3},
        { name: '이천마장점', trainerCount: 4},
        { name: '이천중앙점', trainerCount: 5},
        { name: '평택미전점', trainerCount: 6}
    ]
}











$(document).ready(function () {
    const detailType = getDetailTypeFromUrl();
    loadTrainertDetail({type: detailType});
});


// input 포커스 아웃시 확인
$(document).on("blur", "#trainerDetail input.input", function () {
    const $this = $(this);
    const value = $this.val().trim();

    if (value === "") {
        $this.addClass("error");
        $this.removeClass("valid");
    } else {
        $this.removeClass("error");
        $this.addClass("valid");
    }

    updateFormNextButton();
});

// gym 옵션 버튼
$(document).on("click", "#trainerDetail .gym-type-option", function () {
    $(this).siblings().removeClass("active");
    $(this).addClass("active");
});


// 취소하기 버튼
$(document).on("click", "#trainerDetailCancel", function () {
    window.history.back();
});

// 수정하기 버튼
$(document).on("click", "#trainerDetailEdit", function () {
    if ($(this).hasClass("disabled")) return;

    const detailValues = getDetailValues();
    
    console.log("수정하기 버튼", detailValues);
    if (selectedImageFile) {
        const formData = new FormData();
        formData.append("name", detailValues.name);
        formData.append("gymBranch", detailValues.gymBranch);
        formData.append("image", selectedImageFile);

        // 디버깅용 출력
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
    }
});

// 추가하기 버튼
$(document).on("click", "#trainerDetailAdd", function () {
    if ($(this).hasClass("disabled")) return;

    const detailValues = getDetailValues();
    console.log("추가하기 버튼", detailValues);

    if (selectedImageFile) {
        const formData = new FormData();
        formData.append("name", detailValues.name);
        formData.append("gymBranch", detailValues.gymBranch);
        formData.append("image", selectedImageFile);

        // 디버깅용 출력
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
    }
});






// 파일 선택된 이미지 저장용 전역 변수
let selectedImageFile = null;

// 이미지 클릭 시 파일 선택창 열기
$(document).on("click", "#trainerDetail .image img", function () {
    // 숨겨진 파일 input이 없으면 추가
    if ($('#trainerImageInput').length === 0) {
        const fileInput = $('<input type="file" id="trainerImageInput" accept="image/*" style="display: none;" />');
        $('body').append(fileInput);
    }

    $('#trainerImageInput').click();
});

// 파일 선택 후 처리
$(document).on("change", "#trainerImageInput", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    // 이미지 미리보기 갱신
    const reader = new FileReader();
    reader.onload = function (e) {
        $('#trainerDetail .image img').attr('src', e.target.result);
    };
    reader.readAsDataURL(file);

    // 선택된 파일 저장
    selectedImageFile = file;

    // 필요하면 여기서 서버 업로드도 가능
    console.log("선택된 이미지 파일:", selectedImageFile);
});
