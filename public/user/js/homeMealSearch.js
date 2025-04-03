const mealSearchData = [
    {
        id: 42,
        type: "ingredient_food",
        name: "소고기 채끝살 (생것)",
        detail: "수입산(미국산)",
        weight: 100,
        kcal: 325,
    },
    {
        id: 87,
        type: "processed_food",
        name: "소고기 한우볶음구이",
        detail: "(주)예현 소고기",
        weight: 100,
        kcal: 325,
    },
    {
        id: 13,
        type: "ingredient_food",
        name: "소고기 1등급++ (생것)",
        detail: "수입산(미국산)",
        weight: 100,
        kcal: 325,
    },
    {
        id: 74,
        type: "processed_food",
        name: "소고기 한우볶음구이",
        detail: "청정원",
        weight: 100,
        kcal: 325,
    },
    {
        id: 8,
        type: "cooked_food",
        name: "소고기 구이",
        detail: "급식",
        weight: 100,
        kcal: 325,
    },
    {
        id: 91,
        type: "ingredient_food",
        name: "소고기 채끝살 (생것)",
        detail: "수입산(미국산)",
        weight: 100,
        kcal: 325,
    },
    {
        id: 56,
        type: "processed_food",
        name: "소고기 한우볶음구이",
        detail: "(주)예현 소고기",
        weight: 100,
        kcal: 325,
    },
    {
        id: 34,
        type: "ingredient_food",
        name: "소고기 1등급++ (생것)",
        detail: "수입산(미국산)",
        weight: 100,
        kcal: 325,
    },
    {
        id: 99,
        type: "processed_food",
        name: "소고기 한우볶음구이",
        detail: "청정원",
        weight: 100,
        kcal: 325,
    },
    {
        id: 21,
        type: "cooked_food",
        name: "소고기 구이",
        detail: "급식",
        weight: 100,
        kcal: 325,
    },
];



export function renderMealSearch(mealKey) {
    const mealKor = mealToKor(mealKey);
    return `
      <div id="headerNav" data-title="${mealKor} 등록하기" data-type="2"></div>


      <div class="meal-search-container padding">

        <div class="search-tab-wrapper">
            <div class="tab-button search active">음식 검색</div>
            <div class="tab-button favorite">즐겨찾기</div>
        </div>

        <div class="meal-tab-content">
            <div class="meal-search-list">
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
            <div class="meal-favorite-list" style="display: none;">즐겨찾기</div>
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
$(document).on('keydown', '.input-search', function (e) {
    if (e.key === 'Enter') {
        const keyword = $(this).val().trim();
        handleMealSearch(keyword);
    }
});

//검색 input 돋보기 클릭 시, 엔터와 같은 효과
$(document).on('click', '.search-tool .label img', function () {
    const keyword = $(this).closest('.search-tool').find('.input-search').val().trim();
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
            .attr('data-kcal', '');

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
            .attr('data-kcal', $this.data('kcal'));
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
           data-kcal="${item.kcal}">
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