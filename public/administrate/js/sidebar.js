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
                <div class="sidebar-item-options-wrapper">
                    <div class="sidebar-item-wrapper user">
                        <div class="sidebar-item-option user" data-page="user">
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
            <div class="sidebar-item-wrapper nav-link" data-page="food-management">
                <div class="point-rect"></div>
                <div class="sidebar-item"> 
                    <div class="icon-sidebar">
                        <img class="logo-food" src="/administrate/images/icon_food.png">
                    </div>
                    <div class="label">음식관리</div>
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

            <div class="sidebar-item-wrapper nav-link" data-page="admin-management">
                <div class="point-rect"></div>
                <div class="sidebar-item"> 
                    <div class="icon-sidebar">
                        <img class="logo-admin" src="/administrate/images/icon_admin.png">
                    </div>
                    <div class="label">어드민 관리</div>
                </div>
            </div>                
        </div>

        <div class="resizer" id="resizer"></div>
    `);

    // 페이지 로드 시 현재 URL 기준으로 active 상태 설정
    const currentPage = getCurrentPage();
    updateActiveState(currentPage);
    loadPageContent(currentPage);

    $('.sidebar-item-option').on('click', function (event) {
        var page = $(this).data('page');
        var newUrl = '';

        if(page === 'pt'){
            console.log("true");
            // URL 변경 (새로고침 없음)
            newUrl = `/admin/user-management/${page}`; // 새로운 URL 생성
        } else if (page === 'user') {
            newUrl = `/admin/user-management`; // 새로운 URL 생성
        }

        history.pushState({ page: page }, "", newUrl);

        // 콘텐츠 변경 (AJAX로 해당 페이지 내용 불러오기)
        loadPageContent(page);
        updateSideOptionActiveState(page);

        $(this).addClass("active");
    })

    // 링크 클릭 이벤트 설정 (새로고침 없이 이동)
    $('.nav-link').on('click', function (event) {
        event.preventDefault(); // 기본 이동 방지
        const page = $(this).data('page'); // data-page 값 가져오기
        const newUrl = `/admin/${page}`; // 새로운 URL 생성

        // URL 변경 (새로고침 없음)
        history.pushState({ page: page }, "", newUrl);

        // 콘텐츠 변경 (AJAX로 해당 페이지 내용 불러오기)
        loadPageContent(page);
        updateActiveState(page); // active 상태 업데이트

        // 모든 nav-link의 이미지 원래대로 변경
        $('.nav-link .logo-dashboard').each(function () {
            $(this).attr('src', '/administrate/images/icon_dashboard.png');
        });

        // 클릭한 요소의 이미지 변경
        $(this).find('.logo-dashboard').attr('src', '/administrate/images/icon_dashboard_white.png');
    });

    // 뒤로가기/앞으로가기 처리 (popstate 이벤트)
    window.onpopstate = function (event) {
        const pathParts = window.location.pathname.split("/").slice(2);
        if (event.state && event.state.page) {
            loadPageContent(pathParts.length > 1 ? pathParts : pathParts[0]); // 콘텐츠 변경
            updateActiveState(pathParts.length > 1 ? pathParts : pathParts[0]); // 사이드바 active 업데이트
        }
    };


    // 페이지 콘텐츠 불러오는 함수
    function loadPageContent(page) {
        $('#content').load(`/pages/${page}.html`); // AJAX로 해당 페이지 로드
    }


    // 현재 페이지의 맨뒤에 url을 가져오기
    function getCurrentPage() {
        const pathParts = window.location.pathname.split("/").slice(2); // "/admin/user-management/pt" → ["user-management", "pt"]
        return pathParts.length > 1 ? pathParts : pathParts[0]; // ["user-management", "pt"] or "dashboard"
    }
    

    // 사이드바 선택 상태 업데이트
    function updateActiveState(page) {
        $(".nav-link").removeClass("active"); // 기존 active 제거
        $(".sidebar-item-option").removeClass("active");
        $(`.nav-link[data-page="${page}"]`).addClass("active"); // 새로 선택된 요소에 active 추가
    
        const $optionsWrapper = $(".sidebar-item-options-wrapper");
        var pageUrl = page;

        if(Array.isArray(page)) {
            pageUrl = page[0];
        }

        if (Array.isArray(page)) {
            const mainPage = page[0];
            const subPage = page[1];
    
            $(`.nav-link[data-page="${mainPage}"]`).addClass("active");
    
            // 드롭다운 애니메이션 적용
            $optionsWrapper.stop(true, true)
                .css({ display: "flex", height: 0, opacity: 0 })
                .animate({ height: "58px", opacity: 1 }, 300);
    
            $(`.sidebar-item-option[data-page="${subPage}"]`).addClass("active"); // 하위 옵션도 활성화
        } else {
            $(`.nav-link[data-page="${page}"]`).addClass("active");
    
            if (page === "user-management") {
                $optionsWrapper.stop(true, true)
                    .css({ display: "flex", height: 0, opacity: 0 })
                    .animate({ height: "58px", opacity: 1 }, 300);
                
                $('.sidebar-item-option.user').addClass("active");
            } else {
                $optionsWrapper.stop(true, true).animate({ opacity: 0, height: 0 }, 300, function () {
                    $(this).css("display", "none");
                });
            }
        }

        // 아이콘 색상 변경 로직 유지
        $(".logo-dashboard").attr("src", "/administrate/images/icon_dashboard.png");
        $(".logo-user").attr("src", "/administrate/images/icon_user.png");
        $(".logo-food").attr("src", "/administrate/images/icon_food.png");
        $(".logo-notice").attr("src", "/administrate/images/icon_notice.png");
        $(".logo-admin").attr("src", "/administrate/images/icon_admin.png");

        if (pageUrl === "user-management") {
            console.log("test")
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
