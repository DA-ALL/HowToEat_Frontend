export function showCustomAlert(type) {

    let alertHTML = ``;

    switch (type) {
        case 1 :
            alertHTML = `
                <div id="customAlert">
                    <div class="alert-wrapper">
                        <div class='alert-image'>
                            <img src="/administrate/images/icon_alarm.png">
                        </div>
                        <div class="alert-text-wrapper">
                            <div class="alert-text-title">권한이 없어요</div>
                            <div class="alert-text-sub">Master 권한이 필요한 기능이에요</div>
                        </div>
                        <div class="button-wrapper">
                            <div id="buttonOk" class="button-next">확인</div>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 2:
            alertHTML = `
                <div id="customAlert">
                    <div class="alert-wrapper">
                        <div class='alert-image'>
                            <img src="/administrate/images/icon_alarm.png">
                        </div>
                        <div class="alert-text-wrapper">
                            <div class="alert-text-title">해당 유저를<br>PT 회원 목록에서 삭제하시겠습니까?</div>
                            <div class="alert-text-sub"></div>
                        </div>
                        <div class="button-wrapper">
                            <div id="buttonCancel" class="button-cancel">취소</div>
                            <div id="buttonDelete" class="button-next">삭제하기</div>
                        </div>
                    </div>
                </div>
            `;
            break;
    }

    $("body").append(alertHTML);

    
    // 확인 버튼 클릭 시 알림창 닫기
    $(document).on("click", "#buttonOk", function () {
        $("#customAlert").remove();
    });

    // 취소 버튼 클릭 시 알림창 닫기
    $(document).on("click", "#buttonCancel", function () {
        $("#customAlert").remove();
    });
    // 삭제하기 버튼 클릭 시 알림창 닫기
    $(document).on("click", "#buttonDelete", function () {
        $("#customAlert").remove();
        // 삭제로직
        console.log("삭제하기 클릭");
    });
}
