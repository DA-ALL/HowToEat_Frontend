import { onPopstate, updateURL } from '/administrate/js/router.js';
import { renderUserTable, renderTableWithOptionalPagination } from '/administrate/js/components/userTable.js';

const containerId = 'ptUserTable';
const bodyId = 'ptUserTableBody';
const contentId = 'ptUserManagement'

export function loadPtUserTable() {
    renderUserTable(containerId, bodyId);
    renderTableWithOptionalPagination({
        getData: getUserDataForPtUsers,
        bodyId,
        contentId,
        enablePagination: true
    })
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

    
});

onPopstate(loadPtUserTable);