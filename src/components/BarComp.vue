<template>
  <div>
    <Bar
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  props: ['complaints_data'],
  name: 'BarComp',
  components: { Bar },
  data() {
    return {
      chartOptions: {
        indexAxis: 'y',
        responsive: true,
        aspectRatio: 2,
        plugins: {
          tooltip: {
            bodyFont: {
              size: 20
            }
          },
          legend: {
            labels: {
              font: {
                size: 20
              }
            }
          }
        }
      }
    }
  },
  computed: {
    chartData() {
      if (!this.complaints_data || this.complaints_data.length === 0) {
        return {
          labels: [],
          datasets: [{
            label: 'Частота Обьектов Жалоб',
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            data: []
          }]
        };
      }

      const objectNames = Array.from(new Set(this.complaints_data.map(obj => obj.object_name)));
      const objectOccurrence = objectNames.map(name => this.complaints_data.filter(obj => obj.object_name === name).length);

      const data = objectNames.map((name, index) => ({ name, occurrence: objectOccurrence[index] }));

      // Sort the data by occurrence count in descending order
      data.sort((a, b) => b.occurrence - a.occurrence);

      // Define an array of colors
      const colors = ['#4ac0c0', '#3464f5', '#6b43f0', '#f04386', '#f0a643', '#60f043', '#43f0e8'];

      return {
        labels: data.map(item => item.name),
        datasets: [{
          label: 'Частота Обьектов Жалоб',
          backgroundColor: data.map((item, index) => colors[index % colors.length]),
          data: data.map(item => item.occurrence)
        }]
      };
    }
  }
}
</script>
