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
    breadcrumb: 'Station 03: IFTTT + Adafruit IO IoT Automation',
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
// 2. TASK 1 SANDBOX: ESP32 EMBEDDED WEB SERVER LED CONTROL (PORT 80)
// ==========================================================================
function setupTask1Sandbox() {
  const btnOn = document.getElementById('btnWebOn');
  const btnOff = document.getElementById('btnWebOff');
  const btnBack = document.getElementById('btnWebBack');
  const urlEl = document.getElementById('simBrowserUrl');
  const headingEl = document.getElementById('simWebHeading');
  const btnRow = document.getElementById('simWebBtnRow');
  const virtualBlueLed = document.getElementById('simVirtualBlueLed');
  const blueLedLabel = document.getElementById('simBlueLedLabel');
  const voltageBadge = document.getElementById('simLedVoltage');
  const logEl = document.getElementById('simHttpLog');

  if (!btnOn || !btnOff || !btnBack) return;

  function setLedState(isOn) {
    const now = new Date().toLocaleTimeString();

    if (isOn) {
      if (urlEl) urlEl.textContent = '192.168.56.202/on';
      if (headingEl) {
        headingEl.textContent = 'LED is ON';
        headingEl.style.color = '#111111';
      }
      if (btnRow) btnRow.style.display = 'none';
      if (btnBack) btnBack.style.display = 'inline-block';

      if (virtualBlueLed) virtualBlueLed.classList.add('lit');
      if (blueLedLabel) {
        blueLedLabel.textContent = 'GPIO 2 (HIGH / ON)';
        blueLedLabel.style.color = '#60a5fa';
      }
      if (voltageBadge) {
        voltageBadge.textContent = '3.30V Logic (HIGH)';
        voltageBadge.style.color = '#60a5fa';
        voltageBadge.style.borderColor = '#3b82f6';
      }

      if (logEl) {
        logEl.textContent = `[${now}] CLIENT: 192.168.56.105 -> GET /on HTTP/1.1
[${now}] SERVER: Route matched -> handleLEDOn()
[${now}] GPIO 2: digitalWrite(2, HIGH) -> Logic 3.30V (15mA)
[${now}] ONBOARD: Blue SMD LED illuminated
[${now}] RESP: HTTP/1.1 200 OK (Content-Type: text/html)
[${now}] BODY: <h1>LED is ON</h1><a href='/'>Back</a>
[${now}] RTT: 9ms (protosem Wi-Fi LAN)`;
      }
    } else {
      if (urlEl) urlEl.textContent = '192.168.56.202/off';
      if (headingEl) {
        headingEl.textContent = 'LED is OFF';
        headingEl.style.color = '#111111';
      }
      if (btnRow) btnRow.style.display = 'none';
      if (btnBack) btnBack.style.display = 'inline-block';

      if (virtualBlueLed) virtualBlueLed.classList.remove('lit');
      if (blueLedLabel) {
        blueLedLabel.textContent = 'GPIO 2 (LOW / OFF)';
        blueLedLabel.style.color = 'var(--text-secondary)';
      }
      if (voltageBadge) {
        voltageBadge.textContent = '0.00V Logic (LOW)';
        voltageBadge.style.color = 'var(--text-muted)';
        voltageBadge.style.borderColor = 'var(--border-subtle)';
      }

      if (logEl) {
        logEl.textContent = `[${now}] CLIENT: 192.168.56.105 -> GET /off HTTP/1.1
[${now}] SERVER: Route matched -> handleLEDOff()
[${now}] GPIO 2: digitalWrite(2, LOW) -> Logic 0.00V (0mA)
[${now}] ONBOARD: Blue SMD LED turned OFF
[${now}] RESP: HTTP/1.1 200 OK (Content-Type: text/html)
[${now}] BODY: <h1>LED is OFF</h1><a href='/'>Back</a>
[${now}] RTT: 8ms (protosem Wi-Fi LAN)`;
      }
    }
  }

  btnOn.addEventListener('click', (e) => {
    e.preventDefault();
    setLedState(true);
  });

  btnOff.addEventListener('click', (e) => {
    e.preventDefault();
    setLedState(false);
  });

  btnBack.addEventListener('click', (e) => {
    e.preventDefault();
    const now = new Date().toLocaleTimeString();
    if (urlEl) urlEl.textContent = '192.168.56.202/';
    if (headingEl) {
      headingEl.textContent = 'ESP32 LED Control';
      headingEl.style.color = '#111111';
    }
    if (btnRow) btnRow.style.display = 'flex';
    if (btnBack) btnBack.style.display = 'none';

    if (logEl) {
      logEl.textContent = `[${now}] CLIENT: 192.168.56.105 -> GET / HTTP/1.1
[${now}] SERVER: Route matched -> handleRoot()
[${now}] RESP: HTTP/1.1 200 OK (Content-Type: text/html)
[${now}] BODY: Served interactive HTML control buttons
[${now}] PIN 2: Current state retained without disruption`;
    }
  });
}

