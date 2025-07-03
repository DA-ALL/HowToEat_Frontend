export function showNumericInput(parent, type) {
        console.log("show");
        let numericInputHtml = '';

        numericInputHtml = `
        
            <div id="numericInput">
                <div id="headerNavNumeric">
                    <div class="header-nav-numeric">
                        <div class="button-prev">
                            <img src="/user/images/icon_arrow_back.png">
                        </div>

                        <div class="title">키 기록하기</div>

                        <div class="button-add hidden">
                            <img src="/user/images/icon_add.png">
                        </div>
                    </div>
                </div>

                <div id="inputArea">
                    <div class="value-wrapper">
                        <div class="input-value">176.4</div>
                        <div class="input-unit">cm</div>
                    </div>
                </div>

                <div id="typingArea">
                    <div class="key-row">
                        <div class="number" data-text="1">1</div>
                        <div class="number" data-text="2">2</div>
                        <div class="number" data-text="3">3</div>
                    </div>
                    <div class="key-row">
                        <div class="number" data-text="4">4</div>
                        <div class="number" data-text="5">5</div>
                        <div class="number" data-text="6">6</div>
                    </div>
                    <div class="key-row">
                        <div class="number" data-text="7">7</div>
                        <div class="number" data-text="8">8</div>
                        <div class="number" data-text="9">9</div>
                    </div>
                    <div class="key-row">
                        <div class="number" data-text=".">.</div>
                        <div class="number" data-text="0">0</div>
                        <div class="number" data-text="">←</div>
                    </div>
                </div>

                <div id="buttonArea">
                    <div class="record-button active">기록하기</div>
                </div>
            </div>
        `
        const inputView = $(numericInputHtml);
        $(parent).append(inputView);

        $('body').css('overflow', 'hidden');

        function closeInput() {
            popup.remove();
            $('body').css('overflow', 'auto');
        }

        // popup.find('.popup-btn.confirm').on('click', function () {
        //     closePopup();
        //     resolve(true);
        // });

        // popup.find('.cancel-btn').on('click', function () {
        //     closePopup();
        //     resolve(false);
        // });

        // popup.find('.delete-btn').on('click', function () {
        //     closePopup();
        //     resolve(true);
        // });

        // popup.find('.next-btn').on('click', function () {
        //     closePopup();
        //     resolve(true);
        // });

        // window.addEventListener('popstate', function onPopState() {
        //     closePopup();
        //     resolve(false);
        //     window.removeEventListener('popstate', onPopState);
        // });
    
}

$(document).on('click', '.number', function () {
    const $this = $(this);

    $this.css('background-color', '#FDF3F3');

    setTimeout(() => {
        $this.css('background-color', '');
    }, 70); // 150ms 정도가 적당
});
