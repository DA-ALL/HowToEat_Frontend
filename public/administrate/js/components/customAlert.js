export function showCustomAlert({ type, message, onCancel = {}, onNext = {} }) {
    let alertHTML = ``;

    switch (type) {
        case 1:
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
        case 3:
            alertHTML = `
                <div id="customAlert">
                    <div class="alert-wrapper">
                        <div class='alert-image'>
                            <img src="/administrate/images/icon_alarm.png">
                        </div>
                        <div class="alert-text-wrapper">
                            <div class="alert-text-title">${message}</div>
                            <div class="alert-text-sub"></div>
                        </div>
                        <div class="button-wrapper">
                            <div id="buttonOk" class="button-next">확인</div>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 4:
            alertHTML = `
                <div id="customAlert">
                    <div class="alert-wrapper">
                        <div class='alert-image'>
                            <img src="/administrate/images/icon_alarm.png">
                        </div>
                        <div class="alert-text-wrapper">
                            <div class="alert-text-title">데이터를 수정하시겠어요?</div>
                            <div class="alert-text-sub">수정하시기전 데이터를 한번 더 확인해주세요!</div>
                        </div>
                        <div class="button-wrapper">
                            <div id="buttonCancel" class="button-cancel">취소</div>
                            <div id="buttonModifi" class="button-next">수정하기</div>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 5:
            alertHTML = `
                <div id="customAlert">
                    <div class="alert-wrapper">
                        <div class='alert-image'>
                            <img src="/administrate/images/icon_alarm.png">
                        </div>
                        <div class="alert-text-wrapper">
                            <div class="alert-text-title">데이터를 삭제하시겠어요?</div>
                            <div class="alert-text-sub">삭제하시면 데이터를 다시 불러올 수 없어요.</div>
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

    $(document).off("click", "#customAlert .button-cancel").on("click", "#customAlert .button-cancel", function () {
        if (typeof onCancel === "function") onCancel();
        $("#customAlert").remove();
    });

    $(document).off("click", "#customAlert .button-next").on("click", "#customAlert .button-next", function () {
        if (typeof onNext === "function") onNext();
        $("#customAlert").remove();
    });
}
