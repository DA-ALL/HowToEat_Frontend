export function setupAjaxAuthInterceptor() {
    $.ajaxSetup({
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr, settings) {
            const accessToken = localStorage.getItem("Authorization");
            if (accessToken) {
                xhr.setRequestHeader("Authorization", accessToken);
            }
        },
        complete: function (xhr, status) {
            


            const accessToken = xhr.getResponseHeader('Authorization');

            if(accessToken) {
                localStorage.setItem('Authorization', accessToken);                    
            }

            if (xhr.status === 401) {
                console.warn("토큰이 만료되었습니다. 재발급 요청중입니다.");

                // 원래 요청 정보 저장
                const originalRequest = this;

                // 원래 요청 다시 시도
                $.ajax({
                    ...originalRequest,
                    headers: {
                        ...(originalRequest.headers || {}),
                        Authorization: newAccessToken
                    },
                    error: function () {
                        console.error("토큰 재발급에 에러가 발생했습니다. 다시 로그인해 주세요");
                        window.location.href = "/login-page";
                    }    
                });

            }
        }
    });
}
