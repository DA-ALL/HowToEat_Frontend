import { showCustomAlert } from '/administrate/js/components/customAlert.js';

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

function getDetailTypeFromUrl() {
    const urlPath = window.location.pathname;

    if (/\/admin\/admin-management\/add$/.test(urlPath)) {
        return "add"; // 공지사항 추가
    } else if (/\/admin\/admin-management\/\d+$/.test(urlPath)) {
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
            adminAccountId: "admin1",
        },
        2: {
            id: 2,
            adminAccountId: "admin2"
        },
        3: {
            id: 3,
            adminAccountId: "admin3"
        },
    };

    return dummyData[id] || null;
}

function populateDetails(data) {
    if (!data) return;

    // 제목, 내용 채우기
    $("#adminAccountId").val(data.adminAccountId || "");
}

function getDetailValues(){
    const accountId = $("#adminAccountId").val().trim();
    const password = $("#adminAccountPW").val().trim();
    

    return {
        accountId: accountId,
        password: password,
    };
}


function loadDetailData() {
    const id = getIdFromUrl();
    if (id) {
        const noticeData = generateDummyData(id);  // ID에 맞는 더미 데이터 가져오기
        populateDetails(noticeData);  // 데이터를 필드에 채우기
    }
}



$(document).ready(function () {
    const detailType = getDetailTypeFromUrl();
    loadAdminAccountDetail({type: detailType});
});


// input 포커스 아웃시 확인
// $(document).on("blur", "#adminAccountDetail input.input", function () {
//     const $this = $(this);
//     const value = $this.val().trim();

//     if (value === "") {
//         $this.addClass("error");
//         $this.removeClass("valid");
//     } else {
//         $this.removeClass("error");
//         $this.addClass("valid");
//     }

//     updateFormNextButton();
// });

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
$(document).on("click", "#adminAccountDetailEdit", function () {
    if ($(this).hasClass("disabled")) return;

    const detailValues = getDetailValues();
    console.log("수정하기 버튼", detailValues);
});

// 추가하기 버튼
$(document).on("click", "#adminAccountDetailAdd", function () {
    if ($(this).hasClass("disabled")) return;

    const detailValues = getDetailValues();
    console.log("추가하기 버튼", detailValues);

    showCustomAlert({
        type: 3,
        onNext: function () {
            console.log("관리자 계정 추가");
        }
    })
});
