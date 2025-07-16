
import { updateQueryParam } from '/administrate/js/router.js';

let data = getTrainerGymData();
let currentDropdownItem = data[0];

export function loadSearchDropdown() {
    const container = $("#searchDropdown");
    const params = getParamsFromURL();

    if(params[0] && params[1]){
        currentDropdownItem = [params[0], params[1]];
    } else  {
        currentDropdownItem = data[0];
    }
    
    let searchDropdownHTML = `
        <div class="search-dropdown-wrapper">
            <div class="dropdown-text" data-trainer="${currentDropdownItem[0]}" data-gym="${currentDropdownItem[1]}">
                ${currentDropdownItem[0] === "전체" 
                    ? currentDropdownItem[0] 
                    : `${currentDropdownItem[0]}&nbsp;트레이너_${currentDropdownItem[1]}`}
            </div>
            <div class="dropdown-icon">
                <img src="/administrate/images/icon_toggle_arrow_down.png">
            </div>
        </div>
        <div class="dropdown-list" style="display: none;">
            ${generateDropdownItems()}
        </div>
    `;

    container.html(searchDropdownHTML);

    // 드롭다운 토글
    $(".search-dropdown-wrapper").click(function (event) {
        event.stopPropagation(); // 부모 요소로 이벤트 버블링 방지
        $(".dropdown-list").toggle();
    });

    // 항목 클릭 시 선택
    $(".dropdown-item").click(function () {
        let trainer = $(this).data("trainer");
        let gym = $(this).data("gym");
        currentDropdownItem = [trainer, gym];
        
        updateQueryParam({"trainer": trainer, "gym": gym});
        loadSearchDropdown();
    });

    // 다른 곳 클릭 시 드롭다운 닫기
    $(document).click(function () {
        $(".dropdown-list").hide();
    });
}

function generateDropdownItems() {
    let groupedData = {};
    
    // 데이터 그룹화
    data.forEach(([trainer, gym]) => {
        if (!gym) {
            groupedData["전체"] = [["전체", "전체"]];
        } else {
            if (!groupedData[gym]) groupedData[gym] = [];
            groupedData[gym].push([trainer, gym]);
        }
    });

    let html = "";
    for (let gym in groupedData) {
        
        html += `<div class="dropdown-group">[${gym}]</div>`;
        
        groupedData[gym].forEach(([trainer, gym]) => {
            html += `
                <div class="dropdown-item-wrapper">
                    <div class="dropdown-item" data-trainer="${trainer}" data-gym="${gym}">
                        ${trainer !== "전체" ? trainer + " 트레이너" : trainer}
                    </div>
                </div>
            `;
        });
    }

    return html;
}

function getTrainerGymData(){
    //TODO: API 호출
    return [
        ["전체", "전체"], 
        ["김명현", "용인기흥구청점"],
        ["김예현", "용인기흥구청점"],
        ["홍길동", "용인기흥구청점"],
        ["홍길동", "수원점"],
        ["이순신", "수원점"],
    ];
}

function getParamsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return [urlParams.get('trainer') , urlParams.get('gym')];
}
