import { loadSearchBar } from '/administrate/js/components/searchbar.js';
import { loadFilter } from '/administrate/js/components/filter.js';
import { renderTrainerTable, renderTableWithOptionalPagination } from '/administrate/js/pt-user-management/trainerTable.js';
import { updateURL, registerPopstateHandler, registerViewLoader } from '../router.js';
import { renderTrainerInfo, getTrainerInfo} from '/administrate/js/pt-user-management/trainerInfo.js';
import { getTrainerList } from '../api.js';

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

    loadSearchBar('ptUserManagement', loadTrainerTable);
    loadFilter('ptUserManagement', loadTrainerTable);
    
    loadTrainerTable();
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

async function getTrainerDatas(){
    const params = getParamsFromURL();

    try{
        const response = await getTrainerList(params.page, params.name, params.gymName);
        console.log(response);
        return response;
    } catch (error){
        console.error(error);
    }
}

function getParamsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        page: parseInt(urlParams.get('page')) || 1,
        name: urlParams.get('search') || '',
        gymName: urlParams.get('gym') || ''
    };
}


$(document).on('click', `#trainerTableBody tr`, function () {
    const userId = $(this).find('.td-id').text();
    const page = `user-management/pt/${userId}`;
    updateURL(page);

    renderTrainerInfo(getTrainerInfo(), 'user-management/pt');
});

registerPopstateHandler('ptUserManagement', loadContent);
registerViewLoader('ptUserManagement', loadContent);