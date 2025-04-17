import { showMain, resetHomeMealView, resetSearchView, resetRegistView } from '../components/routers.js';
import { setLastMainPath } from '../components/nav-bottom.js';

const mealSearchData = [
    {
        id: 42,
        type: "ingredient_food",
        name: "소고기 채끝살 (생것)",
        detail: "수입산(미국산)",
        weight: 100,
        kcal: 217,
        carbo: 0,
        protein: 26,
        fat: 12,
    },
    {
        id: 87,
        type: "processed_food",
        name: "소고기 한우볶음구이",
        detail: "(주)예현 소고기",
        weight: 100,
        kcal: 320,
        carbo: 200,
        protein: 21,
        fat: 24,
    },
    {
        id: 13,
        type: "ingredient_food",
        name: "소고기 1등급++ (생것)",
        detail: "수입산(미국산)",
        weight: 100,
        kcal: 245,
        carbo: 0,
        protein: 23,
        fat: 17,
    },
    {
        id: 74,
        type: "processed_food",
        name: "소고기 한우볶음구이",
        detail: "청정원",
        weight: 100,
        kcal: 310,
        carbo: 5,
        protein: 20,
        fat: 22,
    },
    {
        id: 8,
        type: "cooked_food",
        name: "소고기 구이",
        detail: "급식",
        weight: 100,
        kcal: 290,
        carbo: 1,
        protein: 24,
        fat: 20,
    },
    {
        id: 91,
        type: "ingredient_food",
        name: "소고기 채끝살 (생것)",
        detail: "수입산(미국산)",
        weight: 100,
        kcal: 217,
        carbo: 0,
        protein: 26,
        fat: 12,
    },
    {
        id: 56,
        type: "processed_food",
        name: "소고기 한우볶음구이",
        detail: "(주)예현 소고기",
        weight: 100,
        kcal: 320,
        carbo: 4,
        protein: 21,
        fat: 24,
    },
    {
        id: 34,
        type: "ingredient_food",
        name: "소고기 1등급++ (생것)",
        detail: "수입산(미국산)",
        weight: 100,
        kcal: 245,
        carbo: 0,
        protein: 23,
        fat: 17,
    },
    {
        id: 99,
        type: "processed_food",
        name: "소고기 한우볶음구이",
        detail: "청정원",
        weight: 100,
        kcal: 310,
        carbo: 5,
        protein: 20,
        fat: 22,
    },
    {
        id: 21,
        type: "cooked_food",
        name: "소고기 구이",
        detail: "급식",
        weight: 100,
        kcal: 290,
        carbo: 1,
        protein: 24,
        fat: 20,
    },
];

const mealFavoriteData = [
    {
        id: 42,
        type: "ingredient_food",
        name: "소고기 채끝살 (생것)",
        detail: "수입산(미국산)",
        weight: 100,
        kcal: 217,
        carbo: 0,
        protein: 26,
        fat: 12,
    },
    {
        id: 87,
        type: "processed_food",
        name: "소고기 한우볶음구이",
        detail: "(주)예현 소고기",
        weight: 100,
        kcal: 320,
        carbo: 200,
        protein: 21,
        fat: 24,
    },
    {
        id: 13,
        type: "ingredient_food",
        name: "소고기 1등급++ (생것)",
        detail: "수입산(미국산)",
        weight: 100,
        kcal: 245,
        carbo: 0,
        protein: 23,
        fat: 17,
    },
    {
        id: 74,
        type: "processed_food",
        name: "소고기 한우볶음구이",
        detail: "청정원",
        weight: 100,
        kcal: 310,
        carbo: 5,
        protein: 20,
        fat: 22,
    },
    {
        id: 8,
        type: "cooked_food",
        name: "소고기 구이",
        detail: "급식",
        weight: 100,
        kcal: 290,
        carbo: 1,
        protein: 24,
        fat: 20,
    }
];





