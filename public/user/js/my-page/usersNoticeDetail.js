export function renderUsersNoticeDetail(callback) {

    const currentPath = window.location.pathname;
    const parts = currentPath.split('/');
    const noticeId = parts[3];

    const noticeDetailInfo = $.ajax({
        method: "GET",
        url: `${window.DOMAIN_URL}/notices/${noticeId}`,
    });

    $.when(noticeDetailInfo).done(function (noticeDetailRes) {
        const noticeDetailInfoData = noticeDetailRes.data;
        const noticeHTML = renderUserNoticeDetailHTML(noticeDetailInfoData);
        console.log(noticeDetailInfoData)
        callback(noticeHTML);
    });
}

export function renderUserNoticeDetailHTML(noticeDetailInfoData) {
    const contentWithBr = noticeDetailInfoData.content.replace(/\n/g, '<br>');

    let typeKor = '';
    switch (noticeDetailInfoData.type) {
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
            typeKor = noticeDetailInfoData.type;
    }

    return `
            <div id="headerNav" data-title="공지사항" data-type="2"></div>
            <div class="notice-info-container">
                <div class="notice-container">
                    <div class="notice-type">${typeKor}</div>
                    <div class="notice-title">${noticeDetailInfoData.title}</div>
                    <div class="notice-date">${noticeDetailInfoData.modifiedAt}</div>
                </div>

                <div class="notice-description">
                    ${contentWithBr}
                
                </div>
            </div>
    `;
}