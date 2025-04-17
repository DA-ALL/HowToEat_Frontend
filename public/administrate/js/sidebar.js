import { updateURL, onPopstate } from '/administrate/js/router.js';
import { loadFoodDetail } from '/administrate/js/food-management/foodDetail.js';

$(document).ready(function () {
    // 사이드바 HTML 삽입
    $('#sidebar').html(`
        <div class="sidebar-container">
            <div class="logo-wrapper">
                <img src="/administrate/images/logo_02.png">
            </div>

            <div class="sidebar-item-wrapper nav-link" data-page="dashboard">
                <div class="point-rect"></div>
                <div class="sidebar-item"> 
                    <div class="icon-sidebar">
                        <img class="logo-dashboard" src="/administrate/images/icon_dashboard.png">
                    </div>
                    <div class="label">대시보드</div>
                </div>
            </div>
            <div class="sidebar-item-container">
                <div class="sidebar-item-wrapper nav-link user-management" data-page="user-management">
                    <div class="point-rect"></div>
                    <div class="sidebar-item">
                        <div class="icon-sidebar">
                            <img class="logo-user" src="/administrate/images/icon_user.png">
                        </div>
                        <div class="label">유저관리</div>
                    </div>
                </div>
                <div class="sidebar-item-options-wrapper user">
                    <div class="sidebar-item-wrapper user">
                        <div class="sidebar-item-option user" data-page="all-user">
                            <div class="dot"></div>
                            <div class="label">전체 유저 관리</div>
                        </div>
                    </div>
                    <div class="sidebar-item-wrapper user">
                        <div class="sidebar-item-option" data-page="pt">
                            <div class="dot"></div>
                            <div class="label">트레이너 회원 관리</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sidebar-item-container">
                <div class="sidebar-item-wrapper nav-link" data-page="food-management">
                    <div class="point-rect"></div>
                    <div class="sidebar-item"> 
                        <div class="icon-sidebar">
                            <img class="logo-food" src="/administrate/images/icon_food.png">
                        </div>
                        <div class="label">음식관리</div>
                    </div>
                </div>
                <div class="sidebar-item-options-wrapper food">
                    <div class="sidebar-item-wrapper food">
                        <div class="sidebar-item-option food" data-page="all-food">
                            <div class="dot"></div>
                            <div class="label">관리자 등록 음식</div>
                        </div>
                    </div>
                    <div class="sidebar-item-wrapper food">
                        <div class="sidebar-item-option" data-page="user-regist">
                            <div class="dot"></div>
                            <div class="label">유저 등록 음식</div>
                        </div>
                    </div>
                    <div class="sidebar-item-wrapper food">
                        <div class="sidebar-item-option" data-page="recommend">
                            <div class="dot"></div>
                            <div class="label">추천 음식</div>
                        </div>
                    </div>
                    <div class="sidebar-item-wrapper food">
                        <div class="sidebar-item-option" data-page="add">
                            <div class="dot"></div>
                            <div class="label">음식 추가</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sidebar-item-wrapper nav-link" data-page="notice">
                <div class="point-rect"></div>
                <div class="sidebar-item">
                    <div class="icon-sidebar">
                        <img class="logo-notice" src="/administrate/images/icon_notice.png">
                    </div>
                    <div class="label">공지사항</div>
                </div>
            </div>

            <div class="sidebar-item-divider"></div>

            <div class="sidebar-item-container">
                <div class="sidebar-item-wrapper nav-link" data-page="admin-management">
                    <div class="point-rect"></div>
                    <div class="sidebar-item"> 
                        <div class="icon-sidebar">
                            <img class="logo-admin" src="/administrate/images/icon_admin.png">
                        </div>
                        <div class="label">어드민 관리</div>
                    </div>
                </div>
                <div class="sidebar-item-options-wrapper admin">
                    <div class="sidebar-item-wrapper admin">
                        <div class="sidebar-item-option admin" data-page="all-admin">
                            <div class="dot"></div>
                            <div class="label">아이디 관리</div>
                        </div>
                    </div>
                    <div class="sidebar-item-wrapper admin">
                        <div class="sidebar-item-option" data-page="trainer">
                            <div class="dot"></div>
                            <div class="label">트레이너 관리</div>
                        </div>
                    </div>
                    <div class="sidebar-item-wrapper admin">
                        <div class="sidebar-item-option" data-page="gym">
                            <div class="dot"></div>
                            <div class="label">헬스장 관리</div>
                        </div>
                    </div>
                </div>
            </div>     
        </div>

        <div class="resizer" id="resizer"></div>
    `);

    // 페이지 로드 시 현재 URL 기준으로 active 상태 설정
    const currentPage = getCurrentPage();
    updateActiveState(currentPage);

    $('.sidebar-item-option').on('click', function (event) {
        var page = $(this).data('page');
        var newUrl = '';
        
        if(page === 'pt'){ 
            newUrl = `user-management/${page}`;
        } else if (page === 'user-regist') {
            newUrl = `food-management/${page}`;
        }  else if (page === 'recommend') {
            newUrl = `food-management/${page}`;
        } else if (page === 'add') {
            newUrl = `food-management/${page}`;
            
        } else if (page === 'trainer') {
            newUrl = `admin-management/${page}`;
        } else if (page === 'gym') {
            newUrl = `admin-management/${page}`;
        } else if (page === 'all-user') {
            newUrl = `user-management`;
        } else if (page === 'all-food') {
            newUrl = `food-management`;
        } else if (page === 'all-admin') {
            newUrl = `admin-management`;
        }
        
        updateURL(newUrl);
        updateSideOptionActiveState(page);
        
        if (page === 'add') {
            loadFoodDetail({type:"add"});
        }

        $(this).addClass("active");
    })
    
    // 링크 클릭 이벤트 설정 (새로고침 없이 이동)
    $('.nav-link').on('click', function (event) {
        event.preventDefault(); // 기본 이동 방지
        const page = $(this).data('page'); // data-page 값 가져오기

        // URL 변경 (새로고침 없음)
        updateURL(page);
        updateActiveState(page); // active 상태 업데이트

        // 모든 nav-link의 이미지 원래대로 변경
        $('.nav-link .logo-dashboard').each(function () {
            $(this).attr('src', '/administrate/images/icon_dashboard.png');
        });

        // 클릭한 요소의 이미지 변경
        $(this).find('.logo-dashboard').attr('src', '/administrate/images/icon_dashboard_white.png');
    });

    onPopstate(function (event) {
        const pathParts = window.location.pathname.split("/").slice(2);
        updateActiveState(pathParts.length > 1 ? pathParts : pathParts[0]); // 사이드바 active 업데이트
    });

    // 현재 페이지의 맨뒤에 url을 가져오기
    function getCurrentPage() {
        const pathParts = window.location.pathname.split("/").slice(2); // "/admin/food-management/1" → ["food-management", "1"]
    
        if (pathParts[0] === 'food-management') {
            if (pathParts.length === 2 && /^\d+$/.test(pathParts[1])) {
                return ['food-management', 'all-food'];
            }
    
            if (pathParts[1] === 'user-regist' && /^\d+$/.test(pathParts[2])) {
                return ['food-management', 'user-regist'];
            }
    
            if (pathParts[1] === 'recommend' && /^\d+$/.test(pathParts[2])) {
                return ['food-management', 'recommend'];
            }
        }
    
        return pathParts.length > 1 ? pathParts : pathParts[0]; // fallback
    }
    

    // 사이드바 선택 상태 업데이트
    function updateActiveState(page) {
        $(".nav-link").removeClass("active"); // 기존 active 제거
        $(".sidebar-item-option").removeClass("active");
        $(`.nav-link[data-page="${page}"]`).addClass("active"); // 새로 선택된 요소에 active 추가
    
        const $optionsWrapper = $(".sidebar-item-options-wrapper");
        const $optionsUserManagementWrapper = $(".sidebar-item-options-wrapper.user");
        const $optionsFoodManagementWrapper = $(".sidebar-item-options-wrapper.food");
        const $optionsAdminManagementWrapper = $(".sidebar-item-options-wrapper.admin");
        var pageUrl = page;

        if(Array.isArray(page)) {
            pageUrl = page[0];
        }

        if (Array.isArray(page)) {
            const mainPage = page[0];
            let subPage = page[1];
            
            // url이 /user-management/user/1 인 경우 처리
            if (mainPage === 'user-management' && subPage === 'user') {
                subPage = 'all-user';
            }

            $(`.nav-link[data-page="${mainPage}"]`).addClass("active");
    
            // 드롭다운 애니메이션 적용
            if(mainPage === 'user-management') {
                $optionsUserManagementWrapper.stop(true, true).css({ display: "flex", height: 0, opacity: 0 }).animate({ height: "58px", opacity: 1 }, 300);
            } else if(mainPage === 'food-management') {
                $optionsFoodManagementWrapper.stop(true, true).css({ display: "flex", height: 0, opacity: 0 }).animate({ height: "126px", opacity: 1 }, 300);
            } else if(mainPage === 'admin-management') {
                $optionsAdminManagementWrapper.stop(true, true).css({ display: "flex", height: 0, opacity: 0 }).animate({ height: "92px", opacity: 1 }, 300);
            }

            
            $(`.sidebar-item-option[data-page="${subPage}"]`).addClass("active"); // 하위 옵션도 활성화
            
        } else {
            $(`.nav-link[data-page="${page}"]`).addClass("active");
    
            if (page === "user-management") {
                $optionsWrapper.stop(true, true).animate({ opacity: 0, height: 0 }, 300, function () {$(this).css("display", "none");});
                $optionsUserManagementWrapper.stop(true, true).css({ display: "flex", height: 0, opacity: 0 }).animate({ height: "58px", opacity: 1 }, 300);

                $('.sidebar-item-option.user').addClass("active");
            } else if(page === "food-management") {
                $optionsWrapper.stop(true, true).animate({ opacity: 0, height: 0 }, 300, function () {$(this).css("display", "none");});
                $optionsFoodManagementWrapper.stop(true, true).css({ display: "flex", height: 0, opacity: 0 }).animate({ height: "126px", opacity: 1 }, 300);
                
                $('.sidebar-item-option.food').addClass("active");
            } else if(page === "admin-management") {
                $optionsWrapper.stop(true, true).animate({ opacity: 0, height: 0 }, 300, function () {$(this).css("display", "none");});
                $optionsAdminManagementWrapper.stop(true, true).css({ display: "flex", height: 0, opacity: 0 }).animate({ height: "92px", opacity: 1 }, 300);
                $('.sidebar-item-option.admin').addClass("active");
            } else {
                $optionsWrapper.stop(true, true).animate({ opacity: 0, height: 0 }, 300, function () {$(this).css("display", "none");});
                
            }
        }

        // 아이콘 색상 변경 로직 유지
        $(".logo-dashboard").attr("src", "/administrate/images/icon_dashboard.png");
        $(".logo-user").attr("src", "/administrate/images/icon_user.png");
        $(".logo-food").attr("src", "/administrate/images/icon_food.png");
        $(".logo-notice").attr("src", "/administrate/images/icon_notice.png");
        $(".logo-admin").attr("src", "/administrate/images/icon_admin.png");

        if (pageUrl === "user-management") {
            $(".logo-user").attr("src", "/administrate/images/icon_user_white.png");
        } else if (pageUrl === "dashboard") {
            $(".logo-dashboard").attr("src", "/administrate/images/icon_dashboard_white.png");
        } else if (pageUrl === "food-management") {
            $(".logo-food").attr("src", "/administrate/images/icon_food_white.png");
        } else if (pageUrl === "notice") {
            $(".logo-notice").attr("src", "/administrate/images/icon_notice_white.png");
        } else if (pageUrl === "admin-management") {
            $(".logo-admin").attr("src", "/administrate/images/icon_admin_white.png");
        }
    }

    // 유저관리 서브 사이드 바 상태 업데이트
    function updateSideOptionActiveState(page) {
        $(".sidebar-item-option").removeClass("active"); // 기존 active 제거
    }


    // [사이바 드래그로 줄이 키우기 기능]
    const $sidebarContainer = $('.sidebar-container');
    const $resizer = $('#resizer');

    // 로컬 스토리지에서 너비 값 가져오기
    const savedWidth = localStorage.getItem('sidebarContainerWidth');
    if (savedWidth) {
        $sidebarContainer.width(savedWidth);
    }

    let isResizing = false;

    $(document).on('mousedown', '#resizer', function(event) {
        isResizing = true;
        const startX = event.clientX;
        const startWidth = $sidebarContainer.width();

        $(document).on('mousemove', function(event) {
            if (isResizing) {
                const newWidth = startWidth - (startX - event.clientX);
                $sidebarContainer.width(newWidth);
            }
        });

        $(document).on('mouseup', function() {
            isResizing = false;
            $(document).off('mousemove');
            $(document).off('mouseup');

            // 너비 값을 로컬 스토리지에 저장
            localStorage.setItem('sidebarContainerWidth', $sidebarContainer.width());
        });

        event.preventDefault();
    });
});