// ==========================================================================
// 3. TASK 2 SANDBOX: ADAFRUIT IO CLOUD MQTT BULB CONTROLLER
// ==========================================================================
function setupTask2Sandbox() {
  const btnOn = document.getElementById('btnMqttBulbOn');
  const btnOff = document.getElementById('btnMqttBulbOff');
  const bulbStateEl = document.getElementById('simBulbStateVal');
  const feedOutput = document.getElementById('mqttFeedOutput');
  const virtualBulb = document.getElementById('simVirtualBulb');

  function setBulbState(isOn) {
    const now = new Date().toLocaleTimeString();
    const command = isOn ? 'ON' : 'OFF';

    if (bulbStateEl) {
      bulbStateEl.textContent = isOn ? 'ON (ENERGIZED)' : 'OFF (DE-ENERGIZED)';
      bulbStateEl.style.color = isOn ? '#34d399' : '#f43f5e';
    }

    if (virtualBulb) {
      if (isOn) {
        virtualBulb.classList.add('lit');
      } else {
        virtualBulb.classList.remove('lit');
      }
    }

    if (feedOutput) {
      feedOutput.textContent = `[${now}] DASHBOARD: User clicked ${command} toggle
[${now}] MQTT PUB: sudhiksha/feeds/bulb -> "${command}" (io.adafruit.com:1883)
[${now}] BROKER: QoS 0 message delivered to subscriber ESP32 (Port 1883)
[${now}] ESP32 SUB: readSubscription() detected message "${command}"
[${now}] GPIO 26: digitalWrite(26, ${isOn ? 'LOW' : 'HIGH'}) -> Active-LOW Relay ${isOn ? 'ON' : 'OFF'}
[${now}] HARDWARE: Bulb lamp is physically ${isOn ? 'ILLUMINATED' : 'SHUT OFF'}`;
    }
  }

  if (btnOn) {
    btnOn.addEventListener('click', (e) => {
      e.preventDefault();
      setBulbState(true);
    });
  }

  if (btnOff) {
    btnOff.addEventListener('click', (e) => {
      e.preventDefault();
      setBulbState(false);
    });
  }

  // Backward compatibility with generic slider/btn if present
  const slider = document.getElementById('simMqttSlider');
  const valDisplay = document.getElementById('simMqttVal');
  const publishBtn = document.getElementById('btnPublishMqtt');

  if (slider && valDisplay) {
    slider.addEventListener('input', () => {
      valDisplay.textContent = `${parseFloat(slider.value).toFixed(1)} °C`;
    });
  }

  if (publishBtn && feedOutput) {
    publishBtn.addEventListener('click', () => {
      const now = new Date().toLocaleTimeString();
      feedOutput.textContent = `[${now}] PUB: sudhiksha/feeds/bulb -> "ON"
[${now}] TCP: io.adafruit.com:1883 | QoS 0 Delivered
[${now}] ESP32: GPIO 26 set to LOW -> Bulb ON`;
    });
  }
}

// ==========================================================================
// 4. TASK 3 SANDBOX: IFTTT + ADAFRUIT IO VOICE AUTOMATION SIMULATOR
// ==========================================================================
function setupTask3Sandbox() {
  const voiceBtn = document.getElementById('btnSimulateVoiceAutomation');
  const voiceSelect = document.getElementById('simVoiceTriggerSelect');
  const voiceLog = document.getElementById('simVoiceLog');
  const virtualBulb = document.getElementById('simTask3VirtualBulb');
  const bulbStatus = document.getElementById('simTask3BulbStatusText');
  const gpioStatus = document.getElementById('simTask3GpioStatus');

  if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
      const cmd = voiceSelect ? voiceSelect.value : 'ON';
      const isOn = cmd === 'ON';
      const now = new Date().toLocaleTimeString();

      if (voiceLog) {
        voiceLog.innerHTML = `[${now}] 🎙️ VOICE: Spoken phrase recognized by Google Assistant<br>
[${now}] ⚙️ IFTTT: Matched Applet "Activate ${isOn ? 'Bulb' : 'TURN off bulb'}"<br>
[${now}] ☁️ ADAFRUIT IO: Published "${cmd}" to sudhiksha/feeds/bulb<br>
[${now}] 📡 MQTT: QoS 0 packet pushed to ESP32 (Port 1883)<br>
[${now}] 🖥️ ESP32: bulb.lastread = "${cmd}" -> digitalWrite(26, ${isOn ? 'LOW' : 'HIGH'})<br>
[${now}] ⚡ RELAY: Active-LOW Relay ${isOn ? 'CLOSED (Energized)' : 'OPEN (De-energized)'} -> Bulb ${isOn ? 'ON' : 'OFF'}`;
      }

      if (virtualBulb) {
        if (isOn) {
          virtualBulb.classList.add('lit');
          virtualBulb.style.filter = 'drop-shadow(0 0 24px rgba(254, 240, 138, 0.9))';
        } else {
          virtualBulb.classList.remove('lit');
          virtualBulb.style.filter = 'none';
        }
      }

      if (bulbStatus) {
        bulbStatus.textContent = isOn ? 'BULB IS ON (ENERGIZED)' : 'BULB IS OFF (DE-ENERGIZED)';
        bulbStatus.style.color = isOn ? '#34d399' : '#f43f5e';
      }

      if (gpioStatus) {
        gpioStatus.textContent = isOn ? 'LOW (0V / Active)' : 'HIGH (3.3V / Idle)';
      }

      voiceBtn.textContent = '✅ Automation Executed!';
      setTimeout(() => {
        voiceBtn.textContent = '🎙️ Speak Voice Command & Fire Automation';
      }, 1600);
    });
  }

  // Backward compatibility with legacy webhook trigger button if present
  const triggerBtn = document.getElementById('btnTriggerIfttt');
  const notifCard = document.getElementById('simPhoneNotification');
  if (triggerBtn && notifCard) {
    triggerBtn.addEventListener('click', () => {
      notifCard.style.transform = 'scale(0.96)';
      setTimeout(() => { notifCard.style.transform = 'scale(1)'; }, 150);
    });
  }
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
// 7. COMMON UTILITIES: COPY BUTTONS
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
