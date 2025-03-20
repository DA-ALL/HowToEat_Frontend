$(document).ready(function () {
    $('#signupComplete').html(`
        <div class="welcome-text">
            환영합니다
        </div>
    `);
    // 콘페티 실행
    launchConfetti();
});

function launchConfetti() {
    var duration = 3000; // 3초 동안
    var animationEnd = Date.now() + duration;

    var defaults = {
        startVelocity: 40, // 속도
        spread: 120, // 퍼지는 범위
        ticks: 260, // 지속 시간
        gravity: 0.7, // 중력 (느리게 떨어지도록 조절)
        origin: { y: 0.6 } // 화면에서 중간쯤에서 나오도록 설정
    };

    // 여러 번 실행하지 않고 한 번만 대량 발사
    confetti(Object.assign({}, defaults, { particleCount: 80 }));
}