import { onPopstate, updateURL } from '/administrate/js/router.js';
import { renderUserTable,renderTableWithOptionalPagination } from '/administrate/js/components/userTable.js';
import { renderUserInfo, getUserInfo } from '/administrate/js/userInfo.js';

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

function getUserDataForTotalUsers() {
    return Array.from({ length: 200 }, (_, i) => ({
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

$(document).on('click', `#userTableBody tr`, function () {
    const userId = $(this).find('.td-id').text();
    const page = `user-management/user/${userId}`;
    updateURL(page);

    renderUserInfo(getUserInfo(), 'user-management');
});


onPopstate(loadTotalUserTable);