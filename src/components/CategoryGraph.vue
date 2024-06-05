<template>
    <div v-if="COMPLAINTS">
      <Bar
        id="category-chart-id"
        :options="chartOptions"
        :data="chartData"
      />
    </div>
  </template>
  
  <script>
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
  import { mapGetters, mapActions } from 'vuex'
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
  
  export default {
    computed:{
      ...mapGetters(["COMPLAINTS"]),
    },
    name: 'CategoryGraph',
    components: { Bar },
    data() {
      return {
        complaints: null,
        chartData: {
          labels: [], // Initialize as empty array
          datasets: [{
            label: 'Category Occurrences',
            backgroundColor: 'rgba(75, 192, 192, 0.6)', // Example background color
            data: [] // Initialize as empty array
          }]
        },
        chartOptions: {
          indexAxis: 'y',
          responsive: true
        }
      }
    },
    methods: {
      updateChartData() {
        if (this.COMPLAINTS) {
          const categoryNames = Array.from(new Set(this.COMPLAINTS.map(obj => obj.category_name)));
          const categoryOccurrence = categoryNames.map(name => this.COMPLAINTS.filter(obj => obj.category_name === name).length);
          const data = categoryNames.map((name, index) => ({ name, occurrence: categoryOccurrence[index] }));
  
          // Sort the data by occurrence count in descending order
          data.sort((a, b) => b.occurrence - a.occurrence);
  
          // Update chart data
          this.chartData.labels = data.map(item => item.name);
          this.chartData.datasets[0].data = data.map(item => item.occurrence);
        }
      }
    },
    created() {
      this.updateChartData();
    }
  }
  </script>
  