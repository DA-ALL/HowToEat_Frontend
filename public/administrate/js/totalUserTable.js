import { onPopstate, updateQueryParam, getCurrentContent} from '/administrate/js/router.js';
import { showCustomAlert } from '/administrate/js/components/customAlert.js';
import { renderPagination } from '/administrate/js/components/pagination.js';

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
                    <div class="user-role-button ${role}">${role=='super-user' ? 'SuperUser' : role.charAt(0).toUpperCase() + role.slice(1)}</div>
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
        <div class="pagination"></div>`;

    $('#totalUserTable').html(tableHTML);
    renderPageData();
}

function renderPageData() {
    const users = getUserData();
    const start = (currentPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    $('#userTableBody').html(users.slice(start, end).map(createUserRow).join(""));
    // renderPagination(users.length);

    renderPagination({
        contentId: 'userManagement',
        totalItems: users.length,
        itemsPerPage: usersPerPage,
        currentPage,
        onPageChange: (newPage) => {
            updateQueryParam({ page: newPage });
            currentPage = newPage;
            renderPageData();
        }
    });
}

function getPageFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    if(getCurrentContent() == 'userManagement') {
        return parseInt(urlParams.get('page')) || 1;
    } else {
        return 1;
    }
    
}

function getUserData() {
    //TODO: data 요청 api
    return Array.from({ length: 200 }, (_, i) => ({
        id: i + 1,
        imageURL: "/administrate/images/icon_human_green.png",
        name: `사용자${i + 1}`,
        mealCount: Math.floor(Math.random() * 200),
        joined: "2025.03.16",
        left: "-",
        gymUser: Math.random() > 0.5,
        role: ["admin", "user", "master", "super-user"][Math.floor(Math.random() * 4)]
    }));
}

export function loadTotalUserTable() {
    currentPage = getPageFromURL(); // URL에서 페이지 값 다시 읽기
    renderUserTable();
}

// 유저권한 변경 버튼
$(document).on('click', '.user-role-button', function () {
    let dropdownMaster =`
        <div id="roleChangeDropdown">
            <div class="role-item master">Master</div>
        </div>
    `
    let dropdownOther = `
        <div id="roleChangeDropdown">
            <div class="role-item admin">Admin</div>
            <div class="role-item user">User</div>
            <div class="role-item super-user">SuperUser</div>
        </div>
    `
    const $button = $(this);
    const offset = $button.offset(); // 버튼의 위치 가져오기

    // 기존 dropdown이 있으면 삭제 (토글 효과)
    if ($('#roleChangeDropdown').length) {
        $('#roleChangeDropdown').remove();
        return;
    }

    // 버튼이 master 클래스인지 확인 후 드롭다운 선택
    const dropdownHTML = $button.hasClass('master') ? dropdownMaster : dropdownOther;

    // Dropdown 생성 및 위치 지정
    const $dropdown = $(dropdownHTML).css({
        position: 'absolute',
        top: offset.top + $button.outerHeight() + 5, // 버튼 아래에 배치
        left: offset.left - 10,
        zIndex: 1000
    });

    $('body').append($dropdown);

    showCustomAlert();
    
    // 다른 곳 클릭 시 닫기
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.user-role-button, #roleChangeDropdown').length) {
            $('#roleChangeDropdown').remove();
        }
    });
});

$(document).on('click', '.role-item', function () {
    // TODO: role 변경 API 호출
    console.log("role변경 API 호출");

    const isOk = true;
    
    if(isOk){
        
    }
    
    $('#roleChangeDropdown').remove();
});

// 넥스트짐 유저 여부 변경 UI
$(document).on('click', '.image-gym-user', function () {
    console.log("gym-user 버튼 클릭");
    let dropdownHTML =`
        <div id="gymUserDropdown">
            <div class="gym-user-item gym-user"><img src="/administrate/images/logo_nextgym_02.png"></div>
            <div class="gym-user-item not-gym-user">-</div>
        </div>
    `
    const $button = $(this);
    const offset = $button.offset(); // 버튼의 위치 가져오기

    if ($('#gymUserDropdown').length) {
        $('#gymUserDropdown').remove();
        return;
    }

    const $dropdown = $(dropdownHTML).css({
        position: 'absolute',
        top: offset.top + $button.outerHeight() + 5, // 버튼 아래에 배치
        left: offset.left - 10,
        zIndex: 1000
    });

    $('body').append($dropdown);

    $(document).on('click', function (e) {
        if (!$(e.target).closest('.image-gym-user, #gymUserDropdown').length) {
            $('#gymUserDropdown').remove();
        }
    });
});

$(document).on('click', '.gym-user-item', function () {
    // TODO: role 변경 API 호출
    console.log("gymuser 변경 API 호출");
    $('#gymUserDropdown').remove();
});


onPopstate(loadTotalUserTable);