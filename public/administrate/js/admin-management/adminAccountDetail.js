import { showCustomAlert } from '../components/customAlert.js';
import { getAdminAccount } from '/administrate/js/api.js';
import { registerViewLoader } from '/administrate/js/router.js';
import { updateURL } from '../router.js';
import { createAdminAccount, updateAdminAccount } from '../api.js';

registerViewLoader('adminAccountDetail', loadAdminAccountDetail);

export function loadAdminAccountDetail({type}) {
    
    const container = $("#adminAccountDetail");

    let adminAccountDetailHTML = ``;

    switch (type) {
        case "edit":
            adminAccountDetailHTML = `
                <div class="title">관리자 계정 상세보기</div>
                
                <div class="role-wrapper">
                    <div class="role-title">권한</div>
                    <div class="role" data-role="admin">Admin</div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title">아이디</div>
                    <input type="text" class="input" id="adminAccountId" placeholder="아이디를 입력해주세요" />
                    <div class="input-info">* 필수 항목입니다</div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title">비밀번호</div>
                    <input type="password" class="input" id="adminAccountPW" placeholder="새로운 비밀번호를 입력해주세요" />
                    <div class="input-info">* 필수 항목입니다</div>
                </div>

                <div class="button-wrapper">
                    <div class="button-cancel" id="adminAccountDetailCancel">취소</div>
                    <div class="button-next" id="adminAccountDetailEdit">수정하기</div>
                </div>
            `;
            break;
        case "add":
            adminAccountDetailHTML = `
                <div class="title">관리자 계정 추가하기</div>
                
                <div class="role-wrapper">
                    <div class="role-title">권한</div>
                    <div class="role" data-role="admin">Admin</div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title">아이디</div>
                    <input type="text" class="input" id="adminAccountId" placeholder="아이디를 입력해주세요" />
                    <div class="input-info">* 필수 항목입니다</div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title">비밀번호</div>
                    <input type="password" class="input" id="adminAccountPW" placeholder="비밀번호를 입력해주세요" />
                    <div class="input-info">* 필수 항목입니다</div>
                </div>

                <div class="button-wrapper">
                    <div class="button-cancel" id="adminAccountDetailCancel">취소</div>
                    <div class="button-next" id="adminAccountDetailAdd">추가하기</div>
                </div>
            `;
            break;
        default:
            break;
    }

    container.html(adminAccountDetailHTML);
    
    loadDetailData();
    updateFormNextButton();
}

// 유효성 검사
function isFormValid() {
    let isValid = true;

    $("#adminAccountDetail .input").each(function () {
        const $input = $(this);
        const value = $input.val().trim();
        const isRequired = this.id === "adminAccountId" || this.id === "adminAccountPW";

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
    const $editButton = $("#adminAccountDetail .button-next");
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
    if (!data) return;

    // 제목, 내용 채우기
    $("#adminAccountId").val(data.accountId || "");
}

function getDetailValues(){
    const accountId = $("#adminAccountId").val().trim();
    const password = $("#adminAccountPW").val().trim();
    
    return {
        accountId: accountId,
        password: password,
    };
}


async function loadDetailData() {
    const accountId = getIdFromUrl();

    if(!accountId){
        return;
    }

    try {
        const data = await getAdminAccount(accountId); // Promise가 resolve될 때까지 기다림
        populateDetails(data.data);
    } catch (err) {
        return [];
    }
}


$(document).on("blur", "#adminAccountDetail input.input", function () {
    const $this = $(this);
    const value = $this.val().trim();
    const isAccountIdField = $this.attr("id") === "adminAccountId";
    const pattern = /^[A-Za-z0-9!@#$%^&*()_\-+=~`[\]{}|\\:;"'<>,.?/]*$/;

    if (value === "") {
        $this.addClass("error").removeClass("valid");
    } else if (isAccountIdField && !pattern.test(value)) {
        // adminAccountId 필드에 유효하지 않은 문자가 포함되어 있을 때
        $this.addClass("error").removeClass("valid");
    } else {
        $this.removeClass("error").addClass("valid");
    }

    updateFormNextButton();
});

// 취소하기 버튼
$(document).on("click", "#adminAccountDetailCancel", function () {
    window.history.back();
});

// 수정하기 버튼
$(document).on("click", "#adminAccountDetailEdit", async function () {
    if ($(this).hasClass("disabled")) return;
    
    const id = getIdFromUrl();
    const detailValues = getDetailValues();
    try{
        await updateAdminAccount(id, detailValues);
        
        showCustomAlert({
            type: 3,
            message: "관리자 계정이 수정되었습니다.",
            onNext: function () {
                updateURL('admin-management');
            }
        });

    } catch (err) {
        console.log(err.responseJSON);
    }
});

// 추가하기 버튼
$(document).on("click", "#adminAccountDetailAdd", async function () {
    if ($(this).hasClass("disabled")) return;

    const accountData = getDetailValues();

    try {
        await createAdminAccount(accountData); 

        showCustomAlert({
            type: 3,
            message: "관리자 계정이 추가되었습니다.",
            onNext: function () {
                updateURL('admin-management');
            }
        })
    } catch (err) {
        console.log(err.responseJSON);
    }
});
