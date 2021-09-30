    window.Apex = {
  dataLabels: {
    enabled: false
  }
};

var optionsBar = {
  chart: {
    type: 'bar',
    height: 250,
    width: '100%',
    stacked: true,
    foreColor: '#999',
  },
  plotOptions: {
    bar: {
      dataLabels: {
        enabled: false
      },
      columnWidth: '75%',
      endingShape: 'rounded'
    }
  },
  colors: ["#27367f", '#fddcf4'],
  series: [{
    name: "Impression",
    data: [20, 16, 24, 28, 26, 22, 15, 5, 14, 16, 23, 29, 24, 19, 15, 10, 11, 15, 19, 23],
  }, {
    name: "Clicks",
    data: [10, 12, 14, 18, 20, 12, 5, 11, 13, 12, 22, 25, 14, 17, 12, 9, 8, 13, 18, 22],
  }],
  xaxis: {
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    crosshairs: {
      show: false
    },
    labels: {
      show: false,
      style: {
        fontSize: '14px'
      }
    },
  },
  grid: {
    xaxis: {
      lines: {
        show: false
      },
    },
    yaxis: {
      lines: {
        show: false
      },
    }
  },
  yaxis: {
    axisBorder: {
      show: false
    },
    labels: {
      show: false
    },
  },
  legend: {
    floating: true,
    position: 'top',
    horizontalAlign: 'right',
    offsetY: -36
  },
  title: {
    text: 'Web Statistics',
    align: 'left',
  },
  subtitle: {
    text: 'Impression and Clicks'
  },
  tooltip: {
    shared: true,
    intersect: false
  }

}

var chartBar = new ApexCharts(document.querySelector('.mychart'), optionsBar);
chartBar.render();


// data for the sparklines that appear below header area
var sparklineData = [47, 45, 54, 38, 56, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46];


var spark3 = {
  chart: {
    id: 'sparkline3',
    group: 'sparklines',
    type: 'area',
    height: 160,
    sparkline: {
      enabled: true
    },
  },
  stroke: {
    curve: 'straight'
  },
  fill: {
    opacity: 1,
  },
  series: [{
    name: 'Profits',
    data: sparklineData
  }],
  labels: [...Array(24).keys()].map(n => `2021-09-0${n+1}`),
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    min: 0
  },
  
  colors: ['#27367f'],
  title: {
    text: '$35,965',
    offsetX: 30,
    style: {
      fontSize: '24px',
      cssClass: 'apexcharts-yaxis-title'
    }
  },
  subtitle: {
    text: 'Profits',
    offsetX: 30,
    style: {
      fontSize: '14px',
      cssClass: 'apexcharts-yaxis-title'
    }
  }
}



new ApexCharts(document.querySelector("#spark3"), spark3).render();



