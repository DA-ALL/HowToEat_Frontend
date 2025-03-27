export function showCustomAlert() {
    let alertHTML = `
        <div id="customAlert">
            <div class="alert-wrapper">
                <div class='alert-image'>
                    <img src="/administrate/images/icon_user_white.png">
                </div>
                <div class="alert-text-wrapper">
                    <div class="alert-text-title">권한이 없어요</div>
                    <div class="alert-text-sub">Master 권한이 필요한 기능이에요</div>
                </div>
                <div class="alert-button-wrapper">
                    <div class="alert-button-ok">확인</div>
                </div>
            </div>
        </div>
    `;

    $("body").append(alertHTML);

    console.log("asdf");
    // 확인 버튼 클릭 시 알림창 닫기
    $(document).on("click", ".alert-button-ok", function () {
        $("#customAlert").remove();
    });
}
