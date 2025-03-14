$(document).ready(function () {
    // URL을 체크하고 차트를 초기화/제거하는 함수
    function checkURLAndInitChart() {
        if (window.location.href.includes("dashboard")) {
            // dashboard가 URL에 포함되어 있으면 차트 생성
            $('#dashboardChart').html(`
                <div class="chart-container">
                    <div class="title-chart">식단 등록 횟수</div>
                    <div class="chart-wrapper">
                        <canvas id="myChart"></canvas>
                    </div>
                </div>
                <div id="tooltip"></div>
            `);

            initChart();
        } else {
            // dashboard가 URL에 포함되지 않으면 차트 제거
            $('#dashboardChart').html('');
        }
    }

    // 차트 초기화 함수
    function initChart() {
        const ctx = document.getElementById('myChart').getContext('2d');
        const chartWrapper = document.querySelector(".chart-wrapper");
        let isDragging = false;
        let startX;
        let currentStartIndex = 23;

        function generateLast30Days() {
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

        const { dates, values } = generateLast30Days();
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
                pointRadius: 0,
                pointHoverRadius: 5
            }]
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                scales: {
                    x: {
                        ticks: {
                            color: "#A8A8A8",
                            font: { family: "Pretendard", size: 12 },
                            autoSkip: false,
                            padding: 30
                        },
                        grid: { display: false },
                        min: dates[23],
                        max: dates[30]
                    },
                    y: {
                        ticks: {
                            color: "#A8A8A8",
                            font: { family: "Pretendard", size: 12 },
                            maxTicksLimit: 5,
                            padding: 50,
                        },
                        suggestedMax: Math.max(...values) * 2,
                        grid: { color: 'rgba(200, 200, 200, 0.5)' },
                        border: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: false,
                        external: function (context) {
                            let tooltip = document.getElementById('tooltip');
                            let tooltipModel = context.tooltip;

                            if (tooltipModel.opacity === 0) {
                                tooltip.style.opacity = '0';
                                return;
                            }

                            let position = context.chart.canvas.getBoundingClientRect();
                            tooltip.style.opacity = '1';
                            tooltip.style.display = 'block';
                            tooltip.style.left = `${position.left + window.pageXOffset + tooltipModel.caretX}px`;
                            tooltip.style.top = `${position.top + window.pageYOffset + tooltipModel.caretY - 40}px`;
                            tooltip.innerHTML = tooltipModel.body[0].lines[0].split(": ")[1];
                        }
                    }
                }
            }
        };

        const myChart = new Chart(ctx, config);

        chartWrapper.addEventListener("mousedown", (e) => {
            isDragging = true;
            startX = e.clientX;
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            const moveX = e.clientX - startX;
            if (Math.abs(moveX) > 200) {
                if (moveX > 0 && currentStartIndex > 0) {
                    currentStartIndex--;
                } else if (moveX < 0 && currentStartIndex < dates.length - 7) {
                    currentStartIndex++;
                }
                myChart.options.scales.x.min = dates[currentStartIndex];
                myChart.options.scales.x.max = dates[currentStartIndex + 6];
                myChart.update();
                startX = e.clientX;
            }
        });
    }

    // 초기 로드 시 URL 확인
    checkURLAndInitChart();

    // popstate 이벤트로 뒤로가기/앞으로가기 시 URL 변경 감지
    window.addEventListener('popstate', function () {
        checkURLAndInitChart();
    });

    // pushState나 replaceState가 호출될 때도 URL을 변경 감지
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function () {
        originalPushState.apply(history, arguments);
        checkURLAndInitChart(); // URL이 변경되었을 때 차트 확인
    };

    history.replaceState = function () {
        originalReplaceState.apply(history, arguments);
        checkURLAndInitChart(); // URL이 변경되었을 때 차트 확인
    };
});