<script>
import { Line } from 'vue-chartjs'
import { mapGetters } from 'vuex'

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
                        },
                        time: {
                            unit: 'month'
                        }
                    }]
                }
            }
        }
    },
    computed: {
        ...mapGetters({
            getExchange: 'stock/getExchange'
        }),
        data() {
            // Computed Property für 'chartData', damit die Daten überwacht und bei Änderung zum Rerender führen können
            return this.chartData
        },
        currency() {
            return this.getExchange?.currency?.symbol || ''
        }
    },
    watch: {
        // Rendert Chart neu, sobald sich Daten ändern
        data() {
            this.buildChart()
        }
    },
    mounted() {
        this.buildChart()
    },
    methods: {
        buildChart() {
            // Render Function gewrapped, damit sie immer wieder genutzt werden kann (zum Rerendern)
            this.renderChart({
                labels: this.chartLabels,
                datasets: [
                    {
                        label: this.currency,
                        borderColor: this.lineColor,
                        borderWidth: 2,
                        pointBackgroundColor: 'transparent',
                        pointBorderColor: 'transparent',
                        backgroundColor: this.bgColor,
                        data: this.data
                    }
                ]
            }, this.options)
        }
    }
}
</script>
