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

// ================  Trainer API ================
export function getTrainerList(page, name='', gymName='') {
    const params = new URLSearchParams({
        page: page,
        size: 20
    });

    if (name != null && name.trim() !== '') {
        params.append('name', name);
    }
    if (gymName != null && gymName.trim() !== '') {
        params.append('gym', gymName);
    }

    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/admin/trainers?${params.toString()}`,
        contentType: "application/json",
    });
}


export function getTrainer(trainerId) {
    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/admin/trainers/${trainerId}`,
        contentType: "application/json",
    })
}

// export function createTrainer(accountData) {
//     return $.ajax({
//         type: "POST",
//         url: `${window.DOMAIN_URL}/admin/trainers`,
//         contentType: "application/json",
//         data: JSON.stringify(accountData),
//     })
// }
export function createTrainer(formData) {
    return $.ajax({
        type: "POST",
        url: `${window.DOMAIN_URL}/admin/trainers`,
        processData: false, // 필수: jQuery가 FormData를 처리하지 않도록
        contentType: false, // 필수: 브라우저가 자동으로 boundary 포함한 content-type 설정함
        data: formData,
    });
}

export function updateTrainer(trainerId, formData) {
    return $.ajax({
        type: "PUT",
        url: `${window.DOMAIN_URL}/admin/trainers/${trainerId}`,
        processData: false, 
        contentType: false, 
        data: formData,
    })
}

export function deleteTrainer(trainerId) {
    return $.ajax({
        type: "DELETE",
        url: `${window.DOMAIN_URL}/admin/trainers/${trainerId}`,
        contentType: "application/json",
    })
}