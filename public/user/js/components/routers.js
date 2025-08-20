import { renderMealDetail, renderMealListHTML } from '../main/homeMeal.js';
import { initHeaderNav } from './header-nav.js';
import { renderMealSearch } from '../main/homeMealSearch.js';
import { renderReportPage } from '../report/report.js';
import { renderConsumedFoodInfo } from '../main/consumedFood.js';
import { renderMyPage } from '../my-page/myPage.js';
import { renderIncreaseCPFbar, runAllCountAnimations, updateNextButtonData } from '../main/homeMealRegist.js';
import { renderUsersSetTime } from '../my-page/usersSetTime.js';
import { renderUsersNotice } from '../my-page/usersNotice.js';
import { renderUsersNoticeDetail } from '../my-page/usersNoticeDetail.js';
import { renderUsersTerms } from '../my-page/usersTerms.js';
import { renderUsersPrivacy } from '../my-page/usersPrivacy.js';
import { renderWithDraw } from '../my-page/renderWithDraw.js';
import { renderUsersInfo, bindUsersInfoEvents } from '../my-page/usersInfo.js';
import { initCalendarPage } from './calendar.js';
import { renderAddHomeNewFood } from '../main/homeAddNewFood.js';

export function showMain(meal = null, subpage = null, type = null, consumedFoodId = null, isFromAddFavoriteFood = false, isFromNumericInput = false) {
    $('#main').show();
    $('#report').hide();
    $('#my').hide();

    $('#home, #homeMeal, #homeMealSearch, #homeMealRegist, #consumedFoodDetail, #homeAddNewFood').hide();

    const pathParts = window.location.pathname.split("/");
    let mealTime = null;
    let selectedDate = null;

    // 1️⃣ 메인페이지  /main
    if (!meal && !subpage && !type && !consumedFoodId) {
        initCalendarPage();
        resetSearchView();
        $('#home').show();
        return;
    }


    // 2️⃣ 끼니탄단지 페이지 /main/breakfast/2025-06-27
    if (meal && !subpage && !type && !consumedFoodId) {     
        mealTime = meal.toUpperCase();
        selectedDate = pathParts[3];
        
        resetSearchView();


        renderMealDetail(function (html) {
            $('#homeMeal').html(html);
            initHeaderNav($('#homeMeal'));

            renderMealListHTML(meal, selectedDate, mealTime, function (listHtml, buttonHtml) {
                $('.meal-list-wrapper').html(listHtml);
                $('#homeMeal').append(buttonHtml);
                $('#homeMeal').show();
            });
        });
    }

    // 3️⃣ 신규: 섭취 음식 상세 /main/breakfast/2025-06-27/consumed-food/122
    if (meal && subpage === 'consumed-food' && consumedFoodId) {
        renderConsumedFoodInfo(consumedFoodId, function(html) {
            $('#consumedFoodDetail').html(html);
            initHeaderNav($('#consumedFoodDetail'));
            $('#consumedFoodDetail').show();
        });
    }

    // 4️⃣ 음식 새로 등록 페이지 /main/breakfast/2025-06-27/consumed-food/122
    if (meal && subpage === 'favorite-food' && type) {
        
        $('style[data-keyframe]').remove();

        if ($('#homeAddNewFood').children().length === 0) {
            $("#homeAddNewFood").html(renderAddHomeNewFood());
            initHeaderNav($('#homeAddNewFood'));
            bindUsersInfoEvents();
        }
        $('#homeAddNewFood').show();
    }

    // 5️⃣ 음식 검색 및 즐겨찾기 페이지 /main/breakfast/2025-06-27/regist
    if (meal && subpage === 'regist' && !type) {
        $('style[data-keyframe]').remove();
        if ($('#homeMealSearch').children().length === 0 || isFromAddFavoriteFood) {
            renderMealSearch(function(html) {
                $('#homeMealSearch').html(html);
                initHeaderNav($('#homeMealSearch'));
                if(isFromAddFavoriteFood) {
                    //즐겨찾기 음식 추가 후, 즐겨찾기로 이동하기 위해 추가
                    $('.tab-button.favorite').trigger('click');
                }
                runAllCountAnimations();
                $('html, body').scrollTop(0);
            });
        }
        $('#homeMealSearch').show();
    }

    // 6️⃣ 음식 등록 페이지 /main/breakfast/2025-06-27/regist/COOKED/5
    if (meal && subpage === 'regist' && type) {
        renderIncreaseCPFbar(function(html) {
            $('#homeMealRegist').html(html);
            initHeaderNav($('#homeMealRegist'));
            runAllCountAnimations();
            $(".bar-front.bar-increase").hide().show();
            $('html, body').scrollTop(0);
            updateNextButtonData();
        });

        $('#homeMealRegist').show();
    }
}



