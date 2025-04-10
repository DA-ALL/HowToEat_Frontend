import { loadSearchBar } from '/administrate/js/components/searchbar.js';
import { renderUserTable,renderTableWithOptionalPagination } from '/administrate/js/components/userTableAddPtMember.js';

export function showAddPtMember() {

    let addPtMemberHTML = `
        <div id="addPtMember">
            <div class="add-pt-member-wrapper">
                <div class="header">
                    <div class="header-text">회원 추가하기</div>
                </div>

                <div class="searchbar"></div>

                <div id="addPtMemberTable"></div>

                <div class="button-wrapper">
                    <div id="addPtMemberButtonCancel" class="button-cancel">취소하기</div>
                    <div id="addPtMemberButtonNext" class="button-next disabled">추가하기</div>
                </div>
            </div>
        </div>
    `;

    $("body").append(addPtMemberHTML);

    loadSearchBar(loadTotalUserTable);
}

const containerId = 'addPtMemberTable';
const bodyId = 'addPtMemberTableBody';
const contentId = 'addPtMember';

export function loadTotalUserTable() {
    renderUserTable(containerId, bodyId);
    renderTableWithOptionalPagination({
        getData: getUserDataForladdPtUserTable,
        bodyId,
        contentId,
        enablePagination: false
    })
    
}

function getUserDataForladdPtUserTable() {
    return Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        imageURL: "/administrate/images/icon_human_green.png",
        name: `사용자${i + 1}`,
        joined: "2025.03.16",
        gymUser: Math.random() > 0.5,
        role: ["admin", "user", "master", "super-user"][Math.floor(Math.random() * 4)]
    }));
}

//취소 버튼 클릭시
$(document).on("click", "#addPtMemberButtonCancel", function () {
    $("#addPtMember").remove();
});

// 추가하기 버튼 클릭시
$(document).on("click", "#addPtMemberButtonNext", function () {
    if ($(this).hasClass("disabled")) return;

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

    console.log("Row clicked", userId);
});
