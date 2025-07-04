
function generateRandomCalorieData() {
  const result = {};
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    
    let consumed = 0;
    const target = Math.floor(Math.random() * 301) + 2200; // 2200 ~ 2500
    if(i%2 == 0){
        consumed = 0;
    } else {
        consumed = Math.floor(Math.random() * 401) + (target - 100); // target-100 ~ target+300
    }
    
    

    result[dateStr] = {
      consumed,
      target,
    };
  }

  return result;
}

const calorieData = generateRandomCalorieData();

export function renderReportPage() {
    return `
        <div class="user-name">하잇님</div>
        <div class="toggle-report-wrapper">
            <div class="toggle-meal-report toggle-report active">식사기록</div>
            <div class="toggle-weight-report toggle-report">몸무게</div>
        </div>

        <div id="mealReport">
            <div class="date">2025.04.30</div>
            <div class="amount-wrapper">
                <div class="amount">1,652</div>
                <div class="unit">kcal</div>
            </div>
            <div class="feedback-comment">조금 더 드셔야 해요</div>
            <div class="recommend-wrapper">
                <div class="recommend-food">추천음식 보러가기</div>
                <div class="icon">
                    <img src="/user/images/icon_arrow_red.png">
                </div>
            </div>
            <div class="period-button-wrapper">
                <div class="period-button active">1주</div>
                <div class="period-button">1달</div>
            </div>

            <div class="legend-wrapper">
                <div class="legend-box"></div>
                <div class="legend-label">목표 칼로리</div>
            </div>
            <div class="y-label">(Kcal)</div>
            
            <div class="chart-container"> 
                <canvas id="calorieChart"></canvas>
            </div>
        </div>


        <div id="weightReport" style="display:none">
            <div class="date">2025.04.30</div>
            <div class="amount-wrapper">
                <div class="amount">74</div>
                <div class="unit">kg</div>
            </div>
            <div class="feedback-comment">목표를 향해 파이팅!</div>
            <div class="recommend-wrapper">
                <div class="recommend-food">몸무게 기록하기</div>
                <div class="icon">
                    <img src="/user/images/icon_arrow_red.png">
                </div>
            </div>
            
            <div class="chart-container"> 
                <canvas id="weightChart"></canvas>
            </div>
        </div>

        <div id="tooltip"></div>
    `;
}

//식사기록 / 몸무게 토글 클릭시 그래프 뷰 변경
$(document).on('click', '.toggle-report', function () {
    $('.toggle-report').removeClass('active');

    $(this).addClass('active');

    if ($(this).hasClass('toggle-meal-report')) {
        $('#mealReport').show();
        $('#weightReport').hide();
    } else if ($(this).hasClass('toggle-weight-report')) {
        $('#weightReport').show();
        $('#mealReport').hide();
        if (weightChart) {
            weightChart.destroy();
            initWeightChart();
        }
    }
});

// 오늘 날짜의 데이터를 저장할 변수
let currentData;

function updateReportData(date, consumed, target) {
    const dateElement = document.querySelector('#mealReport .date');
    const amountElement = document.querySelector('#mealReport .amount');
    const legendElement = document.querySelector('#mealReport .legend-label');
    const feedbackCommentElement = document.querySelector('#mealReport .feedback-comment');

    if (dateElement && amountElement) {
        const formattedDate = date.replaceAll('-', '.'); 
        dateElement.textContent = formattedDate;
        amountElement.textContent = consumed ? consumed.toLocaleString() : '0';
        legendElement.textContent = '목표 칼로리 ' + (target ? target.toLocaleString() : '0');

        let feedbackComment = '';
        if(consumed < target) {
            feedbackCommentElement.textContent = '조금 더 드셔야 해요';
        } else {
            feedbackCommentElement.textContent = '그만 드셔야 해요';
        }        
    }
}

