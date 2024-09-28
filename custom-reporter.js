const fs = require('fs');

class CustomReporter {
    constructor() {
        this.testResults = [];
    }

    onTestEnd(test, result) {
        const steps = result.steps.map(step => step.title).join(', ');
        this.testResults.push({
            name: test.title,
            steps: steps,
            status: result.status,
            duration: (result.duration / 1000).toFixed(2) + 's',
        });
    }



    generateHTMLReport() {
        const testsSummary = this.testResults.map((test, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${test.name}</td>
      <td>${test.steps}</td>
      <td>${test.status.charAt(0).toUpperCase() + test.status.slice(1)}</td>
      <td>${test.duration}</td>
    </tr>
  `).join('');

        const passed = this.testResults.filter(test => test.status === 'passed').length;
        const failed = this.testResults.filter(test => test.status === 'failed').length;
        const skipped = this.testResults.filter(test => test.status === 'skipped').length;
        const total = passed + failed + skipped;

        const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Playwright Test Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          background-color: #f9f9f9;
        }
        .header-container {
          text-align: center;
          color: #333; /* Darker text for better visibility */
          padding: 10px;
          margin-bottom: 20px;
        }
        .chart-container {
          width: 30%;
          margin: 0 auto;
        }
        canvas {
          max-width: 100%;
          height: auto;
        }
        .table-container {
          width: 100%;
          margin-top: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background-color: #fff;
          border-radius: 8px;
          overflow: hidden;
        }
        table, th, td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        th {
          background-color: #f2f2f2;
          text-align: left;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        tr:hover {
          background-color: #f1f1f1;
        }
      </style>
    </head>
    <body>

      <div class="header-container">
        <h1>Test Results Summary</h1>
        <p>Total Tests: ${total} | Passed: ${passed} | Failed: ${failed} | Skipped: ${skipped}</p>
        <div class="chart-container">
          <canvas id="donutChart"></canvas>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Test Name</th>
              <th>Steps</th>
              <th>Status</th>
              <th>Time Taken</th>
            </tr>
          </thead>
          <tbody>
            ${testsSummary}
          </tbody>
        </table>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <script>
        const ctx = document.getElementById('donutChart').getContext('2d');
        const donutChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Passed', 'Failed', 'Skipped'],
            datasets: [{
              label: 'Test Results',
              data: [${passed}, ${failed}, ${skipped}],
              backgroundColor: ['#4CAF50', '#F44336', '#FFC107'],
              hoverOffset: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      </script>
    </body>
    </html>
  `;

        fs.writeFileSync('playwright-report/test-report.html', htmlContent);
    }


    onEnd() {
        this.generateHTMLReport();
    }
}

module.exports = CustomReporter;
