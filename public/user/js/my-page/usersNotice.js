import { showPage } from '../components/nav-bottom.js'

export function renderUsersNotice(id, type, title, date) {
    return `
        <div class="notice-container" data-id="${id}">
            <div class="notice-type">${type}</div>
            <div class="notice-title">${title}</div>
            <div class="notice-date">${date}</div>
        </div>
    `;
}

$(document).on('click', '.notice-container', function () {
    const id = $(this).data('id');
    const newPath = `/users/notice/${id}`;

    history.pushState({ view: 'users' }, '', newPath);
    showPage(newPath);
});