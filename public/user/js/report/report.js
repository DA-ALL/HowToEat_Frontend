import { showNumericInput } from '/user/js/components/numericInput.js';

let calorieData = {}; // 최종 데이터 저장용

export async function renderReportPage() {

    const userBasicInfoData = await getUserBasicInfoData();
    const kcalSummaryData = await getKcalSummaryData();

    const kcalSummaryDataLastItem = kcalSummaryData[kcalSummaryData.length - 1];
    
    let reportPageHTML = `
        <div class="user-name">${userBasicInfoData.name} 님</div>
        <div class="toggle-report-wrapper">
            <div class="toggle-meal-report toggle-report active">식사기록</div>
            <div class="toggle-weight-report toggle-report">몸무게</div>
        </div>

        <div id="mealReport">
            <div class="date">${kcalSummaryDataLastItem == null ? Date.now() : kcalSummaryDataLastItem.date}</div>
            <div class="amount-wrapper">
                <div class="amount">${kcalSummaryDataLastItem == null ? 0 : kcalSummaryDataLastItem.consumedKcal}</div>
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
            <div class="date"></div>
            <div class="amount-wrapper">
                <div class="amount"></div>
                <div class="unit">kg</div>
            </div>
            <div class="feedback-comment">목표를 향해 파이팅!</div>
            <div class="recommend-wrapper">
                <div class="recommend-weight" data-weight="">몸무게 기록하기</div>
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
    $("#reportPage").html(reportPageHTML);
    initWeightChart()
    loadAndRenderKcalData(kcalSummaryData);
}

async function getKcalSummaryData(){
    const endDate = getDateStr(0);      // 오늘
    const startDate = getDateStr(29);
    try {
        const response = await getKcalSummary(startDate, endDate);
        const targetResponse = await getTargetKcals(startDate, endDate);

        const consumedMap = {};
        for (const item of response.data) {
            consumedMap[item.date] = item.consumedKcal;
        }

        // target 배열을 기준으로 result 채우기
        const result = targetResponse.data.map(item => ({
            date: item.date,
            target: item.targetKcal,
            consumed: consumedMap[item.date] || 0   // 없으면 0
        }));

        return result;

    } catch (error) {
        console.error("kcal 정보 요청 실패", error);
    }
}

async function getUserBasicInfoData(){
    try {
        const response = await getUserBasicInfo();
        return response.data;
        
    } catch (error) {
        console.error("사용자 정보 요청 실패:", error);
    }
}

function loadAndRenderKcalData(data) {
    // 객체 형태로 변환
    calorieData = {};
    data.forEach(item => {
        calorieData[item.date] = {
            consumed: item.consumed,
            target: item.target,
            feedbackText: getFeedbackText(item.date, item.consumed, item.target)
        };
    });

    // 차트 렌더링
    initCalorieChart(7); // 기본은 7일
}

function getDateStr(offsetDays = 0) {
    const date = new Date();
    date.setDate(date.getDate() - offsetDays);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
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

//식사기록 / 몸무게 토글 클릭시 그래프 뷰 변경
$(document).on('click', '.recommend-weight', function () {
    const value = $(this).data('weight');
    showNumericInput("#report", "weight", value);
});

// 오늘 날짜의 데이터를 저장할 변수
let currentData;

// 1) 구간별 랜덤 피드백 사전
const FEEDBACK_TEXTS = {
  today: {
    zero: [
      '아직 식단 기록이 없어요. 식단을 기록해보세요!',
      '첫 기록을 남겨볼까요? 지금부터 시작하면 돼요.',
      '오늘의 한 끼, 메모해두면 내일이 더 쉬워져요.',
      '기록이 없어요! 가볍게 아침부터 적어볼까요?',
      '지금이 딱 시작하기 좋은 순간이에요 :)'
    ],
    lt25: [
      '오늘의 첫걸음! 조금 더 기록해볼까요?',
      '좋아요, 이제 한두 끼만 더 추가해봐요.',
      '스타트 끊었어요. 작은 습관이 큰 변화를 만들어요.',
      '시작이 반! 다음 끼도 잊지 말고 기록해요.',
      '워밍업 완료! 천천히 채워가봐요.'
    ],
    lt50: [
      '절반을 향해 가는 중! 꾸준히 기록하면 더 정확해져요.',
      '좋아요, 페이스 유지하면서 이어가요.',
      '여기까지 아주 좋아요. 다음 식단도 기록해볼까요?',
      '균형을 맞추는 중이에요. 조금만 더!',
      '한 걸음씩, 차근차근 잘하고 있어요.'
    ],
    lt75: [
      '좋아요! 하루 식사의 균형을 맞춰가고 있어요.',
      '목표가 보이기 시작했어요. 계속 가볼까요?',
      '페이스가 좋네요. 간식/식사로 조금 더 채워봐요.',
      '거의 3/4 지점! 조금만 더 힘내요.',
      '잘하고 있어요. 마무리만 깔끔하게!'
    ],
    lt95: [
      '거의 다 왔어요! 조금만 더 채우면 목표 달성이에요.',
      '마지막 스퍼트! 가벼운 간식으로 딱 맞춰볼까요?',
      '95% 근접! 사소한 한 끼가 차이를 만들어요.',
      '아주 근접했어요. 수분 보충도 잊지 마세요.',
      '한 끼만 더 신경 쓰면 완벽해요!'
    ],
    success: [
      '목표에 딱 맞게 잘 드셨어요! 완벽해요 👏',
      '정확하게 맞추셨어요. 멋진 균형감입니다! 👏',
      '오늘 페이스 최고! 내일도 이 느낌 그대로. 🙌',
      '목표 달성! 스스로를 칭찬해도 좋아요 🙌',
      '밸런스가 훌륭해요. 건강한 하루였어요. 🙌'
    ],
    gt105: [
      '오늘은 목표를 초과했어요. 내일은 조절해봐요.',
      '목표보다 많았지만 괜찮아요. 내일은 균형있게!.',
      '오늘은 여유 있게 드신 날! 내일은 가볍게 가볼까요?'
    ]
  },
  past: {
    zero: [
      '식사 기록이 없어요.',
    ],
    lt25: [
      '이날은 목표 대비 아주 적게 섭취하셨어요.',
      '섭취량이 목표의 25% 미만이었어요.',
      '전반적으로 낮은 섭취량을 보였던 날이에요.',
      '목표 대비 부족한 편이었어요.',
      '에너지 섭취가 매우 적었던 하루였어요.'
    ],
    lt50: [
      '이날은 목표의 절반 이하만 섭취하셨어요.',
      '목표에 비해 다소 적게 드신 날이에요.',
      '필요량의 50%에 못 미쳤어요.',
      '전반적으로 섭취량이 낮은 편이었어요.',
    ],
    lt75: [
      '이날은 목표보다 조금 적게 드셨어요.',
      '목표에 근접했지만 다소 부족했어요.',
      '균형에 거의 도달했지만 조금 모자랐어요.',
      '섭취가 안정적이었지만 목표치에는 못 미쳤어요.',
      '조금 더 드셨어도 괜찮았던 날이에요.'
    ],
    lt95: [
      '이날은 거의 목표치에 근접했어요.',
      '거의 맞췄어요. 좋은 밸런스였어요.',
      '목표에 바짝 다가간 날이네요.',
      '큰 편차 없이 잘 관리했어요.'
    ],
    success: [
      '이날은 목표를 정확히 달성했어요. 잘하셨어요 👏',
      '이날은 이상적인 섭취량을 기록했어요. 🙌',
      '목표 범위 내에서 아주 잘 드셨어요. 🙌',
      '균형 잡힌 하루였어요. 훌륭합니다! 🙌',
      '목표 관리가 인상적이었던 날이에요. 🙌'
    ],
    gt105: [
      '목표를 초과했어요. 조절해 균형을 맞추면 좋아요.',
      '다소 많은 섭취였어요. 패턴 참고에 활용해보세요.',
      '초과 섭취가 있었던 날이에요.',
      '목표 대비 섭취가 높았던 하루였어요.',
      '조금 과했지만, 장기적으로 균형을 맞추면 괜찮아요.'
    ]
  }
};

// 2) 랜덤 선택 유틸
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 3) 구간 키 계산
function getBucketKey(consumed, target) {
  if (!target || target <= 0) {
    // 목표가 없으면 0% 취급
    return consumed === 0 ? 'zero' : 'lt25';
  }
  if (consumed === 0) return 'zero';

  const percent = (consumed / target) * 100;
  if (percent < 25) return 'lt25';
  if (percent < 50) return 'lt50';
  if (percent < 75) return 'lt75';
  if (percent < 95) return 'lt95';
  if (percent <= 105) return 'success';
  return 'gt105';
}

function getFeedbackText(date, consumed, target) {
    const bucket = getBucketKey(consumed, target);
    const context = isToday(date) ? 'today' : 'past';
    const texts = FEEDBACK_TEXTS[context][bucket];
    return pickRandom(texts);
}

function updateReportData(date, consumed, target) {
    const dateElement = document.querySelector('#mealReport .date');
    const amountElement = document.querySelector('#mealReport .amount');
    const legendElement = document.querySelector('#mealReport .legend-label');
    const feedbackCommentElement = document.querySelector('#mealReport .feedback-comment');
    const recommendWrapperElement = document.querySelector('#mealReport .recommend-wrapper');

    if (dateElement && amountElement) {
        const formattedDate = date.replaceAll('-', '.'); 
        dateElement.textContent = formattedDate;
        amountElement.textContent = consumed ? consumed.toLocaleString() : '0';
        legendElement.textContent = '목표 칼로리 ' + (target ? Math.floor(target).toLocaleString() : '0');
        
        recommendWrapperElement.style.visibility = 'hidden';
        recommendWrapperElement.style.pointerEvents = 'none';

        feedbackCommentElement.textContent = calorieData[date]?.feedbackText || '';
    }
}

function isToday(dateStr) {
    const today = new Date();
    const [year, month, day] = dateStr.split('-').map(Number);
    return (
        today.getFullYear() === year &&
        today.getMonth() + 1 === month &&
        today.getDate() === day
    );
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

function initCalorieChart(days = 7) {
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
        $('body').css('overflow', 'hidden');
        document.body.addEventListener('touchmove', preventScroll, { passive: false });
    });

    $chart.off('touchend touchcancel').on('touchend touchcancel', function () {
        $('body').css('overflow', '');
        document.body.removeEventListener('touchmove', preventScroll, { passive: false });
    });
};

// =========================================================== 몸무게 차트  ===========================================================

let weightChart = null;

async function getWeightDatasByDates() {
    try {
        const response = await getWeightDatas();
        let dates = [], values = [];
        response.data.forEach(item => {
            const date = item.createdAt;
            const weight = item.weight;
            dates.push(date);
            values.push(weight);
        });
        return { dates, values };
    } catch (error) {
        console.error("몸무게 데이터 요청 실패:", error);
        return { dates: [], values: [] };  // 기본값 반환
    }
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

async function initWeightChart() {
    const ctx = document.getElementById('weightChart').getContext('2d');
    const chartContainer = document.querySelector("#weightReport .chart-container");
    const { dates, values } = await getWeightDatasByDates() || {};

    
    if (Array.isArray(values) && values.length > 0) { // values가 배열이고, 빈 배열이 아닐 때만 실행
        $(".recommend-weight").attr('data-weight', values[values.length - 1]);
    } else {
        // values가 없거나 비어있는 경우에 대한 처리 (옵션)
        $(".recommend-weight").attr('data-weight', 0); // 기본값 0 또는 다른 적절한 값 설정
    }


    let isDragging = false;
    let startX;

    dates.push('');         // 우측 여백용
    values.push(null);      // null로 포인트 숨김

    const totalLength = dates.length;
    let currentStartIndex = Math.max(0, totalLength - 7);
    let minDate = dates[currentStartIndex] ?? dates[0];         // fallback to first date
    let maxDate = dates[totalLength - 1] ?? dates[dates.length - 1]; // fallback to last date

    let selectedIndex = dates.length - 2;
    updateWeightReportData(dates[selectedIndex], values[selectedIndex]);

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
                    min: minDate,//dates[currentStartIndex + 1],
                    max: maxDate, //dates[currentStartIndex + 7],
                    offset: totalLength == 2 ? true : false, // 데이터가 하나일 때만 좌우 여백 추가
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


// =========================================================== API ===========================================================

function getKcalSummary(start_date, end_date) {
    const params = new URLSearchParams({
        start_date: start_date,
        end_date: end_date
    });

    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/daily-summary/kcals?${params.toString()}`,
        contentType: "application/json",
    });
}

function getTargetKcals(start_date, end_date) {
    const params = new URLSearchParams({
        start_date: start_date,
        end_date: end_date
    });

    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/targets/kcals?${params.toString()}`,
        contentType: "application/json",
    });
}

function getWeightDatas() {
    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/user-stats/weight`,
        contentType: "application/json",
    })
}

function getUserBasicInfo() {
    return $.ajax({
        type: "GET",
        url: `${window.DOMAIN_URL}/users/basic-info`,
        contentType: "application/json",
    })
}