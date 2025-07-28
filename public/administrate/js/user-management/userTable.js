import { updateQueryParam } from '/administrate/js/router.js';
import { showCustomAlert } from '/administrate/js/components/customAlert.js';
import { renderPagination } from '/administrate/js/components/pagination.js';
import { updateUserNextGymStatus, updateUserRole } from '../api.js';
const usersPerPage = 20;

export function createUserRow({ id, profileImageUrl, name, consumedFoodCount, createdAt, left, nextGym, userRole }) {
    
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
            <td class="td-gym-user" data-user-id=${id}>
                ${nextGym ? `<div class="image-gym-user"><img src="/administrate/images/logo_nextgym_02.png"></div>` : `<div class="image-gym-user">-</div>`}
            </td>
            <td class="td-user-role">
                <div class="user-role-wrapper">
                    <div class="user-role-button ${userRole}" data-user-id=${id}>${formatUserRole(userRole)}</div>
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
    const userId = $(this).data('user-id');

    let dropdownMaster =`
        <div id="roleChangeDropdown" data-user-id=${userId}>
            <div class="role-item master">Master</div>
        </div>
    `
    let dropdownOther = `
        <div id="roleChangeDropdown" data-user-id=${userId}>
            <div class="role-item USER" data-query="USER">User</div>
            <div class="role-item SUPERUSER" data-query="SUPERUSER">SuperUser</div>
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

    // 다른 곳 클릭 시 닫기
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.user-role-button, #roleChangeDropdown').length) {
            $('#roleChangeDropdown').remove();
        }
    });
});

$(document).on('click', '.role-item', async function () {
    // TODO: role 변경 API 호출
    const userId = $('#roleChangeDropdown').data('user-id')
    const userRole = $(this).data('query');
    
     try {
        const response = await updateUserRole(userId, {userRole});
        
        showCustomAlert({
            type: 3,
            message: response.message,
            onNext: function () {
                window.location.reload();
            }
        });
         
         
     } catch (err) {
         console.error("Error fetching user data:", err);
     }

    const isOk = true;
    
    if(isOk){
        
    }
    
    $('#roleChangeDropdown').remove();
});

// 넥스트짐 유저 여부 변경 UI
$(document).on('click', '.image-gym-user', function (e) {
    e.stopPropagation();
    const userId = $(this).parent().data('user-id');
    
    let dropdownHTML =`
        <div id="gymUserDropdown" data-user-id=${userId}>
            <div class="gym-user-item gym-user" data-query="true"><img src="/administrate/images/logo_nextgym_02.png"></div>
            <div class="gym-user-item not-gym-user" data-query="false">-</div>
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

$(document).on('click', '.gym-user-item', async function () {
    const userId = $('#gymUserDropdown').data('user-id')
    const isNextGym = $(this).data('query');

    
    try {
        const response = await updateUserNextGymStatus(userId, {isNextGym});
        // console.log(response);
        showCustomAlert({
            type: 3,
            message: response.message,
            onNext: function () {
                window.location.reload();
            }
        });
     } catch (err) {
         console.error("Error fetching user data:", err);
     }

    
    // console.log("gymuser 변경 API 호출");
    $('#gymUserDropdown').remove();
});