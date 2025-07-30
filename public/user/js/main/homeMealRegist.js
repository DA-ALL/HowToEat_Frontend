import { showMain, resetHomeMealView, resetSearchView, resetRegistView } from '../components/routers.js';
import { setLastMainPath } from '../components/nav-bottom.js';
import { showToast } from '../components/toast.js';

// 탄단지 섹션 렌더링 (상단 메시지, 바 포함)
export function renderIncreaseCPFbar(callback) {
    const pathParts = window.location.pathname.split("/");
    const mealKey = pathParts[2];
    const mealKor = mealToKor(mealKey);
    const selectedDate = pathParts[3];
    const mealTime = pathParts[2].toUpperCase();
    const foodId = pathParts[6];

    const macrosRequest = $.ajax({
        url: `${window.DOMAIN_URL}/daily-summaries/${selectedDate}/meal-time/${mealTime}/macros`,
        method: 'GET'
    });

    const foodRequest = $.ajax({
        url: `${window.DOMAIN_URL}/food/${foodId}`,
        method: 'GET'
    });

    $.when(macrosRequest, foodRequest).done(function (macrosRes, foodRes) {
        const raw = macrosRes[0].data;
        const userConsumedData = {
        carbo: { consumed: raw.consumedCarbo, target: raw.targetCarbo },
        protein: { consumed: raw.consumedProtein, target: raw.targetProtein },
        fat: { consumed: raw.consumedFat, target: raw.targetFat }
        };
        const foodInfo = foodRes[0].data;
        // console.log(userConsumedData);
        // console.log(foodInfo);

        const cpfBarHTML = `
            <div class="home-meal-container padding">
                <div class="title-format">${mealKor}의 탄단지</div>
                <div class="cpf-kcal-left-message-wrapper">
                    ${getMessageFormat(userConsumedData, foodInfo)}
                    <div class="cpf-kcal-tail-svg">${getTailSvg()}</div>
                </div>
                ${createBarContainer(mealKor, userConsumedData, foodInfo)}
            </div>
            <div class="divider large"></div>
        `;

        const mealRegistHTML = renderMealRegist(mealKor, userConsumedData, foodInfo);
        const mealAdjustHTML = renderMealAdjust(mealKor, userConsumedData, foodInfo);
        const combinedHTML = mealRegistHTML + cpfBarHTML + mealAdjustHTML;

        callback(combinedHTML);
    }).fail(function () {
        callback(`<div class="error">데이터를 불러오는 데 실패했습니다.</div>`);
    });
}




// 음식 정보 등록 카드 렌더링 (이름, g, 이미지 업로드 등)
export function renderMealRegist(mealKor, userConsumedData, foodInfo) {
    const commonHeader = `
        <div id="headerNav" data-title="${mealKor} 등록하기" data-type="2"></div>
        <div class="home-meal-regist-container padding">
            <div class="text-wrapper">
                <div class="title">${foodInfo.foodName}</div>
                <div class="sub-title truncate">${Math.round(foodInfo.foodWeight)}g</div>
            </div>
            <div class="image-container">
                <img class="new-image" src="">
                <img class="preview-image" src="/user/images/icon_camera.png">
                <input type="file" accept="image/*" class="image-input" style="display: none;">
            </div>
            <div class="food-info-container">
                <div class="food-info-wrapper">
                    <span class="title">칼로리</span>
                    <span class="amount kcal">${(foodInfo.kcal).toFixed(1)}kcal</span>
                </div>

                <div class="divider column"></div>

                <div class="food-info-wrapper">
                    <span class="title">탄수화물</span>
                    <span class="amount carbo">${(foodInfo.carbo).toFixed(1)}g</span>
                </div>

                <div class="divider column"></div>

                <div class="food-info-wrapper">
                    <span class="title">단백질</span>
                    <span class="amount protein">${(foodInfo.protein).toFixed(1)}g</span>
                </div>

                <div class="divider column"></div>

                <div class="food-info-wrapper">
                    <span class="title">지방</span>
                    <span class="amount fat">${(foodInfo.fat).toFixed(1)}g</span>
                </div>
            </div>
        </div>
        <div class="divider large"></div>
    `;
    return `
        ${commonHeader}
    `;
}

