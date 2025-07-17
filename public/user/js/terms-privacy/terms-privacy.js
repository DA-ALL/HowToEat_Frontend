import { initHeaderNav } from '../components/header-nav.js';

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
    isNextGym: '',
    termsAgreedAt:'',
    privacyAgreedAt:''
};

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
        isNextGym: '',
        signupProvider: user.signup_provider || '',
        profileImageUrl: user.profile_image_url || '',
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