import { getAdminInfo } from './api.js';

$(document).ready(function() {
    initProfileBar();
});

async function initProfileBar() {
    try {
        const data = await getAdminInfo();
        if (data) {
            updateProfileBar(data.data);
        }
    } catch (error) {
        console.error('Error initializing profile bar:', error);
    }
}

function updateProfileBar({ name, userRole, profileImageUrl }) {
    const imageUrl = profileImageUrl || '/administrate/images/icon_human_green.png';
    $('#profilebar').html(`
        <div class="profile-wrapper">
            <img src="${imageUrl}" class="image-profile">
            <div class="profile-text-wrapper">
                <div class="label-name">${name}</div>
                <div class="label-role">${userRole}</div>
            </div>
            <img src="/administrate/images/icon_toggle_arrow_down.png" class="button-profile">
        </div>
    `);
}

