<template>
  <v-card>
    <v-card-title>Complaints by Category</v-card-title>
    <v-card-text>
      <div v-if="!chartData">
        Loading complaints...
      </div>

    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    complaints: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {

    };
  },
  computed: {

  },
  watch: {
    categoryCounts(newCounts) {
      this.chartData = {
        labels: Object.keys(newCounts),
        datasets: [
          {
            label: "Complaint Categories",
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(67, 67, 67, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              // Add more colors as needed
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(67, 67, 67, 1)",
              "rgba(153, 102, 255, 1)",
              // Add more colors as needed
            ],
            data: Object.values(newCounts),
          },
        ],
      };
    },
  },
};
</script>
