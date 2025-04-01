export function renderMealDetail(mealKey) {
    const mealKor = mealToKor(mealKey);
  
    return `
      <div class="root-container">
        <h2>${mealKor} 식사 상세 페이지</h2>
        <p>여기에 ${mealKor}에 대한 음식, 칼로리, 차트 등 정보가 들어갑니다.</p>
        <button id="back-to-main">← 뒤로가기</button>
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
  