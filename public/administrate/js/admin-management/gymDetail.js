import { showCustomAlert } from '/administrate/js/components/customAlert.js';
import { createGym, getGym, updateGym } from '../api.js';
import { registerViewLoader } from '/administrate/js/router.js';
export async function loadGymDetail({type}) {
    
    const container = $("#gymDetail");

    let gymDetailHTML = ``;

    switch (type) {
        case "edit":
            gymDetailHTML = `
                <div class="title">헬스장 상세보기</div>

                <div class="input-wrapper">
                    <div class="input-title">지점명</div>
                    <input type="text" class="input" id="gymName" placeholder="지점명을 입력해주세요" />
                    <div class="input-info">* 필수 항목입니다</div>
                </div>

                <div class="button-wrapper">
                    <div class="button-cancel" id="gymDetailCancel">취소</div>
                    <div class="button-next" id="gymDetailEdit">수정하기</div>
                </div>
            `;
            break;
        case "add":
            gymDetailHTML = `
                <div class="title">헬스장 추가하기</div>

                <div class="input-wrapper">
                    <div class="input-title">지점명</div>
                    <input type="text" class="input" id="gymName" placeholder="지점명을 입력해주세요" />
                    <div class="input-info">* 필수 항목입니다</div>
                </div>

                <div class="button-wrapper">
                    <div class="button-cancel" id="gymDetailCancel">취소</div>
                    <div class="button-next" id="gymDetailAdd">추가하기</div>
                </div>
            `;
            break;
        default:
            break;
    }

    container.html(gymDetailHTML);
    
    await loadDetailData();
    updateFormNextButton();
}

// 유효성 검사
function isFormValid() {
    let isValid = true;

    $("#gymDetail .input").each(function () {
        const $input = $(this);
        const value = $input.val().trim();
        const isRequired = this.id === "gymName"

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
    const $editButton = $("#gymDetail .button-next");
    const valid = isFormValid();
    
    if (valid) {
        $editButton.removeClass("disabled");
    } else {
        $editButton.addClass("disabled");
    }
}

function getDetailTypeFromUrl() {
    const urlPath = window.location.pathname;

    if (/\/admin\/admin-management\/gym\/add$/.test(urlPath)) {
        return "add"; // 공지사항 추가
    } else if (/\/admin\/admin-management\/gym\/\d+$/.test(urlPath)) {
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

function populateDetails(data) {
    if (!data) {
        return;
    }

    // 이름 입력
    $("#gymName").val(data.name || "");
}


function getDetailValues(){
    const name = $('#gymName').val().trim();

    return {
        name,
    };
}


async function loadDetailData() {
    const gymId = getIdFromUrl();
    
    if (!gymId) {
        return;    
    }

    try{
        const response = await getGym(gymId);
        // console.log("??", response);
        populateDetails(response.data);  // 데이터를 필드에 채우기
    } catch(error){
        console.log(error);
    }

    
}

// input 포커스 아웃시 확인
$(document).on("blur input", "#gymDetail input.input", function () {
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


// 취소하기 버튼
$(document).on("click", "#gymDetailCancel", function () {
    window.history.back();
});

// 수정하기 버튼
$(document).on("click", "#gymDetailEdit", async function () {
    if ($(this).hasClass("disabled")) return;
    const gymId = getIdFromUrl();

    const detailValues = getDetailValues();
    try{
        const response = await updateGym(gymId, detailValues);
        showCustomAlert({
            type: 3,
            message: response.message,
            onNext: () => {
                window.history.back(); // 이전 페이지로 돌아가기
            }
        });

    } catch(error){
        console.log(error);
    }
});

// 추가하기 버튼
$(document).on("click", "#gymDetailAdd", async function () {
    if ($(this).hasClass("disabled")) return;

    const detailValues = getDetailValues();
    try{
        await createGym(detailValues);
        showCustomAlert({
            type: 3,
            message: "헬스장이 성공적으로 추가되었습니다.",
            onNext: () => {
                window.history.back(); // 이전 페이지로 돌아가기
            }
        });
    } catch(error){
        console.log(error);
    }
});


registerViewLoader('gymDetail', loadGymDetail);