function getTodayData() {
    const today = new Date();
    const todayKey = today.toISOString().split('T')[0];
    return {
        date: todayKey,
        consumed: calorieData[todayKey]?.consumed,
        target: calorieData[todayKey]?.target
    };
}

let calorieChart; // Chart 인스턴스를 저장할 변수

export function initCalorieChart(days = 7) {
    const { labels, data } = getRecentData(days);
    const goalData = data.map(item => item.target); // target만 추출

    const ctx = document.getElementById('calorieChart')?.getContext('2d');
    if (!ctx) {
        console.error('calorieChart element not found');
        return;
    }

    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0.5, "rgba(235, 133, 133, 0.16)");
    gradient.addColorStop(0.9, "rgba(255, 255, 255, 0.18)");
    const red500 = getComputedStyle(document.documentElement).getPropertyValue('--red500').trim();

    if (calorieChart) {
        calorieChart.destroy();
    }

    currentData = getTodayData();
    updateReportData(currentData.date, currentData.consumed, currentData.target);

    const todayLabel = currentData.date.slice(5); // 'MM-DD'
    const todayIndex = labels.indexOf(todayLabel);

    const initialPointRadius = new Array(labels.length).fill(0);
    if (todayIndex !== -1) {
        initialPointRadius[todayIndex] = 3;
    }

    let pointReset = false;

    calorieChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '섭취 칼로리',
                    data: data.map(item => item.consumed), // consumed만
                    borderColor: red500,
                    borderWidth: 1,
                    backgroundColor: gradient,
                    pointBackgroundColor: red500,
                    pointRadius: initialPointRadius,
                    pointHoverRadius: 3,
                    tension: 0.25,
                    fill: true,
                },
                {
                    label: '목표 칼로리 계단',
                    data: goalData,
                    borderColor: '#FFEDED',
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    pointStyle: false,
                    stepped: true,
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.3,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: { display: false },
                annotation: { annotations: {} },
                tooltip: {
                    enabled: false,
                    external: function (context) {
                        const tooltip = document.getElementById('tooltip');
                        const tooltipModel = context.tooltip;

                        if (tooltipModel.opacity === 0) {
                            tooltip.style.opacity = '0';
                            return;
                        }

                        const chart = context.chart;
                        const yScale = chart.scales.y;
                        const xScale = chart.scales.x;
                        const position = chart.canvas.getBoundingClientRect();

                        tooltip.style.opacity = '1';
                        tooltip.style.display = 'flex';
                        tooltip.style.justifyContent = 'center';
                        tooltip.style.alignItems = 'center';
                        tooltip.style.flexDirection = 'column';

                        const dataPoint = tooltipModel.dataPoints?.[0];
                        const label = dataPoint?.label || '';
                        const index = dataPoint?.dataIndex;

                        const zeroY = yScale.getPixelForValue(0);
                        const pointX = xScale.getPixelForValue(index);
                        const verticalBarHeight = yScale.height;

                        const tooltipWidth = tooltip.offsetWidth;
                        const tooltipTop = position.top + window.pageYOffset + zeroY - verticalBarHeight - 22;
                        const tooltipLeft = position.left + window.pageXOffset + pointX - (tooltipWidth / 2);

                        tooltip.style.left = `${tooltipLeft}px`;
                        tooltip.style.top = `${tooltipTop}px`;

                        tooltip.innerHTML = `
                            <div class="tooltip-content">
                                <div class="tooltip-date">${label}</div>
                                <div class="vertical-bar"></div>
                            </div>
                        `;

                        requestAnimationFrame(() => {
                            const bar = tooltip.querySelector('.vertical-bar');
                            if (bar) {
                                bar.style.height = `${verticalBarHeight}px`;
                            }
                        });
                    }
                }
            },
            scales: {
                x: {
                    ticks: { display: false },
                    grid: { display: false, drawBorder: false },
                },
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 4000,
                    ticks: { stepSize: 1000, color: '#999' },
                    grid: { display: false, drawBorder: false }
                }
            },
            onHover: (event, elements) => {
                if (!pointReset) {
                    calorieChart.data.datasets[0].pointRadius = 0; // 초기 점 제거
                    calorieChart.update('none');
                    pointReset = true;
                }

                if (elements.length > 0) {
                    const index = elements[0].index;
                    const dayData = data[index];
                    if (dayData) {
                        updateReportData(dayData.date, dayData.consumed, dayData.target);
                    }
                }
            }
        }
    });
    bindTouchEventsForChart();
}


