import { initHeaderNav } from '../components/header-nav.js';

function renderTermsPrivacy() {
    console.log("Test");
}

$(document).ready(function () {
    renderTermsPrivacy();
    initHeaderNav($('#terms'));


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
