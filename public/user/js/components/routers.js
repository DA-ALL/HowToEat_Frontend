
export function showMain(meal = null) {
  $('#main').show();
}

export function showReport() {
  $('#main').hide();
  $('#report').show();
}

function highlightMeal(meal) {
  // 간단한 예시
  $(`#mealLog .meal-time`).each(function () {
    if ($(this).text() === mealToKor(meal)) {
      $(this).css('background-color', '#ffe0e0');
    } else {
      $(this).css('background-color', ''); // 초기화
    }
  });
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
