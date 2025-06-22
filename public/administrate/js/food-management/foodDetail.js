import { showCustomAlert } from '/administrate/js/components/customAlert.js';
import { getFood, createFood, updateFood } from '../api.js';
import { registerViewLoader, updateURL } from '../router.js';

export function loadFoodDetail({type}) {
    
    const container = $("#foodDetail");

    let foodDetialHTML = ``;

    switch (type) {
        case "edit":
            foodDetialHTML = `
                <div class="title">음식 상세보기</div>
                
                <div class="data-type-wrapper"> 
                    <div class="data-type-title">데이터 종류</div>
                    <div class="data-type-option-wrapper">
                        <div class="data-type-option" data-query="PROCESSED">가공식품DB</div>
                        <div class="data-type-option" data-query="COOKED">음식DB</div>
                        <div class="data-type-option" data-query="INGREDIENT">원재료DB</div>
                        <div class="data-type-option" data-query="CUSTOM">유저 등록</div>
                    </div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title">음식 이름</div>
                    <input type="text" class="input" id="foodName" placeholder="음식 이름을 입력해주세요" />
                    <div class="input-info">* 필수 항목입니다</div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title">회사명 or 수입지역</div>
                    <input type="text" class="input" id="providedBy" placeholder="회사명 or 수입지역을 입력해주세요" />
                </div>

                <div class="input-wrapper">
                    <div class="input-title-wrapper">
                        <div class="input-title">칼로리&nbsp</div>
                        <div class="input-title-unit">(kcal)</div>
                    </div>
                    <input type="text" class="input only-number" id="kcal" placeholder="칼로리를 입력해 주세요" />
                    <div class="input-info">* 미입력 시, 0으로 자동 기입됩니다.</div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title-wrapper">
                        <div class="input-title">탄수화물&nbsp</div>
                        <div class="input-title-unit">(g)</div>
                    </div>
                    <input type="text" class="input only-number" id="carbo" placeholder="탄수화물을 입력해 주세요" />
                    <div class="input-info">* 미입력 시, 0으로 자동 기입됩니다.</div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title-wrapper">
                        <div class="input-title">단백질&nbsp</div>
                        <div class="input-title-unit">(g)</div>
                    </div>
                    <input type="text" class="input only-number" id="protein" placeholder="단백질을 입력해 주세요" />
                    <div class="input-info">* 미입력 시, 0으로 자동 기입됩니다.</div>
                </div>
                
                <div class="input-wrapper">
                    <div class="input-title-wrapper">
                        <div class="input-title">지방&nbsp</div>
                        <div class="input-title-unit">(g)</div>
                    </div>
                    <input type="text" class="input only-number" id="fat" placeholder="지방을 입력해 주세요" />
                    <div class="input-info">* 미입력 시, 0으로 자동 기입됩니다.</div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title">식품 중량</div>
                    <div class="unit-option-wrapper">
                        <div class="unit-option active" data-query="g">g(그램)</div>
                        <div class="unit-option" data-query="ml">ml(밀리리터)</div>
                    </div>
                    <input type="text" class="input only-number" id="foodWeight" placeholder="무게를 입력해 주세요" />
                    <div class="input-info">* 필수 항목입니다</div>
                </div>

                <div class="toggle-container">
                    <div class="toggle-title">1인분</div>
                    <div class="toggle-description">해당 음식의 정보가 1인분 기준이면 체크해주세요</div>
                    <div class="toggle-wrapper" id="isPerServingToggle">
                        <div class="toggle-circle"></div>
                    </div>
                </div>
                

                <div class="toggle-container">
                    <div class="toggle-title">추천음식 등록 여부</div>
                    <div class="toggle-description">추천음식에는 0~500Kcal의 음식만 등록이 가능해요</div>
                    <div class="toggle-wrapper" id="isRecommendedToggle">
                        <div class="toggle-circle"></div>
                    </div>
                </div>
                

                <div class="button-wrapper">
                    <div class="button-cancel" id="foodDetailCancel">취소</div>
                    <div class="button-next" id="foodDetailEdit">수정하기</div>
                </div>
            `;
            break;

        case "share":
            foodDetialHTML = `
                <div class="title">음식 상세보기</div>
                
                <div class="data-type-wrapper"> 
                    <div class="data-type-title">데이터 종류</div>
                    <div class="data-type-option-wrapper">
                        <div class="data-type-option active" data-query="CUSTOM">유저 등록</div>
                    </div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title">음식 이름</div>
                    <input type="text" class="input" id="foodName" placeholder="음식 이름을 입력해주세요" />
                    <div class="input-info">* 필수 항목입니다</div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title">회사명 or 수입지역</div>
                    <input type="text" class="input" id="providedBy" placeholder="회사명 or 수입지역을 입력해주세요" />
                </div>

                <div class="input-wrapper">
                    <div class="input-title description">설명</div>
                    <textarea class="input" id="description" placeholder="유저가 등록한 설명입니다." disabled></textarea>
                </div>

                <div class="input-wrapper">
                    <div class="input-title-wrapper">
                        <div class="input-title">칼로리&nbsp</div>
                        <div class="input-title-unit">(kcal)</div>
                    </div>
                    <input type="text" class="input only-number" id="kcal" placeholder="칼로리를 입력해 주세요" />
                    <div class="input-info">* 미입력 시, 0으로 자동 기입됩니다.</div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title-wrapper">
                        <div class="input-title">탄수화물&nbsp</div>
                        <div class="input-title-unit">(g)</div>
                    </div>
                    <input type="text" class="input only-number" id="carbo" placeholder="탄수화물을 입력해 주세요" />
                    <div class="input-info">* 미입력 시, 0으로 자동 기입됩니다.</div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title-wrapper">
                        <div class="input-title">단백질&nbsp</div>
                        <div class="input-title-unit">(g)</div>
                    </div>
                    <input type="text" class="input only-number" id="protein" placeholder="단백질을 입력해 주세요" />
                    <div class="input-info">* 미입력 시, 0으로 자동 기입됩니다.</div>
                </div>
                
                <div class="input-wrapper">
                    <div class="input-title-wrapper">
                        <div class="input-title">지방&nbsp</div>
                        <div class="input-title-unit">(g)</div>
                    </div>
                    <input type="text" class="input only-number" id="fat" placeholder="지방을 입력해 주세요" />
                    <div class="input-info">* 미입력 시, 0으로 자동 기입됩니다.</div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title">식품 중량</div>
                    <div class="unit-option-wrapper">
                        <div class="unit-option active" data-query="g">g(그램)</div>
                        <div class="unit-option" data-query="ml">ml(밀리리터)</div>
                    </div>
                    <input type="text" class="input only-number" id="foodWeight" placeholder="무게를 입력해 주세요" />
                    <div class="input-info">* 필수 항목입니다</div>
                </div>

                <div class="toggle-container">
                    <div class="toggle-title">1인분</div>
                    <div class="toggle-description">해당 음식의 정보가 1인분 기준이면 체크해주세요</div>
                    <div class="toggle-wrapper" id="isPerServingToggle">
                        <div class="toggle-circle"></div>
                    </div>
                </div>
                

                <div class="toggle-container">
                    <div class="toggle-title">추천음식 등록 여부</div>
                    <div class="toggle-description">추천음식에는 0~500Kcal의 음식만 등록이 가능해요</div>
                    <div class="toggle-wrapper" id="isRecommendedToggle">
                        <div class="toggle-circle"></div>
                    </div>
                </div>
                

                <div class="button-wrapper">
                    <div class="button-cancel" id="foodDetailCancel">취소</div>
                    <div class="button-next" id="foodDetailShare">공유하기</div>
                </div>
            `;
            break;
        case "add":
            foodDetialHTML = `
                <div class="title">음식 상세보기</div>
                
                <div class="data-type-wrapper"> 
                    <div class="data-type-title">데이터 종류</div>
                    <div class="data-type-option-wrapper">
                        <div class="data-type-option active" data-query="PROCESSED">가공식품DB</div>
                        <div class="data-type-option" data-query="COOKED">음식DB</div>
                        <div class="data-type-option" data-query="INGREDIENT">원재료DB</div>
                    </div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title">음식 이름</div>
                    <input type="text" class="input" id="foodName" placeholder="음식 이름을 입력해주세요" />
                    <div class="input-info">* 필수 항목입니다</div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title">회사명 or 수입지역</div>
                    <input type="text" class="input" id="providedBy" placeholder="회사명 or 수입지역을 입력해주세요" />
                </div>

                <div class="input-wrapper">
                    <div class="input-title-wrapper">
                        <div class="input-title">칼로리&nbsp</div>
                        <div class="input-title-unit">(kcal)</div>
                    </div>
                    <input type="text" class="input only-number" id="kcal" placeholder="칼로리를 입력해 주세요" />
                    <div class="input-info">* 미입력 시, 0으로 자동 기입됩니다.</div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title-wrapper">
                        <div class="input-title">탄수화물&nbsp</div>
                        <div class="input-title-unit">(g)</div>
                    </div>
                    <input type="text" class="input only-number" id="carbo" placeholder="탄수화물을 입력해 주세요" />
                    <div class="input-info">* 미입력 시, 0으로 자동 기입됩니다.</div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title-wrapper">
                        <div class="input-title">단백질&nbsp</div>
                        <div class="input-title-unit">(g)</div>
                    </div>
                    <input type="text" class="input only-number" id="protein" placeholder="단백질을 입력해 주세요" />
                    <div class="input-info">* 미입력 시, 0으로 자동 기입됩니다.</div>
                </div>
                
                <div class="input-wrapper">
                    <div class="input-title-wrapper">
                        <div class="input-title">지방&nbsp</div>
                        <div class="input-title-unit">(g)</div>
                    </div>
                    <input type="text" class="input only-number" id="fat" placeholder="지방을 입력해 주세요" />
                    <div class="input-info">* 미입력 시, 0으로 자동 기입됩니다.</div>
                </div>

                <div class="input-wrapper">
                    <div class="input-title">식품 중량</div>
                    <div class="unit-option-wrapper">
                        <div class="unit-option active" data-query="g">g(그램)</div>
                        <div class="unit-option" data-query="ml">ml(밀리리터)</div>
                    </div>
                    <input type="text" class="input only-number" id="foodWeight" placeholder="무게를 입력해 주세요" />
                    <div class="input-info">* 필수 항목입니다</div>
                </div>

                <div class="toggle-container">
                    <div class="toggle-title">1인분</div>
                    <div class="toggle-description">해당 음식의 정보가 1인분 기준이면 체크해주세요</div>
                    <div class="toggle-wrapper" id="isPerServingToggle">
                        <div class="toggle-circle"></div>
                    </div>
                </div>
                

                <div class="toggle-container">
                    <div class="toggle-title">추천음식 등록 여부</div>
                    <div class="toggle-description">추천음식에는 0~500Kcal의 음식만 등록이 가능해요</div>
                    <div class="toggle-wrapper" id="isRecommendedToggle">
                        <div class="toggle-circle"></div>
                    </div>
                </div>
                

                <div class="button-wrapper">
                    <div class="button-next" id="foodDetailAdd">추가하기</div>
                </div>
            `;
            break;
        default:
            break;
    }

    container.html(foodDetialHTML);

    updateFormNextButton();
    loadFoodDetailData();
}