// 섭취량 조절 탭 렌더링 (간편/직접 입력 탭 포함)
export function renderMealAdjust(mealKey, userConsumedData, foodInfo) {
    window.registFoodData = foodInfo;
    window.userConsumedData = userConsumedData;
    window.mealKey = mealKey;
    window.lastPortionRatio = 1;
    
    const mealKor = mealToKor(mealKey);
    const commonHeader = `
        <div class="home-meal-adjust-container padding">
            <div class="text-wrapper">
                <div class="title">섭취량 조절</div>
                <div class="sub">* 선택한 음식 1인분에 대한 평균 g으로 자동 표기돼요.</div>
            </div>

            <div class="toggle-tab">
                <div class="tab easy-input active">간편 입력</div>
                <div class="tab manual-input">직접 입력</div>
            </div>

            <div class="input-content easy-input-content">
                 ${renderPortionItems(foodInfo)}
            </div>

            <div class="input-content manual-input-content" style="display: none;">
                <div class="manual-wrapper">
                    <span class="hidden-text">g</span>
                    <input type="number" class="manual-input-field" value="${foodInfo.foodWeight}" inputmode="numeric" pattern="[0-9]*"/>
                    <span class="unit">g</span>
                </div>
            </div>
        </div>
        <div class="button-container">
            <div id="registButton" data-food-id="${foodInfo.foodId}" data-food-name="${foodInfo.foodName}" data-is-per-serving="${foodInfo.isPerServing}" data-food-code="${foodInfo.foodCode}" data-unit="${foodInfo.unit}" data-provided-by="${foodInfo.providedBy}" data-source="${foodInfo.source}">${mealKor} 등록</div>
        </div>
    `;
    return `
        ${commonHeader}
    `;
    
}

// let isFixed = false;
// let prevScroll = 0;

// $(window).on("scroll", function () {
//     const $target = $(".food-info-container");
//     const $header = $(".header-nav");
    
//     if ($target.length === 0 || $header.length === 0) return;

//     const headerHeight = $header.outerHeight(); // 실제 헤더 높이
//     const offsetTop = $target.offset().top;
//     const scrollTop = $(window).scrollTop() + headerHeight;

//     if (!isFixed && scrollTop > offsetTop) {
//         $target.addClass("fixed");
//         isFixed = true;
//     }

//     if (isFixed && scrollTop < prevScroll) {
//         $target.removeClass("fixed");
//         isFixed = false;
//     }

//     prevScroll = scrollTop;
// });


// 영어 meal key를 한글로 변환
function mealToKor(meal) {
    switch (meal) {
        case 'breakfast': return '아침';
        case 'lunch': return '점심';
        case 'dinner': return '저녁';
        case 'snack': return '간식';
        default: return '';
    }
}

// 1/1 ~ 1/10 또는 1/30 portion-item HTML 생성
function renderPortionItems(registFoodData) {
    const kcal = Number(registFoodData.kcal || 0).toFixed(1);
    const type = registFoodData.type;
    
    let maxPortion = 10;
    if (type === 'processed_food') maxPortion = 30;

    const html = [];
    for (let i = 1; i <= maxPortion; i++) {
        const ratioText = `1 / ${i}`;
        const ratioValue = 1 / i;
        const kcalText = `${(kcal * ratioValue).toFixed(1)} kcal`;

        html.push(`
            <div class="portion-item${i === 1 ? ' active' : ''}">
                <span class="ratio">${ratioText}</span>
                <span class="kcal">${kcalText}</span>
            </div>
        `);
    }

    return html.join('');
}

// 탄/단/지 바 전체 HTML 컨테이너 생성
function createBarContainer(mealKey, userConsumedData, registFoodData) {
    const types = ['carbo', 'protein', 'fat'];
    return `
        <div class="home-meal-bar-container">
            ${types.map(type => {
                const consumed = Number(userConsumedData[type]?.consumed || 0);
                const target = Math.trunc(Number(userConsumedData[type]?.target || 0));
                const upcoming = Number(registFoodData[type] || 0); // 예정 섭취량
                const newConsumed = (consumed + upcoming).toFixed(1);

                const rawPercent = target > 0 ? (consumed / target) * 100 : 0;
                const rawIncreasePercent = target > 0 ? (newConsumed / target) * 100 : 0;

                return createBar(
                    mealKey,
                    type,
                    consumed,
                    newConsumed,
                    target,
                    Math.min(rawPercent, 100).toFixed(1),
                    rawPercent,
                    Math.min(rawIncreasePercent, 100).toFixed(1),
                    rawIncreasePercent
                );
            }).join('')}
        </div>
    `;
}

