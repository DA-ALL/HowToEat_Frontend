import { renderMealDetail } from '../main/homeMeal.js';
import { initHeaderNav } from './header-nav.js';
import { renderMealSearch } from '../main/homeMealSearch.js';
import { renderReportPage } from '../report/report.js';
import { renderMyPage } from '../my-page/myPage.js';
import { renderIncreaseCPFbar, renderMealRegist, renderMealAdjust, runAllCountAnimations, updateNextButtonData } from '../main/homeMealRegist.js';
import { renderUsersSetTime } from '../my-page/usersSetTime.js';
import { renderUsersNotice } from '../my-page/usersNotice.js';
import { renderUsersNoticeDetail } from '../my-page/usersNoticeDetail.js';

const userConsumedDataTest = {
    date: "2025-04-18",
    carbo: { consumed: 70, target: 220 },
    protein: { consumed: 42, target: 90 },
    fat: { consumed: 20, target: 50 }
} 

const registFoodDataTest = {
    id: 42,
    type: "ingredient_food",
    name: "소고기 채끝살 (생것)",
    detail: "수입산(미국산)",
    weight: 100,
    kcal: 217,
    carbo: 442,
    protein: 26,
    fat: 12
}

export function showMain(meal = null, subpage = null, type = null, userConsumedData = null, registFoodData = null) {
    const saved = localStorage.getItem(`mealData_${meal}`);
    const savedFood = saved ? JSON.parse(saved) : null;
    const merged = mergeConsumedData(userConsumedDataTest, savedFood);

    // $('#report').hide();
    $('#main').show();
    $('#report').hide();
    $('#my').hide();

    // 초기 상태: 모든 하위 뷰 숨기고 시작
    $('#home, #homeMeal, #homeMealSearch, #homeMealRegist').hide();

    if (!meal) {
        $('#home').show(); // /main
        return;
    }
    
    if (meal && !subpage && !type) {
        if ($('#homeMeal').children().length === 0) {
            // 저장된 데이터 불러오기

            $('#homeMeal').html(renderMealDetail(meal, merged));
            initHeaderNav($('#homeMeal'));
        }
        $('#homeMeal').show();
    }
    

    if (meal && subpage === 'regist' && !type) {
        // /main/morning/search
        if ($('#homeMealSearch').children().length === 0) {

            $('#homeMealSearch').html(renderMealSearch(meal, merged, registFoodDataTest));
            initHeaderNav($('#homeMealSearch'));
        }

        $('#homeMealSearch').show();
    }

    if (meal && subpage === 'regist' && type) {
        if ($('#homeMealRegist').children().length === 0) {
            $('#homeMealRegist').html(renderIncreaseCPFbar(meal, userConsumedDataTest, registFoodDataTest));
            $('#homeMealRegist').append(renderMealRegist(meal, userConsumedDataTest, registFoodDataTest));
            $('#homeMealRegist').append(renderMealAdjust(meal, userConsumedDataTest, registFoodDataTest));
            initHeaderNav($('#homeMealRegist'));
            runAllCountAnimations();
            $(".bar-front.bar-increase").hide();
            $(".bar-front.bar-increase").show();

            $('html, body').scrollTop(0);
            updateNextButtonData();
        }
    
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

    $('#myPage, #usersSetTime, #usersNotice, #usersNoticeDetail').hide();

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
    } else if (subpath === 'set-time') {
        $("#usersSetTime").html(renderUsersSetTime());
        initHeaderNav($('#usersSetTime'));
        $('#usersSetTime').show();
    } else if (subpath === 'question') {
        console.log('문의 뷰로 이동');
    } else if (subpath === 'terms') {
        console.log('약관 및 이용동의 뷰로 이동');
    } else if (subpath === 'privacy') {
        console.log('개인정보 보호정책 뷰로 이동');
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
