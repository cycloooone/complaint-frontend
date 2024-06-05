<template>
    <div v-if="complaints">
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
import axios from 'axios'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
name: 'ObjectGraph',
components: { Bar },
data() {
  return {
    complaints: null,
    chartData: {
      labels: [], // Initialize as empty array
      datasets: [{
        label: 'Object Occurrences',
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Example background color
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
  async getComplaints() {
    try {
      const { data } = await axios.get("https://complaint-backend-drab.vercel.app/complaint");
      this.complaints = data;
      this.updateChartData();
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  },
  updateChartData() {
if (this.complaints) {
  const objectNames = Array.from(new Set(this.complaints.map(obj => obj.object_name)));
  const objectOccurrence = objectNames.map(name => this.complaints.filter(obj => obj.object_name === name).length);

  // Combine object names and occurrence counts into an array of objects
  const data = objectNames.map((name, index) => ({ name, occurrence: objectOccurrence[index] }));

  // Sort the data by occurrence count in descending order
  data.sort((a, b) => b.occurrence - a.occurrence);

  // Update chart data
  this.chartData.labels = data.map(item => item.name);
  this.chartData.datasets[0].data = data.map(item => item.occurrence);
}
}


},
created() {
  this.getComplaints();
}
}
</script>
