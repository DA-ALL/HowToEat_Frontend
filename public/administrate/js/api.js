//     import { adminLogin } from '/administrate/js/api.js';
// import { adminLogin } from '../api.js';
// import { registerViewLoader } from '/administrate/js/router.js';



// ================ Admin Accounts API ================
export function adminLogin(loginData) {
    return $.ajax({
        type: "POST",
        url: `${window.DOMAIN_URL}/admin/login`,
        contentType: "application/json",
        data: JSON.stringify(loginData),
    })
}

export function getAdminAccountList(page) {
    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/admin/accounts?page=${page}&size=20`,
        contentType: "application/json",
    })
}

export function getAdminAccount(id) {
    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/admin/accounts/${id}`,
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

// ================  API ================