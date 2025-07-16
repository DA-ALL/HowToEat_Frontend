import { registerPopstateHandler, updateURL, registerViewLoader } from '/administrate/js/router.js';
import { renderUserTable, renderTableWithOptionalPagination } from '/administrate/js/pt-user-management/userTableWithDelete.js';
import { showAddPtMember } from '/administrate/js/pt-user-management/addPtMember.js';
import { renderUserInfo } from '/administrate/js/userInfo.js';
import { getTrainer, getTrainerWithPtMembers} from '../api.js';


export function renderTrainerInfo({ imageURL, name, memberCount, gym }, previousContent) {
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
                    <img src="${imageURL ? imageURL : '/administrate/images/icon_human_green.png'}">
                </div>

                <div class="trainer-name">${name}</div>

                <div class="trainer-detail-wrapper">
                    <div class="text-wrapper">
                        <div class="value">${memberCount}</div>
                        <div class="label">담당 회원 수</div>
                    </div>

                    <div class="divider"></div>                    

                    <div class="text-wrapper">
                        <div class="value">${gym}</div>
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
    
    const trainerId = getPathIdFromUrl();
    sessionStorage.setItem('previousContent', 'user-management/pt/' + trainerId);
});


export async function getTrainerInfo() {
    const trainerId = getPathIdFromUrl();
    try {
        const response = await getTrainer(trainerId);
        console.log("Trainer Info:", response.data);
        const { imageURL, name, memberCount } = response.data;
        const gym = response.data.gym.name;

        return { imageURL, name, memberCount, gym };
    } catch (error) {
        console.error("Error fetching trainer info:", error);
    }   
}

async function getUserDataForUserTable() {
    const page = getPageFromURL();
    const trainerId = getPathIdFromUrl();
    try {
        const response = await getTrainerWithPtMembers(page, trainerId);
        console.log("Trainer with PT Members:", response.data);
        const currentPage = response.data.ptMembers.page;
        const totalElements = response.data.ptMembers.totalElements;
        const content = response.data.ptMembers.content;
        return { currentPage, totalElements, content };
    } catch (error) {
        console.error("Error fetching trainer info:", error);
    }   
}


registerPopstateHandler('trainerInfo', loadUserTable);
registerViewLoader('trainerInfo', async () => {
    const trainerInfo = await getTrainerInfo();
    renderTrainerInfo(trainerInfo, 'user-management/pt');
});

function getPathIdFromUrl() {
    const pathArray = window.location.pathname.split('/');
    return pathArray[pathArray.length - 1]; // 마지막 요소가 ID
}

function getPageFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('page')) || 1;
}

// 회원 추가하기 클릭시
$(document).on('click', `#memberAddButton`, function () {
    showAddPtMember();
});
