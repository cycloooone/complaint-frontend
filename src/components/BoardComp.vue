<template>
  <div>
    <Pie
      id="category-pie-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
  </div>
</template>

<script>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

export default {
  props: ['complaints_data'],
  name: 'BoardComp',
  components: { Pie },
  data() {
    return {
      chartOptions: {
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
            label: 'Частота Категорий жалоб',
            backgroundColor: [],
            data: []
          }]
        };
      }

      const categoryNames = Array.from(new Set(this.complaints_data.map(obj => obj.category_name)));
      const categoryOccurrence = categoryNames.map(name => this.complaints_data.filter(obj => obj.category_name === name).length);
      const data = categoryNames.map((name, index) => ({ name, occurrence: categoryOccurrence[index] }));
      data.sort((a, b) => b.occurrence - a.occurrence);

      // Predefined set of three good combining colors
      const predefinedColors = ['#FF6384', '#36A2EB', '#FFCE56'];

      return {
        labels: data.map(item => item.name),
        datasets: [{
          label: 'Частота Категорий жалоб',
          backgroundColor: data.map((_, index) => predefinedColors[index % predefinedColors.length]), // Cycle through the colors
          data: data.map(item => item.occurrence)
        }]
      };
    }
  }
}
</script>
