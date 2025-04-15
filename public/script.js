function calculatePercentageChange(current, previous) {
  return ((current - previous) / previous) * 100;
}

function getDominantPoints(data, threshold = 130) {
  return data.map(value => value >= threshold);
}

fetch('/data.json')
  .then(res => res.json())
  .then(data => {
    const labels = data.map(d => d.date);
    const usdData = data.map(d => d.USD);
    const dominantPoints = getDominantPoints(usdData, 130);
    const percentageChange = usdData.map((usd, i) =>
      i === 0 ? 0 : calculatePercentageChange(usd, usdData[i - 1])
    );
    const latestUSD = usdData[usdData.length - 1];
    const previousUSD = usdData[usdData.length - 2];
    const latestPercentageChange = calculatePercentageChange(latestUSD, previousUSD);
    document.getElementById("usd-value").textContent = `$${latestUSD.toFixed(2)}`;
    const pctElem = document.getElementById("percentage-change");
    if (latestPercentageChange > 0) {
      pctElem.textContent = `+${latestPercentageChange.toFixed(2)}%`;
      pctElem.classList.add("positive");
      pctElem.classList.remove("negative");
    } else {
      pctElem.textContent = `${latestPercentageChange.toFixed(2)}%`;
      pctElem.classList.add("negative");
      pctElem.classList.remove("positive");
    }
    document.getElementById("update-time").textContent = `Updated: ${new Date().toLocaleString()}`;

    new Chart(document.getElementById("usdChart"), {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "USD Mined",
          data: usdData,
          borderColor: "#00fff7",
          backgroundColor: "rgba(0,255,247,0.2)",
          fill: true,
          pointStyle: 'circle',
          pointRadius: ctx => dominantPoints[ctx.dataIndex] ? 8 : 4,
          pointHoverRadius: 10,
          pointBorderColor: "#00fff7",
          pointBackgroundColor: ctx => dominantPoints[ctx.dataIndex] ? "#ff00ff" : "#00fff7"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            backgroundColor: '#111',
            titleColor: '#00fff7',
            bodyColor: '#00fff7',
            borderColor: '#00fff7',
            borderWidth: 1,
            titleFont: { size: 14 },
            bodyFont: { size: 18 },
            padding: 12
          },
          legend: { labels: { color: '#00fff7' } }
        },
        scales: {
          x: { ticks: { color: '#00fff7' } },
          y: { ticks: { color: '#00fff7' } }
        }
      }
    });

    new Chart(document.getElementById("coinChart"), {
      type: "bar",
      data: {
        labels,
        datasets: [
          { 
            label: "BTC", 
            data: data.map(d => d.BTC * d.BTC_usd), // Mined amount * BTC USD price
            backgroundColor: "#FFA500"
          },
          { 
            label: "LTC", 
            data: data.map(d => d.LTC * d.LTC_usd), // Mined amount * LTC USD price
            backgroundColor: "#bebebe"
          },
          { 
            label: "DOGE", 
            data: data.map(d => d.DOGE * d.DOGE_usd), // Mined amount * DOGE USD price
            backgroundColor: "#D2B48C"
          },
          { 
            label: "KAS", 
            data: data.map(d => d.KAS * d.KAS_usd), // Mined amount * KAS USD price
            backgroundColor: "#4ad6ff"
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            backgroundColor: '#111',
            titleColor: '#00fff7',
            bodyColor: '#00fff7',
            borderColor: '#00fff7',
            borderWidth: 1,
            titleFont: { size: 14 },
            bodyFont: { size: 18 },
            padding: 12
          },
          legend: { labels: { color: '#00fff7' } }
        },
        scales: {
          x: { ticks: { color: '#00fff7' } },
          y: {
            ticks: {
              color: '#00fff7',
              callback: function(value) {
                return `$${value.toFixed(2)}`; // Format the y-axis as USD
              }
            }
          }
        }
      }
    });
  });

document.getElementById('toggle-button').addEventListener('click', () => {
  const liveRates = document.getElementById('live-rates');
  const toggleButton = document.getElementById('toggle-button');

  const isHidden = liveRates.style.display === 'none';

  liveRates.style.display = isHidden ? 'block' : 'none';
  toggleButton.textContent = isHidden ? 'Hide' : 'Show';
  toggleButton.classList.toggle('shrink', !isHidden);
});