// 개별 탄/단/지 바 HTML 생성
function createBar(mealKey, type, consumed, newConsumed, target, percent, rawPercent, increasedPercent, rawIncreasePercent) {
    const labelMap = {
        carbo: "탄수화물",
        protein: "단백질",
        fat: "지방"
    };

    const label = labelMap[type];

    let color = "var(--red500)";
    let fontColor = "var(--red500)";

    let increaseColor = "#ffc0c0";
    let increaseFontColor = "var(--red500)";

    //현재 섭취한 탄단지 바 색상
    if (rawPercent > 105) {
        color = '#814949';
        fontColor = '#814949';
    } else if (rawPercent >= 0) {
        color = 'var(--red500)';
        fontColor = 'var(--red500)';
    }

    // 등록 후 탄단지 바 색상
    if (rawIncreasePercent > 105) {
        increaseColor = '#aa9595';
        increaseFontColor = '#814949';
    }  else if (rawIncreasePercent >= 0) {
        increaseColor = '#ffc0c0';
        increaseFontColor = 'var(--red500)';
    }

    return `
        <div class="home-meal-bar-wrapper ${type}">
            <div class="meal-title ${type}">${label}</div>
            <div class="meal-bar-wrapper">
                <div class="bar-wrapper">
                    <div class="bar-back"></div>
                    <div class="bar-front bar-increase ${type}" style="width: 0%; background: ${increaseColor}; animation: blinkBarOpacity 1.5s infinite ease-in-out, fillBar-${mealKey}-${type}-increase 1s forwards;"></div>
                    <div class="bar-front ${type}" style="width: ${percent}%; background: ${color};"></div>
                </div>
                <div class="text-wrapper">
                    <span class="consumed ${type} search" 
                        data-from="${consumed}" 
                        data-to="${newConsumed}" 
                        data-type="${type}"
                        style="color: ${increaseFontColor};">
                        ${newConsumed}g
                    </span>
                    <span class="divide">/</span>
                    <span class="target ${type}">${target}g</span>
                </div>
            
            </div>
            <style>
                @keyframes fillBar-${mealKey}-${type}-increase {
                    from { width: 0%; }
                    to { width: ${increasedPercent}%; }
                }
                @keyframes blinkBarOpacity {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
                @keyframes blinkFontOpacity {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            </style>
        </div>
    `;
    
}

// 메시지 텍스트 생성 (과섭취 여부에 따라 문구 다름)
function getMessageFormat(userConsumedData, foodInfo) {
    const types = ['carbo', 'protein', 'fat'];

    for (const type of types) {
        const consumed = Number(userConsumedData[type]?.consumed || 0);
        const added = foodInfo ? foodInfo[type] : Number(foodInfo[type] || 0);
        const target = Number(userConsumedData[type]?.target || 0);

        const newConsumed = consumed + added;
        const rawIncreasePercent = target > 0 ? (newConsumed / target) * 100 : 0;

        if (rawIncreasePercent > 105) {
            return `<span class="cpf-kcal-left-message">아침 목표치보다 많아요. 양을 조절해주세요 ❗️</span>`;
        }
    }

    return `<span class="cpf-kcal-left-message">아래와 같이 추가될 거에요</span>`;
}

