export function showToast(message, parent) {
    $('.custom-toast').remove(); // 기존 토스트 제거

    const toast = $(`
        <div class="custom-toast-container">
            <div class="custom-toast">
                ${message}
            </div>
        </div>
    `);

    $(parent).append(toast);

    // 애니메이션 시작
    setTimeout(() => toast.addClass('show'), 10);

    // 2.5초 뒤 사라지게
    setTimeout(() => toast.removeClass('show'), 2500); // 숨김 애니메이션
    setTimeout(() => toast.remove(), 3000); // DOM에서 제거
}
