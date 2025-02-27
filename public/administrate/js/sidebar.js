$(document).ready(function() {
    // 사이드바 HTML 삽입
    $('#sidebar').html(`
        <div class="sidebar-container">
            <div class="logo-wrapper">
                <img src="/administrate/images/logo_02.png">
            </div>

            <div class="sidebar-item-wrapper nav-link" data-page="dashboard">
                <div class="point-rect"></div>
                <div class="sidebar-item"> 
                    <img class="logo-dashboard" src="/administrate/images/icon_dashboard.png">
                    <div class="label">대시보드</div>
                </div>
            </div>
            <div class="sidebar-item-wrapper nav-link" data-page="user-management">
                <div class="point-rect"></div>
                <div class="sidebar-item"> 
                    <img class="logo-user" src="/administrate/images/icon_user.png">
                    <div class="label">유저관리</div>
                </div>
            </div>
            <div class="sidebar-item-wrapper nav-link" data-page="food-management">
                <div class="point-rect"></div>
                <div class="sidebar-item"> 
                    <img class="logo-food" src="/administrate/images/icon_food.png">
                    <div class="label">음식관리</div>
                </div>
            </div>
            <div class="sidebar-item-wrapper nav-link" data-page="report">
                <div class="point-rect"></div>
                <div class="sidebar-item"> 
                    <img class="logo-report" src="/administrate/images/icon_report.png">
                    <div class="label">리포트</div>
                </div>
            </div>
            <div class="sidebar-item-wrapper nav-link" data-page="notice">
                <div class="point-rect"></div>
                <div class="sidebar-item"> 
                    <img class="logo-notice" src="/administrate/images/icon_notice.png">
                    <div class="label">공지사항</div>
                </div>
            </div>

            <div class="sidebar-item-divider"></div>

            <div class="sidebar-item-wrapper nav-link" data-page="admin-management">
                <div class="point-rect"></div>
                <div class="sidebar-item"> 
                    <img class="logo-admin" src="/administrate/images/icon_admin.png">
                    <div class="label">어드민 관리</div>
                </div>
            </div>                
        </div>
    `);

    // 현재 URL에서 활성화할 페이지 가져오기
    function getCurrentPage() {
        return window.location.pathname.split("/").pop(); // 예: "/admin/dashboard" -> "dashboard"
    }

    // 사이드바 선택 상태 업데이트
    function updateActiveState(page) {
        $(".nav-link").removeClass("active"); // 기존 active 제거
        $(`.nav-link[data-page="${page}"]`).addClass("active"); // 새로 선택된 요소에 active 추가
    }

    // 링크 클릭 이벤트 설정 (새로고침 없이 이동)
    $('.nav-link').on('click', function(event) {
        event.preventDefault(); // 기본 이동 방지
        const page = $(this).data('page'); // data-page 값 가져오기
        const newUrl = `/admin/${page}`; // 새로운 URL 생성

        // URL 변경 (새로고침 없음)
        history.pushState({ page: page }, "", newUrl);

        // 콘텐츠 변경 (AJAX로 해당 페이지 내용 불러오기)
        loadPageContent(page);
        updateActiveState(page); // active 상태 업데이트
    });

    // 뒤로가기/앞으로가기 처리 (popstate 이벤트)
    window.onpopstate = function(event) {
        if (event.state && event.state.page) {
            loadPageContent(event.state.page);
        }
    };

    // 페이지 콘텐츠 불러오는 함수
    function loadPageContent(page) {
        $('#content').load(`/pages/${page}.html`); // AJAX로 해당 페이지 로드
    }


    // 페이지 로드 시 현재 URL 기준으로 active 상태 설정
    const currentPage = getCurrentPage();
    updateActiveState(currentPage);
    loadPageContent(currentPage);
});