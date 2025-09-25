import { updateButtonState, validateInput, checkInput } from '/user/js/components/input-validate.js';
import { populateDays, updateDays, validateDateInput, birthDropDown } from '/user/js/components/date-picker-validate.js';
import { updateProgressBar } from '/user/js/components/header-processbar.js';
import { initHeaderNav } from '/user/js/components/header-nav.js';
import { setupAjaxAuthInterceptor } from '../utils/auth-interceptor.js';

let currentPage = 1;
// 뒤로가기 이벤트 처리
const surveyData = JSON.parse(localStorage.getItem('surveyData'));

window.onpopstate = function (event) {
    if (event.state && event.state.page) {
        currentPage = event.state.page;
        loadPage(currentPage, true);
    }
};

$(document).ready(function () {
    setupAjaxAuthInterceptor();
    const urlParams = new URLSearchParams(window.location.search);
    const savedPage = parseInt(urlParams.get('page')) || 1;

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


function getSurveyTemplate(pageNumber, provider) {
    switch (pageNumber) {
        case 1:
            return `
                <div class="survey-title">
                    아래의 정보가 맞나요?
                </div>

                <div class="input-container">
                    <div class="input-wrapper">
                        <div class="input-label">이름</div>
                        <div class="input name-input">
                            <input type="text" data-provider="${provider}" id="name" name="name" placeholder="이름" ime-mode="active" data-text="">
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
                            <input class="decimal" type="text" inputmode="decimal" id="height" name="height" placeholder="키" ime-mode="active" data-text="">
                        </div>
                    </div>

                    <div class="input-wrapper">
                        <div class="input-label">몸무게</div>
                        <div class="input">
                            <input class="decimal" type="text" inputmode="decimal" id="weight" name="weight" placeholder="몸무게" ime-mode="active" data-text="">
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
                        <div class="main-text">운동이 일상이에요</div>
                        <div class="des-text">운동이 루틴이고, 하루종일 활동적임</div>
                        <div class="sub-text">주 6~7회 이상 고강도 운동 (운동 선수) <br> 업무 형태가 활동적</div>
                    </div>
                    <div class="select-wrapper active" data-text="HIGH">
                        <div class="main-text">꽤 자주해요</div>
                        <div class="des-text">거의 매일 운동함</div>
                        <div class="sub-text">주 4~6회 웨이트운동과 유산소 포함</div>
                    </div>
                    <div class="select-wrapper moderate" data-text="NORMAL">
                        <div class="main-text">보통이에요</div>
                        <div class="des-text">일주일에 몇번 운동함</div>
                        <div class="sub-text">주 2~3회 운동 (유산소 + 웨이트 트레이닝)</div>
                    </div>
                    <div class="select-wrapper low" data-text="LOW">
                        <div class="main-text">가끔해요</div>
                        <div class="des-text">가볍게 움직임</div>
                        <div class="sub-text">주 1~2회 가볍게 걷기, 요가, 스트레칭 등</div>
                    </div>
                    <div class="select-wrapper very-low" data-text="VERY_LOW">
                        <div class="main-text">안해요</div>
                        <div class="des-text">운동을 하지 않음</div>
                        <div class="sub-text">하루에 대부분 앉아서 생활 <br> 운동습관 없음</div>
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
    let provider = surveyData.signupProvider;
    $('#survey').html(getSurveyTemplate(pageNumber, provider));

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
    if (pageNumber === 1) {
        saveSurveyData('name', $('#name').val());
        saveSurveyData('birthYear', $('#year-text').data('text'));
    
        // 👇 두 자리 형식으로 보정
        const month = String($('#month-text').data('text')).padStart(2, '0');
        const day = String($('#day-text').data('text')).padStart(2, '0');
    
        saveSurveyData('birthMonth', month);
        saveSurveyData('birthDay', day);
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
            isNextGym: storedData.isNextGym,
            signupProvider: storedData.signupProvider,
            profileImageUrl: storedData.profileImageUrl,
        };

        $.ajax({
            type: "POST",
            url: `${window.DOMAIN_URL}/signup`,
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
    //  Apple 로그인 시, name 값 존재 여부에 따라 disabled 제어
    if (surveyData.signupProvider === 'APPLE') {
        if (surveyData.name && surveyData.name.trim() !== "") {
            $('#name').val(surveyData.name);
            $('#name')
                .attr('disabled', true)               // 입력 불가
                .addClass('disabled');                // CSS 제어용 클래스 추가
            $('.name-input').addClass('disabled');    // wrapper에도 클래스 넣고 싶다면
        } else {
            $('#name')
                .removeAttr('disabled')               // 입력 가능
                .removeClass('disabled');             // 클래스 제거
            $('.name-input').removeClass('disabled'); // wrapper에도 제거
        }
    } else {
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
        if(surveyData.gender === 'MALE' || surveyData.gender === 'M') {
            $('.select-item.male').addClass('valid');
        } else if(surveyData.gender === 'FEMALE' || surveyData.gender === 'F') {
            $('.select-item.female').addClass('valid');
        }
    }
    if (surveyData.goal) {
        if(surveyData.goal == 'LOSE_WEIGHT') {
            $('.select-item.weight-loss').addClass('valid');
        } else if(surveyData.goal == 'MAINTAIN_WEIGHT') {
            $('.select-item.weight-maintain').addClass('valid');
        } else if(surveyData.goal == 'GAIN_WEIGHT') {
            $('.select-item.weight-gain').addClass('valid');
        } else if(surveyData.goal == 'GAIN_MUSCLE') {
            $('.select-item.muscle-gain').addClass('valid');
        }
    }
    if (surveyData.activity) {
        if(surveyData.activity == 'VERY_HIGH') {
            $('.select-wrapper.very-active').addClass('valid');
        } else if(surveyData.activity == 'HIGH') {
            $('.select-wrapper.active').addClass('valid');
        } else if(surveyData.activity == 'NORMAL') {
            $('.select-wrapper.moderate').addClass('valid');
        } else if(surveyData.activity == 'LOW') {
            $('.select-wrapper.low').addClass('valid');
        } else if(surveyData.activity == 'VERY_LOW') {
            $('.select-wrapper.very-low').addClass('valid');
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

$(document).on('input', '.decimal', function () {
    let val = $(this).val();
    

    // 숫자와 소수점만 남기기
    val = val.replace(/[^0-9.]/g, '');

    // 소수점 2개 이상 제거
    const parts = val.split('.');
    if (parts.length > 2) {
        val = parts[0] + '.' + parts[1];
    }

    // 소수점 이하 첫째 자리까지만 유지
    if (parts.length === 2) {
        parts[1] = parts[1].substring(0, 1); // 한 자리까지만
        val = parts[0] + '.' + parts[1];
    }

    $(this).val(val);
});

$(document).on('keydown', '.decimal', function (e) {
    if (this.value === '' && e.key === '0') {
      e.preventDefault();
    }
  });