// ================= IoT Section Interactive Utilities =================

document.addEventListener('DOMContentLoaded', () => {
  setupCopyButtons();
  setupSimulationWidgets();
  setupChecklistPersistence();
});

// ---- Copy Code snippet to clipboard ----
function setupCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const codeBox = btn.closest('.code-box');
      if (!codeBox) return;
      const codeEl = codeBox.querySelector('pre code');
      if (!codeEl) return;

      try {
        await navigator.clipboard.writeText(codeEl.textContent);
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.color = 'var(--emerald)';
        btn.style.borderColor = 'var(--emerald)';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.color = '';
          btn.style.borderColor = '';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code: ', err);
      }
    });
  });
}

// ---- Interactive Simulations for Evidence Stations ----
function setupSimulationWidgets() {
  // Task 1: ESP32 Web Server LED Interactive Demo
  const ledToggleBtn = document.getElementById('simLedToggle');
  const ledIndicator = document.getElementById('simLedIndicator');
  const ledStateText = document.getElementById('simLedStateText');

  if (ledToggleBtn && ledIndicator && ledStateText) {
    let isOn = false;
    ledToggleBtn.addEventListener('click', () => {
      isOn = !isOn;
      if (isOn) {
        ledIndicator.style.background = '#00ff88';
        ledIndicator.style.boxShadow = '0 0 20px #00ff88, 0 0 40px #00ff88';
        ledStateText.textContent = 'HIGH (3.3V) — LED IS ON';
        ledStateText.style.color = '#00ff88';
        ledToggleBtn.textContent = 'Send HTTP GET /L (Turn OFF)';
        ledToggleBtn.style.background = '#ff4757';
      } else {
        ledIndicator.style.background = '#222738';
        ledIndicator.style.boxShadow = 'none';
        ledStateText.textContent = 'LOW (0V) — LED IS OFF';
        ledStateText.style.color = 'var(--ink-muted)';
        ledToggleBtn.textContent = 'Send HTTP GET /H (Turn ON)';
        ledToggleBtn.style.background = 'var(--cyan)';
      }
    });
  }

  // Task 5: Interactive CSV Downloader Demo
  const csvDownloadBtn = document.getElementById('btnDownloadCsvSim');
  if (csvDownloadBtn) {
    csvDownloadBtn.addEventListener('click', () => {
      const csvData = `Timestamp,Temperature_C,Humidity_Pct,LDR_Raw,Bulb_State,Mode
2026-10-08 09:00:15,27.4,62.1,1850,OFF,AUTOMATIC
2026-10-08 09:00:45,27.5,61.8,1810,OFF,AUTOMATIC
2026-10-08 09:01:15,27.6,62.0,1720,OFF,AUTOMATIC
2026-10-08 09:01:45,27.8,61.5,1420,OFF,AUTOMATIC
2026-10-08 09:02:15,28.0,60.9,1180,ON,AUTOMATIC
2026-10-08 09:02:45,28.1,60.5,1050,ON,AUTOMATIC
2026-10-08 09:03:15,28.0,60.8,920,ON,AUTOMATIC
2026-10-08 09:03:45,27.9,61.2,1250,ON,AUTOMATIC`;

      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'iot_telemetry_logs_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }
}

// ---- Checklist Interactivity ----
function setupChecklistPersistence() {
  document.querySelectorAll('.check-item').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const icon = item.querySelector('.box-done');
      if (icon) {
        if (icon.textContent === '☑') {
          icon.textContent = '☐';
          icon.style.color = 'var(--ink-muted)';
        } else {
          icon.textContent = '☑';
          icon.style.color = 'var(--emerald)';
        }
      }
    });
  });
}