registerViewLoader('foodDetail', loadFoodDetail);

function validateInput(input) {
    const value = input.value.trim();
    const isNumberField = input.classList.contains("only-number");
    const isRequired = input.id === "foodName" || input.id === "foodWeight";

    // reset classes
    input.classList.remove("error", "valid");

    // 필수값 체크
    if (isRequired && value === "") {
        input.classList.add("error");
        return;
    }

    // number 타입 입력값 체크
    if (isNumberField) {
        const numValue = parseFloat(value);
    
        if (value === "") {
            if (!isRequired) return;
            else {
                input.classList.add("error");
                return;
            }
        }
    
        if (isNaN(numValue)) {
            input.classList.add("error");
            return;
        }
    }
    

    // 유효한 경우
    input.classList.add("valid");
    
}

// 유효성 검사만 수행하는 함수
function isFormValid() {
    let isValid = true;

    $("#foodDetail .input").each(function () {
        const $input = $(this);
        const value = $input.val().trim();
        const isRequired = this.id === "foodName" || this.id === "foodWeight";

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

// 버튼 상태만 업데이트하는 함수
function updateFormNextButton() {
    const $editButton = $("#foodDetail .button-next");
    const valid = isFormValid();

    if (valid) {
        $editButton.removeClass("disabled");
    } else {
        $editButton.addClass("disabled");
    }
}


function updateRecommendedToggleLock() {
    const kcalVal = parseFloat($("#kcal").val());
    const $toggle = $("#isRecommendedToggle");

    const isValidKcal = !isNaN(kcalVal) && kcalVal >= 0 && kcalVal <= 500;

    // 유효 범위를 벗어났을 때는 비활성화
    if (!isValidKcal) {
        $toggle.removeClass("active");
        $toggle.addClass("disabled"); 
    } else {
        $toggle.removeClass("disabled");
    }
}


function getIdFromUrl() {
    const urlPath = window.location.pathname;
    const regex = /\/(\d+)$/;  // 마지막 숫자 ID 추출
    const match = urlPath.match(regex);
    return match ? match[1] : null;  // ID가 있으면 반환, 없으면 null
}


async function getFoodData() {
    const foodId = getIdFromUrl();
    try {
        const response = await getFood(foodId);
        console.log("음식 단일 조회: ", response);
        
        return response.data;
    } catch (err) {
        console.error(err);
    }
}


function populateFoodDetails(data) {
    if (!data) return;

    $("#foodName").val(data.foodName);
    $("#providedBy").val(data.providedBy);
    $("#kcal").val(data.kcal);
    $("#carbo").val(data.carbo);
    $("#protein").val(data.protein);
    $("#fat").val(data.fat);
    $("#foodWeight").val(data.foodWeight);

    // Unit Option
    $(".unit-option").removeClass("active");  // 모든 유닛 옵션에서 active 클래스 제거
    $(".unit-option").each(function () {
        if ($(this).data("query") === data.unit) {
            $(this).addClass("active");
        }
    });

    // Data Type Option
    $(".data-type-option").removeClass("active");  // 모든 데이터 타입 옵션에서 active 클래스 제거
    $(".data-type-option").each(function () {
        if ($(this).data("query") === data.foodType) {
            $(this).addClass("active");
        }
    });

    // Per Serving Toggle
    const perServingToggle = $("#isPerServingToggle");
    if (data.isPerServing) {
        perServingToggle.addClass("active");
    } else {
        perServingToggle.removeClass("active");
    }

    // Recommended Toggle
    const recommendedToggle = $("#isRecommendedToggle");
    if (data.isRecommended) {
        recommendedToggle.addClass("active");
    } else {
        recommendedToggle.removeClass("active");
    }

    updateFormNextButton();  // 데이터가 로드되면 버튼 상태 업데이트
}


async function loadFoodDetailData() {
    const id = getIdFromUrl();
    if (id) {
        const foodData = await getFoodData(id);  // ID에 맞는 더미 데이터 가져오기
        populateFoodDetails(foodData);  // 데이터를 필드에 채우기
    }
}


function getFoodDetailValues() {
    const foodName = $("#foodName").val()?.trim() || "";
    const providedBy = $("#providedBy").val()?.trim() || "";
    const kcal = parseFloat($("#kcal").val()) || 0;
    const carbo = parseFloat($("#carbo").val()) || 0;
    const protein = parseFloat($("#protein").val()) || 0;
    const fat = parseFloat($("#fat").val()) || 0;
    const foodWeight = parseFloat($("#foodWeight").val()) || 0;

    // 선택된 데이터 종류
    const foodType = $(".data-type-option.active").data("query") || "";

    // 선택된 단위 (g/ml)
    const unit = $(".unit-option.active").data("query") || "";

    // toggle 상태 체크
    const isPerServing = $("#isPerServingToggle").hasClass("active");
    const isRecommended = $("#isRecommendedToggle").hasClass("active");

    // description은 share 모드에서만 존재함 (food에 필요는없음)
    // const description = $("#description").length ? $("#description").val()?.trim() : "";

    return {
        foodName,
        providedBy,
        kcal,
        carbo,
        protein,
        fat,
        foodWeight,
        foodType,
        unit,
        isPerServing,
        isRecommended,
    };
}

// 1인분 토글
$(document).on("click", "#isPerServingToggle", function () {
    $(this).toggleClass("active");
    const isActive = $(this).hasClass('active');
    console.log('Toggle is active:', isActive);
});

// 추천음식 토글
$(document).on("click", "#isRecommendedToggle", function () {
    // disabled일 경우 클릭 막기
    if ($(this).hasClass("disabled")) return;
    
    $(this).toggleClass("active");
    const isActive = $(this).hasClass('active');
    console.log('Toggle is active:', isActive);
});

// 인풋 포커스아웃
$(document).on("blur", "#foodDetail .input", function () {
    validateInput(this);
    updateFormNextButton()
});

// 숫자만 입력되도록 필터링
$(document).on("input", ".only-number", function () {
    const cleaned = this.value.replace(/[^0-9.]/g, ""); // 소수점 허용
    if (this.value !== cleaned) {
        this.value = cleaned;
    }
});

// kcal 입력이 바뀔 때마다 recommended 토글 체크
$(document).on("input", "#kcal", function () {
    const cleaned = this.value.replace(/[^0-9.]/g, "");
    if (this.value !== cleaned) {
        this.value = cleaned;
    }
    updateRecommendedToggleLock();
    updateFormNextButton(); // kcal도 유효성에 영향 줄 수 있으니까
});

// 타입 옵션 버튼
$(document).on("click", "#foodDetail .data-type-option", function () {
    $(this).siblings().removeClass("active");
    $(this).addClass("active");
});
// 단위 옵션 버튼
$(document).on("click", "#foodDetail .unit-option", function () {
    $(this).siblings().removeClass("active");
    $(this).addClass("active");
});


// 취소하기 버튼
$(document).on("click", "#foodDetailCancel", function () {
    window.history.back();
});

// 수정하기 버튼
$(document).on("click", "#foodDetailEdit", function () {
    if ($(this).hasClass("disabled")) return;
    
    const foodId = getIdFromUrl();
    const foodDetailValues = getFoodDetailValues();
    console.log("수정할 음식 정보:", foodDetailValues); 
    

    showCustomAlert({
        type: 4,
        onCancel: function () {
            console.log("수정 취소");
        },
        onNext: async function () {        
            try {
                const response = await updateFood(foodId, foodDetailValues);
                showCustomAlert({
                    type: 3,
                    message: response.message,
                    onNext: function () {
                        updateURL('food-management');
                    }
                });
            } catch(err) {
                console.log(err);
            }
        }
    });
});

//공유하기 버튼
$(document).on("click", "#foodDetailShare", function () {
    if ($(this).hasClass("disabled")) return;

    const foodDetailValues = getFoodDetailValues();
    console.log("공유할 음식 정보:", foodDetailValues);
});

// 추가하기 버튼
$(document).on("click", "#foodDetailAdd", async function () {
    if ($(this).hasClass("disabled")) return;

    const foodDetailValues = getFoodDetailValues();
    console.log(foodDetailValues);
    try {
        const response = await createFood(foodDetailValues);
        showCustomAlert({
            type: 3,
            message: response.message,
            onNext: function () {
                updateURL('food-management');
            }
        });
    } catch(err) {
        console.log(err);
    }
    
});