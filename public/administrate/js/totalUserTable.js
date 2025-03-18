$(document).ready(function () {
    const usersPerPage = 20;
    let currentPage = getPageFromURL() || 1; // URL에서 page 값 가져오기

    function createUserRow({ id, imageURL, name, mealCount, joined, left, gymUser, role }) {
        return `
            <tr>
                <td class="td-id">${id}</td>
                <td class="td-user-profile">
                    <div class="td-user-profile-wrapper">
                        <div class="image-user">
                            <img src=${imageURL}>
                        </div>
                        <div class="user-name">${name}</div>
                    </div>
                </td>
                <td class="td-meal-log-count">${mealCount}</td>
                <td class="td-account-created-at">${joined}</td>
                <td class="td-account-closed-at">${left}</td>
                <td class="td-gym-user">
                    ${gymUser ? `<div class="image-gym-user"><img src="/administrate/images/logo_nextgym_02.png"></div>` : `<div class="image-gym-user">-</div>`}
                </td>
                <td class="td-user-role">
                    <div class="user-role-wrapper">
                        <div class="user-role-button ${role}">${role.charAt(0).toUpperCase() + role.slice(1)}</div>
                    </div>
                </td>
            </tr>
        `;
    }

    function renderUserTable() {
        const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th class="th-id">ID</th>
                        <th class="th-user-profile">회원명</th>
                        <th class="th-meal-log-count">식단 총 등록 수</th>
                        <th class="th-account-created-at">가입일</th>
                        <th class="th-account-closed-at">탈퇴일</th>
                        <th class="th-gym-user">넥스트짐 등록 여부</th>
                        <th class="th-user-role">권한</th>
                    </tr>
                </thead>
                <tbody id="userTableBody"></tbody>
            </table>
            <div id="pagination"></div>`;
        
        $('#totalUserTable').html(tableHTML);
        renderPageData();
    }

    function renderPageData() {
        const users = getUserData();
        const start = (currentPage - 1) * usersPerPage;
        const end = start + usersPerPage;
        $('#userTableBody').html(users.slice(start, end).map(createUserRow).join(""));
        renderPagination(users.length);
    }

    function renderPagination(totalUsers) {
        const totalPages = Math.ceil(totalUsers / usersPerPage);
        let paginationHTML = "<div class='pagination'>";
        
        paginationHTML += `<div class="pagination-button" data-page="${Math.max(1, currentPage - 10)}"><<</div>`;
        paginationHTML += `<div class="pagination-button" data-page="${Math.max(1, currentPage - 1)}"><</div>`;
        
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);
        
        if (currentPage <= 3) {
            startPage = 1;
            endPage = Math.min(5, totalPages);
        } else if (currentPage >= totalPages - 2) {
            startPage = Math.max(1, totalPages - 4);
            endPage = totalPages;
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `<div class="pagination-button ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</div>`;
        }
        
        paginationHTML += `<div class="pagination-button" data-page="${Math.min(totalPages, currentPage + 1)}">></div>`;
        paginationHTML += `<div class="pagination-button" data-page="${Math.min(totalPages, currentPage + 10)}">>></div>`;
        paginationHTML += "</div>";
        
        $('#pagination').html(paginationHTML);

        $('.pagination-button').click(function () {
            const newPage = parseInt($(this).data("page"));
            if (newPage !== currentPage) {
                updatePageInURL(newPage);
                currentPage = newPage;
                renderPageData();
            }
        });
    }

    function updatePageInURL(page) {
        const url = new URL(window.location);
        url.searchParams.set('page', page);
        window.history.pushState({ page }, "", url);
    }

    function getPageFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('page')) || 1;
    }

    function getUserData() {
        return Array.from({ length: 200 }, (_, i) => ({
            id: i + 1,
            imageURL: "/administrate/images/icon_human_green.png",
            name: `사용자${i + 1}`,
            mealCount: Math.floor(Math.random() * 200),
            joined: "2025.03.16",
            left: "-",
            gymUser: Math.random() > 0.5,
            role: ["admin", "user", "master"][Math.floor(Math.random() * 3)]
        }));
    }

    function renderPage() {
        currentPage = getPageFromURL(); // URL에서 페이지 값 다시 읽기
        renderUserTable();
    }

    // 최초 실행
    renderPage();

    // 뒤로가기, 앞으로가기 시 페이지 유지
    window.addEventListener("popstate", renderPage);
});