export function showReport() {
    $('#main').hide();
    $('#my').hide();
    $('#report').show();

    $('#kcalGraphPath').attr('d', '');

    // 그래프 두번 그려주기 방지
    $('#kcalGraphPath').attr('d', '');

    // 그래프 두번 그려주기 방지
    $('style').each(function () {
        const content = this.innerHTML;
        if (/@keyframes fillBar-(carbo|protein|fat)/.test(content)) {
            this.remove();
        }
    });
    
    // 그래프 두번 그려주기 방지
    $('style').filter((_, el) =>
        /@keyframes fillArc/.test(el.innerHTML)
    ).remove();

    $("#reportPage").html(renderReportPage());
}



export function showMyPage(subpath = null, detailId = null, isFromNumericInput = false) {
    $('#main').hide();
    $('#report').hide();
    $('#my').show();
    $('#myPage, #usersSetTime, #usersNotice, #usersNoticeDetail, #usersTerms, #usersPrivacy, #usersInfo, #withDraw').hide();

    if (!subpath) {
        if($('#myPage').children().length === 0 || isFromNumericInput) {
            renderMyPage(function(html) {
                $('#myPage').html(html);
                // initHeaderNav($('#myPage'));
                $('html, body').scrollTop(0);
            });
        }
        $('#myPage').show();
        return;
    }

    if (subpath === 'notice') {
        if (detailId) {
            // /users/notice/4
            renderUsersNoticeDetail(function(html) {
                $('#usersNoticeDetail').html(html);
                initHeaderNav($('#usersNoticeDetail'));
                $('html, body').scrollTop(0);
            });
            $('#usersNoticeDetail').show();
        } else {
            // /users/notice
            $('#usersNoticeDetail').html('');

            if ($('#noticeListContainer').children().length === 0) {
                renderUsersNotice(function(html) {
                    $('#noticeListContainer').html(html);
                    initHeaderNav($('#usersNotice'));
                    $('html, body').scrollTop(0);
                });
            }
                $('#usersNotice').show();
        }

     } else if (subpath === 'info') {
            renderUsersInfo(function(html) {
                $('#usersInfo').html(html);
                initHeaderNav($('#usersInfo'));
                $('html, body').scrollTop(0);
            });
        $('#usersInfo').show();
    
        bindUsersInfoEvents(); //페이지를 그리고 난 후, 인풋 유효성 검사 진행을 위해 추가한 함수
    } else if (subpath === 'set-time') {
        $("#usersSetTime").html(renderUsersSetTime());
        initHeaderNav($('#usersSetTime'));
        $('#usersSetTime').show();
    } else if (subpath === 'question') {
        // console.log('문의 뷰로 이동');
    } else if (subpath === 'terms') {
        $("#usersTerms").html(renderUsersTerms());
        initHeaderNav($('#usersTerms'));
        $('#usersTerms').show();
    } else if (subpath === 'privacy') {
        $("#usersPrivacy").html(renderUsersPrivacy());
        initHeaderNav($('#usersPrivacy'));
        $('#usersPrivacy').show();
    } else  if (subpath === 'withdraw') {
        $("#withDraw").html(renderWithDraw());
        initHeaderNav($('#withDraw'));
        $('#withDraw').show();  
    }
}


export function resetHomeMealView() {
    $('#homeMeal').empty();
}

export function resetSearchView() {
    $('#homeMealSearch').empty();
}

export function resetAddFavoriteFoodView() {
    $('#homeAddNewFood').empty();
}

export function resetRegistView() {
    $('#homeMealRegist').empty();
}

export function resetSetTimeView() {
    $('#usersSetTime').empty();
}