export function renderMealSearch(mealKey, userConsumedDataTest, registFoodDataTest) {
    window.userConsumedData = userConsumedDataTest;
    window.mealKey = mealKey;
    const mealKor = mealToKor(mealKey);
    return `
      <div id="headerNav" data-title="${mealKor} 등록하기" data-type="2"></div>


      <div class="meal-search-container">

      <div class="search-toggle-wrapper">
            <div class="search-tab-wrapper">
                <div class="tab-button search active">음식 검색</div>
                <div class="tab-button favorite">즐겨찾기</div>
            </div>
      </div>

        <div class="meal-tab-content">
            <div class="meal-search-list padding">
                <div class="search-tool-wrapper">
                    <div class="search-tool">
                        <input class="input-search"></input>
                        <div class="label">
                            <img src="/user/images/icon_search_gray2.png">
                        </div>
                    </div>
                </div>
                <div class="button-container meal-search hidden">
                    <div class="next-button home-meal-search disabled" data-id="" data-type="" data-name="" data-weight="" data-kcal="">다음</div>
                </div>
            </div>

            <div class="meal-favorite-list" style="display: none;">
                <div class="cpf-container padding">
                    <div class="second-title-format">${mealKor}의 탄단지</div>
                    <div class="cpf-kcal-left-message-wrapper">
                        <span class="cpf-kcal-left-message favorite">음식을 선택하면 얼마나 증가되는지 한눈에 볼 수 있어요.</span>
                        <div class="cpf-kcal-tail-svg">${getTailSvg()}</div>
                    </div>

                    ${createBarContainer(mealKey, userConsumedDataTest)}
                </div>
            
                <div class="divider large"></div>

                <div class="favorite-list-container padding">
                    <div class="second-title-format">즐겨찾는 음식</div>

                    <div class="favorite-meal-list-wrapper">
                    ${mealFavoriteData.map(item => `
                        <div class="favorite-meal-item"
                             data-id="${item.id}"
                             data-type="${item.type}"
                             data-name="${item.name}"
                             data-detail="${item.detail}"
                             data-weight="${item.weight}"
                             data-kcal="${item.kcal}"
                             data-carbo="${item.carbo}"
                             data-protein="${item.protein}"
                             data-fat="${item.fat}">
                            <div class="meal-title">${item.name}</div>
                            <div class="text-wrapper">
                                <span class="weight">${item.weight}g</span>
                                <span class="divide">/</span>
                                <span class="kcal">${item.kcal}kcal</span>
                            </div>
                        </div>
                      `).join('')}
                    </div>
                </div>
                <div class="button-container meal-favorite hidden">
                    <div id="registFavoriteButton" class="next-button home-meal-favorite disabled" data-id="" data-type="" data-name="" data-weight="" data-kcal="">다음</div>
                </div>
            </div>
            

        </div>

      </div>

    `;
}

initMealSearchTab()

export function initMealSearchTab() {
    $(document).on('click', '.tab-button', function () {
        const isSearchTab = $(this).hasClass('search');
        const isAlreadyActive = $(this).hasClass('active');

        // 탭 스타일 처리
        $('.tab-button').removeClass('active');
        $(this).addClass('active');

        // 탭 콘텐츠 show/hide
        if (isSearchTab) {
            $('.meal-search-list').show();
            $('.meal-favorite-list').hide();

            const $input = $('.input-search');

            // "음식 검색" 탭을 연속 클릭한 경우 → input 비우고 focus
            if (isAlreadyActive) {
                $input.val('').focus();
                $input.closest('.search-tool').css('border-color', '');
            }
        } else {
            $('.meal-search-list').hide();
            $('.meal-favorite-list').show();
        }
    });

    // input에 값이 있을 때 border-color 바꾸기
    $(document).on('input', '.input-search', function () {
        const hasText = $(this).val().trim() !== '';
        $(this).closest('.search-tool').css('border-color', hasText ? 'var(--gray300)' : '');
    });

    $(document).on('click', '.search-tool', function () {
        $(this).find('.input-search').focus();
    });
}

