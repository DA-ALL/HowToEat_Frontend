import { updateURL } from '/administrate/js/router.js';
import { renderUserTable,renderTableWithOptionalPagination } from '/administrate/js/user-management/userTable.js';
import { renderUserInfo } from '/administrate/js/userInfo.js';
import { getUserList } from '../api.js';

const containerId = 'totalUserTable';
const bodyId = 'userTableBody';
const contentId = 'userManagement';

export function loadTotalUserTable() {
    renderUserTable(containerId, bodyId);
    renderTableWithOptionalPagination({
        getData: getUserDataForTotalUsers,
        bodyId,
        contentId,
        enablePagination: true
    })
}

async function getUserDataForTotalUsers() {
    const request = getParamsFromURL();
    try {
        const response = await getUserList(request);
        console.log("User data fetched:", response);
        return response;
    } catch (err) {
        console.error("Error fetching user data:", err);
    }
}

function getParamsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        page: parseInt(urlParams.get('page')) || 1,
        name: urlParams.get('search') || '',
        orderBy: urlParams.get('orderBy') || '',
        isNextGym: urlParams.get('isNextGym') || '',
        userRole: urlParams.get('userRole') || '',
        size: 20,
    };
}

$(document).on('click', `#userTableBody tr`, function () {
    const userId = $(this).find('.td-id').text();
    const page = `user-management/user/${userId}`;
    updateURL(page);
});
