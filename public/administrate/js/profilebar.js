import { getAdminInfo, adminLogout } from './api.js';

$(document).ready(function() {
    initProfileBar();
});

async function initProfileBar() {
    try {
        const data = await getAdminInfo();
        if (data) {
            updateProfileBar(data.data);
        }
    } catch (error) {
        console.error('Error initializing profile bar:', error);
    }
}

async function logout() {
    try {
        await adminLogout();
        // 로그아웃 성공 시 처리
        window.location.replace('/admin/login');
        localStorage.removeItem('Authorization');
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

function updateProfileBar({ name, userRole, profileImageUrl }) {
    const imageUrl = profileImageUrl || '/administrate/images/icon_human_green.png';

    $('#profilebar').html(`
        <div class="profile-wrapper" style="position: relative;">
            <img src="${imageUrl}" class="image-profile">
            <div class="profile-text-wrapper">
                <div class="label-name">${name}</div>
                <div class="label-role">${userRole}</div>
            </div>
            <div class="button-wrapper">
                <img src="/administrate/images/icon_toggle_arrow_down.png" class="button-profile">
            </div>

            <div class="dropdown-menu">
                <div id="Logout" class="dropdown-item">로그아웃</div>
            </div>
        </div>
    `);

    // 드롭다운 토글 이벤트 등록
    $('.button-wrapper').on('click', function () {
        const dropdown = $('.dropdown-menu');
        if (dropdown.hasClass('open')) {
            dropdown.removeClass('open').css('display', 'none');
        } else {
            dropdown.addClass('open').css('display', 'flex');
        }
    });

    // 바깥 클릭 시 닫기
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.profile-wrapper').length) {
            $('.dropdown-menu').removeClass('open').css('display', 'none');
        }
    }); 

    // 로그아웃 클릭 이벤트 등록
    $('#Logout').on('click', function () {
        logout();
    });
}

