import { loadSearchBar } from '/administrate/js/components/searchbar.js';
import { loadFilter } from '/administrate/js/components/filter.js';
import { loadSearchDropdown } from '/administrate/js/components/searchDropdown.js';
import { renderTrainerTable, renderTableWithOptionalPagination } from '/administrate/js/components/trainerTable.js';
import { updateURL } from '/administrate/js/router.js';
import { renderTrainerInfo, getTrainerInfo} from '/administrate/js/trainerInfo.js';


$(document).ready(function () {
    loadContent();
});

function loadContent() {
    const container = $("#ptUserManagement");

    let ptUserManagementHTML = `
        <div class="title">트레이너 회원 관리</div>    
        <div class="searchbar" data-placeholder="회원명 검색"></div>
        
        <div class="filter-group">
            <div id="filter" data-type="8"></div>       
        </div>      

        <div id="trainerTable"></div>
    `;

    container.html(ptUserManagementHTML);

    loadSearchBar();
    loadFilter();
    
    loadTrainerTable();
    loadSearchDropdown();
}


function loadTrainerTable() {
    const containerId = 'trainerTable';
    const bodyId = 'trainerTableBody';
    const contentId = 'ptUserManagement'

    renderTrainerTable(containerId, bodyId);
    renderTableWithOptionalPagination({
        getData: getTrainerDatas,
        bodyId,
        contentId,
        enablePagination: true
    })
}

function getTrainerDatas() {
    return Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        imageURL: "/administrate/images/icon_human_red.png",
        name: `트레이너 ${i + 1}`,
        gymBranch: ['용인기흥구청점', '용인기흥구청점', '처인구청점', '수원권선동점', '이천마장점', '이천중앙점', '평택미전점'][Math.floor(Math.random() * 7)],
        memberCount: Math.floor(Math.random() * 20),
        joined: "2025.03.16"
    }));
}



$(document).on('click', `#trainerTableBody tr`, function () {
    const userId = $(this).find('.td-id').text();
    const page = `user-management/pt/${userId}`;
    updateURL(page);

    renderTrainerInfo(getTrainerInfo(), 'user-management/pt');
});