// 숫자 카운팅 애니메이션
function animateCountUp($element, from, to, duration = 1200) {
    const start = performance.now();
    
    function update(timestamp) {
        const progress = Math.min((timestamp - start) / duration, 1);
        const current = (from + (to - from) * progress).toFixed(1);
        $element.text(`${current}g`);
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// 전체 바 숫자 애니메이션 적용
export function runAllCountAnimations() {
    $('.home-meal-bar-wrapper .consumed').each(function () {
        const $el = $(this);
        const from = Number($el.data('from'));
        const to = Number($el.data('to'));

        if (!isNaN(from) && !isNaN(to)) {
            animateCountUp($el, from, to);
        }
    });
}

// 꼬리 SVG 아이콘 생성
function getTailSvg() {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="26" viewBox="0 0 28 26" fill="none">
            <g>
                <path d="M15.1547 15.3682C14.6415 16.2571 13.3585 16.2571 12.8453 15.3682L6.49445 4.36816C5.98125 3.47927 6.62275 2.36816 7.64915 2.36816L20.3509 2.36816C21.3773 2.36816 22.0188 3.47928 21.5056 4.36816L15.1547 15.3682Z" fill="white"/>
            </g>
            <defs>

            </defs>
        </svg>
    `;
}

//
// regist 버튼 클릭 시
$(document).on('click', '#registButton', function () {
    const $btn = $(this);
    const pathParts = window.location.pathname.split("/");
    const mealTime = pathParts[2];
    const mealTimeUpper = mealTime.toUpperCase();
    const selectedDate = pathParts[3];

    const formData = new FormData();

    formData.append("foodCode", $btn.data("food-code"));
    formData.append("foodName", $btn.data("food-name"));
    formData.append("mealTime", mealTimeUpper);
    formData.append("foodWeight", $btn.data("weight"));
    formData.append("foodType", $btn.data("type"));
    formData.append("kcal", $btn.data("kcal"));
    formData.append("carbo", $btn.data("carbo"));
    formData.append("protein", $btn.data("protein"));
    formData.append("fat", $btn.data("fat"));
    formData.append("providedBy", $btn.data("provided-by") || "");
    formData.append("source", $btn.data("source"));
    formData.append("isPerServing", $btn.data("is-per-serving"));
    formData.append("unit", $btn.data("unit"));
    // 이미지 파일이 있을 경우 추가
    if (compressedFile) {
        formData.append("foodImageFile", compressedFile, compressedFile.name);
    }

    $.ajax({
        type: "POST",
        url: `${window.DOMAIN_URL}/consumed-foods/search`,
        data: formData,
        processData: false, // 필수: jQuery가 FormData를 문자열로 변환하지 않도록
        contentType: false, // 필수: 브라우저가 boundary 포함한 content-type 자동 설정
        success: function (res) {
            resetHomeMealView();
            resetSearchView();
            resetRegistView();

            const targetPath = `/main/${mealTime}/${selectedDate}`;
            history.pushState({ view: 'main' }, '', targetPath);
            window.lastMainPath = targetPath;
            if (typeof setLastMainPath === 'function') {
                setLastMainPath(targetPath);
            }

            showMain(mealTime);
        }
    });
});



// favorite 버튼 클릭 시
$(document).on('click', '#favoriteButton', function () {
    const $btn = $(this);
    const pathParts = window.location.pathname.split("/");
    const mealTime = pathParts[2];
    const mealTimeUpper = mealTime.toUpperCase();
    const selectedDate = pathParts[3];

    const fields = {
        foodCode: $btn.data('food-code'),
        foodName: $btn.data('food-name'),
        mealTime: mealTimeUpper,
        foodWeight: $btn.data('weight'),
        foodType: $btn.data('type'),
        kcal: $btn.data('kcal'),
        carbo: $btn.data('carbo'),
        protein: $btn.data('protein'),
        fat: $btn.data('fat'),
        providedBy: $btn.data('provided-by') || "",
        isPerServing: $btn.data('is-per-serving'),
        unit: $btn.data('unit'),
        source: "User",
        foodImageUrl: compressedFile // 예시
    };

    // 기존 formData 클리어 후 새로 이미지 추가
    let globalFormData = new FormData(); // 새로 생성해서 덮기

    // 기존 globalFormData에 필드 추가
    for (const key in fields) {
        globalFormData.append(key, fields[key]);
    }

    $.ajax({
        type: 'POST',
        url: `${window.DOMAIN_URL}/favorite-food/search`,
        data: globalFormData,
        contentType: false,
        processData: false,
        success: function () {
            showToast("즐겨찾기에 추가되었습니다.", "#homeMealRegist")
            // console.log("업로드 성공");
        },
        error: function (err) {
            console.error("업로드 실패", err);
        }
    });
});



// 주어진 비율로 전체 UI 업데이트 (amount, bar, message, 색상, consumed 텍스트 포함)
function updateUIWithRatio(ratio) {
    const regist = window.registFoodData;
    const user = window.userConsumedData;
    const mealKey = window.mealKey;

    const adjusted = {
        kcal: (regist.kcal * ratio),
        carbo: regist.carbo * ratio,
        protein: regist.protein * ratio,
        fat: regist.fat * ratio,
    };
    // 정보 업데이트
    $('.food-info-wrapper .amount.kcal').text(`${(adjusted.kcal).toFixed(1)}kcal`);
    $('.food-info-wrapper .amount.carbo').text(`${(adjusted.carbo).toFixed(1)}g`);
    $('.food-info-wrapper .amount.protein').text(`${(adjusted.protein).toFixed(1)}g`);
    $('.food-info-wrapper .amount.fat').text(`${(adjusted.fat).toFixed(1)}g`);
    

    // 메시지 갱신
    const message = getMessageFormat(user, adjusted);
    $('.cpf-kcal-left-message-wrapper .cpf-kcal-left-message').replaceWith(message);

    // 바 업데이트
    ['carbo', 'protein', 'fat'].forEach(type => {
        const newValue = user[type].consumed + adjusted[type];
        const rawIncreasePercent = user[type].target > 0 ? (newValue / user[type].target) * 100 : 0;
        const percentLimited = Math.min(rawIncreasePercent, 100);
        const barId = `fillBar-${mealKey}-${type}-increase-${Date.now()}`;

        // 색상
        let color = "#ffc0c0";
        let fontColor = "var(--red500)";
        if (rawIncreasePercent > 105) {
            color = '#aa9595';
            fontColor = '#814949';
        }

        // 바 초기화 + 애니메이션
        const $bar = $(`.bar-front.bar-increase.${type}`);
        $bar.css({ width: '0%', background: color, animation: 'none' });
        void $bar[0].offsetWidth;
        $bar.css({ animation: `blinkBarOpacity 1.5s infinite ease-in-out, ${barId} 1s forwards` });
        $(`style[data-keyframe="${type}"]`).remove();
        $('head').append(`
            <style data-keyframe="${type}">
                @keyframes ${barId} {
                    from { width: 0%; }
                    to { width: ${percentLimited}%; }
                }
            </style>
        `);

        // consumed 텍스트 및 애니메이션
        const $el = $(`.consumed.${type}.search`);
        const from = parseFloat($el.attr('data-from')) || 0;
        const to = Math.round(newValue * 10) / 10;

        $el.attr('data-from', from).attr('data-to', to).css('color', fontColor);
        animateCountUp($el, from, to);
    });
}

// 버튼에 최신 데이터 저장
export function updateNextButtonData() {
    const regist = window.registFoodData;

    const id = regist.id;
    const name = regist.name;
    const type = regist.type;
    const detail = regist.detail;
    const weightText = $('.sub-title.truncate').text().replace('g', '').trim();

    const kcal = $('.food-info-wrapper .amount.kcal').text().replace('kcal', '').trim();
    const carbo = $('.food-info-wrapper .amount.carbo').text().replace('g', '').trim();
    const protein = $('.food-info-wrapper .amount.protein').text().replace('g', '').trim(); 
    const fat = $('.food-info-wrapper .amount.fat').text().replace('g', '').trim();
    const $buttons = $('#registButton');
    const foodImgUrl = $('.new-image').attr('src');

    $buttons.each(function () {
        $(this)
            .attr('data-id', id)
            .attr('data-name', name)
            .attr('data-type', type)
            .attr('data-detail', detail)
            .attr('data-weight', weightText)
            .attr('data-kcal', kcal)
            .attr('data-carbo', carbo)
            .attr('data-protein', protein)
            .attr('data-fat', fat)
            .attr('data-img', foodImgUrl);
    });
}


// 이미지 클릭 시 파일 선택창 열기
$(document).on('click', '.image-container', function (e) {
    const $input = $(this).find('.image-input');
    if ($input.length > 0) {
        $input[0].click(); // 직접 DOM 메서드 호출 (trigger 보다 안전)
    }
    e.stopPropagation(); // 꼭 버블 차단
});

let compressedFile = null;

// 이미지 선택 시 formData에 미리 넣기
$(document).off('change', '.image-input').on('change', '.image-input', async function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const $container = $(this).closest('.image-container');
    const $newImage = $container.find('.new-image');
    const $previewImage = $container.find('.preview-image');

    const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 720,
        useWebWorker: true,
        maxIteration: 5,
        initialQuality: 0.7
    };

    try {
        compressedFile = await imageCompression(file, options);
        const compressedDataUrl = await imageCompression.getDataUrlFromFile(compressedFile);

        $newImage.attr('src', compressedDataUrl).show();
        $previewImage.hide();

        updateNextButtonData();
        // console.log("압축 성공:", (compressedFile.size / 1024).toFixed(1), "KB");
    } catch (err) {
        console.error("압축 실패:", err);
    }
});



// 간편입력 / 직접입력 탭 전환 처리
$(document).on('click', '.toggle-tab .tab', function () {
    $('.toggle-tab .tab').removeClass('active');
    $(this).addClass('active');

    const isEasy = $(this).hasClass('easy-input');

    $('.easy-input-content').toggle(isEasy);
    $('.manual-input-content').toggle(!isEasy);
});

// [직접 입력] 탭 클릭 시 → 현재 g값 기준 UI 갱신
$(document).on('click', '.manual-input', function () {
    const gram = parseFloat($('.manual-input-field').val()) || 0;
    const base = window.registFoodData.foodWeight;
    const ratio = gram / base;

    if (!isNaN(ratio) && ratio >= 0) {
        $('.sub-title.truncate').text(`${Math.round(gram)}g`);
        updateUIWithRatio(ratio);
        updateNextButtonData();
    } 
});

// [직접 입력] input에서 포커스 아웃 시 → 입력 g값 기준 UI 갱신
$(document).on('blur', '.manual-input-field', function () {
    const gram = parseFloat($(this).val()) || 0;
    const base = window.registFoodData.foodWeight;
    const ratio = gram / base;

    if (!isNaN(ratio) && ratio >= 0) {
        $('.sub-title.truncate').text(`${Math.round(gram)}g`);
        updateUIWithRatio(ratio);
        updateNextButtonData();
    }
});


// [간편 입력] 탭 클릭 시 → 마지막 클릭했던 portion-item 비율로 UI 복원
$(document).on('click', '.easy-input', function () {
    const ratio = window.lastPortionRatio;
    const base = window.registFoodData.foodWeight;
    const gram = Math.round(base * ratio);
    $('.sub-title.truncate').text(`${gram}g`);
    updateUIWithRatio(window.lastPortionRatio);
    updateNextButtonData();
});


$(document).on('click', '.portion-item', function () {
    const $this = $(this);
    const ratioText = $this.find('.ratio').text(); // 예: "1 / 3"
    const [numerator, denominator] = ratioText.split('/').map(v => parseFloat(v.trim()));
    const ratio = numerator / denominator;

    // 상태 및 클래스 업데이트
    $('.portion-item').removeClass('active');
    $this.addClass('active');
    window.lastPortionRatio = ratio;

    const original = window.registFoodData;
    const user = window.userConsumedData;
    const mealKey = window.mealKey;

    // 1. 서브타이틀 g 업데이트
    const adjustedWeight = Math.round(original.foodWeight * ratio);
    $('.sub-title.truncate').text(`${adjustedWeight}g`);

    // 2. kcal/탄단지 계산
    const adjusted = {
        kcal: Math.round(original.kcal * ratio),
        carbo: original.carbo * ratio,
        protein: original.protein * ratio,
        fat: original.fat * ratio,
    };

    // 3. 메시지 업데이트
    const message = getMessageFormat(user, adjusted);
    $('.cpf-kcal-left-message-wrapper .cpf-kcal-left-message').replaceWith(message);

    // 4. 탄단지 바 애니메이션 + 숫자 업데이트
    ['carbo', 'protein', 'fat'].forEach(type => {
        const newValue = user[type].consumed + adjusted[type];
        const rawIncreasePercent = user[type].target > 0 ? (newValue / user[type].target) * 100 : 0;
        const percentLimited = Math.min(rawIncreasePercent, 100);

        const uniqueKey = `fillBar-${mealKey}-${type}-increase-${Date.now()}`;
        const $bar = $(`.bar-front.bar-increase.${type}`);

        let color = '#ffc0c0';
        let fontColor = 'var(--red500)';
        if (rawIncreasePercent > 105) {
            color = '#aa9595';
            fontColor = '#814949';
        }

        $bar.css({ width: '0%', background: color, animation: 'none' });
        void $bar[0].offsetWidth;
        $bar.css({ animation: `blinkBarOpacity 1.5s infinite ease-in-out, ${uniqueKey} 1s forwards` });

        $(`style[data-keyframe="${type}"]`).remove();
        $('head').append(`
            <style data-keyframe="${type}">
                @keyframes ${uniqueKey} {
                    from { width: 0%; }
                    to { width: ${percentLimited}%; }
                }
            </style>
        `);

        const $el = $(`.consumed.${type}`);
        const from = parseFloat($el.attr('data-from')) || 0;
        const to = Math.round(newValue * 10) / 10;

        $el.attr({ 'data-from': from, 'data-to': to }).css('color', fontColor);
        animateCountUp($el, from, to);
    });

    // 5. UI, 버튼 업데이트
    updateUIWithRatio(ratio);
    updateNextButtonData();



});
