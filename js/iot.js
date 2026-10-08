// ==========================================================================
// SUDHIKSHA IOT ENGINEERING HUB — Dynamic Interactions & Sandboxes
// ==========================================================================

const TASK_META = {
  task1: {
    breadcrumb: 'Station 01: Web Server & Local Control',
    blob: 'radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, rgba(236, 72, 153, 0.2) 70%, transparent 100%)'
  },
  task2: {
    breadcrumb: 'Station 02: Adafruit IO MQTT Telemetry',
    blob: 'radial-gradient(circle, rgba(0, 242, 254, 0.6) 0%, rgba(59, 130, 246, 0.2) 70%, transparent 100%)'
  },
  task3: {
    breadcrumb: 'Station 03: IFTTT Event Automation & Webhooks',
    blob: 'radial-gradient(circle, rgba(16, 185, 129, 0.6) 0%, rgba(6, 182, 212, 0.2) 70%, transparent 100%)'
  },
  task4: {
    breadcrumb: 'Station 04: Firebase Realtime DB & Dashboard',
    blob: 'radial-gradient(circle, rgba(255, 138, 0, 0.6) 0%, rgba(239, 68, 68, 0.2) 70%, transparent 100%)'
  },
  task5: {
    breadcrumb: 'Station 05: Capstone Autonomous System & Export',
    blob: 'radial-gradient(circle, rgba(244, 63, 94, 0.6) 0%, rgba(139, 92, 246, 0.2) 70%, transparent 100%)'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  setupTaskTabSwitcher();
  setupCopyButtons();
  setupChecklistInteractivity();

  // Initialize all 5 interactive demonstration sandboxes
  setupTask1Sandbox();
  setupTask2Sandbox();
  setupTask3Sandbox();
  setupTask4Sandbox();
  setupTask5Sandbox();
});

