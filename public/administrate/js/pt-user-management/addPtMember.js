import { loadSearchBar } from '/administrate/js/components/searchbar.js';
import { renderUserTable,renderTableWithOptionalPagination } from '/administrate/js/pt-user-management/userTableAddPtMember.js';
import { getUserList, createPtMember} from '../api.js';
import { showCustomAlert } from '/administrate/js/components/customAlert.js';

export function showAddPtMember() {

    let addPtMemberHTML = `
        <div id="addPtMember">
            <div class="add-pt-member-wrapper">
                <div class="header">
                    <div class="header-text">회원 추가하기</div>
                </div>

                <div class="searchbar popup" data-placeholder="회원명 검색"></div>

                <div id="addPtMemberTable"></div>

                <div class="button-wrapper">
                    <div id="addPtMemberButtonCancel" class="button-cancel">취소하기</div>
                    <div id="addPtMemberButtonNext" class="button-next disabled">추가하기</div>
                </div>
            </div>
        </div>
    `;

    $("body").append(addPtMemberHTML);
    
    loadSearchBar('addPtMember', (searchValue, page) => {
        loadTotalUserTable(searchValue, page);
    });
}

const containerId = 'addPtMemberTable';
const bodyId = 'addPtMemberTableBody';
const contentId = 'addPtMember';

export function loadTotalUserTable(searchValue, page) {
    renderUserTable(containerId, bodyId);

    const getData = (sv = searchValue, p = page) => getUserDataForladdPtUserTable(sv, p);

    renderTableWithOptionalPagination({
        getData,
        bodyId,
        contentId,
        enablePagination: true
    })
    
}

async function getUserDataForladdPtUserTable(searchValue, page) {
    // console.log("getUserDataForladdPtUserTable called with searchValue:", searchValue, "and page:", page);
    try{
        const request = {
            name: searchValue || '',
            page: page || 1,
            size: 10,
            isAddPtMember: true,
            orderBy: 'asc',
        }
        // console.log("Request parameters:", request);
        const response = await getUserList(request);
        // console.log(response);
        return response;
    } catch (error){
        console.error(error);
    }
}

function getPathIdFromUrl() {
    const pathArray = window.location.pathname.split('/');
    return pathArray[pathArray.length - 1]; // 마지막 요소가 ID
}

//취소 버튼 클릭시
$(document).on("click", "#addPtMemberButtonCancel", function () {
    $("#addPtMember").remove();
});

// 추가하기 버튼 클릭시
$(document).on("click", "#addPtMemberButtonNext", async function () {
    if ($(this).hasClass("disabled")) return;

    const trainerId = getPathIdFromUrl();
    const userId = $(`#${bodyId} tr.selected .td-id`).map(function () {
        return $(this).text();
    }).get(0);

    try {
        const response = await createPtMember({trainerId, userId});
        showCustomAlert({
            type: 3,
            message: response.message,
            onNext: function() {
                location.reload();
            }
        })
    } catch (error) {
        console.error("Error while creating PT member:", error);
    }
    
    $("#addPtMember").remove();
});

// 유저 검색 테이블 row 클릭시
$(document).on("click", `#${bodyId} tr`, function () {
    const userId = $(this).find('.td-id').text();
    
    // 클릭된 행의 'selected' 클래스를 토글
    $(this).toggleClass("selected");
    
    // 같은 부모 내 다른 행들의 'selected' 클래스를 제거
    if ($(this).hasClass("selected")) {
        $(this).siblings().removeClass("selected");
    }

    // 모든 행들 중 하나라도 'selected' 클래스를 가진 행이 있는지 확인
    const isAnyRowSelected = $(`#${bodyId} tr.selected`).length > 0;
    
    if (isAnyRowSelected) {
        $(".button-next").removeClass("disabled");
    } else {
        $(".button-next").addClass("disabled");
    }

    // console.log("Row clicked", userId);
});
