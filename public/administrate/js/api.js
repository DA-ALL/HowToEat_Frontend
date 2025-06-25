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

export function getAllGymList(){
    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/admin/gyms/all`,
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

export function getTrainerWithPtMembers(page, trainerId) {
    const params = new URLSearchParams({
        page: page,
        size: 20
    });

    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/admin/trainers/${trainerId}/pt-members?${params.toString()}`,
        contentType: "application/json",
    });
}

// ================  notice API ================

export function getNoticeList(page, title='', orderBy='desc') {
    const params = new URLSearchParams({
        page: page,
        size: 20,
        orderBy: orderBy
    });

    if (title != null && title.trim() !== '') {
        params.append('title', title);
    }

    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/admin/notices?${params.toString()}`,
        contentType: "application/json",
    });
}

export function getNotice(noticeId) {
    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/admin/notices/${noticeId}`,
        contentType: "application/json",
    })
}

export function createNotice(noticeData) {
    return $.ajax({
        type: "POST",
        url: `${window.DOMAIN_URL}/admin/notices`,
        contentType: "application/json",
        data: JSON.stringify(noticeData),
    })
}

export function updateNotice(noticeId, noticeData) {
    return $.ajax({
        type: "PUT",
        url: `${window.DOMAIN_URL}/admin/notices/${noticeId}`,
        contentType: "application/json",
        data: JSON.stringify(noticeData),
    })
}

export function deleteNotice(noticeId) {
    return $.ajax({
        type: "DELETE",
        url: `${window.DOMAIN_URL}/admin/notices/${noticeId}`,
        contentType: "application/json",
    })
}

// ================  User API ================

export function getUserList({page, size, name='', orderBy, isNextGym, isAddPtMember=false}) {
    const params = new URLSearchParams({
        page,
        size,
        isAddPtMember,
        orderBy: orderBy || 'desc',
    });

    if (name != null && name.trim() !== '') {
        params.append('name', name);
    }
    if (isNextGym != null && isNextGym.trim() !== 'all' && isNextGym.trim() !== '') {
        params.append('isNextGym', isNextGym);
    }

    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/admin/users?${params.toString()}`,
        contentType: "application/json",
    });
}

export function getUser(userId) {
    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/admin/users/${userId}`,
        contentType: "application/json",
    })
}

export function getUserDetail(userId) {
    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/admin/users/${userId}/detail`,
        contentType: "application/json",
    })
}

export function getUserDailyCalories(userId, page) {
    const params = new URLSearchParams({
        page: page,
        size: 20
    });

    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/admin/users/${userId}/daily-summaries/calories?${params.toString()}`,
        contentType: "application/json",
    })
}

export function updateUserNextGymStatus(userId, requestDto) {
    return $.ajax({
        type: "PATCH",
        url: `${window.DOMAIN_URL}/admin/users/${userId}/is-next-gym`,
        contentType: "application/json",
        data: JSON.stringify(requestDto),
    })
}

export function updateUserRole(userId, requestDto) {
    return $.ajax({
        type: "PATCH",
        url: `${window.DOMAIN_URL}/admin/users/${userId}/user-role`,
        contentType: "application/json",
        data: JSON.stringify(requestDto),
    })
}

// ================  PtMember API ================

export function createPtMember(ptMemberData) {
    return $.ajax({
        type: "POST",
        url: `${window.DOMAIN_URL}/admin/pt-members`,
        contentType: "application/json",
        data: JSON.stringify(ptMemberData),
    })
}

export function deletePtMember(ptMemberId) {
    return $.ajax({
        type: "DELETE",
        url: `${window.DOMAIN_URL}/admin/pt-members/${ptMemberId}`,
        contentType: "application/json",
    })
}

// ================  Food API ================

export function getFoodList({page, size, name, orderBy, foodType, recommendation}) {
    const params = new URLSearchParams({
        page,
        size,
        foodType,
        recommendation,
        orderBy: orderBy || 'desc',
    });

    if (name != null && name.trim() !== '') {
        params.append('name', name);
    }

    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/admin/foods?${params.toString()}`,
        contentType: "application/json",
    });
}

export function getFood(foodId) {
    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/admin/foods/${foodId}`,
        contentType: "application/json",
    })
}

export function createFood(foodData) {
    return $.ajax({
        type: "POST",
        url: `${window.DOMAIN_URL}/admin/foods`,
        contentType: "application/json",
        data: JSON.stringify(foodData),
    })
}

export function updateFood(foodId, foodData) {
    return $.ajax({
        type: "PUT",
        url: `${window.DOMAIN_URL}/admin/foods/${foodId}`,
        contentType: "application/json",
        data: JSON.stringify(foodData),
    })
}

export function deleteFood(foodId) {
    return $.ajax({
        type: "DELETE",
        url: `${window.DOMAIN_URL}/admin/foods/${foodId}`,
        contentType: "application/json",
    })
}



// ================  Favorite Food API ================

export function getFavoriteFoodList({page, size, name, orderBy, adminShared}) {
    const params = new URLSearchParams({
        page,
        size,
        adminShared,
        orderBy: orderBy || 'desc',
    });

    if (name != null && name.trim() !== '') {
        params.append('name', name);
    }

    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/admin/favorite-foods?${params.toString()}`,
        contentType: "application/json",
    });
}

export function getFavoriteFood(favoritefoodId) {
    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/admin/favorite-foods/${favoritefoodId}`,
        contentType: "application/json",
    })
}

export function shareFood(foodData) {
    return $.ajax({
        type: "POST",
        url: `${window.DOMAIN_URL}/admin/foods/share`,
        contentType: "application/json",
        data: JSON.stringify(foodData),
    })
}