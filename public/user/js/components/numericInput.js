export function showNumericInput(parent, type, value) {
        console.log("show");
        let numericInputHtml = '';

        numericInputHtml = `
        
            <div id="numericInput" data-default="${value}">
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
                        <div class="input-value placeholder">${value}</div>
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
                        <div class="number" data-text="←">←</div>
                    </div>
                </div>

                <div id="buttonArea">
                    <div class="record-button disabled">기록하기</div>
                </div>
            </div>
        `
        const inputView = $(numericInputHtml);
        $(parent).append(inputView);
    
        $('body').css('overflow', 'hidden');
    
        function closeInput() {
            $('#numericInput').remove();
            $('body').css('overflow', 'auto');
        }   
}

// 입력 로직: `.number` 클릭
$(document).on('click', '.number', function () {
    const $this = $(this);
    const text = $this.data('text');
    const $input = $('.input-value');
    const $numericInput = $('#numericInput');
    const defaultValue = $numericInput.data('default');
    let current = $input.text();

    $this.css('background-color', '#FDF3F3');
    setTimeout(() => {
        $this.css('background-color', '');
    }, 70);

    // 🔷 현재 placeholder 상태?
    const isPlaceholder = $input.hasClass('placeholder');

    if (text === '←') {
        if (isPlaceholder) {
            // 이미 placeholder 상태면 아무 것도 할 필요 없음
            return;
        }
        current = current.slice(0, -1);
        if (!current) {
            $input.text(defaultValue).addClass('placeholder');
            return;
        }
    } else {
        if (isPlaceholder) {
            if (text === '.') {
                // 🔷 placeholder 상태에서 . 입력 → 무시
                return;
            }
            // 🔷 숫자 입력 → placeholder 해제
            current = '';
            $input.removeClass('placeholder');
        }

        if (text === '.') {
            if (current === '') {
                // 🔷 값이 없을 때 . 입력 → 무시
                return;
            }
            if (current === '0') {
                // 🔷 값이 없을 때 . 입력 → 무시
                return;
            }
            if (current.includes('.')) {
                // 🔷 이미 . 있으면 또 입력 → 무시
                return;
            }
            current += '.';
        } else {
            if (current.includes('.')) {
                const decimalPart = current.split('.')[1];
                if (decimalPart.length >= 1) {
                    return;
                }
            }
            current += text;
        }
    }

    $input.text(current);
    validateInput();
});

function validateInput() {
    const $input = $('.input-value');
    const $numericInput = $('#numericInput');
    const $valueWrapper = $('.value-wrapper');
    const $button = $('.record-button');
    const defaultValue = $numericInput.data('default');
    const current = $input.hasClass('placeholder') ? '' : $input.text();

    // 초기화
    $button.removeClass('active').addClass('disabled');
    $valueWrapper.removeClass('error').removeAttr('data-errortype');

    if (!current) return;

    if (current === defaultValue) return;

    // 🔷 소수점이 마지막에만 있는 경우 → 아직 미완성
    if (current.endsWith('.')) return;

    const num = parseFloat(current);
    if (isNaN(num)) return;

    if (num >= 300) {
        // 300 이상 → 즉시 에러
        $valueWrapper.addClass('error').attr('data-errortype', '2');
        return;
    }

    if (num <= 100) {
        // 99 이하 → 버튼 비활성화
        return;
    }

    // 정상 값
    $button.removeClass('disabled').addClass('active');
}