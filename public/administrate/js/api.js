//     import { adminLogin } from '/administrate/js/api.js';

export function adminLogin(loginData) {
    return $.ajax({
        type: "POST",
        url: `${window.DOMAIN_URL}/admin/login`,
        contentType: "application/json",
        data: JSON.stringify(loginData),
        })
}

export function getAdminAccountList(){
    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/admin/accounts`,
        contentType: "application/json",
    })
}