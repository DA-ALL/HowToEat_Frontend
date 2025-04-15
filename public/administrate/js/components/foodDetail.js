function loadFoodDetail() {
    const container = $("#foodDetail");

    let foodDetialHTML = `
        <div class="title">음식 상세보기</div>
        
        <div class="input-wrapper">
            <div class="input-title">음식 이름</div>
            <input type="text" class="input" id="foodName" placeholder="메뉴 이름을 입력해주세요" />
        </div>



        <div class="input-wrapper">
            <div class="input-title">설명</div>
            <input type="text" class="input" id="" placeholder="설명을 추가해 주세요" />
        </div>

        <div class="input-wrapper">
            <div class="input-title">칼로리 (Kcal)</div>
            <input type="text" class="input" id="foodName" placeholder="칼로리를 입력해 주세요" />
        </div>

        <div class="input-wrapper">
            <div class="input-title">탄수화물 (g)</div>
            <input type="text" class="input" id="foodName" placeholder="탄수화물을 입력해 주세요" />
        </div>

        <div class="input-wrapper">
            <div class="input-title">단백질 (g)</div>
            <input type="text" class="input" id="foodName" placeholder="단백질을 입력해 주세요" />
        </div>
        
        <div class="input-wrapper">
            <div class="input-title">지방 (g)</div>
            <input type="text" class="input" id="foodName" placeholder="지방을 입력해 주세요" />
        </div>

        <div class="input-wrapper">
            <div class="input-title">무게</div>
            <input type="text" class="input" id="foodName" placeholder="무게를 입력해 주세요" />
        </div>
    `;

    container.html(foodDetialHTML);

}
