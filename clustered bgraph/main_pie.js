const xValues = ["Male", "Female", "Non-Binary", "Unknown"];
const yValues = [103675, 18562, 12, 10726];
const barColors = ["#00b4d8", "#FA0089","gray","#bc6c25"];

new Chart("myChart", {
  type: "doughnut",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    title: {
      display: true,
      text: "Moma Artifacts by Gender of Artists",
      fontSize: 30
    },
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1, 
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      }
    }
  }
});