// 검색 input에서 엔터나 검색 버튼 클릭 시, 조회 시작
$(document).on('keyup', '.input-search', function (e) {
    if (e.key === 'Enter') {
        const keyword = $(this).val().trim();
        $(this).blur();
        handleMealSearch(keyword);
    }
});

//검색 input 돋보기 클릭 시, 엔터와 같은 효과
$(document).on('click', '.search-tool .label img', function () {
    const $input = $(this).closest('.search-tool').find('.input-search');
    const keyword = $input.val().trim();

    setTimeout(() => {
        $input.blur();
    }, 100);
    handleMealSearch(keyword);
});

// 음식 meal-item 클릭 시 active 토글 & 단독 적용
$(document).on('click', '.meal-item', function () {
    const $this = $(this);
    const $container = $('.button-container.meal-search');
    const $button = $container.find('.next-button');

    if ($this.hasClass('active')) {
        // 선택 해제
        $this.removeClass('active');
        $button.removeClass('active').addClass('disabled');
        $container.addClass('hidden');

        // 버튼의 데이터 제거
        $button
            .attr('data-id', '')
            .attr('data-type', '')
            .attr('data-name', '')
            .attr('data-weight', '')
            .attr('data-kcal', '')
            .attr('data-carbo', '')
            .attr('data-protein', '')
            .attr('data-fat', '');

    } else {
        // 기존 active 해제 후 새로 설정
        $('.meal-item.active').removeClass('active');
        $this.addClass('active');

        // 버튼 표시
        $button.removeClass('disabled').addClass('active');
        $container.removeClass('hidden');

        // 선택된 item의 데이터 복사
        $button
            .attr('data-id', $this.data('id'))
            .attr('data-type', $this.data('type'))
            .attr('data-name', $this.data('name'))
            .attr('data-weight', $this.data('weight'))
            .attr('data-kcal', $this.data('kcal'))
            .attr('data-carbo', $this.data('carbo'))
            .attr('data-protein', $this.data('protein'))
            .attr('data-fat', $this.data('fat'));

    }
});

function handleMealSearch(keyword) {
    const $list = $('.meal-search-list');
    $list.find('.meal-results').remove(); // 이전 검색 결과 제거

    if (keyword) {
        renderMealSearchResults(keyword);
        $('.input-search').closest('.search-tool').css('border-color', 'var(--gray300)');
    } else {
        $('.input-search').closest('.search-tool').css('border-color', '');
    }
}

function renderMealSearchResults(keyword) {
    const filtered = mealSearchData.filter(item =>
        item.name.includes(keyword)
    );

    const html = filtered.map(item => `
      <div class="meal-item"
           data-id="${item.id}"
           data-type="${item.type}"
           data-name="${item.name}"
           data-weight="${item.weight}"
           data-kcal="${item.kcal}"
           data-carbo="${item.carbo}"
           data-protein="${item.protein}"
           data-fat="${item.fat}">
        <div class="meal-wrapper">
          <div class="meal-type ${typeColorClass(item.type)}">${typeToKor(item.type)}</div>
          <div class="meal-name">${item.name}</div>
          <div class="meal-detail">${item.detail}</div>
        </div>
        <div class="meal-meta">
          <div class="weight">${item.weight}g</div>
          <div class="divide">/</div>
          <div class="kcal">${item.kcal}kcal</div>
        </div>
      </div>
    `).join('');

    $('.meal-search-list').append(`<div class="meal-results">${html}</div>`);
}


// type에 따라 색상 클래스 다르게
function typeColorClass(type) {
    switch (type) {
        case 'ingredient_food': return 'type-ingredient';
        case 'processed_food': return 'type-processed';
        case 'cooked_food': return 'type-cooked';
        case 'custom_food': return 'type-custom';
        default: return '';
    }
}



function mealToKor(meal) {
    switch (meal) {
        case 'morning': return '아침';
        case 'lunch': return '점심';
        case 'dinner': return '저녁';
        case 'snack': return '간식';
        default: return '';
    }
}

