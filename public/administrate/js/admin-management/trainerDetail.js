import { showCustomAlert } from '/administrate/js/components/customAlert.js';
import { getTrainer, createTrainer, updateTrainer, getAllGymList} from '../api.js';
import { registerViewLoader } from '../router.js';

export async function loadTrainertDetail({type}) {
    
    const container = $("#trainerDetail");

    let trainerDetailHTML = ``;

    let gyms = await getGyms();
    let gymOptionsHTML = gyms.map((gym, index) => {
        return `<div class="gym-type-option${index === 0 ? ' active' : ''}" data-query="${gym.name}" data-id="${gym.id}">${gym.name}</div>`;
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

function getIdFromUrl() {
    const urlPath = window.location.pathname;
    const regex = /\/(\d+)$/;  // 마지막 숫자 ID 추출
    const match = urlPath.match(regex);
    return match ? match[1] : null;  // ID가 있으면 반환, 없으면 null
}

function populateDetails(data) {
    if (!data) {
        return;
    }

    const $trainerDetail = $('#trainerDetail');

    // 이름 입력
    $trainerDetail.find('#trainerName').val(data.name || '');

    // 이미지 설정
    $trainerDetail.find('.image img').attr('src', data.imageUrl || '/administrate/images/icon_human_red.png');


    const $gymOptions = $trainerDetail.find('.gym-type-option');
    $gymOptions.removeClass('active');
    $gymOptions.each(function () {
        const $option = $(this);
        if ($option.data('query') === data.gym.name) {
            $option.addClass('active');
        }
    });
}


function getDetailValues(){
    const $trainerDetail = $('#trainerDetail');

    const name = $trainerDetail.find('#trainerName').val().trim();
    const imageURL = $trainerDetail.find('.image img').attr('src');
    const gym = $trainerDetail.find('.gym-type-option.active').data('id');

    return {
        name,
        imageURL,
        gym
    };
}


async function loadDetailData() {
    const trainerId = getIdFromUrl();

    if (!trainerId) {
        return;
    }

    try {
        const response = await getTrainer(trainerId);
        console.log("트레이너 정보:", response);
        populateDetails(response.data);  // 데이터를 필드에 채우기
    } catch (err) {
        console.error("트레이너 정보를 불러오는 중 오류 발생:", err);
    }
}


async function getGyms(){
    try{
        const response = await getAllGymList();
        console.log("헬스장 목록:", response);
        return response.data;
    } catch (err) {
        console.error("헬스장 목록을 불러오는 중 오류 발생:", err);
    }
}

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
$(document).on("click", "#trainerDetailEdit", async function () {
    if ($(this).hasClass("disabled")) return;

    const trainerId = getIdFromUrl();
    const detailValues = getDetailValues();

    const formData = new FormData();
    formData.append("name", detailValues.name);
    formData.append("gym", detailValues.gym);
    
    if (selectedImageFile) {
        formData.append("image", selectedImageFile);
    }
    
    try {
        const response = await updateTrainer(trainerId, formData);
        console.log("트레이너 수정 성공:", response);
        showCustomAlert({
            type: 3,
            message: response.message,
            onNext: () => {
                window.history.back(); // 이전 페이지로 돌아가기
            }
        });
    } catch (err) {
        console.error("트레이너 수정 실패:", err);
    }

});

// 추가하기 버튼
$(document).on("click", "#trainerDetailAdd", async function () {
    if ($(this).hasClass("disabled")) return;

    const detailValues = getDetailValues();

    const formData = new FormData();
    formData.append("name", detailValues.name);
    formData.append("gym", detailValues.gym);
    
    if (selectedImageFile) {
        formData.append("image", selectedImageFile);
    }

    try {
        const response = await createTrainer(formData);
        console.log("트레이너 추가 성공:", response);
        showCustomAlert({
            type: 3,
            message: response.message,
            onNext: () => {
                window.history.back(); // 이전 페이지로 돌아가기
            }
        });
    } catch (err) {
        console.error("트레이너 추가 실패:", err);
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

// 이미지 파일 선택 시 처리
$(document).on("change", "#trainerImageInput", async function (event) {
    const file = event.target.files[0];
    if (!file) return;

    // 압축 옵션 설정
    const options = {
        maxSizeMB: 0.5,                // 최대 용량: 500KB
        maxWidthOrHeight: 720,        // 최대 해상도: 720px (가로/세로 중 큰 값 기준)
        useWebWorker: true,           // 웹 워커 사용 (성능 향상)
        maxIteration: 5,              // 반복 압축 최대 5번까지 (속도와 품질 균형)
        initialQuality: 0.8           // 초기 품질: 80%
    };

    try {
        // 이미지 압축
        const compressedFile = await imageCompression(file, options);

        // 이미지 미리보기 갱신 (압축된 파일 기준)
        const compressedDataUrl = await imageCompression.getDataUrlFromFile(compressedFile);
        $('#trainerDetail .image img').attr('src', compressedDataUrl);

        // 압축된 파일 저장
        selectedImageFile = compressedFile;

        console.log("압축 전 크기:", (file.size / 1024).toFixed(1), "KB");
        console.log("압축 후 크기:", (compressedFile.size / 1024).toFixed(1), "KB");

    } catch (error) {
        console.error("이미지 압축 중 오류 발생:", error);
        // 압축 실패 시 원본 저장
        selectedImageFile = file;

        // 미리보기 원본으로 표시
        const reader = new FileReader();
        reader.onload = function (e) {
            $('#trainerDetail .image img').attr('src', e.target.result);
        };
        reader.readAsDataURL(file);
    }
});


registerViewLoader('trainerDetail', loadTrainertDetail);