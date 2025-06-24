export function showPopup(parent, type, title, subtitle) {

    let popupHtml = '';

    switch (type) {
        case 1: // 알림형 (확인만)
            popupHtml = `
                <div class="popup-cover">
                    <div class="popup">
                        <div class="icon notify"></div>
                        <div class="popup-title">${title}</div>
                        <div class="popup-subtitle">${subtitle}</div>
                        <button class="popup-btn confirm">확인</button>
                    </div>
                </div>
            `;
            break;

        case 2: // 삭제 확인형 (취소/삭제)
            popupHtml = `
                <div class="popup-cover">
                    <div class="popup">
                        <div class="icon delete">
                            <img src="/user/images/icon_garbage.png">
                        </div>
                        <div class="popup-title">${title}</div>
                        <div class="popup-button-container">
                            <div class="cancel-btn">취소</div>
                            <div class="delete-btn active">삭제</div>
                        </div>
                    </div>
                </div>
            `;
            break;
    }

    const popup = $(popupHtml);
    $("#main").append(popup);

    // 공통: 닫기 이벤트
    popup.find('.popup-btn.confirm, .popup-btn.cancel, .popup-btn.delete').on('click', function() {
        popup.remove();
    });

    // 필요시 삭제 콜백 분리 가능
}
