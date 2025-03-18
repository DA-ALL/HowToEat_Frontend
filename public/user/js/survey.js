import { updateButtonState, validateInput, checkInput } from './components/input-validate.js';
import { populateDays, updateDays, validateDateInput, birthDropDown } from './components/date-picker-validate.js';

let currentPage = 1;
let surveyData = {
    name: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
};

// 뒤로가기 이벤트 처리
window.onpopstate = function (event) {
    console.log("🔙 뒤로가기 감지!", event.state);

    if (event.state && event.state.page) {
        currentPage = event.state.page;
        loadPage(currentPage, true);
    }
};

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const savedPage = parseInt(urlParams.get('page')) || 1;

    currentPage = savedPage;
    loadPage(currentPage);
});

function getSurveyTemplate(pageNumber) {
    switch (pageNumber) {
        case 1:
            return `
                <div class="survey-title">
                    아래의 정보가 맞나요?
                </div>

                <div class="input-container">
                    <div class="input-wrapper">
                        <div class="input-label">이름</div>
                        <div class="input">
                            <input type="text" id="name" name="name" placeholder="이름" ime-mode="active" data-text="">
                        </div>
                    </div>

                    <div class="input-wrapper">
                        <div class="input-label">생년월일</div>
                        
                        <div class="date-picker">
                            <div class="date-box" id="year-box">
                                <span id="year-text" data-text="">년도</span>
                                <div class="dropdown" id="year-dropdown"></div>
                            </div>
                            <div class="date-box" id="month-box">
                                <span id="month-text" data-text="">월</span>
                                <div class="dropdown" id="month-dropdown"></div>
                            </div>
                            <div class="date-box" id="day-box">
                                <span id="day-text" data-text="">일</span>
                                <div class="dropdown" id="day-dropdown"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <div class="next-button">다음</div>
                </div>
            `;
        case 2:
            return `
                <div class="survey-title">
                    나의 키와 몸무게는?
                </div>

                <div class="input-container">
                    <div class="input-wrapper">
                        <div class="input-label">키</div>
                        <div class="input">
                            <input type="number" id="height" name="height" placeholder="키" ime-mode="active" data-text="">
                        </div>
                    </div>

                    <div class="input-wrapper">
                        <div class="input-label">몸무게</div>
                        <div class="input">
                            <input type="number" id="weight" name="weight" placeholder="키" ime-mode="active" data-text="">
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <div class="next-button">다음</div>
                </div>
            `;
        case 7:
            return `
                <div class="survey-title">모든 질문이 끝났습니다!</div>
                <button onclick="submitSurvey()">제출</button>
            `;
        default:
            return `<div>잘못된 페이지</div>`;
    }
}

function loadPage(pageNumber, isBackNavigation = false) {
    $('#survey').html(getSurveyTemplate(pageNumber));

    if (!isBackNavigation) {
        history.pushState({ page: pageNumber }, '', `?page=${pageNumber}`);
    }
    restoreSurveyData();
    birthDropDown();
    
    populateDays(31);
    updateDays();
    bindEvents();
    updateButtonState();
}

function bindEvents() {
    $(".next-button").off('click').on('click', function () {
        nextPage();
    });

    $('#name').off('blur').on('blur', function () {
        validateInput($(this));
    });

    checkInput($('#name'));
    validateDateInput($('#year-text'));
    validateDateInput($('#month-text'));
    validateDateInput($('#day-text'));

}

function nextPage() {
    saveSurveyData('name', $('#name').val());
    saveSurveyData('birthYear', $('#year-text').data('text'));
    saveSurveyData('birthMonth', $('#month-text').data('text'));
    saveSurveyData('birthDay', $('#day-text').data('text'));
    currentPage++;
    loadPage(currentPage);
}

function restoreSurveyData() {
    if (surveyData.name) {
        $('#name').val(surveyData.name);
    }
    if (surveyData.birthYear) {
        $('#year-text').text(surveyData.birthYear + '년').attr('data-text', surveyData.birthYear);
    }
    if (surveyData.birthMonth) {
        $('#month-text').text(surveyData.birthMonth + '월').attr('data-text', surveyData.birthMonth);
    }
    if (surveyData.birthDay) {
        $('#day-text').text(surveyData.birthDay + '일').attr('data-text', surveyData.birthDay);
    }

    updateButtonState();
}

function saveSurveyData(key, value) {
    surveyData[key] = value;
    localStorage.setItem('surveyData', JSON.stringify(surveyData));
}


// 드롭다운 채우기 및 클릭
$(document).on('click', '.dropdown-item', function () {
    var value = $(this).data('value');
    var parentBox = $(this).closest('.date-box');
    parentBox.removeClass('open');

    if (parentBox.attr('id') === 'year-box') {
        $('#year-text').text(value + '년').attr('data-text', value);
        validateDateInput($('#year-text'));
    } else if (parentBox.attr('id') === 'month-box') {
        $('#month-text').text(value + '월').attr('data-text', value);
        updateDays();
        validateDateInput($('#month-text'));
    } else if (parentBox.attr('id') === 'day-box') {
        $('#day-text').text(value + '일').attr('data-text', value);
        validateDateInput($('#day-text'));
    }
    updateButtonState();
});


$(document).on('click', function (event) {
    if (!$(event.target).closest('.date-picker').length) {
        $('.date-box').removeClass('open');
    }
});
