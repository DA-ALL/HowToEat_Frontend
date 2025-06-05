//     import { adminLogin } from '/administrate/js/api.js';
// import { adminLogin } from '../api.js';
// import { registerViewLoader } from '/administrate/js/router.js';



// ================ Admin Login API ================

export function adminLogin(loginData) {
    return $.ajax({
        type: "POST",
        url: `${window.DOMAIN_URL}/admin/login`,
        contentType: "application/json",
        data: JSON.stringify(loginData),
    })
}

// ================ Admin Accounts API ================

export function getAdminAccountList(page) {
    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/admin/accounts?page=${page}&size=20`,
        contentType: "application/json",
    })
}

export function getAdminAccount(accountId) {
    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/admin/accounts/${accountId}`,
        contentType: "application/json",
    })
}

export function createAdminAccount(accountData) {
    return $.ajax({
        type: "POST",
        url: `${window.DOMAIN_URL}/admin/accounts`,
        contentType: "application/json",
        data: JSON.stringify(accountData),
    })
}

export function updateAdminAccount(accountId, accountData) {
    return $.ajax({
        type: "PUT",
        url: `${window.DOMAIN_URL}/admin/accounts/${accountId}`,
        contentType: "application/json",
        data: JSON.stringify(accountData),
    })
}

export function deleteAdminAccount(accountId) {
    return $.ajax({
        type: "DELETE",
        url: `${window.DOMAIN_URL}/admin/accounts/${accountId}`,
        contentType: "application/json",
    })
}

// ================  Gym API ================
export function getGymList(page, name='') {
    const params = new URLSearchParams({
        page: page,
        size: 20
    });

    if (name != null && name.trim() !== '') {
        params.append('name', name);
    }

    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/admin/gyms?${params.toString()}`,
        contentType: "application/json",
    });
}


export function getGym(gymId) {
    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/admin/gyms/${gymId}`,
        contentType: "application/json",
    })
}

export function createGym(accountData) {
    return $.ajax({
        type: "POST",
        url: `${window.DOMAIN_URL}/admin/gyms`,
        contentType: "application/json",
        data: JSON.stringify(accountData),
    })
}

export function updateGym(gymId, accountData) {
    return $.ajax({
        type: "PUT",
        url: `${window.DOMAIN_URL}/admin/gyms/${gymId}`,
        contentType: "application/json",
        data: JSON.stringify(accountData),
    })
}

export function deleteGym(gymId) {
    return $.ajax({
        type: "DELETE",
        url: `${window.DOMAIN_URL}/admin/gyms/${gymId}`,
        contentType: "application/json",
    })
}