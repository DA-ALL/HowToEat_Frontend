import { validateInputFavoriteFood } from '../components/input-validate.js';
import { showPopup } from '../components/popup.js';
import { showPage } from '../components/nav-bottom.js';

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
                        <input class="favorite-food-add-input" type="text" id="description" name="description" placeholder="어떤 음식인가요?" maxlength="30" data-text="">
                    </div>
                </div>


                <div class="input-wrapper">
                    <div class="input-label">칼로리</div>
                    <div id="kcalInput" class="input">
                        <input class="favorite-food-add-input decimal" type="text" inputmode="decimal" id="kcal" name="kcal" placeholder="칼로리를 입력해 주세요" maxlength="10" data-text=""}>
                    </div>
                </div>

                <div class="input-wrapper">
                    <div class="input-label">탄수화물</div>
                    <div id="carboInput" class="input">
                        <input class="favorite-food-add-input decimal" type="text" inputmode="decimal" id="carbo" name="carbo" placeholder="탄수화물을 입력해 주세요" maxlength="10" data-text=""}>
                    </div>
                </div>

                <div class="input-wrapper">
                    <div class="input-label">단백질</div>
                    <div id="proteinInput" class="input">
                        <input class="favorite-food-add-input decimal" type="text" inputmode="decimal" id="protein" name="protein" placeholder="단백질을 입력해 주세요" maxlength="10" data-text=""}>
                    </div>
                </div>

                <div class="input-wrapper">
                    <div class="input-label">지방</div>
                    <div id="fatInput" class="input">
                        <input class="favorite-food-add-input decimal" type="text" inputmode="decimal" id="fat" name="fat" placeholder="지방을 입력해 주세요" maxlength="10" data-text=""}>
                    </div>
                </div>

                <div class="input-wrapper">
                    <div class="input-label">무게</div>
                    <div class="weigth-unit-wrapper">
                        <div class="unit-toggle gram active" data-unit="g">g(그램)</div>
                        <div class="unit-toggle milliliter" data-unit="ml">ml(밀리리터)</div>
                    </div>
                    <div id="weightInput" class="input valid">
                        <input class="favorite-food-add-input decimal" type="text" inputmode="decimal" id="foodWeight" name="foodWeight" placeholder="100" maxlength="6" value="100"}>
                    </div>
                </div>
            </div> 
        </div>

        <div class="button-container">
            <div id="addFavoriteFoodByNew" class="add-button disabled">추가하기</div>
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


$(document).on('click', '.unit-toggle', function () {
    $('.unit-toggle').removeClass('active');  // 모든 toggle에서 active 제거
    $(this).addClass('active');               // 클릭한 요소에만 active 추가
});


$(document).on('click', '#addFavoriteFoodByNew.active', function () {
    const foodName = $('#foodName').val().trim();
    const kcal = parseFloat($('#kcal').val());
    const carbo = parseFloat($('#carbo').val());
    const protein = parseFloat($('#protein').val());
    const fat = parseFloat($('#fat').val());
    const foodWeight = parseFloat($('#foodWeight').val());
    const unit = $('.unit-toggle.active').data('unit');
    const description = $('#description').val().trim();

    // 기타 고정 값 또는 사용자 정보에서 가져오는 값
    const foodType = 'CUSTOM'; // 직접 추가한 음식은 보통 USER_CREATED 등으로 고정
    const providedBy = '-';
    const source = 'User';

    const requestData = {
        foodName,
        kcal,
        foodType,
        carbo,
        protein,
        fat,
        foodWeight,
        providedBy,
        unit,
        source,
        description
    };

    // console.log(requestData);

    $.ajax({
        url: `${window.DOMAIN_URL}/favorite-foods/new`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        success: function (res) {
            showPopup("#main", 1, "음식이 추가되었어요!", "'즐겨찾기'에서 확인해보세요").then((confirmed) => {
                if(confirmed) {
                    const currentPath = window.location.pathname;
                    const parts = currentPath.split('/');

                    const mealTime = parts[2];
                    const selectedDate = parts[3];
    
                    const newPath = `/main/${mealTime}/${selectedDate}/regist`;
                    history.pushState({ view: 'main', mealTime, date: selectedDate }, '', newPath);
                    showPage(`/main/${mealTime}/${selectedDate}/regist`, true);
                    $('#homeAddNewFood').empty();
                    return;
                }
            });
        },
    });
});


$(document).on('input', '.decimal', function () {
    let val = $(this).val();

    // 숫자와 소수점만 남기기
    val = val.replace(/[^0-9.]/g, '');

    // 소수점 2개 이상 제거
    const parts = val.split('.');
    if (parts.length > 2) {
        val = parts[0] + '.' + parts[1];
    }

    // 소수점 이하 첫째 자리까지만 유지
    if (parts.length === 2) {
        parts[1] = parts[1].substring(0, 1); // 한 자리까지만
        val = parts[0] + '.' + parts[1];
    }

    $(this).val(val);
});

$(document).on('keydown', '.decimal', function (e) {
    if (this.value === '' && e.key === '0') {
      e.preventDefault();
    }
});

if ($(window).width() <= 450) {
    $(window).on("focusin", function () {
        $("#navBottom").hide();
    });
    $(window).on("focusout", function () {
        $("#navBottom").show();
    });
}