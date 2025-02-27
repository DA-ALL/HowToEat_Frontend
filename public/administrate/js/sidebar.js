$(document).ready(function() {
    // 사이드바 HTML 삽입
    $('#sidebar').html(`
        <div class="sidebar">
            <div class="sidebar-item-wrapper>
                <div class="nav-link" data-page="dashboard">대시보드</div>
                <div class="nav-link" data-page="user-management">유저관리</div>
                <div class="nav-link" data-page="food-management">음식관리</div>
                <div href="/admin/notice" class="nav-link" data-page="notice">공지사항</div>
                <div href="/admin/admin-management" class="nav-link" data-page="admin-management">어드민관리</div>
            </ul>
        </div>
    `);

    // 링크 클릭 이벤트 설정 (새로고침 없이 이동)
    $('.nav-link').on('click', function(event) {
        event.preventDefault(); // 기본 이동 방지
        const page = $(this).data('page'); // data-page 값 가져오기
        const newUrl = `/admin/${page}`; // 새로운 URL 생성

        // URL 변경 (새로고침 없음)
        history.pushState({ page: page }, "", newUrl);

        // 콘텐츠 변경 (AJAX로 해당 페이지 내용 불러오기)
        loadPageContent(page);
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
});