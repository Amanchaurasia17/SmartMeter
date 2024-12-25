import { ChartOptions } from 'chart.js';

export const powerChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 750,
    easing: 'easeInOutQuart'
  },
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
      max: 15, // Fixed max for stability
      title: {
        display: true,
        text: 'Power Usage (kWh)'
      },
      ticks: {
        stepSize: 3
      }
    },
    x: {
      title: {
        display: true,
        text: 'Time'
      },
      ticks: {
        maxTicksLimit: 8 // Limit number of time labels for clarity
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  },
  elements: {
    line: {
      tension: 0.4,
      borderWidth: 2
    },
    point: {
      radius: 3,
      hitRadius: 8,
      hoverRadius: 5
    }
  }
};