// ==========================================================================
// 1. LEFT SIDEBAR TAB SWITCHER
// ==========================================================================
function setupTaskTabSwitcher() {
  const tabButtons = document.querySelectorAll('.task-nav-btn[data-task]');
  const taskViews = document.querySelectorAll('.task-view');
  const dynamicBlob = document.getElementById('dynamicBlob');
  const breadcrumbEl = document.getElementById('topStationBreadcrumb');

  if (tabButtons.length === 0 || taskViews.length === 0) return;

  function activateTask(taskId) {
    document.body.setAttribute('data-active-task', taskId);

    // Update dynamic background ambient blob
    if (dynamicBlob && TASK_META[taskId]) {
      dynamicBlob.style.background = TASK_META[taskId].blob;
    }

    // Update top breadcrumb
    if (breadcrumbEl && TASK_META[taskId]) {
      breadcrumbEl.textContent = TASK_META[taskId].breadcrumb;
    }

    // Update sidebar button states
    tabButtons.forEach(btn => {
      const isActive = btn.dataset.task === taskId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update view visibility with gentle fade
    taskViews.forEach(view => {
      const match = view.id === `view-${taskId}`;
      if (match) {
        view.style.display = 'block';
        view.style.opacity = '0';
        view.style.transform = 'translateY(8px)';
        requestAnimationFrame(() => {
          view.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          view.style.opacity = '1';
          view.style.transform = 'translateY(0)';
        });
      } else {
        view.style.display = 'none';
      }
    });

    // Sync URL hash
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

// ==========================================================================
// 2. TASK 1 SANDBOX: ESP32 EMBEDDED WEB SERVER LED CONTROL
// ==========================================================================
function setupTask1Sandbox() {
  const toggleBtn = document.getElementById('simLedToggle');
  const bulb = document.getElementById('simLedIndicator');
  const stateText = document.getElementById('simLedStateText');
  const voltageBadge = document.getElementById('simLedVoltage');
  const logEl = document.getElementById('simHttpLog');

  if (!toggleBtn || !bulb || !stateText) return;

  let isOn = false;

  toggleBtn.addEventListener('click', () => {
    isOn = !isOn;
    const now = new Date().toLocaleTimeString();

    if (isOn) {
      bulb.style.background = '#ec4899';
      bulb.style.boxShadow = '0 0 25px rgba(236, 72, 153, 0.9), 0 0 50px rgba(139, 92, 246, 0.5)';
      bulb.style.borderColor = '#f472b6';
      stateText.textContent = 'HIGH (3.3V) — LED IS ON';
      stateText.style.color = '#f472b6';
      if (voltageBadge) voltageBadge.textContent = '3.30V Logic (HIGH)';
      toggleBtn.textContent = '⚡ Send HTTP GET /L (Turn LED OFF)';
      toggleBtn.style.background = 'linear-gradient(135deg, #4b5563, #374151)';

      if (logEl) {
        logEl.textContent = `[${now}] CLIENT: 192.168.1.102 -> GET /H HTTP/1.1
[${now}] SERVER: Parsed command 'GET /H'
[${now}] GPIO 2: State changed LOW -> HIGH (3.30V)
[${now}] RESP: HTTP/1.1 200 OK (Content-Length: 148 bytes)
[${now}] RTT: 18ms (Local Wi-Fi LAN)`;
      }
    } else {
      bulb.style.background = '#1c1c24';
      bulb.style.boxShadow = 'none';
      bulb.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      stateText.textContent = 'LOW (0V) — LED IS OFF';
      stateText.style.color = 'var(--text-muted)';
      if (voltageBadge) voltageBadge.textContent = '0.00V Logic (LOW)';
      toggleBtn.textContent = '⚡ Send HTTP GET /H (Turn LED ON)';
      toggleBtn.style.background = 'var(--t1-gradient)';

      if (logEl) {
        logEl.textContent = `[${now}] CLIENT: 192.168.1.102 -> GET /L HTTP/1.1
[${now}] SERVER: Parsed command 'GET /L'
[${now}] GPIO 2: State changed HIGH -> LOW (0.00V)
[${now}] RESP: HTTP/1.1 200 OK (Content-Length: 148 bytes)
[${now}] RTT: 14ms (Local Wi-Fi LAN)`;
      }
    }
  });
}

// ==========================================================================
// 3. TASK 2 SANDBOX: ADAFRUIT IO CLOUD MQTT PUBLISHER
// ==========================================================================
function setupTask2Sandbox() {
  const slider = document.getElementById('simMqttSlider');
  const valDisplay = document.getElementById('simMqttVal');
  const publishBtn = document.getElementById('btnPublishMqtt');
  const feedOutput = document.getElementById('mqttFeedOutput');

  if (slider && valDisplay) {
    slider.addEventListener('input', () => {
      valDisplay.textContent = `${parseFloat(slider.value).toFixed(1)} °C`;
    });
  }

  if (publishBtn && feedOutput) {
    publishBtn.addEventListener('click', () => {
      const val = slider ? parseFloat(slider.value).toFixed(1) : '28.5';
      const now = new Date().toLocaleTimeString();

      feedOutput.textContent = `[${now}] PUB: night07owl/feeds/temperature -> ${val} °C
[${now}] TCP: io.adafruit.com:1883 | Packet Size: 18 bytes
[${now}] ACK: Broker received QoS 0 message
[${now}] DASH: Adafruit IO gauge component updated instantly!`;
      
      publishBtn.textContent = '✅ Published to Adafruit IO!';
      setTimeout(() => {
        publishBtn.textContent = '🚀 Publish MQTT Packet to Adafruit IO';
      }, 1500);
    });
  }
}

// ==========================================================================
// 4. TASK 3 SANDBOX: IFTTT EVENT AUTOMATION & NOTIFICATION
// ==========================================================================
function setupTask3Sandbox() {
  const triggerBtn = document.getElementById('btnTriggerIfttt');
  const eventSelect = document.getElementById('simIftttEvent');
  const notifCard = document.getElementById('simPhoneNotification');
  const notifTitle = document.getElementById('simPhoneTitle');
  const notifMsg = document.getElementById('simPhoneMsg');

  if (!triggerBtn || !notifCard) return;

  triggerBtn.addEventListener('click', () => {
    const selected = eventSelect ? eventSelect.value : 'temp_alarm';
    const now = new Date().toLocaleTimeString();

    if (selected === 'temp_alarm') {
      if (notifTitle) notifTitle.textContent = '🚨 Overheat Warning (Temp > 35°C)';
      if (notifMsg) notifMsg.textContent = `[${now}] Sensor node ESP32-DEV-01 exceeded calibrated limit. Auto-fan relay triggered.`;
    } else if (selected === 'intruder_alert') {
      if (notifTitle) notifTitle.textContent = '🚪 Perimeter Breach Detected';
      if (notifMsg) notifMsg.textContent = `[${now}] Hall effect magnetic sensor OPEN on Forge Station Lab door.`;
    } else {
      if (notifTitle) notifTitle.textContent = '💧 Water Leak Alert';
      if (notifMsg) notifMsg.textContent = `[${now}] Liquid detected on PCB ground basin (ADC: 382). Power cut safely.`;
    }

    // Pop-in animation
    notifCard.style.transform = 'scale(0.96)';
    notifCard.style.borderColor = 'var(--t3-accent)';
    notifCard.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.4)';
    
    setTimeout(() => {
      notifCard.style.transform = 'scale(1)';
    }, 150);

    triggerBtn.textContent = '📲 Webhook Dispatched & Delivered!';
    setTimeout(() => {
      triggerBtn.textContent = '📲 Dispatch Webhook & Receive Phone Alert';
    }, 1800);
  });
}

// ==========================================================================
// 5. TASK 4 SANDBOX: FIREBASE REALTIME DB SYNC
// ==========================================================================
function setupTask4Sandbox() {
  const slider = document.getElementById('simFirebaseSlider');
  const valDisplay = document.getElementById('simFirebaseVal');
  const relayBtn = document.getElementById('simFirebaseRelay');
  const jsonPreview = document.getElementById('simFirebaseJson');

  let relayState = false;

  function updateJson() {
    if (!jsonPreview) return;
    const humidity = slider ? slider.value : 65;
    const now = new Date().toISOString();

    jsonPreview.textContent = JSON.stringify({
      forge_station_04: {
        telemetry: {
          humidity_pct: parseInt(humidity, 10),
          temperature_c: 27.8,
          status: "ONLINE",
          last_sync: now
        },
        actuators: {
          relay_powered: relayState,
          mode: relayState ? "ACTIVE_POWER" : "STANDBY"
        }
      }
    }, null, 2);
  }

  if (slider && valDisplay) {
    slider.addEventListener('input', () => {
      valDisplay.textContent = `${slider.value} % RH`;
      updateJson();
    });
  }

  if (relayBtn) {
    relayBtn.addEventListener('click', () => {
      relayState = !relayState;
      if (relayState) {
        relayBtn.textContent = 'RELAY ON (3.3V)';
        relayBtn.style.background = '#ff8a00';
        relayBtn.style.color = '#050505';
      } else {
        relayBtn.textContent = 'RELAY OFF';
        relayBtn.style.background = '#252836';
        relayBtn.style.color = 'var(--text-muted)';
      }
      updateJson();
    });
  }
}

// ==========================================================================
// 6. TASK 5 SANDBOX: HYSTERESIS & CSV DOWNLOAD
// ==========================================================================
function setupTask5Sandbox() {
  const slider = document.getElementById('simLightSlider');
  const valDisplay = document.getElementById('simLightVal');
  const relayStateEl = document.getElementById('simRelayState');
  const bandStatusEl = document.getElementById('simHysteresisStatus');
  const csvBtn = document.getElementById('btnDownloadCsvSim');
  const logEl = document.getElementById('simCsvLog');

  let isRelayOn = false;

  if (slider && valDisplay) {
    slider.addEventListener('input', () => {
      const light = parseInt(slider.value, 10);
      valDisplay.textContent = `${light} Raw ADC (${light < 1200 ? 'Dark' : light > 1500 ? 'Bright' : 'Deadband'})`;

      // Software Hysteresis Algorithm
      if (light < 1200) {
        isRelayOn = true;
        if (relayStateEl) {
          relayStateEl.textContent = 'ON (ENERGIZED — LOW LIGHT)';
          relayStateEl.style.color = '#34d399';
        }
        if (bandStatusEl) bandStatusEl.textContent = 'Zone: Below 1200 (Turn ON Triggered)';
      } else if (light > 1500) {
        isRelayOn = false;
        if (relayStateEl) {
          relayStateEl.textContent = 'OFF (DE-ENERGIZED — BRIGHT)';
          relayStateEl.style.color = '#f43f5e';
        }
        if (bandStatusEl) bandStatusEl.textContent = 'Zone: Above 1500 (Turn OFF Triggered)';
      } else {
        // In the deadband zone (1200 - 1500)
        if (bandStatusEl) {
          bandStatusEl.textContent = `Zone: In 300pt Deadband (${isRelayOn ? 'Holding ON' : 'Holding OFF'} — Chatter Blocked)`;
        }
      }

      if (logEl) {
        logEl.textContent = `[HYSTERESIS] Reading: ${light} ADC | Thresholds: [1200, 1500]
[DECISION]   Relay output: ${isRelayOn ? 'HIGH (1)' : 'LOW (0)'} | Chatter: SUPPRESSED
[CSV STREAM] Buffered 1 row to flash memory ring-buffer`;
      }
    });
  }

  // Client-side CSV Download
  if (csvBtn) {
    csvBtn.addEventListener('click', () => {
      const csvData = `Timestamp,Temperature_C,Humidity_Pct,LDR_Raw,Bulb_State,Mode,Deadband_Status
2026-10-08 09:00:15,27.4,62.1,1850,OFF,AUTOMATIC,STABLE_BRIGHT
2026-10-08 09:00:45,27.5,61.8,1810,OFF,AUTOMATIC,STABLE_BRIGHT
2026-10-08 09:01:15,27.6,62.0,1720,OFF,AUTOMATIC,STABLE_BRIGHT
2026-10-08 09:01:45,27.8,61.5,1420,OFF,AUTOMATIC,IN_DEADBAND_HELD_OFF
2026-10-08 09:02:15,28.0,60.9,1180,ON,AUTOMATIC,TRIGGERED_ON
2026-10-08 09:02:45,28.1,60.5,1240,ON,AUTOMATIC,IN_DEADBAND_HELD_ON
2026-10-08 09:03:15,28.0,60.8,1490,ON,AUTOMATIC,IN_DEADBAND_HELD_ON
2026-10-08 09:03:45,27.9,61.2,1540,OFF,AUTOMATIC,TRIGGERED_OFF`;

      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'capstone_telemetry_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }
}

// ==========================================================================
// 7. COMMON UTILITIES: COPY BUTTONS & CHECKLIST
// ==========================================================================
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
        btn.style.background = 'var(--purple-primary)';
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

function setupChecklistInteractivity() {
  document.querySelectorAll('.check-item').forEach(item => {
    item.addEventListener('click', () => {
      const icon = item.querySelector('.box-done');
      if (icon) {
        if (icon.textContent === '☑') {
          icon.textContent = '☐';
          icon.style.opacity = '0.35';
        } else {
          icon.textContent = '☑';
          icon.style.opacity = '1';
        }
      }
    });
  });
}
