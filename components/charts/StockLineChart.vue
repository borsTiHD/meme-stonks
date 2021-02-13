<script>
import { Line } from 'vue-chartjs'

export default {
    extends: Line,
    props: {
        chartData: {
            type: Array || Object,
            required: false,
            default: []
        },
        chartLabels: {
            type: Array,
            required: true
        },
        lineColor: {
            type: String,
            required: false,
            default: '#ffffffb3'
        },
        bgColor: {
            type: String,
            required: false,
            default: 'rgba(0, 0, 0, 0.2)'
        }
    },
    data() {
        return {
            options: {
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false
                        },
                        gridLines: {
                            display: true
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            display: false
                        },
                        type: 'time',
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 24
                        }
                    }]
                }
            }
        }
    },
    mounted() {
        this.renderChart({
            labels: this.chartLabels,
            datasets: [
                {
                    label: '€',
                    borderColor: this.lineColor,
                    borderWidth: 2,
                    pointBackgroundColor: 'transparent',
                    pointBorderColor: 'transparent',
                    backgroundColor: this.bgColor,
                    data: this.chartData
                }
            ]
        }, this.options)
    }
}
</script>
