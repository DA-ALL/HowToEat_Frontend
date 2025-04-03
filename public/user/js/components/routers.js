import { renderMealDetail } from '../homeMeal.js';
import { initHeaderNav } from '../headerNav.js';
import { renderMealSearch } from '../homeMealSearch.js';

const data = {
  date: "2025-04-03",
  carbo: { consumed: 210, target: 220 },
  protein: { consumed: 92, target: 90 },
  fat: { consumed: 60, target: 50 }
}

export function showMain(meal = null, subpage = null) {
  $('#report').hide();
  $('#main').show();

  // 초기 상태: 모든 하위 뷰 숨기고 시작
  $('#home, #homeMeal, #homeMealSearch').hide();

  if (!meal) {
    $('#home').show(); // /main
    return;
  }

  if (meal && !subpage) {
    if ($('#homeMeal').children().length === 0) {
      // 한 번만 렌더링
      $('#homeMeal').html(renderMealDetail(meal, data));
      initHeaderNav($('#homeMeal'));
    }
    $('#homeMeal').show();
  }
  if (meal && subpage === 'regist') {
    // /main/morning/search
    if ($('#homeMealSearch').children().length === 0) {

      $('#homeMealSearch').html(renderMealSearch(meal));
      initHeaderNav($('#homeMealSearch'));
    }

    $('#homeMealSearch').show();
  }
}


export function showReport() {
  $('#main').hide();
  $('#report').show();
}

export function resetHomeMealView() {
  $('#homeMeal').html('');
}

export function resetSearchView() {
  $('#homeMealSearch').html('');
}