function typeToKor(type) {
    switch (type) {
        case 'ingredient_food': return '원재료';
        case 'processed_food': return '가공식품';
        case 'cooked_food': return '음식';
        case 'custom_food': return '유저등록';
        default: return '';
    }
}


// 탄/단/지 바 전체 HTML 컨테이너 생성
function createBarContainer(mealKey, userConsumedData) {
    const types = ['carbo', 'protein', 'fat'];
    return `
        <div class="home-meal-bar-container">
            ${types.map(type => {
                const consumed = Number(userConsumedData[type]?.consumed || 0);
                const target = Number(userConsumedData[type]?.target || 0);

                const rawPercent = target > 0 ? (consumed / target) * 100 : 0;

                return createBar(
                    mealKey,
                    type,
                    consumed,
                    target,
                    Math.min(rawPercent, 100).toFixed(1),
                    rawPercent,
                );
            }).join('')}
        </div>
    `;
}

// 개별 탄/단/지 바 HTML 생성
function createBar(mealKey, type, consumed, target, percent, rawPercent) {
    const labelMap = {
        carbo: "탄수화물",
        protein: "단백질",
        fat: "지방"
    };

    const label = labelMap[type];

    let color = "var(--red500)";
    let fontColor = "var(--red500)";

    if (rawPercent > 105) {
        color = '#814949';
        fontColor = '#814949';
    } else if (rawPercent >= 0) {
        color = 'var(--red500)';
        fontColor = 'var(--red500)';
    }

    return `
        <div class="home-meal-bar-wrapper ${type}">
            <div class="meal-title ${type}">${label}</div>
            <div class="meal-bar-wrapper">
                <div class="bar-wrapper">
                    <div class="bar-back"></div>
                    <div class="bar-front bar-increase ${type}" style="width: 0%; background: ${color}; animation: blinkBarOpacity 1.5s infinite ease-in-out, fillBar-${mealKey}-${type}-increase-favorite 1s forwards;"></div>
                    <div class="bar-front ${type}" 
                         style="width: ${percent}%; background: ${color};"></div>
                </div>
                <div class="text-wrapper">
                    <span class="consumed ${type} favorite" 
                          data-from="${consumed}" 
                          data-to="${consumed}" 
                          data-type="${type}" 
                          style="color: ${fontColor};">
                        ${consumed}g
                    </span>
                    <span class="divide">/</span>
                    <span class="target ${type}">${target}g</span>
                </div>
            </div>
        </div>
        <style>
            @keyframes blinkBarOpacity {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }
            @keyframes blinkFontOpacity {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        </style>
    `;
}

