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

    // 👑 Crown plugin for all-time high annotation
    const crownPlugin = {
      id: 'crownPlugin',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        const index = chart.data.labels.indexOf('2025-04-12');
        if (index === -1) return;

        const meta = chart.getDatasetMeta(0);
        const point = meta.data[index];
        if (!point) return;

        const x = point.x;
        const y = point.y;

        ctx.save();
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('👑', x, y - 25);
        ctx.font = '12px sans-serif';
        ctx.fillText('All-Time High', x, y - 40);
        ctx.restore();
      }
    };

    // USD Line Chart
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
      },
      plugins: [crownPlugin]
    });

    // Coin Bar Chart
    new Chart(document.getElementById("coinChart"), {
      type: "bar",
      data: {
        labels,
        datasets: [
          { 
            label: "BTC", 
            data: data.map(d => d.BTC * d.BTC_usd),
            backgroundColor: "#FFA500"
          },
          { 
            label: "LTC", 
            data: data.map(d => d.LTC * d.LTC_usd),
            backgroundColor: "#bebebe"
          },
          { 
            label: "DOGE", 
            data: data.map(d => d.DOGE * d.DOGE_usd),
            backgroundColor: "#D2B48C"
          },
          { 
            label: "KAS", 
            data: data.map(d => d.KAS * d.KAS_usd),
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
                return `$${value.toFixed(2)}`;
              }
            }
          }
        }
      }
    });
  });
