import { renderMealDetail, renderMealListHTML } from '../main/homeMeal.js';
import { initHeaderNav } from './header-nav.js';
import { renderMealSearch } from '../main/homeMealSearch.js';
import { renderReportPage } from '../report/report.js';
import { renderMyPage } from '../my-page/myPage.js';
import { renderIncreaseCPFbar, renderMealRegist, renderMealAdjust, runAllCountAnimations, updateNextButtonData } from '../main/homeMealRegist.js';
import { renderUsersSetTime } from '../my-page/usersSetTime.js';
import { renderUsersNotice } from '../my-page/usersNotice.js';
import { renderUsersNoticeDetail } from '../my-page/usersNoticeDetail.js';
import { renderUsersTerms } from '../my-page/usersTerms.js';
import { renderUsersPrivacy } from '../my-page/usersPrivacy.js';
import { renderUsersInfo, bindUsersInfoEvents } from '../my-page/usersInfo.js';
import { initCalendarPage } from './calendar.js';

export function showMain(meal = null, subpage = null, type = null, userConsumedData = null, registFoodData = null) {

    // $('#report').hide();
    $('#main').show();
    $('#report').hide();
    $('#my').hide();

    // 초기 상태: 모든 하위 뷰 숨기고 시작
    $('#home, #homeMeal, #homeMealSearch, #homeMealRegist').hide();

    if (!meal) {
        initCalendarPage(true);
        resetSearchView();
        $('#home').show(); // /main
        return;
    }


    if (meal && !subpage && !type) {
        resetSearchView();
        renderMealDetail(function (html) {
            const pathParts = window.location.pathname.split("/");
            const selectedDate = pathParts[3];
            const mealTime = meal.toUpperCase();
    
            // 먼저 뼈대 렌더링
            $('#homeMeal').html(html);
            initHeaderNav($('#homeMeal'));
    
            // 그 다음 비동기로 식단 + 버튼 렌더링
            renderMealListHTML(meal, selectedDate, mealTime, function (listHtml, buttonHtml) {
                $('.meal-list-wrapper').html(listHtml);
                $('#homeMeal').append(buttonHtml);
                $('#homeMeal').show();
            });
        });
    }
    
    

    if (meal && subpage === 'regist' && !type) {
        // /main/morning/search

        if ($('#homeMealSearch').children().length === 0) {
            renderMealSearch(function(html) {
                $('#homeMealSearch').html(html);
                initHeaderNav($('#homeMealSearch'));
                runAllCountAnimations();
                $('style[data-keyframe]').remove();
                $('html, body').scrollTop(0);
            });
            
         } 
        $('#homeMealSearch').show();
    }

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

    //리포트 페이지
    if ($('#reportPage').children().length === 0) {
        $("#reportPage").html(renderReportPage());
    }
    //마이 페이지
    if ($('#myPage').children().length === 0) {
        $("#myPage").html(renderMyPage());
    }   
}


export function showReport() {
    $('#main').hide();
    $('#my').hide();
    $('#report').show();

    //리포트 페이지
    if ($('#reportPage').children().length === 0) {
        $("#reportPage").html(renderReportPage());
    }
}

export function showMyPage(subpath = null, detailId = null) {
    $('#main').hide();
    $('#report').hide();
    $('#my').show();
    $('#myPage, #usersSetTime, #usersNotice, #usersNoticeDetail, #usersTerms, #usersPrivacy, #usersInfo').hide();

    if (!subpath) {
        if ($('#myPage').children().length === 0) {
            $("#myPage").html(renderMyPage());
        }
        $('#myPage').show();
        return;
    }

    if (subpath === 'notice') {
        if (detailId) {
            // /users/notice/4 같은 경우
            $('#usersNoticeDetail').html(renderUsersNoticeDetail(detailId));
            initHeaderNav($('#usersNoticeDetail'));
            $('#usersNoticeDetail').show();
        } else {
            // /users/notice
            if ($('#noticeListContainer').children().length === 0) {
                let id = 4;
                let type = "업데이트";
                let title = "하잇앱이 신규 업데이트 되었어요";
                let date = "2025.04.32";
                $("#noticeListContainer").append(renderUsersNotice(id, type, title, date));
                initHeaderNav($('#usersNotice'));
            }
                $('#usersNotice').show();
        }

     } else if (subpath === 'info') {
        $("#usersInfo").html(renderUsersInfo());
        initHeaderNav($('#usersInfo'));
        $('#usersInfo').show();
    
        bindUsersInfoEvents(); //페이지를 그리고 난 후, 인풋 유효성 검사 진행을 위해 추가한 함수
    } else if (subpath === 'set-time') {
        $("#usersSetTime").html(renderUsersSetTime());
        initHeaderNav($('#usersSetTime'));
        $('#usersSetTime').show();
    } else if (subpath === 'question') {
        console.log('문의 뷰로 이동');
    } else if (subpath === 'terms') {
        $("#usersTerms").html(renderUsersTerms());
        initHeaderNav($('#usersTerms'));
        $('#usersTerms').show();
    } else if (subpath === 'privacy') {
        $("#usersPrivacy").html(renderUsersPrivacy());
        initHeaderNav($('#usersPrivacy'));
        $('#usersPrivacy').show();
    }
}


export function resetHomeMealView() {
    $('#homeMeal').empty();
}

export function resetSearchView() {
    $('#homeMealSearch').empty();
}

export function resetRegistView() {
    $('#homeMealRegist').empty();
}

export function resetSetTimeView() {
    $('#usersSetTime').empty();
}

function mergeConsumedData(user, food) {
    if (!food) return user;

    console.log(food);
    return {
        date: user.date,
        carbo: {
            consumed: user.carbo.consumed + food.carbo,
            target: user.carbo.target
        },
        protein: {
            consumed: user.protein.consumed + food.protein,
            target: user.protein.target
        },
        fat: {
            consumed: user.fat.consumed + food.fat,
            target: user.fat.target
        }
    };
}
