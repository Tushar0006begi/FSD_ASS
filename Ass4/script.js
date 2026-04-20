document.addEventListener("DOMContentLoaded", function () {
  const weatherData = {
    mumbai: {
      name: "Mumbai",
      insight: "Humid coastal conditions",
      advice: [
        "Carry a light umbrella because rainfall chances stay active.",
        "Prefer breathable clothing due to consistently high humidity.",
        "Sea breeze keeps evenings more comfortable than afternoons."
      ],
      weekly: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        temperature: [31, 32, 30, 29, 31, 33, 32],
        humidity: [78, 80, 76, 82, 79, 75, 77],
        rainfall: [12, 16, 10, 19, 15, 13, 11],
        wind: [18, 21, 17, 23, 20, 19, 18]
      },
      monthly: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        temperature: [27, 28, 30, 32, 33, 30],
        humidity: [61, 63, 67, 72, 78, 84],
        rainfall: [2, 1, 3, 8, 25, 112],
        wind: [13, 15, 16, 18, 21, 26]
      }
    },
    delhi: {
      name: "Delhi",
      insight: "Dry air with strong temperature swings",
      advice: [
        "Hydration matters more here because humidity is low.",
        "Outdoor plans are best in the morning before heat builds up.",
        "Dust and wind can rise together on hotter days."
      ],
      weekly: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        temperature: [27, 29, 30, 31, 28, 26, 27],
        humidity: [44, 40, 38, 36, 41, 46, 48],
        rainfall: [0, 1, 0, 2, 0, 0, 1],
        wind: [12, 15, 14, 18, 16, 13, 12]
      },
      monthly: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        temperature: [14, 18, 24, 31, 36, 39],
        humidity: [68, 55, 42, 30, 24, 34],
        rainfall: [19, 17, 9, 4, 12, 38],
        wind: [9, 11, 13, 16, 19, 21]
      }
    },
    bengaluru: {
      name: "Bengaluru",
      insight: "Mild temperatures with balanced moisture",
      advice: [
        "Conditions stay pleasant enough for commuting and walking.",
        "Short showers can appear quickly, especially later in the day.",
        "Layered clothing works well because mornings feel cooler."
      ],
      weekly: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        temperature: [24, 25, 24, 23, 24, 26, 25],
        humidity: [66, 64, 68, 71, 69, 63, 65],
        rainfall: [4, 6, 5, 9, 7, 3, 2],
        wind: [10, 12, 11, 13, 12, 9, 8]
      },
      monthly: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        temperature: [22, 24, 27, 29, 28, 25],
        humidity: [52, 49, 46, 54, 62, 70],
        rainfall: [1, 2, 5, 18, 74, 96],
        wind: [8, 9, 11, 13, 15, 14]
      }
    }
  };

  const citySelect = document.getElementById("citySelect");
  const rangeButtons = document.querySelectorAll(".range-btn");
  const statTargets = {
    avgTemp: document.getElementById("avgTemp"),
    avgHumidity: document.getElementById("avgHumidity"),
    totalRainfall: document.getElementById("totalRainfall"),
    peakWind: document.getElementById("peakWind")
  };
  const heroCity = document.getElementById("heroCity");
  const heroInsight = document.getElementById("heroInsight");
  const lastUpdated = document.getElementById("lastUpdated");
  const feelsLike = document.getElementById("feelsLike");
  const comfortIndex = document.getElementById("comfortIndex");
  const summaryText = document.getElementById("summaryText");
  const adviceList = document.getElementById("adviceList");
  const forecastTargets = {
    oneLabel: document.getElementById("dayOneLabel"),
    oneTemp: document.getElementById("dayOneTemp"),
    oneText: document.getElementById("dayOneText"),
    twoLabel: document.getElementById("dayTwoLabel"),
    twoTemp: document.getElementById("dayTwoTemp"),
    twoText: document.getElementById("dayTwoText"),
    threeLabel: document.getElementById("dayThreeLabel"),
    threeTemp: document.getElementById("dayThreeTemp"),
    threeText: document.getElementById("dayThreeText")
  };

  let currentCity = "mumbai";
  let currentRange = "weekly";

  const sharedTickColor = "#cbd5e1";
  const gridColor = "rgba(148, 163, 184, 0.14)";

  const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: sharedTickColor
        }
      }
    }
  };

  const tempChart = new Chart(document.getElementById("tempChart"), {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Temperature (°C)",
        data: [],
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56, 189, 248, 0.18)",
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.35
      }]
    },
    options: {
      ...chartDefaults,
      scales: {
        x: {
          ticks: { color: sharedTickColor },
          grid: { color: gridColor }
        },
        y: {
          ticks: { color: sharedTickColor },
          grid: { color: gridColor }
        }
      }
    }
  });

  const humidityChart = new Chart(document.getElementById("humidityChart"), {
    type: "bar",
    data: {
      labels: [],
      datasets: [{
        label: "Humidity (%)",
        data: [],
        backgroundColor: ["#22c55e", "#16a34a", "#4ade80", "#15803d", "#34d399", "#22c55e", "#86efac"]
      }]
    },
    options: {
      ...chartDefaults,
      scales: {
        x: {
          ticks: { color: sharedTickColor },
          grid: { display: false }
        },
        y: {
          ticks: { color: sharedTickColor },
          grid: { color: gridColor }
        }
      }
    }
  });

  const rainChart = new Chart(document.getElementById("rainChart"), {
    type: "doughnut",
    data: {
      labels: [],
      datasets: [{
        label: "Rainfall (mm)",
        data: [],
        backgroundColor: ["#60a5fa", "#38bdf8", "#818cf8", "#f59e0b", "#f97316", "#ef4444", "#14b8a6"],
        borderWidth: 0
      }]
    },
    options: {
      ...chartDefaults,
      cutout: "62%"
    }
  });

  const windChart = new Chart(document.getElementById("windChart"), {
    type: "radar",
    data: {
      labels: [],
      datasets: [{
        label: "Wind Speed (km/h)",
        data: [],
        borderColor: "#fb7185",
        backgroundColor: "rgba(251, 113, 133, 0.24)",
        pointBackgroundColor: "#fecdd3",
        pointBorderColor: "#fb7185",
        borderWidth: 2
      }]
    },
    options: {
      ...chartDefaults,
      scales: {
        r: {
          angleLines: { color: gridColor },
          grid: { color: gridColor },
          pointLabels: { color: sharedTickColor },
          ticks: {
            color: "#0f172a",
            backdropColor: "#cbd5e1"
          }
        }
      }
    }
  });

  function average(values) {
    const total = values.reduce(function (sum, value) {
      return sum + value;
    }, 0);
    return total / values.length;
  }

  function sum(values) {
    return values.reduce(function (accumulator, value) {
      return accumulator + value;
    }, 0);
  }

  function calculateFeelsLike(avgTempValue, avgHumidityValue) {
    return avgTempValue + (avgHumidityValue - 50) / 12;
  }

  function getComfortLabel(avgTempValue, avgHumidityValue, peakWindValue) {
    if (avgTempValue <= 26 && avgHumidityValue <= 70 && peakWindValue <= 18) {
      return "Comfortable";
    }
    if (avgTempValue >= 32 || avgHumidityValue >= 80) {
      return "Sticky";
    }
    if (peakWindValue >= 22) {
      return "Windy";
    }
    return "Moderate";
  }

  function getForecastText(tempValue, rainValue, windValue) {
    if (rainValue >= 15) {
      return "High rain chance with damp roads.";
    }
    if (windValue >= 20) {
      return "Breezy conditions expected.";
    }
    if (tempValue >= 32) {
      return "Warm and bright through the day.";
    }
    return "Stable weather with light variation.";
  }

  function updateStats(dataset) {
    const avgTempValue = average(dataset.temperature);
    const avgHumidityValue = average(dataset.humidity);
    const totalRainfallValue = sum(dataset.rainfall);
    const peakWindValue = Math.max.apply(null, dataset.wind);

    statTargets.avgTemp.textContent = avgTempValue.toFixed(1) + "°C";
    statTargets.avgHumidity.textContent = Math.round(avgHumidityValue) + "%";
    statTargets.totalRainfall.textContent = totalRainfallValue + " mm";
    statTargets.peakWind.textContent = peakWindValue + " km/h";

    feelsLike.textContent = calculateFeelsLike(avgTempValue, avgHumidityValue).toFixed(1) + "°C";
    comfortIndex.textContent = getComfortLabel(avgTempValue, avgHumidityValue, peakWindValue);
  }

  function updateNarrative(cityData, dataset) {
    const cityName = cityData.name;
    const avgTempValue = average(dataset.temperature).toFixed(1);
    const avgHumidityValue = Math.round(average(dataset.humidity));
    const totalRainfallValue = sum(dataset.rainfall);
    const peakWindValue = Math.max.apply(null, dataset.wind);

    heroCity.textContent = cityName;
    heroInsight.textContent = cityData.insight;
    lastUpdated.textContent = new Date().toLocaleString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      day: "numeric",
      month: "short"
    });

    summaryText.textContent =
      cityName +
      " shows an average temperature of " +
      avgTempValue +
      "°C with humidity around " +
      avgHumidityValue +
      "%. Total rainfall for the selected " +
      currentRange +
      " view is " +
      totalRainfallValue +
      " mm, while wind peaks at " +
      peakWindValue +
      " km/h. Overall, the pattern suggests " +
      cityData.insight.toLowerCase() +
      ".";

    adviceList.innerHTML = "";
    cityData.advice.forEach(function (item) {
      const li = document.createElement("li");
      li.textContent = item;
      adviceList.appendChild(li);
    });
  }

  function updateForecast(dataset) {
    const count = dataset.labels.length;
    const indexList = [0, Math.floor((count - 1) / 2), count - 1];
    const targets = [
      [forecastTargets.oneLabel, forecastTargets.oneTemp, forecastTargets.oneText],
      [forecastTargets.twoLabel, forecastTargets.twoTemp, forecastTargets.twoText],
      [forecastTargets.threeLabel, forecastTargets.threeTemp, forecastTargets.threeText]
    ];

    indexList.forEach(function (dataIndex, position) {
      const entry = targets[position];
      entry[0].textContent = dataset.labels[dataIndex];
      entry[1].textContent = dataset.temperature[dataIndex] + "°C";
      entry[2].textContent = getForecastText(
        dataset.temperature[dataIndex],
        dataset.rainfall[dataIndex],
        dataset.wind[dataIndex]
      );
    });
  }

  function updateCharts() {
    const cityData = weatherData[currentCity];
    const dataset = cityData[currentRange];
    const cityName = cityData.name;

    tempChart.data.labels = dataset.labels;
    tempChart.data.datasets[0].data = dataset.temperature;
    tempChart.data.datasets[0].label = cityName + " Temperature (°C)";

    humidityChart.data.labels = dataset.labels;
    humidityChart.data.datasets[0].data = dataset.humidity;
    humidityChart.data.datasets[0].label = cityName + " Humidity (%)";

    rainChart.data.labels = dataset.labels;
    rainChart.data.datasets[0].data = dataset.rainfall;
    rainChart.data.datasets[0].label = cityName + " Rainfall (mm)";

    windChart.data.labels = dataset.labels;
    windChart.data.datasets[0].data = dataset.wind;
    windChart.data.datasets[0].label = cityName + " Wind Speed (km/h)";

    tempChart.update();
    humidityChart.update();
    rainChart.update();
    windChart.update();

    updateStats(dataset);
    updateNarrative(cityData, dataset);
    updateForecast(dataset);
  }

  citySelect.addEventListener("change", function (event) {
    currentCity = event.target.value;
    updateCharts();
  });

  rangeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      currentRange = button.dataset.range;
      rangeButtons.forEach(function (item) {
        item.classList.toggle("active", item === button);
      });
      updateCharts();
    });
  });

  updateCharts();
});
