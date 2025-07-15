import { showPage } from '../components/nav-bottom.js'


export function renderUsersNotice(callback) {
    $.ajax({
        method: "GET",
        url: `${window.DOMAIN_URL}/notices`,
    }).done(function (noticesInfoList) {
        const noticesInfo = noticesInfoList.data;

        let noticeHTML = "";

        noticesInfo.forEach(notice => {
            noticeHTML += renderUserNoticeHTML(notice);
        });

        callback(noticeHTML);
    });
}


export function renderUserNoticeHTML(noticesInfo) {
    let typeKor = '';
    switch (noticesInfo.type) {
        case 'NOTICE':
            typeKor = '공지사항';
            break;
        case 'UPDATE':
            typeKor = '업데이트';
            break;
        case 'BUGFIX':
            typeKor = '버그수정';
            break;
        default:
            typeKor = noticesInfo.type;
    }

    return `
        <div class="notice-container" data-id="${noticesInfo.id}">
            <div class="notice-type">${typeKor}</div>
            <div class="notice-title">${noticesInfo.title}</div>
            <div class="notice-date">${noticesInfo.modifiedAt}</div>
        </div>
    `;
}



$(document).on('click', '.notice-container', function () {
    const id = $(this).data('id');
    const newPath = `/users/notice/${id}`;

    window.lastUsersPath = newPath;

    history.pushState({ view: 'users', noticeId: id }, '', newPath);
    showPage(newPath);
});
