import { showMain } from '../components/routers.js';
import { setLastMainPath } from '../components/nav-bottom.js';
import { showPopup } from '../components/popup.js';
import { showPage } from '../components/nav-bottom.js';

let currentSearchKeyword = '';
let currentPage = 0;
let hasNext = true;
let selectedFavorites = [];
let isLoading = false;

export function renderMealSearch(callback) {
    const pathParts = window.location.pathname.split("/");
    const mealKey = pathParts[2];
    const mealKor = mealToKor(mealKey);
    const mealTime = mealKey.toUpperCase();
    const selectedDate = pathParts[3];

    selectedFavorites = [];
    isLoading = false;


    const macrosRequest = $.ajax({
        url: `${window.DOMAIN_URL}/daily-summaries/${selectedDate}/meal-time/${mealTime}/macros`,
        method: 'GET'
    });

    const favoriteFoodList = $.ajax({
        url: `${window.DOMAIN_URL}/favorite-foods`,
        method: 'GET'
    });

    $.when(macrosRequest, favoriteFoodList).done(function (macrosRes, favoriteRes) {
        const raw = macrosRes[0].data;
        const userConsumedData = {
            carbo: { consumed: raw.consumedCarbo, target: raw.targetCarbo },
            protein: { consumed: raw.consumedProtein, target: raw.targetProtein },
            fat: { consumed: raw.consumedFat, target: raw.targetFat }
        };

        const favoriteFoods = favoriteRes[0].data;
        
        // console.log(userConsumedData);
        // console.log(favoriteFoods);

        window.userConsumedData = userConsumedData;
        window.mealKey = mealKey;

        const favoriteListHTML = favoriteFoods.map(item => `
            <div class="favorite-meal-item"
                 data-id="${item.favoriteFoodId}"
                 data-food-code="${item.foodCode}"
                 data-type="${item.foodType}"
                 data-name="${item.foodName}"
                 data-detail="${item.providedBy}"
                 data-weight="${item.foodWeight}"
                 data-kcal="${item.kcal}"
                 data-carbo="${item.carbo}"
                 data-protein="${item.protein}"
                 data-source="${item.source}"
                 data-fat="${item.fat}"
                 data-unit="${item.unit}">

                
                <div class="meal-info-wrapper">
                    <div class="meal-title">${item.foodName}</div>
                    
                    <div class="meal-macro-wrapper">
                        <div class="macro-kcal">${(item.kcal).toFixed(1).toLocaleString()} kcal</div>
                        <div class="divider">|</div>
                        <div class="macro-carbo">탄수 ${(item.carbo).toFixed(1).toLocaleString()}</div>
                        <div class="divider">|</div>
                        <div class="macro-protein">단백 ${(item.protein).toFixed(1).toLocaleString()}</div>
                        <div class="divider">|</div>
                        <div class="macro-fat">지방 ${(item.fat).toFixed(1).toLocaleString()}</div>
                    </div>
                </div>

                <!--
                <div class="text-wrapper">
                    <span class="weight">${Math.trunc(item.foodWeight)}g</span>
                    <span class="divide">/</span>
                    <span class="kcal">${Math.trunc(item.kcal)}kcal</span>
                </div>
                --!>
            </div>
        `).join('');

        const html = `
          <div id="headerNav" data-title="${mealKor} 등록하기" data-type="3"></div>
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
                              <input class="input-search" />
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
                          ${createBarContainer(mealKey, userConsumedData)}
                      </div>

                      <div class="divider large"></div>

                      <div class="favorite-list-container padding">
                          <div class="second-title-format">즐겨찾는 음식</div>
                          <div class="favorite-meal-list-wrapper">
                              ${favoriteListHTML}
                          </div>
                      </div>
                      <div class="button-container meal-favorite hidden">
                            <div id="deleteFavoriteButton" class="next-button home-meal-favorite disabled" data-id="" data-type="" data-name="" data-weight="" data-kcal="">삭제</div>
                            <div id="registFavoriteButton" class="next-button home-meal-favorite disabled" data-id="" data-type="" data-name="" data-weight="" data-kcal="">추가하기</div>
                      </div>
                  </div>
              </div>
          </div>
        `;

        callback(html);
    }).fail(function () {
        callback(`<div class="error">데이터를 불러오는 데 실패했습니다.</div>`);
    });
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
            $('.favorite-meal-item.active').each(function () {
                $(this).trigger('click');
            });

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
    $list.find('.meal-results').remove();

    currentSearchKeyword = keyword;
    currentPage = 0;
    hasNext = true;

    if (keyword) {
        fetchSearchResults(keyword, currentPage);
        $('.input-search').closest('.search-tool').css('border-color', 'var(--gray300)');
    } else {
        $('.input-search').closest('.search-tool').css('border-color', '');
    }
}

