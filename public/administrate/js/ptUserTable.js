// import { onPopstate, updateQueryParam, getCurrentContent, updateURL } from '/administrate/js/router.js';
// import { renderPagination } from '/administrate/js/components/pagination.js';

// const usersPerPage = 20;
// let currentPage = getPageFromURL() || 1; // URL에서 page 값 가져오기

// function createUserRow({ id, imageURL, name, mealCount, joined, left, gymUser, role }) {
//     return `
//         <tr>
//             <td class="td-id">${id}</td>
//             <td class="td-user-profile">
//                 <div class="td-user-profile-wrapper">
//                     <div class="image-user">
//                         <img src=${imageURL}>
//                     </div>
//                     <div class="user-name">${name}</div>
//                 </div>
//             </td>
//             <td class="td-meal-log-count">${mealCount}</td>
//             <td class="td-account-created-at">${joined}</td>
//             <td class="td-account-closed-at">${left}</td>
//             <td class="td-gym-user">
//                 ${gymUser ? `<div class="image-gym-user"><img src="/administrate/images/logo_nextgym_02.png"></div>` : `<div class="image-gym-user">-</div>`}
//             </td>
//             <td class="td-user-role">
//                 <div class="user-role-wrapper">
//                     <div class="user-role-button ${role}">${role=='super-user' ? 'SuperUser' : role.charAt(0).toUpperCase() + role.slice(1)}</div>
//                 </div>
//             </td>
//         </tr>
//     `;
// }

// function renderUserTable() {
//     const tableHTML = `
//         <table>
//             <thead>
//                 <tr>
//                     <th class="th-id">ID</th>
//                     <th class="th-user-profile">회원명</th>
//                     <th class="th-meal-log-count">식단 총 등록 수</th>
//                     <th class="th-account-created-at">가입일</th>
//                     <th class="th-account-closed-at">탈퇴일</th>
//                     <th class="th-gym-user">넥스트짐 등록 여부</th>
//                     <th class="th-user-role">권한</th>
//                 </tr>
//             </thead>
//             <tbody id="ptUserTableBody"></tbody>
//         </table>
//         <div class="pagination"></div>`;

//     $('#ptUserTable').html(tableHTML);
//     renderPageData();
// }

// function renderPageData() {
//     const users = getUserData();
//     const start = (currentPage - 1) * usersPerPage;
//     const end = start + usersPerPage;
//     $('#ptUserTableBody').html(users.slice(start, end).map(createUserRow).join(""));

//     renderPagination({
//         contentId: 'ptUserManagement',
//         totalItems: users.length,
//         itemsPerPage: usersPerPage,
//         currentPage,
//         onPageChange: (newPage) => {
//             updateQueryParam({ page: newPage });
//             currentPage = newPage;
//             renderPageData();
//         }
//     });
// }

// function getPageFromURL() {
    
//     const urlParams = new URLSearchParams(window.location.search);
//     if(getCurrentContent() == 'ptUserManagement'){
//         return parseInt(urlParams.get('page')) || 1;
//     } else {
//         return 1;
//     }
// }

// function getUserData() {
//     //TODO: data 요청 api
//     return Array.from({ length: 50 }, (_, i) => ({
//         id: i + 1,
//         imageURL: "/administrate/images/icon_human_red.png",
//         name: `사용자${i + 1}`,
//         mealCount: Math.floor(Math.random() * 200),
//         joined: "2025.03.16",
//         left: "-",
//         gymUser: Math.random() > 0.5,
//         role: ["admin", "user", "master", "super-user"][Math.floor(Math.random() * 4)]
//     }));
// }

// export function loadTotalUserTable() {
//     currentPage = getPageFromURL(); // URL에서 페이지 값 다시 읽기
//     renderUserTable();
// }

// $(document).on('click', '#ptUserTableBody tr', function () {
//     console.log('Row clicked:', $(this).find('.td-id').text());
//     const userId = $(this).find('.td-id').text();
//     const page = `user-management/pt/user/${userId}`
//     updateURL(page);

    
//     let elem = document.querySelector('.content-container');
//     if (elem) {
//         elem.append(`<div id='userInfo'> 테스트 테스트 </div>`);
//     }
// });

// onPopstate(loadTotalUserTable);


import { onPopstate, updateURL } from '/administrate/js/router.js';
import { renderUserTable, renderPageData, getPageFromURL, setCurrentPage } from '/administrate/js/components/userTable.js';

const containerId = 'ptUserTable';
const bodyId = 'ptUserTableBody';
const contentId = 'ptUserManagement';

export function loadPtUserTable() {
    setCurrentPage(getPageFromURL(contentId));
    renderUserTable(containerId, bodyId);
    renderPageData(getUserDataForPtUsers, bodyId, contentId);
}

function getUserDataForPtUsers() {
    return Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        imageURL: "/administrate/images/icon_human_red.png",
        name: `PT 사용자${i + 1}`,
        mealCount: Math.floor(Math.random() * 200),
        joined: "2025.03.16",
        left: "-",
        gymUser: Math.random() > 0.5,
        role: ["admin", "user", "master", "super-user"][Math.floor(Math.random() * 4)]
    }));
}

$(document).on('click', `#${bodyId} tr`, function () {
    const userId = $(this).find('.td-id').text();
    const page = `user-management/pt/user/${userId}`;
    updateURL(page);
    
    let elem = document.querySelector('.content-container');
    if (elem) {
        elem.insertAdjacentHTML('beforeend', `<div id='userInfo'> 사용자 ID: ${userId} </div>`);
    }


    let userInfoHtml = `
        <div id="userInfo">
            <div class="nav-top">
                <div class="back-button-wrapper">
                    <div class="icon-back">
                        <img src="/administrate/images/icon_arrow_back_black.png">
                    </div>
                    <div class="label-back">뒤로가기</div>
                </div>
            </div>

            <div class="user-info-wrapper">
                <div class="">
            
                </div>
            </div>

            <div class="user-info-table">
            </div>

            <div class="daily-calorie-table">
            </div>
        </div>
    `;
});

onPopstate(loadPtUserTable);