function getRecentData(days) {
    const today = new Date();
    const resultLabels = [];
    const resultData = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

        resultLabels.push(dateKey.slice(5)); // MM-DD

        resultData.push({
            date: dateKey,
            consumed: calorieData[dateKey]?.consumed ?? 0,
            target: calorieData[dateKey]?.target ?? 0
        });
    }
    return { labels: resultLabels, data: resultData };
}


// 기간 버튼 클릭 이벤트 핸들러
$(document).on('click', '.period-button', function () {
    var wrapper = $(this).closest('.period-button-wrapper');
    wrapper.find('.period-button').removeClass('active');
    $(this).addClass('active');

    const period = $(this).text();
    let daysToShow = 7; // 기본값은 1달

    if (period === '1달') {
        daysToShow = 30;
    }

    initCalorieChart(daysToShow); // 선택된 기간에 따라 차트 다시 초기화
});

$(document).on('touchend', function () {
    const tooltip = document.getElementById('tooltip');
    
    if (tooltip) {
        console.log("터치끝");
        tooltip.style.opacity = '0';  // 툴팁을 숨깁니다.
        tooltip.style.display = 'none';  // 툴팁을 아예 숨깁니다.
    }
});

function bindTouchEventsForChart() {
    const $chart = $('#calorieChart');

    if ($chart.length === 0) {
        console.warn('#calorieChart 요소가 존재하지 않습니다.');
        return;
    }

    function preventScroll(e) {
        e.preventDefault();
    }

    $chart.off('touchstart').on('touchstart', function () {
        console.log("touch start");
        $('body').css('overflow', 'hidden');
        document.body.addEventListener('touchmove', preventScroll, { passive: false });
    });

    $chart.off('touchend touchcancel').on('touchend touchcancel', function () {
        console.log("touch end or cancel");
        $('body').css('overflow', '');
        document.body.removeEventListener('touchmove', preventScroll);
    });
};

// =========================================================== 몸무게 차트  ===========================================================

let weightChart = null;

function generateRandomWeightData() {
    let dates = [], values = [];
    let today = new Date();
    for (let i = 29; i >= 0; i--) {
        let pastDate = new Date();
        pastDate.setDate(today.getDate() - i);
        dates.push(pastDate.toISOString().split('T')[0]);
        values.push(Math.floor(Math.random() * 100) + 1);
    }
    return { dates, values };
}

function updateWeightReportData(date, weight) {
    const dateElement = document.querySelector('#weightReport .date');
    const amountElement = document.querySelector('#weightReport .amount');



    if (dateElement && amountElement) {
        const formattedDate = date.replaceAll('-', '.'); 
        dateElement.textContent = formattedDate;
        amountElement.textContent = weight ? weight.toLocaleString() : '0';
    }
}

