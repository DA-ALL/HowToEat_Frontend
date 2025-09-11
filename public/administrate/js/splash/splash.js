$(document).ready(async function () {
    const refreshToken = getCookie('RefreshToken');

    // console.log(refreshToken);
    const redirectTo = (url) => {
        setTimeout(() => {
            window.location.href = url;
        }, 1300); // 1.3초 후 이동
    };

    try {
        const res = await $.ajax({
            method: 'GET',
            url: `${window.DOMAIN_URL}/admin/me`,
            xhrFields: {
                withCredentials: true
            },
        });

        redirectTo('/admin/dashboard');
        
    } catch (err) {        
        window.location.href = '/admin/login';
    }
});

function getCookie(name) {
    const value = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return value ? value.pop() : '';
}
