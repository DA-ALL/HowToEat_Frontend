import { renderMealDetail } from './home-meal.js';
import { initHeaderNav } from '../headerNav.js';

export function showMain(meal = null) {
  $('#report').hide();
  $('#main').show();

  if (meal) {
    $('#home').hide();
    $('#homeMeal').html(renderMealDetail(meal));
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