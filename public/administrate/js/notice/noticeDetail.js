import { showCustomAlert } from '/administrate/js/components/customAlert.js';

export function loadNoticeDetail({type}) {
    console.log("noticeDetail:" , type);
    const container = $("#noticeDetail");

    let noticeDetailHTML = ``;

    switch (type) {
        case "edit":
            noticeDetailHTML = `
                <div class="title">공지사항 상세보기</div>
                
                <div class="input-wrapper">
                    <div class="input-title">제목</div>
                    <input type="text" class="input" id="noticeTitle" placeholder="제목을 입력해주세요" />
                    <div class="input-info">* 필수 항목입니다</div>
                </div>

                <div class="notice-type-wrapper"> 
                    <div class="notice-type-title">데이터 종류</div>
                    <div class="notice-type-option-wrapper">
                        <div class="notice-type-option active" data-query="notice">공지</div>
                        <div class="notice-type-option" data-query="bugfix">버그수정</div>
                        <div class="notice-type-option" data-query="update">업데이트</div>
                    </div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title">공지사항 내용</div>
                    <textarea class="input" id="noticeContent" placeholder="내용을 입력해주세요"></textarea>
                    <div class="input-info">* 필수 항목입니다</div>
                </div>

                <div class="button-wrapper">
                    <div class="button-cancel" id="noticeDetailCancel">취소</div>
                    <div class="button-next" id="noticeDetailEdit">수정하기</div>
                </div>
            `;
            break;
        case "add":
            noticeDetailHTML = `
                <div class="title">공지사항 추가하기</div>
                
                <div class="input-wrapper">
                    <div class="input-title">제목</div>
                    <input type="text" class="input" id="noticeTitle" placeholder="제목을 입력해주세요" />
                    <div class="input-info">* 필수 항목입니다</div>
                </div>

                  <div class="notice-type-wrapper"> 
                    <div class="notice-type-title">데이터 종류</div>
                    <div class="notice-type-option-wrapper">
                        <div class="notice-type-option active" data-query="notice">공지</div>
                        <div class="notice-type-option" data-query="bugfix">버그수정</div>
                        <div class="notice-type-option" data-query="update">업데이트</div>
                    </div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title">공지사항 내용</div>
                    <textarea class="input" id="noticeContent" placeholder="내용을 입력해주세요"></textarea>
                    <div class="input-info">* 필수 항목입니다</div>
                </div>

                <div class="button-wrapper">
                    <div class="button-cancel" id="noticeDetailCancel">취소</div>
                    <div class="button-next" id="noticeDetailAdd">추가하기</div>
                </div>
            `;
            break;
        default:
            break;
    }

    container.html(noticeDetailHTML);
    loadNoticeDetailData();
    updateFormNextButton();
}

// 유효성 검사
function isFormValid() {
    let isValid = true;

    $("#noticeDetail .input").each(function () {
        const $input = $(this);
        const value = $input.val().trim();
        const isRequired = this.id === "noticeTitle" || this.id === "noticeContent";

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
    const $editButton = $("#noticeDetail .button-next");
    const valid = isFormValid();

    if (valid) {
        $editButton.removeClass("disabled");
    } else {
        $editButton.addClass("disabled");
    }
}

function getNoticeDetailTypeFromUrl() {
    const urlPath = window.location.pathname;

    if (/\/admin\/notice\/add$/.test(urlPath)) {
        return "add"; // 공지사항 추가
    } else if (/\/admin\/notice\/\d+$/.test(urlPath)) {
        return "edit"; // 공지사항 수정 (숫자 ID)
    } else {
        return null; // 그 외는 처리 안 함
    }
}

function getNoticeIdFromUrl() {
    const urlPath = window.location.pathname;
    const regex = /\/(\d+)$/;  // 마지막 숫자 ID 추출
    const match = urlPath.match(regex);
    return match ? match[1] : null;  // ID가 있으면 반환, 없으면 null
}


function generateDummyData(id) {
    const dummyData = {
        1: {
            id: 1,
            noticeType: "notice",
            noticeTitle: "공지사항1",
            noticeContent: "공지사항 1번입니다~"
        },
        2: {
            id: 2,
            noticeType: "bugfix",
            noticeTitle: "공지사항2",
            noticeContent: "공지사항 2번입니다~"
        },
        3: {
            id: 3,
            noticeType: "update",
            noticeTitle: "공지사항3",
            noticeContent: "공지사항 3번입니다~"
        },
    };

    return dummyData[id] || null;
}

function populateNoticeDetails(data) {
    if (!data) return;

    // 제목, 내용 채우기
    $("#noticeTitle").val(data.noticeTitle || "");
    $("#noticeContent").val(data.noticeContent || "");

    // 데이터 타입 옵션 (공지 / 버그수정 / 업데이트)
    $(".notice-type-option").removeClass("active");
    $(".notice-type-option").each(function () {
        if ($(this).data("query") === data.noticeType) {
            $(this).addClass("active");
        }
    });
}

function getNoticeDetailValues(){
    const title = $("#noticeTitle").val().trim();
    const content = $("#noticeContent").val().trim();
    const type = $(".notice-type-option.active").data("query");

    return {
        noticeTitle: title,
        noticeContent: content,
        noticeType: type
    };
}


function loadNoticeDetailData() {
    const id = getNoticeIdFromUrl();
    if (id) {
        const noticeData = generateDummyData(id);  // ID에 맞는 더미 데이터 가져오기
        populateNoticeDetails(noticeData);  // 데이터를 필드에 채우기
    }
}



$(document).ready(function () {
    const noticeDetailType = getNoticeDetailTypeFromUrl();
    loadNoticeDetail({type: noticeDetailType});
});


// input 포커스 아웃시 확인
$(document).on("blur", "#noticeDetail input.input, #noticeDetail textarea.input", function () {
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
$(document).on("click", "#noticeDetailCancel", function () {
    window.history.back();
});

// 수정하기 버튼
$(document).on("click", "#noticeDetailEdit", function () {
    if ($(this).hasClass("disabled")) return;

    const noticeDetailValues = getNoticeDetailValues();
    console.log("수정하기 버튼", noticeDetailValues);
});

// 추가하기 버튼
$(document).on("click", "#noticeDetailAdd", function () {
    if ($(this).hasClass("disabled")) return;

    const noticeDetailValues = getNoticeDetailValues();
    console.log("추가하기 버튼", noticeDetailValues);

    showCustomAlert({
        type: 3,
        onNext: function () {
            console.log("공지사항 추가");
        }
    })
});

// 옵션 버튼
$(document).on("click", "#noticeDetail .notice-type-option", function () {
    $(this).siblings().removeClass("active");
    $(this).addClass("active");
});

