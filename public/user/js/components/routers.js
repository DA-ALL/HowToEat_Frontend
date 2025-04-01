import { renderMealDetail } from './home-meal.js';

export function showMain(meal = null) {
  $('#report').hide();
  $('#main').show();

  if (meal) {
    $('#home').hide();
    $('#homeMeal').show();
    $('#homeMeal').html(renderMealDetail(meal));
  } else {
    $('#homeMeal').hide();
    $('#home').show();
  }
}


export function showReport() {
  $('#main').hide();
  $('#report').show();
}
