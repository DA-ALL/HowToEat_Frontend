export function showPopup(parent, type, title, subtitle) {
    return new Promise((resolve) => {
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
        $(parent).append(popup);

        $('body').css('overflow', 'hidden');

        function closePopup() {
            popup.remove();
            $('body').css('overflow', 'auto');
        }

        popup.find('.popup-btn.confirm').on('click', function () {
            closePopup();
            resolve(true);
        });

        popup.find('.cancel-btn').on('click', function () {
            closePopup();
            resolve(false);
        });

        popup.find('.delete-btn').on('click', function () {
            closePopup();
            resolve(true);
        });

        window.addEventListener('popstate', function onPopState() {
            closePopup();
            resolve(false);
            window.removeEventListener('popstate', onPopState);
        });
    });
}
