const mealSearchData = [
    {
      type: "원재료",
      name: "소고기 채끝살 (생것)",
      detail: "수입산(미국산)",
      weight: 100,
      kcal: 325,
    },
    {
      type: "가공식품",
      name: "소고기 한우볶음구이",
      detail: "(주)예현 소고기",
      weight: 100,
      kcal: 325,
    },
    {
      type: "원재료",
      name: "소고기 1등급++ (생것)",
      detail: "수입산(미국산)",
      weight: 100,
      kcal: 325,
    },
    {
      type: "가공식품",
      name: "소고기 한우볶음구이",
      detail: "청정원",
      weight: 100,
      kcal: 325,
    },
    {
      type: "음식",
      name: "소고기 구이",
      detail: "급식",
      weight: 100,
      kcal: 325,
    }
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
                <div class="search-tool">
                    <div class="label">
                        <img src="/user/images/icon_search_gray2.png">
                    </div>
                    <input class="input-search"></input>
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
      <div class="meal-item">
        <div class="meal-wrapper">
            <div class="meal-type ${typeColorClass(item.type)}">${item.type}</div>
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
      case '원재료': return 'type-raw';
      case '가공식품': return 'type-processed';
      case '음식': return 'type-dish';
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