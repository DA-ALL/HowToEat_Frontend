$(document).ready(function() {
    
    //TODO: url 변경될때마다 실행시키는것도 해야되는데 그건 다른게 뭔가 있을듯?
    function updatePageTitle() {
        const pathSegments = window.location.pathname.split("/");
        const lastSegment = pathSegments[pathSegments.length - 1]; // 마지막 경로 추출
        let titleText = "";

        switch (lastSegment) {
            case "dashboard":
                titleText = "Dashboard";
                break;
            case "user-management":
                titleText = "User Management";
                break;
            default:
                titleText = "Unknown Page"; // 기본값 설정 (예: 예외 처리)
                break;
        }

        $('#title').text(titleText);
    }

    updatePageTitle();
});