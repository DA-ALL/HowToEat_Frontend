$(document).ready(async function () {
    const refreshToken = getCookie('RefreshToken');

    console.log(refreshToken);
    const redirectTo = (url) => {
        setTimeout(() => {
            window.location.href = url;
        }, 1500); // 1.5초 후 이동
    };


    try {
        const res = await $.ajax({
            method: 'GET',
            url: `${window.DOMAIN_URL}/users/basic-info`,
            xhrFields: {
                withCredentials: true
            },
        });

        console.log(res);
        redirectTo('/main');
        
    } catch (err) {        
        redirectTo('/login-page');
    }
});

function getCookie(name) {
    const value = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return value ? value.pop() : '';
}
