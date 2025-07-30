import { showPopup } from '../components/popup.js'

export function setupAjaxAuthInterceptor() {
    let isErrorHandled = false; //에러 1회 발생 시, 다른  아작스는 에러로 넘어가지 않도록

    $.ajaxSetup({
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr) { 
            const accessToken = localStorage.getItem("Authorization");
            if (accessToken) {
                xhr.setRequestHeader("Authorization", accessToken);
            }
        },
        complete: function (xhr) {
            const newAccessToken = xhr.getResponseHeader('Authorization');
            if (newAccessToken) {
                localStorage.setItem('Authorization', newAccessToken);
            }
        },
        error: function (jqXHR) {
            // 에러 1회만 처리하도록 플래그 검사
            if (isErrorHandled) return;
            isErrorHandled = true;
        
            const errorResponse = jqXHR.responseJSON;
            console.log(errorResponse);
        
            // 인증 정보 에러
            if (errorResponse?.errorType === "NOT_FOUND_AUTHENTICATION_INFO" || errorResponse?.errorType === "MISSING_REFRESH_TOKEN") {
                showPopup("#main", 3, "로그인해주세요.", "").then((confirmed) => {
                    redirectToLogin();
                });
                showPopup("#report", 3, "로그인해주세요.", "").then((confirmed) => {
                    redirectToLogin();
                });
                showPopup("#my", 3, "로그인해주세요.", "").then((confirmed) => {
                    redirectToLogin();
                });
            }
        
            // JWT 관련 에러
            else if (errorResponse?.errorType === "INVALID_REFRESH_TOKEN") {
                alert("유효하지 않은 리프레시 토큰입니다. 다시 로그인 해주세요.");
                clearAuthTokensAndRedirect();
                redirectToLogin();
            }
            else if (errorResponse?.errorType === "INVALID_JWT") {
                alert("유효하지 않은 토큰입니다. 다시 로그인 해주세요.");
                clearAuthTokensAndRedirect();
                redirectToLogin();
            }
        
            // 로그인 필요
            else if (errorResponse?.errorType === "REQUIRES_LOGIN") {
                if (confirm("로그인이 필요한 서비스입니다.")) {
                    clearAuthTokensAndRedirect();
                    redirectToLogin();
                }
            }
        
            // 로그인 필요
            else if (errorResponse?.errorType === "ALREADY_LOGGED_OUT") {
                clearAuthTokensAndRedirect();
                redirectToLogin();
            }
        
            // 권한 에러
            else if (errorResponse?.errorType === "NOT_AVAILABLE_PERMISSION") {
                alert("권한이 없습니다.");
            } else if (errorResponse?.errorType === "NOT_ADMIN_ACCOUNT") {
                alert("관리자 계정이 아니므로 변경할 수 없습니다.");
            }
        
            // 유저 관련 에러
            else if (errorResponse?.errorType === "NOT_FOUND_USER") {
                alert("존재하지 않는 회원입니다.");
                redirectToLogin();
            } else if (errorResponse?.errorType === "ALREADY_EXISTS_EMAIL") {
                alert("이미 존재하는 이메일입니다.");
            }

            // 유저 스탯 관련 에러
            else if (errorResponse?.errorType === "NOT_FOUND_USER_STAT") {
                alert("유저 스탯이 존재하지 않습니다.");
                redirectToLogin();
            }
        
            // 기타 알 수 없는 에러
            else {
                console.error("⚠️ 에러:", errorResponse);
                alert(errorResponse?.message || "알 수 없는 에러가 발생했습니다.");
                redirectToLogin();
            }
        
            function redirectToLogin() {
                window.location.href = "/login-page";
            }
        }
        
    });
}

function clearAuthTokensAndRedirect() {
    // 1. 로컬스토리지에서 액세스토큰 제거
    localStorage.removeItem("Authorization");

    // 2. 쿠키에서 리프레시토큰 제거 (유효기간을 과거로 설정)
    document.cookie = "RefreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}

setupAjaxAuthInterceptor();