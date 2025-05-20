import { updateButtonState, validateInput, checkInput } from '/user/js/components/input-validate.js';
import { populateDays, updateDays, validateDateInput, birthDropDown } from '/user/js/components/date-picker-validate.js';
import { updateProgressBar } from '/user/js/components/header-processbar.js';
import { initHeaderNav } from '/user/js/components/header-nav.js';
import { setupAjaxAuthInterceptor } from '../utils/auth-interceptor.js';

let currentPage = 1;
let surveyData = {
    email: '',
    name: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    height: '',
    weight: '',
    gender: '',
    goal: '',
    activity: '',
    isNextGym: ''
};

// 뒤로가기 이벤트 처리
window.onpopstate = function (event) {
    console.log("뒤로가기 감지!", event.state);

    if (event.state && event.state.page) {
        currentPage = event.state.page;
        loadPage(currentPage, true);
    }
};

$(document).ready(function () {
    setupAjaxAuthInterceptor();
    const urlParams = new URLSearchParams(window.location.search);
    const savedPage = parseInt(urlParams.get('page')) || 1;
    const token = urlParams.get("token");
    const user = getPayloadFromToken(token);

    // 생일이 "MM-DD" 형식이면 나눠서 넣기
    const birthMonth = user.birthday?.split('-')[0] || '';
    const birthDay = user.birthday?.split('-')[1] || '';

    // surveyData 초기화
    surveyData = {
        email: user.email || '',
        name: user.name || '',
        birthYear: user.birthyear || '',
        birthMonth,
        birthDay,
        height: user.height || '',
        weight: user.weight || '',
        gender: user.gender || '',
        goal: '',
        activity: '',
        isNextGym: ''
    };

    localStorage.setItem('surveyData', JSON.stringify(surveyData));

    currentPage = savedPage;
    initHeaderNav();
    loadPage(currentPage);
});

