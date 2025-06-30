import { validateInputFavoriteFood } from '../components/input-validate.js';

export function renderAddHomeNewFood() {
    return `
        <div id="headerNav" data-title="음식 추가" data-type="2"></div>

        
        <div class="body-stats-container container-format">
            <div class="input-container inner-container-format">

                <!-- [ 메뉴 이름 ] --!>
                <div class="input-wrapper">
                    <div class="input-label">메뉴 이름</div>
                    <div id="foodNameInput" class="input">
                        <input class="favorite-food-add-input" type="text" id="foodName" name="foodName" placeholder="메뉴 이름을 입력해주세요" maxlength="20" data-text="">
                    </div>
                </div>

                <div class="input-wrapper">
                    <div class="input-label">설명</div>
                    <div id="descriptionInput" class="input">
                        <input class="favorite-food-add-input" type="text" inputmode="decimal" id="description" name="description" placeholder="어떤 음식인가요?" maxlength="20" data-text="">
                    </div>
                </div>


                <div class="input-wrapper">
                    <div class="input-label">칼로리</div>
                    <div id="kcalInput" class="input">
                        <input class="favorite-food-add-input" type="text" inputmode="decimal" id="kcal" name="kcal" placeholder="칼로리를 입력해 주세요" maxlength="10" data-text=""}>
                    </div>
                </div>

                <div class="input-wrapper">
                    <div class="input-label">탄수화물</div>
                    <div id="carboInput" class="input">
                        <input class="favorite-food-add-input" type="text" inputmode="decimal" id="carbo" name="carbo" placeholder="탄수화물을 입력해 주세요" maxlength="10" data-text=""}>
                    </div>
                </div>

                <div class="input-wrapper">
                    <div class="input-label">단백질</div>
                    <div id="proteinInput" class="input">
                        <input class="favorite-food-add-input" type="text" inputmode="decimal" id="protein" name="protein" placeholder="단백질을 입력해 주세요" maxlength="10" data-text=""}>
                    </div>
                </div>

                <div class="input-wrapper">
                    <div class="input-label">지방</div>
                    <div id="fatInput" class="input">
                        <input class="favorite-food-add-input" type="text" inputmode="decimal" id="fat" name="fat" placeholder="지방을 입력해 주세요" maxlength="10" data-text=""}>
                    </div>
                </div>

                <div class="input-wrapper">
                    <div class="input-label">무게</div>
                    <div class="weigth-unit-wrapper">
                        <div class="unit-toggle gram active data-unit="g">g(그램)</div>
                        <div class="unit-toggle milliliter" data-unit="ml">ml(밀리리터)</div>
                    </div>
                    <div id="weightInput" class="input valid">
                        <input class="favorite-food-add-input" type="text" inputmode="decimal" id="foodWeight" name="foodWeight" placeholder="100" maxlength="6" value="100"}>
                    </div>
                </div>
            </div> 
        </div>

        <div class="button-container">
            <div class="add-button disabled">추가하기</div>
        </div>
        `
}


$(document).on('blur', '.favorite-food-add-input', function () {
    const $input = $(this);
    validateInputFavoriteFood($input);
    updateAddFavoriteFoodButtonState()
});

function updateAddFavoriteFoodButtonState() {
    const requiredInputs = [
        '#foodNameInput',
        '#kcalInput',
        '#carboInput',
        '#proteinInput',
        '#fatInput',
        '#weightInput'
    ];

    const allValid = requiredInputs.every(selector => {
        return $(selector).hasClass('valid');
    });

    const $addButton = $('.add-button');

    if (allValid) {
        $addButton.removeClass('disabled').addClass('active');
    } else {
        $addButton.removeClass('active').addClass('disabled');
    }
}


//키와 몸무게 인풋 확인 함수
// export function bindUsersInfoEvents() {
//     const originalInputValue = {};

//     // focus 시 원래 값 저장
//     $('input').off('focus').on('focus', function () {
//         const id = $(this).attr('id');
//     });

//     // blur 시 실제 값이 바뀐 경우에만 처리
//     $('input').off('blur').on('blur', function () {
//         const $input = $(this);
//         const id = $input.attr('id');
//         const currentVal = $input.val();

//         validateInputFavoriteFood($input);
//     });


//     // 버튼 상태도 초기 상태 기준으로 업데이트
//     // updateNextButtonState();
// }

$(document).on('click', '.unit-toggle', function () {
    $('.unit-toggle').removeClass('active');  // 모든 toggle에서 active 제거
    $(this).addClass('active');               // 클릭한 요소에만 active 추가
});