// 탄단지 증가 바 함수
function updateCPFIncreaseBar(selectedItems) {
    const user = window.userConsumedData;
    const mealKey = window.mealKey;

    const total = selectedItems.reduce((acc, item) => {
        acc.carbo += Number(item.carbo || 0);
        acc.protein += Number(item.protein || 0);
        acc.fat += Number(item.fat || 0);
        return acc;
    }, { carbo: 0, protein: 0, fat: 0 });

    const mealKor = mealToKor(mealKey);

    // 탄단지 각각에 대해 105% 초과 여부 검사
    const isOverTarget = ['carbo', 'protein', 'fat'].some(type => {
        const consumed = Number(user[type]?.consumed || 0);
        const target = Number(user[type]?.target || 0);
        const upcoming = Number(total[type] || 0);
        const percent = target > 0 ? ((consumed + upcoming) / target) * 100 : 0;
        return percent > 105;
    });

    const messageHtml = `
        <span class="cpf-kcal-left-message favorite">
            ${isOverTarget
                ? `${mealKor} 목표치보다 많아요. 양을 조절해주세요 ❗️`
                : `음식을 선택하면 얼마나 증가되는지 한눈에 볼 수 있어요.`}
        </span>
        <div class="cpf-kcal-tail-svg">${getTailSvg()}</div>
    `;

    $('.cpf-container .cpf-kcal-left-message-wrapper').html(messageHtml);



    ['carbo', 'protein', 'fat'].forEach(type => {
        const consumed = Number(user[type]?.consumed || 0);
        const target = Number(user[type]?.target || 0);
        const newValue = consumed + total[type];
        const rawIncreasePercent = target > 0 ? (newValue / target) * 100 : 0;
        const percentLimited = Math.min(rawIncreasePercent, 100);
        const uniqueKey = `fillBar-${mealKey}-${type}-increase-favorite`;

        // 색상 계산
        let color = '#ffc0c0';
        let fontColor = 'var(--red500)';
        if (rawIncreasePercent > 105) {
            color = '#aa9595';
            fontColor = '#814949';
        }

        const $bar = $(`.bar-front.bar-increase.${type}`);
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

        // 숫자도 변경
        const $el = $(`.consumed.${type}.favorite`);
        const from = parseFloat($el.attr('data-from')) || 0;
        const to = Math.round(newValue * 10) / 10;
        $el.attr({ 'data-from': from, 'data-to': to }).css('color', fontColor);
        animateCountUp($el, from, to);
    });
}

// 숫자 카운팅 애니메이션
function animateCountUp($element, from, to, duration = 1200) {
    const start = performance.now();
    
    function update(timestamp) {
        const progress = Math.min((timestamp - start) / duration, 1);
        const current = Math.floor(from + (to - from) * progress);
        $element.text(`${current}g`);
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}


function getTailSvg() {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="26" viewBox="0 0 28 26" fill="none">
            <path d="M15.1547 15.3682C14.6415 16.2571 13.3585 16.2571 12.8453 15.3682L6.49445 4.36816C5.98125 3.47927 6.62275 2.36816 7.64915 2.36816L20.3509 2.36816C21.3773 2.36816 22.0188 3.47928 21.5056 4.36816L15.1547 15.3682Z" fill="white"/>
        </svg>
    `;
}


let selectedFavorites = [];

$(document).on('click', '.favorite-meal-item', function () {
    const $this = $(this);
    const data = $this.data();

    $this.toggleClass('active');
    
    if ($this.hasClass('active')) {
        selectedFavorites.push(data);
    } else {
        selectedFavorites = selectedFavorites.filter(item => item.id !== data.id);
    }
    

    //즐겨찾기에서 음식 선택시 버튼 active
    const $buttonContainer = $('.button-container.meal-favorite');
    const $nextButton = $buttonContainer.find('.next-button');

    if (selectedFavorites.length > 0) {
        $buttonContainer.removeClass('hidden');
        $nextButton.removeClass('disabled').addClass('active');
    } else {
        $buttonContainer.addClass('hidden');
        $nextButton.removeClass('active').addClass('disabled');
    }
    
    updateCPFIncreaseBar(selectedFavorites); // 바 애니메이션 적용
});

// regist 버튼 클릭 시
$(document).on('click', '#registFavoriteButton', function () {
    const $btn = $(this);
    const mealKey = window.mealKey;

    console.log('선택된 즐겨찾기 항목:', selectedFavorites);

    resetHomeMealView();
    resetSearchView();
    resetRegistView();

    $(`style[data-keyframe="protein"]`).remove(); 
    $(`style[data-keyframe="fat"]`).remove(); 
    $(`style[data-keyframe="carbo"]`).remove(); 
    selectedFavorites = [];

    const targetPath = `/main/${mealKey}`;
    history.pushState({ view: 'main' }, '', targetPath);
    setLastMainPath(targetPath);
    
    // ✅ window에도 저장, 그리고 nav-bottom.js에서도 참조하도록
    window.lastMainPath = targetPath;
    if (typeof setLastMainPath === 'function') {
        setLastMainPath(targetPath); // 전역 설정 함수 호출
    }

    showMain(mealKey);
});
