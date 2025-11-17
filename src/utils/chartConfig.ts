import { ChartOptions } from 'chart.js';

export const powerChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  animation: {
    duration: 750,
    easing: 'easeInOutQuart'
  },
  scales: {
    y: {
      beginAtZero: true,
      // Remove fixed max to allow dynamic scaling based on data
      title: {
        display: true,
        text: 'Power Usage (kWh)'
      },
      ticks: {
        stepSize: 2,
        callback: function(value) {
          return value.toFixed(1) + ' kWh';
        }
      },
      // Add grace padding to show trend lines clearly
      grace: '10%'
    },
    x: {
      title: {
        display: true,
        text: 'Time'
      },
      ticks: {
        maxTicksLimit: 12,
        callback: function(value, index, values) {
          const label = this.getLabelForValue(value as number);
          return label.split(' ')[0]; // Show only time, not date
        }
      }
    }
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'end',
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 12,
          weight: '500'
        }
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      cornerRadius: 8,
      titleFont: {
        size: 13,
        weight: 'bold'
      },
      bodyFont: {
        size: 12
      },
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y.toFixed(2) + ' kWh';
          }
          return label;
        }
      }
    }
  },
};