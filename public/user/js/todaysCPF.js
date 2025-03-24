export function getTodaysCPF(date) {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10); // 'YYYY-MM-DD'

    if (date === todayStr) {
        return `<div class="cpf-title">오늘의 탄단지</div>`;
    }

    const [year, month, day] = date.split("-");
    return `<div class="cpf-title">${year}년 ${month}월 ${day}일의 탄단지</div>`;
}
