$(document).ready(function () {
    $('#headerProcessBar').html(`
        <div class="header-process-bar">
            <div class="bar" data-page="1"></div>
            <div class="bar" data-page="2"></div>
            <div class="bar" data-page="3"></div>
            <div class="bar" data-page="4"></div>
            <div class="bar" data-page="5"></div>
            <div class="bar" data-page="6"></div>
        </div>
    `);
});


export function updateProgressBar(pageNumber) {
    $('.bar').each(function () {
        const page = parseInt($(this).attr('data-page'));
        if (page <= pageNumber) {
            $(this).css('background-color', 'var(--red500)');
        } else {
            $(this).css('background-color', 'lightgray'); // 기본 색상 (필요하면 변경)
        }
    });
}