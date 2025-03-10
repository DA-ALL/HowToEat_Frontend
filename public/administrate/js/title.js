$(document).ready(function () {
    function updatePageTitle() {
        const path = window.location.pathname;
        let titleText = "Unknown Page"; // 기본값 설정

        if (path.includes("dashboard")) {
            titleText = "Dashboard";
        } else if (path.includes("user-management")) {
            titleText = "User Management";
        }
        else if (path.includes("food-management")) {
            titleText = "Food Management";
        }
        else if (path.includes("notice")) {
            titleText = "Notice";
        }
        else if (path.includes("admin-management")) {
            titleText = "Admin Management";
        }

        $('#title').text(titleText);
    }

    // 초기 실행
    updatePageTitle();

    // 뒤로 가기, 앞으로 가기 등의 이벤트 감지
    window.addEventListener("popstate", updatePageTitle);

    // pushState와 replaceState 이벤트를 감지하도록 설정
    (function () {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function () {
            originalPushState.apply(this, arguments);
            window.dispatchEvent(new Event("pushstate"));
        };

        history.replaceState = function () {
            originalReplaceState.apply(this, arguments);
            window.dispatchEvent(new Event("replacestate"));
        };

        window.addEventListener("pushstate", updatePageTitle);
        window.addEventListener("replacestate", updatePageTitle);
    })();
});