function getPayloadFromToken(token) {
    try {
        const base64Payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64Payload)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('JWT 파싱 에러:', e);
        return null;
    }
}


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
                <div class="button-container bottom">
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
                            <input type="number" inputmode="numeric" id="height" name="height" placeholder="키" ime-mode="active" data-text="">
                        </div>
                    </div>

                    <div class="input-wrapper">
                        <div class="input-label">몸무게</div>
                        <div class="input">
                            <input type="number" inputmode="numeric" id="weight" name="weight" placeholder="몸무게" ime-mode="active" data-text="">
                        </div>
                    </div>
                </div>
                <div class="button-container bottom">
                    <div class="next-button">다음</div>
                </div>
            `;
        case 3:
            return `
                <div class="survey-title">
                    나의 성별은?
                </div>

                <div class="select-container">
                    <div class="select-item male" data-text="MALE">남자</div>
                    <div class="select-item female" data-text="FEMALE">여자</div>
                </div>

                <div class="button-container bottom">
                    <div class="next-button">다음</div>
                </div>
            `;
        case 4:
            return `
                <div class="survey-title">
                    나의 목표는?
                </div>

                <div class="select-container">
                    <div class="select-item weight-loss" data-text="LOSE_WEIGHT">체중 감량</div>
                    <div class="select-item weight-maintain" data-text="MAINTAIN_WEIGHT">체중 유지</div>
                    <div class="select-item weight-gain" data-text="GAIN_WEIGHT">체중 증량</div>
                    <div class="select-item muscle-gain" data-text="GAIN_MUSCLE">근육 증량</div>
                </div>

                <div class="button-container bottom">
                    <div class="next-button">다음</div>
                </div>
            `;
        case 5:
            return `
                <div class="survey-title">
                    나의 활동량은?
                </div>

                <div class="select-container activity">
                    <div class="select-wrapper very-active" data-text="VERY_HIGH">
                        <div class="main-text">매우 활동적</div>
                        <div class="sub-text">주 6~7회 이상 고강도 운동 (운동 선수) <br> 업무 형태가 활동적</div>
                    </div>
                    <div class="select-wrapper active" data-text="HIGH">
                        <div class="main-text">활동적</div>
                        <div class="sub-text">주 4~6회 운동 (웨이트 트레이닝) <br> 주 150분 이상 유산소 운동</div>
                    </div>
                    <div class="select-wrapper moderate" data-text="NORMAL">
                        <div class="main-text">보통</div>
                        <div class="sub-text">주 2~3회 운동 (유산소 + 웨이트 트레이닝)</div>
                    </div>
                    <div class="select-wrapper low" data-text="LOW">
                        <div class="main-text">적음</div>
                        <div class="sub-text">주 2회 미만의 운동 <br> 웨이트 트레이닝 / 유산소 운동 선택적 진행</div>
                    </div>
                    <div class="select-wrapper very-low" data-text="VERY_LOW">
                        <div class="main-text">매우 적음</div>
                        <div class="sub-text">평소 운동을 하지 않음 <br> 업무 형태가 주로 앉아서 진행</div>
                    </div>
                </div>

                <div class="button-container bottom">
                    <div class="next-button">다음</div>
                </div>
            `;
            case 6:
                return `
                    <div class="survey-title">
                        넥스트짐을 다니고 계신가요?
                    </div>
    
                    <div class="select-container">
                        <div class="select-item yes" data-text="true">예</div>
                        <div class="select-item no" data-text="false">아니오</div>
                    </div>
    
                    <div class="button-container bottom">
                        <div class="next-button">다음</div>
                    </div>
                `;
        default:
            return `<div>잘못된 페이지</div>`;
    }
}

function loadPage(pageNumber, isBackNavigation = false) {
    $('#survey').html(getSurveyTemplate(pageNumber));

    // 페이지가 1이면 button-prev 숨기기, 그렇지 않으면 보이게 설정
    if (pageNumber === 1) {
        $('.button-prev').hide();
    } else {
        $('.button-prev').show();
    }

    if (!isBackNavigation) {
        history.pushState({ page: pageNumber }, '', `?page=${pageNumber}`);
    }
    restoreSurveyData();
    birthDropDown();
    
    populateDays(31);
    updateDays();
    bindEvents(pageNumber);
    updateProgressBar(pageNumber);
    updateButtonState(pageNumber);
}


function bindEvents(pageNumber) {
    $(".next-button").off('click').on('click', function () {
        nextPage(pageNumber);
        initHeaderNav();
    });

    $('input').off('blur').on('blur', function () {
        validateInput($(this));
        updateButtonState(pageNumber);
    });

    if(pageNumber === 1) {
        checkInput($('#name'));
        validateDateInput($('#year-text'));
        validateDateInput($('#month-text'));
        validateDateInput($('#day-text'));
    } else if(pageNumber === 2) {
        checkInput($('#height'));
        checkInput($('#weight'));
    }

}


function nextPage(pageNumber) {
    if(pageNumber === 1) {
        saveSurveyData('name', $('#name').val());
        saveSurveyData('birthYear', $('#year-text').data('text'));
        saveSurveyData('birthMonth', $('#month-text').data('text'));
        saveSurveyData('birthDay', $('#day-text').data('text'));
    } else if(pageNumber === 2) {
        saveSurveyData('height', $('#height').val());
        saveSurveyData('weight', $('#weight').val());
    } else if(pageNumber === 3) {
        saveSurveyData('gender', $('.select-item.valid').data('text'));
    } else if(pageNumber === 4) {
        saveSurveyData('goal', $('.select-item.valid').data('text'));
    } else if(pageNumber === 5) {
        saveSurveyData('activity', $('.select-wrapper.valid').data('text'));
    } else if(pageNumber === 6) {
        saveSurveyData('isNextGym', $('.select-item.valid').data('text'));
        
        const storedData = JSON.parse(localStorage.getItem('surveyData'));

        const requestData = {
            email: storedData.email,
            name: storedData.name,
            birthday: `${storedData.birthYear}-${storedData.birthMonth}-${storedData.birthDay}`, // yyyy-MM-dd
            gender: storedData.gender,
            height: parseFloat(storedData.height),
            weight: parseFloat(storedData.weight),
            goal: storedData.goal,
            activityLevel: storedData.activity,
            isNextGym: storedData.isNextGym === 'true'
        };

        $.ajax({
            type: "POST",
            url: "http://localhost:8080/signup",
            contentType: "application/json",
            data: JSON.stringify(requestData),
            success: function () {
                
                window.location.href = "/signup-complete";
            },
            error: function (err) {
                console.error("회원가입 실패", err);
                alert("회원가입 중 문제가 발생했습니다.");
            }
        });

        return;
    }
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
    if (surveyData.height) {
        $('#height').val(surveyData.height);
    }
    if (surveyData.weight) {
        $('#weight').val(surveyData.weight);
    }
    if (surveyData.gender) {
        if(surveyData.gender === 'male' || surveyData.gender === 'M') {
            $('.select-item.male').addClass('valid');
        } else if(surveyData.gender === 'female' || surveyData.gender === 'F') {
            $('.select-item.female').addClass('valid');
        }
    }
    if (surveyData.goal) {
        if(surveyData.goal == '1') {
            $('.select-item.weight-loss').addClass('valid');
        } else if(surveyData.goal == '2') {
            $('.select-item.weight-maintain').addClass('valid');
        } else if(surveyData.goal == '3') {
            $('.select-item.weight-gain').addClass('valid');
        } else if(surveyData.goal == '4') {
            $('.select-item.muscle-gain').addClass('valid');
        }
    }
    if (surveyData.activity) {
        if(surveyData.activity == '1') {
            $('.select-wrapper.very-low').addClass('valid');
        } else if(surveyData.activity == '2') {
            $('.select-wrapper.low').addClass('valid');
        } else if(surveyData.activity == '3') {
            $('.select-wrapper.moderate').addClass('valid');
        } else if(surveyData.activity == '4') {
            $('.select-wrapper.active').addClass('valid');
        } else if(surveyData.activity == '5') {
            $('.select-wrapper.very-active').addClass('valid');
        }
    }
    if (surveyData.isNextGym) {
        if (surveyData.isNextGym === 'true') {
            $('.select-item.yes').addClass('valid');
        } else {
            $('.select-item.no').addClass('valid');
        }
    }

    updateButtonState(currentPage);
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
    updateButtonState(currentPage);
});


// 드롭다운 채우기 및 클릭
$(document).on('click', '.select-item', function () {
    $('.select-item').removeClass('valid');
    $(this).addClass('valid');

    updateButtonState(currentPage);
});

// page4 활동량
$(document).on('click', '.select-wrapper', function () {
    $('.select-wrapper').removeClass('valid');
    $(this).addClass('valid');

    updateButtonState(currentPage);
});


$(document).on('click', function (event) {
    if (!$(event.target).closest('.date-picker').length) {
        $('.date-box').removeClass('open');
    }
});