function renderMealSearchResults(items, isFirstPage) {
    let isItemEmpty = items.length === 0;


    const html = items.map(item => `
      <div class="meal-item"
           data-id="${item.foodId}"
           data-type="${item.type}"
           data-name="${item.foodName}"
           data-weight="${item.foodWeight}"
           data-kcal="${item.kcal}"
           data-carbo="${item.carbo}"
           data-protein="${item.protein}"
           data-fat="${item.fat}">
        <div class="meal-wrapper">
          <div class="meal-type ${typeColorClass(item.type)}">${typeToKor(item.type)}</div>
          <div class="meal-name">${item.foodName}</div>
          <div class="meal-detail">${item.providedBy}</div>
        </div>
        <div class="meal-meta">
          <div class="weight">${item.foodWeight}g</div>
          <div class="divide">/</div>
          <div class="kcal">${item.kcal}kcal</div>
        </div>
      </div>
    `).join('');

    if(!isItemEmpty) {
        if (isFirstPage) {
            $('.meal-search-list').append(`<div class="meal-results">${html}</div>`);
        } else {
            $('.meal-results').append(html);
        }
    } else {
        $('.meal-search-list').append(`<div class="meal-results not-found-result"><div class="text">검색 결과가 없어요.</div><div class="text">원하는 음식을 직접 추가해보세요!</div><div class="add-button">추가하기</div></div>`);
    }
}


// type에 따라 색상 클래스 다르게
function typeColorClass(type) {
    switch (type) {
        case 'INGREDIENT': return 'type-ingredient';
        case 'PROCESSED': return 'type-processed';
        case 'COOKED': return 'type-cooked';
        case 'CUSTOM': return 'type-custom';
        default: return '';
    }
}



function mealToKor(meal) {
    switch (meal) {
        case 'breakfast': return '아침';
        case 'lunch': return '점심';
        case 'dinner': return '저녁';
        case 'snack': return '간식';
        default: return '';
    }
}

function typeToKor(type) {
    switch (type) {
        case 'INGREDIENT': return '원재료';
        case 'PROCESSED': return '가공식품';
        case 'COOKED': return '음식';
        case 'CUSTOM': return '유저등록';
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
                const target = Math.trunc(Number(userConsumedData[type]?.target || 0));

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
        const newValue = (consumed + total[type]);

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
        const current = (from + (to - from) * progress).toFixed(1);
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

//호출 API
function fetchSearchResults(keyword, page) {
    $.ajax({
        url: `${window.DOMAIN_URL}/foods?name=${encodeURIComponent(keyword)}&page=${page}&size=10`,
        method: 'GET',
        success: function (res) {
            const items = res.data.content;
            hasNext = res.data.hasNext;
            // console.log(res);
            renderMealSearchResults(items, page === 0);
        },
        complete: function () {
            isLoading = false; // 다시 호출 가능
        }
    });
}

$(window).on('scroll', function () {

    if(!$('#main').is(':visible'))  return;
    if(!$('#homeMealSearch').is(':visible'))  return;
    const scrollBottom = $(document).height() - $(window).scrollTop() - $(window).height();

    if (scrollBottom < 100 && hasNext && !isLoading) {
        isLoading = true; // 중복 호출 방지
        currentPage++;
        fetchSearchResults(currentSearchKeyword, currentPage);
    }
});


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
    const pathParts = window.location.pathname.split('/');
    const selectedDate = pathParts[3];
    const mealTime = pathParts[2];
    const mealTimeUpper = mealTime.toUpperCase();

    const consumedFoodList = [];

    $('.favorite-meal-item.active').each(function () {
        const $item = $(this);
        const food = {
            favoriteFoodId: $item.data('id'),
            foodCode: $item.data('food-code'),
            foodName: $item.data('name'),
            mealTime: mealTimeUpper,
            foodWeight: $item.data('weight'),
            foodType: $item.data('type'),
            kcal: $item.data('kcal'),
            carbo: $item.data('carbo'),
            protein: $item.data('protein'),
            fat: $item.data('fat'),
            providedBy: $item.data('detail') || "-",
            isPerServing: false, // 필요시 변경
            source : $item.data('source'),
            unit: $item.data('unit'),
            foodImageUrl: ""
        };
        consumedFoodList.push(food);
    });

    if (consumedFoodList.length === 0) {
        alert("음식을 선택해주세요.");
        return;
    }

    $.ajax({
        type: "POST",
        url: `${window.DOMAIN_URL}/consumed-foods`,
        contentType: "application/json",
        data: JSON.stringify(consumedFoodList),
        success: function () {  

            consumedFoodList.length = 0;
            selectedFavorites.length = 0;

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


$(document).on('click', '.add-button', function() {
    const currentPath = window.location.pathname;
    const parts = currentPath.split('/');
    const mealTime = parts[2];
    const selectedDate = parts[3];

    const newPath = `/main/${mealTime}/${selectedDate}/regist/favorite-food/add`;
    history.pushState({ view: 'main', mealTime, date: selectedDate }, '', newPath);
    showPage(newPath);
    return;
});

// delete 버튼 클릭 시
$(document).on('click', '#deleteFavoriteButton', function () {
    const favoriteFoodIdList = [];

    $('.favorite-meal-item.active').each(function () {
        const $item = $(this);
        const favoriteFoodId = {
            favoriteFoodId: $item.data('id'),
        };
        favoriteFoodIdList.push(favoriteFoodId);
    });

    if (favoriteFoodIdList.length === 0) {
        alert("음식을 선택해주세요.");
        return;
    }

    showPopup("#main", 2, "삭제하시겠어요?", "").then((confirmed) => {
        if (confirmed) {

            $.ajax({
                type: "DELETE",
                url: `${window.DOMAIN_URL}/favorite-foods`,
                contentType: "application/json",
                data: JSON.stringify(favoriteFoodIdList),
                success: function () {
                    favoriteFoodIdList.length = 0;
                    selectedFavorites.length = 0;

                    $('.favorite-meal-item.active').each(function () {
                        const $el = $(this);
                        $el.trigger('click');
                        $el.remove();
                    });


                }
            });

        }
    })
});

