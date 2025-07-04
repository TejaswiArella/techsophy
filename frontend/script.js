async function sendData() {
    const button = document.getElementById('analyzeBtn');
    const resultDiv = document.getElementById('result');
    const input = document.getElementById('jsonInput').value;
  
    button.disabled = true;
    button.classList.add('loading');
    resultDiv.innerHTML = '';
  
    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employees: JSON.parse(input) }),
      });
  
      const data = await response.json();
      displayResults(data);
    } catch (err) {
      resultDiv.innerHTML = `
        <div style="color: #dc2626; font-weight: 500;">
          Error: Invalid JSON input or server error. Please check your input and try again.
        </div>
      `;
      console.error(err);
    } finally {
      button.disabled = false;
      button.classList.remove('loading');
    }
  }
  
  function displayResults(data) {
    const resultDiv = document.getElementById('result');
    let html = '<h2 style="margin-bottom: 1rem;">Analysis Results</h2>';
  
    // Summary Table
    html += `
      <table class="summary-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Risk Level</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
    `;
  
    data.forEach(employee => {
      const riskClass = employee.risk_level === 'High' ? 'risk-high' :
                       employee.risk_level === 'Medium' ? 'risk-medium' : 'risk-low';
      html += `
        <tr>
          <td>${employee.employee_id}</td>
          <td>${employee.name || 'N/A'}</td>
          <td class="${riskClass}">${employee.risk_level || 'N/A'}</td>
          <td>
            <button onclick="toggleDetails('${employee.employee_id}')" style="background: none; border: none; color: #3b82f6; cursor: pointer;">
              View
            </button>
          </td>
        </tr>
      `;
    });
  
    html += '</tbody></table>';
  
    // Detailed Results
    data.forEach(employee => {
      const riskClass = employee.risk_level === 'High' ? 'risk-high' :
                        employee.risk_level === 'Medium' ? 'risk-medium' : 'risk-low';
      html += `
        <div id="details-${employee.employee_id}" class="employee-details" style="display: none;">
          <h3>${employee.name || 'N/A'} (ID: ${employee.employee_id})</h3>
          <p><strong>Risk Level:</strong> <span class="${riskClass}">${employee.risk_level || 'N/A'}</span></p>
          <p><strong>Blood Pressure:</strong> ${employee.bp || 'N/A'} mmHg</p>
          <p><strong>Heart Rate:</strong> ${employee.heart_rate || 'N/A'} bpm</p>
          <p><strong>Stress Level:</strong> ${employee.stress_level || 'N/A'} /10</p>
          <p><strong>Activity Level:</strong> ${employee.activity_level || 'N/A'}</p>
          <p><strong>Recommendation:</strong> ${employee.recommendation || 'N/A'}</p>
        </div>
      `;
    });
  
    resultDiv.innerHTML = html;
  }
  
  function toggleDetails(id) {
    const div = document.getElementById(`details-${id}`);
    if (div) {
      div.style.display = div.style.display === 'none' ? 'block' : 'none';
    }
  }