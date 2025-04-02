import { renderMealDetail } from '../homeMeal.js';
import { initHeaderNav } from '../headerNav.js';

const data = {
  date: "2025-04-02",
  carbo: { consumed: 210, target: 220 },
  protein: { consumed: 92, target: 90 },
  fat: { consumed: 60, target: 50 }
}

export function showMain(meal = null) {
  $('#report').hide();
  $('#main').show();

  if (meal) {
    $('#home').hide();
    //아작스로 호출 예정
    $('#homeMeal').html(renderMealDetail(meal, data));
    initHeaderNav();
    $('#homeMeal').show();
  } else {
    $('#homeMeal').hide();
    $('#home').show();
  }
}


export function showReport() {
  $('#main').hide();
  $('#report').show();
}