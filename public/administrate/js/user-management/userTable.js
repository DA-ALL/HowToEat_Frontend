import { updateQueryParam , getCurrentContent} from '/administrate/js/router.js';
import { showCustomAlert } from '/administrate/js/components/customAlert.js';
import { renderPagination } from '/administrate/js/components/pagination.js';

const usersPerPage = 20;

export function createUserRow({ id, profileImageUrl, name, consumedFoodCount, createdAt, left, isNextGym, userRole }) {
    return `
        <tr>
            <td class="td-id">${id}</td>
            <td class="td-user-profile">
                <div class="td-user-profile-wrapper">
                    <div class="image-user">
                        <img src=${profileImageUrl || '/administrate/images/icon_human_red.png'}>
                    </div>
                    <div class="user-name">${name}</div>
                </div>
            </td>
            <td class="td-meal-log-count">${consumedFoodCount}</td>
            <td class="td-account-created-at">${createdAt}</td>
            <td class="td-account-closed-at">${left || '-'}</td>
            <td class="td-gym-user">
                ${isNextGym ? `<div class="image-gym-user"><img src="/administrate/images/logo_nextgym_02.png"></div>` : `<div class="image-gym-user">-</div>`}
            </td>
            <td class="td-user-role">
                <div class="user-role-wrapper">
                    <div class="user-role-button ${userRole}">${formatUserRole(userRole)}</div>
                </div>
            </td>
        </tr>
    `;
}

function formatUserRole(userRole) {
    switch (userRole) {
        case 'SUPERUSER':
            return 'SuperUser';
        case 'ADMIN':
            return 'Admin';
        case 'USER':
            return 'User';
        case 'MASTER':
            return 'Master';
        default:
            return '';
    }
}

export function renderUserTable(containerId, bodyId) {
    const tableHTML = `
        <table class="user-table">
            <thead>
                <tr>
                    <th class="th-id">ID</th>
                    <th class="th-user-profile">유저명</th>
                    <th class="th-meal-log-count">식단 총 등록 수</th>
                    <th class="th-account-created-at">가입일</th>
                    <th class="th-account-closed-at">탈퇴일</th>
                    <th class="th-gym-user">넥스트짐 등록 여부</th>
                    <th class="th-user-role">권한</th>
                </tr>
            </thead>
            <tbody id="${bodyId}"></tbody>
        </table>
        <div class="pagination"></div>`;

    $(`#${containerId}`).html(tableHTML);
}

export async function renderTableWithOptionalPagination({
    getData,         // 데이터 함수
    bodyId,
    contentId,
    enablePagination = true
}) {
    const data = await getData();
    const page = data.page + 1;
    const rows = data.content;

    $(`#${bodyId}`).html(rows.map(createUserRow).join(""));

    if (enablePagination) {
        renderPagination({
            contentId,
            totalItems: data.totalElements,
            itemsPerPage: usersPerPage,
            currentPage: page,
            onPageChange: (newPage) => {
                updateQueryParam({ page: newPage });
                renderTableWithOptionalPagination({
                    getData,
                    bodyId,
                    contentId,
                    enablePagination
                });
            }
        });
    } else {
        $(`#${bodyId}`).closest('table').parent().find('.pagination').remove();
    }
}

// 유저권한 변경 버튼
$(document).on('click', '.user-role-button', function (e) {
    e.stopPropagation();

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

    showCustomAlert({
        type: 1,
        onNext: () => {
            console.log("확인");
        }
    });
    
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
$(document).on('click', '.image-gym-user', function (e) {
    e.stopPropagation();
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