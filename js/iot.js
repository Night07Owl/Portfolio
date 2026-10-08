// ==========================================================================
// COLOR PALETTE #62 — IoT Interactive Master Script
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  setupTaskTabSwitcher();
  setupCopyButtons();
  setupSimulationWidgets();
  setupChecklistInteractivity();
});

// ---- Smooth Tab Switching for Master Hub (iot.html) ----
function setupTaskTabSwitcher() {
  const tabButtons = document.querySelectorAll('.task-nav-btn[data-task]');
  const taskViews = document.querySelectorAll('.task-view');

  if (tabButtons.length === 0 || taskViews.length === 0) return;

  function activateTask(taskId) {
    // Update button states
    tabButtons.forEach(btn => {
      const isActive = btn.dataset.task === taskId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update view visibility
    taskViews.forEach(view => {
      const match = view.id === `view-${taskId}`;
      if (match) {
        view.style.display = 'block';
        view.style.opacity = '0';
        view.style.transform = 'translateY(6px)';
        requestAnimationFrame(() => {
          view.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          view.style.opacity = '1';
          view.style.transform = 'translateY(0)';
        });
      } else {
        view.style.display = 'none';
      }
    });

    // Sync URL hash without jumping
    if (history.replaceState) {
      history.replaceState(null, null, `#${taskId}`);
    } else {
      location.hash = taskId;
    }
  }

  // Click handler
  tabButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      activateTask(btn.dataset.task);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Initial load hash detection
  const hash = (location.hash || '').replace('#', '');
  if (['task1', 'task2', 'task3', 'task4', 'task5'].includes(hash)) {
    activateTask(hash);
  } else {
    activateTask('task1');
  }
}

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
        btn.style.background = 'var(--palette-coral)';
        btn.style.color = '#fff';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.color = '';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
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
        ledIndicator.style.background = 'var(--palette-coral)';
        ledIndicator.style.boxShadow = '0 0 20px rgba(229, 133, 123, 0.8), 0 0 40px rgba(229, 133, 123, 0.4)';
        ledStateText.textContent = 'HIGH (3.3V) — LED IS ON';
        ledStateText.style.color = 'var(--palette-coral)';
        ledToggleBtn.textContent = 'Send HTTP GET /L (Turn OFF)';
        ledToggleBtn.style.background = 'var(--palette-navy)';
      } else {
        ledIndicator.style.background = '#2B2F4A';
        ledIndicator.style.boxShadow = 'none';
        ledStateText.textContent = 'LOW (0V) — LED IS OFF';
        ledStateText.style.color = 'var(--text-muted)';
        ledToggleBtn.textContent = 'Send HTTP GET /H (Turn ON)';
        ledToggleBtn.style.background = 'var(--palette-coral)';
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
function setupChecklistInteractivity() {
  document.querySelectorAll('.check-item').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const icon = item.querySelector('.box-done');
      if (icon) {
        if (icon.textContent === '☑') {
          icon.textContent = '☐';
          icon.style.color = 'var(--text-muted)';
        } else {
          icon.textContent = '☑';
          icon.style.color = 'var(--palette-coral)';
        }
      }
    });
  });
}