export function initWeightChart() {
    const ctx = document.getElementById('weightChart').getContext('2d');
    const chartContainer = document.querySelector("#weightReport .chart-container");
    const { dates, values } = generateRandomWeightData();

    let isDragging = false;
    let startX;
    let currentStartIndex = Math.max(0, dates.length - 7);
    let selectedIndex = dates.length-1;
    updateWeightReportData(dates[selectedIndex], values[selectedIndex]);

    // dates.unshift('');        // 좌측 여백용
    // values.unshift(null);     // 포인트 숨김

    dates.push('');         // 우측 여백용
    values.push(null);      // null로 포인트 숨김

    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0.5, "rgba(235, 133, 133, 0.16)");
    gradient.addColorStop(0.9, "rgba(255, 255, 255, 0.18)");

    const red500 = getComputedStyle(document.documentElement).getPropertyValue('--red500').trim();

    const data = {
        labels: dates,
        datasets: [{
            label: '개수 변화',
            data: values,
            borderColor: red500,
            backgroundColor: gradient,
            borderWidth: 1,
            fill: true,

            pointRadius: (ctx) => ctx.dataIndex === selectedIndex ? 5 : 3,
            pointBackgroundColor: (ctx) => ctx.dataIndex === selectedIndex ? red500 : '#ffffff',
            pointBorderColor: red500,       // 포인트 테두리 색상
            pointBorderWidth: 1,             // 포인트 테두리 두께
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.3,
            interaction: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                x: {
                    ticks: { 
                        display: false,
                    },
                    grid: { display: false, drawBorder: false },
                    min: dates[currentStartIndex+1],
                    max: dates[currentStartIndex + 7],
                    // offset: true,
                },
                y: {
                    beginAtZero: true,
                    min: 0,
                    ticks: { stepSize: 20, color: '#999' },
                    suggestedMax: Math.max(...values) * 1.3,
                    grid: { display: false, drawBorder: false },
                    border: { display: false }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: false,
                },
                hover: {
                   mode: null
                },
            },
        }
    };

    weightChart = new Chart(ctx, config);

    let touchStartX = 0;
    let touchEndX = 0;

    chartContainer.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
        isDragging = true;
        touchStartX = e.touches[0].clientX;
    }
    }, { passive: false }); //preventDefault를 쓰려면 passive: false

    chartContainer.addEventListener("touchmove", (e) => {
        if (!isDragging || e.touches.length !== 1) return;

        const currentX = e.touches[0].clientX;
        const moveX = currentX - touchStartX;

        // 좌우로 스와이프 중이면 세로 스크롤 방지
        if (Math.abs(moveX) > 10) {
            e.preventDefault(); // 세로 스크롤 막기
        }

        if (Math.abs(moveX) > 30) {
            const moveStep = Math.floor(Math.abs(moveX) / 30); // 이동 거리에 따라 여러 step 계산

            if (moveX > 0 && currentStartIndex > 0) {
                currentStartIndex = Math.max(0, currentStartIndex - moveStep);
            } else if (moveX < 0 && currentStartIndex < dates.length - 7) {
                currentStartIndex = Math.min(dates.length - 7, currentStartIndex + moveStep);
            }

            weightChart.options.scales.x.min = dates[currentStartIndex];
            weightChart.options.scales.x.max = dates[currentStartIndex + 6];
            weightChart.update({ duration: 0 }); 

            touchStartX = currentX; // 기준점 업데이트
        }
    }, { passive: false }); 

    chartContainer.addEventListener("touchend", (e) => {
        isDragging = false;

        if (e.changedTouches.length === 1) {
            const touch = e.changedTouches[0];
            const touchEndX = touch.clientX;
            const touchEndY = touch.clientY;

            const diffX = Math.abs(touchEndX - touchStartX);
            if (diffX < 10) {
                const rect = ctx.canvas.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;

                const fakeEvent = {
                    type: 'touchend',
                    chart: weightChart,
                    native: e,
                    x,
                    y
                };

                const elements = weightChart.getElementsAtEventForMode(
                    fakeEvent,
                    'index',              
                    { intersect: false }, 
                    true
                );

                if (elements.length > 0) {
                    const index = elements[0].index;
                    const weight = weightChart.data.datasets[0].data[index];
                    const date = weightChart.data.labels[index];

                    if (weight && date) {
                        updateWeightReportData(date, weight);
                        selectedIndex = index;
                        weightChart.update();  
                    }
                }
            }
        }
    });
}
