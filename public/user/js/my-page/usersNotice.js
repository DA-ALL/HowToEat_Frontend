export function renderUsersNotice(type, title, date) {
    return `
        <div class="notice-container">
            <div class="notice-type">${type}</div>
            <div class="notice-title">${title}</div>
            <div class="notice-date">${date}</div>
        </div>
    `;
} 