export function renderMealSearch(mealKey) {
    const mealKor = mealToKor(mealKey);
    return `
      <div id="headerNav" data-title="${mealKor} 등록하기" data-type="2"></div>
      <div class="meal-search-wrapper padding">
        <div class="search-tab">
          <button class="tab active">음식 검색</button>
          <button class="tab">즐겨찾기</button>
        </div>
        <div class="search-bar">
          <input type="text" placeholder="메뉴 및 음식을 검색하세요">
        </div>
      </div>
    `;
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