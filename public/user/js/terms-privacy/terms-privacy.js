import { initHeaderNav } from '../components/header-nav.js';


$(document).ready(function () {
    initHeaderNav($('#terms'));
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const user = getPayloadFromToken(token);
    console.log(user);
    
    // 생일이 "MM-DD" 형식이면 나눠서 넣기
    const birthMonth = user.birthday?.split('-')[0] || '';
    const birthDay = user.birthday?.split('-')[1] || '';

    // surveyData 초기화
    let surveyData = {
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
        isNextGym: '',
        signupProvider: user.signup_provider || '',
        profileImageUrl: user.profile_image_url || '',
        termsAgreedAt:'',
        privacyAgreedAt:''
    };

    localStorage.setItem('surveyData', JSON.stringify(surveyData));


    function updateState() {
        const termsActive = $('#termsBtn img').attr('src').includes('active');
        const privacyActive = $('#privacyBtn img').attr('src').includes('active');

        if (termsActive && privacyActive) {
            $('#allBtn img').attr('src', '/user/images/icon_check_active.png');
            $('#agreeButton').removeClass('disabled');
        } else {
            $('#allBtn img').attr('src', '/user/images/icon_check.png');
            $('#agreeButton').addClass('disabled');
        }
    }

    $('#allBtn').on('click', function () {
        const isActive = $('#allBtn img').attr('src').includes('active');
        const newSrc = isActive ? '/user/images/icon_check.png' : '/user/images/icon_check_active.png';

        $('#allBtn img').attr('src', newSrc);
        $('#termsBtn img').attr('src', newSrc);
        $('#privacyBtn img').attr('src', newSrc);

        if (!isActive) {
            $('#agreeButton').removeClass('disabled');
        } else {
            $('#agreeButton').addClass('disabled');
        }
    });

    $('#termsBtn, #privacyBtn').on('click', function () {
        const $img = $(this).find('img');
        const isActive = $img.attr('src').includes('active');
        const newSrc = isActive ? '/user/images/icon_check.png' : '/user/images/icon_check_active.png';

        $img.attr('src', newSrc);
        updateState();
    });
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

$('#agreeButton').on('click', function () {
    if ($(this).hasClass('disabled')) {
        return; // 동의하지 않은 상태면 아무 것도 안함
    }

    // 현재 날짜/시간 ISO 포맷
    const now = new Date().toISOString();

    // surveyData 불러오기
    let surveyData = JSON.parse(localStorage.getItem('surveyData') || '{}');

    // 값 넣기
    surveyData.termsAgreedAt = now;
    surveyData.privacyAgreedAt = now;

    // 다시 저장
    localStorage.setItem('surveyData', JSON.stringify(surveyData));
    window.location.href = '/survey'
});