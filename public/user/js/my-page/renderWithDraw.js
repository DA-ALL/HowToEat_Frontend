import { showPopup } from '../components/popup.js'
import { showPage } from '../components/nav-bottom.js';

export function renderWithDraw() {
    return `
    <div id="headerNav" data-title="회원 탈퇴" data-type="2"></div>
    
    <div id="withDrawContainer">
        <div class="title-wrapper">탈퇴하기</div>

        <div class="sub-title-wrapper">
            <div>
                <div class="text-wrapper">
                <div class="wrapper">
                    <div class="point"></div>
                    <div class="sub">탈퇴 시 지금까지 기록한</div>
                </div>
                    <div class="sub-second">모든 식단 내역이 삭제돼요</div>
                </div>
            </div>

            <div>
                <div class="text-wrapper">
                <div class="wrapper">
                    <div class="point"></div>
                    <div class="sub">즐겨찾기에 추가한 음식 정보도</div>
                </div>
                    <div class="sub-second">모두 사라져요</div>
                </div>
            </div>


            <div>
                <div class="text-wrapper">
                <div class="wrapper">
                    <div class="point"></div>
                    <div class="sub">누적된 통계 및 리포트 정보가</div>
                </div>
                    <div class="sub-second">복구되지 않아요</div>
                </div>
            </div>

        </div>

    </div>
                        
    <div class="withdraw-button-container">
        <div class="cancel-btn">취소</div>
        <div class="withdraw-btn">탈퇴하기</div>
    </div>
 
    `;
} 

$(document).on('click', '.withdraw-btn', function () {
    showPopup("#my", 5, "정말 탈퇴하시겠어요?", "탈퇴하면 모든 데이터가 사라져요ㄴ").then((confirmed) => {
        if(confirmed) {
            // $.ajax({
            //     url: `${window.DOMAIN_URL}/logout`,
            //     type: 'POST',
            //     success: function (res) {
            //         window.location.href = "/login-page";   
            //     }
            // });
            return;
        }
    });
});

$(document).on('click', '.cancel-btn', function () {
    const newPath = `/users`;

    history.pushState({ view: 'users' }, '', newPath);
    showPage(newPath);
    return;
});

