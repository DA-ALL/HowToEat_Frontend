import { registerPopstateHandler, updateURL } from '/administrate/js/router.js';
import { renderUserTable, renderTableWithOptionalPagination } from '/administrate/js/pt-user-management/userTableWithDelete.js';
import { showAddPtMember } from '/administrate/js/pt-user-management/addPtMember.js';
import { renderUserInfo, getUserInfo } from '/administrate/js/userInfo.js';


export function renderTrainerInfo({ imageURL, trainername, memberCount, gymBranch }, previousContent) {
    if (previousContent) {
        sessionStorage.setItem('previousContentTrainer', previousContent);
    }

    let trainerInfoHtml = `
        <div class="nav-top">
            <div class="back-button-wrapper">
                <div class="icon-back">
                    <img src="/administrate/images/icon_arrow_back_black.png">
                </div>
                <div class="label-back">뒤로가기</div>
            </div>
        </div>
        <div class="trainer-info-container">
            <div class="trainer-info-wrapper">
                <div class="trainer-profile-image">
                    <img src="${imageURL}">
                </div>

                <div class="trainer-name">${trainername}</div>

                <div class="trainer-detail-wrapper">
                    <div class="text-wrapper">
                        <div class="value">${memberCount}</div>
                        <div class="label">담당 회원 수</div>
                    </div>

                    <div class="divider"></div>                    

                    <div class="text-wrapper">
                        <div class="value">${gymBranch}</div>
                        <div class="label">헬스장</div>
                    </div>
                </div>
            </div>
        
            <div class="table-wrapper">
                <div class="table-title-wrapper">
                    <div class="table-title">PT 회원 목록</div>
                    <div id="memberAddButton" class="add-button-wrapper">
                        <div class="label-add">회원 추가하기</div>
                        <div class="icon-add">
                            <img src="/administrate/images/icon_add_red.png">
                        </div>
                    </div>
                </div>
                <div id="ptUserTable"></div>
            </div>
        </div>
    
    `;

    
    let trainerInfo = $('#trainerInfo');
    trainerInfo.html(trainerInfoHtml);

    loadUserTable();
}

// 뒤로가기 버튼 클릭
$(document).on('click', `#trainerInfo .back-button-wrapper`, function () {
    const prev = sessionStorage.getItem('previousContentTrainer');
    if (prev) {
        updateURL(prev);
    } else {
        // fallback
        window.history.back();
    }
});

const containerId = 'ptUserTable';
const bodyId = 'ptUserTableBody';
const contentId = 'trainerInfo';

function loadUserTable() {
    renderUserTable(containerId, bodyId);
    renderTableWithOptionalPagination({
        getData: getUserDataForUserTable,
        bodyId: bodyId,
        contentId: contentId,
        enablePagination: true
    })
}

// ptUserTableBody row 클릭시 
$(document).on('click', `#${bodyId} tr`, function () {
    const userId = $(this).find('.td-id').text();
    
    const pathSegments = window.location.pathname.split("/").slice(2);
    const lastSegment = pathSegments[pathSegments.length - 1]; // 마지막 값 추출

    const fullPath = pathSegments.join("/");
    const page = fullPath + `/user/${userId}`;
    updateURL(page);

    renderUserInfo(getUserInfo(), `user-management/pt/${lastSegment}`);
});


export function getTrainerInfo() {
    return {
        imageURL: "/administrate/images/icon_human_blue.png",
        trainername: `김예현`,
        memberCount: 13,
        gymBranch: '용인기흥구청점'
    }
}

function getUserDataForUserTable() {
    return Array.from({ length: 50 }, (_, i) => ({
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


registerPopstateHandler('trainerInfo',loadUserTable);


$(document).ready(function () {
    const pathSegments = window.location.pathname.split('/');
    const userId = parseInt(pathSegments[pathSegments.length - 1], 10);
    if(userId) {
        renderTrainerInfo(getTrainerInfo(), 'user-management/pt');    
    }      
});


// 회원 추가하기 클릭시
$(document).on('click', `#memberAddButton`, function () {
    showAddPtMember();
});
