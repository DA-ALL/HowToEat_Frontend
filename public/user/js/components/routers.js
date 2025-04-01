export function showMain(meal = null) {
  $('#report').hide();
  $('#main').show();

  if (meal) {
    // 상세 식사 페이지 보여주기
    $('#home').hide();
    $('#home-meal').show();

    // 예시 텍스트 삽입 (실제 내용은 동적으로 생성)
    const mealKor = mealToKor(meal);
    $('#homMeal').html(`
      <div class="root-container">
        <h2>${mealKor} 식사 상세 페이지</h2>
        <p>여기에 ${mealKor}에 대한 음식, 칼로리, 차트 등 정보가 들어갑니다.</p>
        <button id="back-to-main">← 뒤로가기</button>
      </div>
    `);
  } else {
    // 메인 홈화면으로 복귀
    $('#homeMeal').hide();
    $('#home').show();
  }
}

export function showReport() {
  $('#main').hide();
  $('#report').show();
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
