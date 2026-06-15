export const generateHTMLReport = (data: any): string => {
  const mapUrl = `https://maps.google.com/maps?q=${data.targetCoordinates.lat},${data.targetCoordinates.lng}&z=15&output=embed`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pegasus Intelligence Report - ${data.targetName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      background: #000000;
      color: #00ff00;
      font-family: 'Courier New', 'Courier', monospace;
      padding: 20px;
      line-height: 1.5;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: #000000;
    }
    
    /* Print Styles - Keep Black Background with 2mm margins */
    @media print {
      @page {
        size: A4;
        margin: 2mm;
      }
      
      body {
        background: #000000 !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      
      .container {
        background: #000000 !important;
        max-width: 100%;
        padding: 5px;
      }
      
      .header, .section, .stat-card, .message-entry, .error-box {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      
      .map-container iframe {
        display: block;
        width: 100%;
        height: 400px;
        border: 2px solid #00ff00;
      }
      
      .no-print {
        display: none;
      }
      
      button {
        display: none;
      }
      
      .print-button {
        display: none;
      }
      
      /* Keep all colors in print */
      .section {
        border: 1px solid #00ff00 !important;
        background: #000000 !important;
        padding: 8px !important;
        margin-bottom: 10px !important;
      }
      
      .section-title {
        border-bottom: 1px solid #00ff00 !important;
        color: #00ff00 !important;
        font-size: 14px !important;
        margin-bottom: 8px !important;
        padding-bottom: 3px !important;
      }
      
      .stat-card {
        border: 1px solid #00ff00 !important;
        background: #001100 !important;
        color: #00ff00 !important;
        padding: 6px !important;
      }
      
      .stat-card .value {
        font-size: 18px !important;
        margin: 4px 0 !important;
      }
      
      .message-entry {
        border-left: 3px solid #00ff00 !important;
        background: #001100 !important;
        padding: 6px !important;
        margin-bottom: 6px !important;
      }
      
      .message-deleted {
        border-left-color: #ff4444 !important;
        background: #110000 !important;
      }
      
      .deleted-badge {
        color: #ff4444 !important;
        font-size: 9px !important;
        margin-bottom: 4px !important;
      }
      
      .base64 {
        color: #00cc00 !important;
        font-size: 12px !important;
        padding: 4px !important;
        margin: 4px 0 !important;
      }
      
      .decoded {
        border-top-color: #00ff00 !important;
        color: #00ff00 !important;
        font-size: 12px !important;
        margin-top: 4px !important;
        padding-top: 4px !important;
      }
      
      .coordinates {
        background: #001100 !important;
        border: 1px solid #00ff00 !important;
        color: #00ff00 !important;
        padding: 6px !important;
        font-size: 11px !important;
        margin-top: 6px !important;
      }
      
      .error-box {
        border: 1px solid #ff4444 !important;
        background: #110000 !important;
        padding: 8px !important;
        margin: 6px 0 !important;
      }
      
      .error-title {
        color: #ff4444 !important;
        font-size: 12px !important;
        margin-bottom: 4px !important;
      }
      
      .error-details {
        font-size: 9px !important;
        margin-top: 4px !important;
        padding-top: 4px !important;
      }
      
      td {
        border-bottom: 1px solid #003300 !important;
        padding: 4px !important;
        font-size: 9px !important;
      }
      
      th {
        border-bottom: 1px solid #00ff00 !important;
        color: #00ff00 !important;
        padding: 4px !important;
        font-size: 9px !important;
      }
      
      .footer {
        border-top: 1px solid #00ff00 !important;
        color: #00ff00 !important;
        padding: 8px !important;
        font-size: 9px !important;
        margin-top: 10px !important;
      }
      
      .stats-grid {
        gap: 6px !important;
        margin-bottom: 10px !important;
      }
      
      a {
        color: #00ff00 !important;
      }
      
      .header {
        padding: 8px !important;
        margin-bottom: 10px !important;
      }
      
      .header h1 {
        font-size: 16px !important;
      }
      
      .header p {
        font-size: 9px !important;
        margin-top: 4px !important;
      }
    }
    
    /* Screen Styles - Reduced Card Sizes */
    .header {
      padding: 15px;
      margin-bottom: 15px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 20px;
    }
    
    .header p {
      font-size: 11px;
      margin-top: 5px;
    }
    
    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #00ff00;
      color: #000000;
      border: none;
      padding: 8px 16px;
      font-family: 'Courier New', monospace;
      font-weight: bold;
      cursor: pointer;
      z-index: 1000;
      border-radius: 4px;
      font-size: 11px;
    }
    
    .print-button:hover {
      background: #00cc00;
    }
    
    .section {
      border: 1px solid #00ff00;
      margin-bottom: 12px;
      padding: 10px;
      border-radius: 4px;
      background: #000000;
    }
    
    .section-title {
      font-size: 14px;
      font-weight: bold;
      border-bottom: 1px solid #00ff00;
      padding-bottom: 4px;
      margin-bottom: 10px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 15px;
    }
    
    .stat-card {
      border: 1px solid #00ff00;
      padding: 8px;
      text-align: center;
      background: #001100;
    }
    
    .stat-card div:first-child {
      font-size: 11px;
      opacity: 0.8;
    }
    
    .stat-card .value {
      font-size: 20px;
      font-weight: bold;
      margin: 5px 0;
    }
    
    .stat-card div:last-child {
      font-size: 11px;
      opacity: 0.6;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th, td {
      text-align: left;
      padding: 6px;
      border-bottom: 1px solid #003300;
      font-size: 10px;
    }
    
    th {
      border-bottom: 2px solid #00ff00;
      font-weight: bold;
      font-size: 10px;
    }
    
    .message-entry {
      background: #001100;
      padding: 8px;
      margin-bottom: 8px;
      border-left: 3px solid #00ff00;
      border-radius: 4px;
    }
    
    .message-deleted {
      border-left-color: #ff4444;
      background: #110000;
    }
    
    .deleted-badge {
      color: #ff4444;
      font-size: 9px;
      font-weight: bold;
      margin-bottom: 5px;
      text-transform: uppercase;
    }
    
    .base64 {
      font-size: 11px;
      color: #00cc00;
      word-break: break-all;
      margin: 5px 0;
      font-family: monospace;
      background: #000000;
      padding: 5px;
    }
    
    .decoded {
      font-size: 11px;
      font-weight: bold;
      margin-top: 5px;
      padding-top: 5px;
      border-top: 1px dashed #00ff00;
      color: #00ff00;
    }
    
    .map-container {
      margin: 10px 0;
      border: 2px solid #00ff00;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .map-container iframe {
      width: 100%;
      height: 400px;
      border: none;
      display: block;
    }
    
    .coordinates {
      background: #001100;
      padding: 8px;
      margin-top: 8px;
      text-align: center;
      border-radius: 4px;
      font-size: 10px;
    }
    
    .error-box {
      background: #110000;
      border: 1px solid #ff4444;
      padding: 10px;
      margin: 8px 0;
      border-radius: 4px;
    }
    
    .error-title {
      color: #ff4444;
      font-weight: bold;
      margin-bottom: 6px;
      font-size: 12px;
    }
    
    .error-details {
      margin-top: 6px;
      padding-top: 6px;
      border-top: 1px solid #ff4444;
      font-size: 9px;
    }
    
    .footer {
      text-align: center;
      padding: 12px;
      border-top: 1px solid #00ff00;
      margin-top: 15px;
      font-size: 8px;
      opacity: 0.7;
    }
    
    .watermark {
      display: none;
    }
    
    @media print {
      .watermark {
        display: none;
      }
    }
    
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 9px;
      font-weight: bold;
      margin-left: 8px;
    }
    
    .badge-success {
      background: #00ff00;
      color: #000000;
    }
    
    .badge-error {
      background: #ff4444;
      color: #ffffff;
    }
    
    .badge-warning {
      background: #ffcc00;
      color: #000000;
    }
    
    .coordinates a {
      color: #00ff00;
    }
  </style>
</head>
<body>
  <button class="print-button no-print" onclick="window.print();">🖨️ Print / Save as PDF</button>
  
  <div class="container">
    <div class="header">
      <h1>CONFIDENTIAL REPORT</h1>
      <p><strong>Target:</strong> ${data.targetName} (${data.targetPhone})</p>
      <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Classification:</strong> TOP SECRET // NOFORN</p>
    </div>

    <!-- Statistics Overview -->
    <div class="stats-grid">
      <div class="stat-card">
        <div>📞 Total Calls</div>
        <div class="value">${data.callStats.total}</div>
        <div>${data.callStats.incoming} in / ${data.callStats.outgoing} out</div>
      </div>
      <div class="stat-card">
        <div>📨 Messages</div>
        <div class="value">${data.messages.length}</div>
        <div>${data.deletedMessages} deleted</div>
      </div>
      <div class="stat-card">
        <div>📍 Locations</div>
        <div class="value">${data.locationCount}</div>
        <div>Tracked points</div>
      </div>
      <div class="stat-card">
        <div>🎙️ Microphone</div>
        <div class="value">${data.microphoneStatus.success ? 'ACTIVE' : 'FAILED'}</div>
        <div>${data.microphoneStatus.success ? 'Recording' : 'Encrypted'}</div>
      </div>
    </div>

    <!-- Call Logs Section -->
    <div class="section">
      <div class="section-title">📞 CALL LOGS</div>
      <table>
        <thead>
          <tr>
            <th>Direction</th>
            <th>Phone Number</th>
            <th>Duration</th>
            <th>App</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          ${data.calls.map((call: any) => `
            <tr>
              <td>${call.direction === 'incoming' ? '📞 Incoming' : '📤 Outgoing'}</td>
              <td>${call.number}</td>
              <td>${Math.floor(call.duration / 60)}m ${call.duration % 60}s</td>
              <td>${call.app}</td>
              <td>1</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="margin-top: 6px; padding: 5px; background: #001100; border-radius: 3px; font-size: 9px;">
        <strong>Summary:</strong> ${data.callStats.total} calls | ${data.callStats.uniqueNumbers} numbers | ${Math.floor(data.callStats.totalDuration / 60)} min total
      </div>
    </div>

    <!-- Messages Section with Base64 -->
    <div class="section">
      <div class="section-title">💬 INTERCEPTED MESSAGES</div>
      ${data.messages.map((msg: any) => `
        <div class="message-entry ${msg.isDeleted ? 'message-deleted' : ''}">
          ${msg.isDeleted ? '<div class="deleted-badge">⚠️ DELETED - RECOVERED</div>' : ''}
          <div><strong>[${msg.app.toUpperCase()}]</strong> ${msg.direction === 'in' ? '← RECEIVED' : '→ SENT'} at ${new Date(msg.timestamp).toLocaleTimeString()}</div>
          <div class="base64">📦 BASE64: ${msg.base64}</div>
          <div class="decoded">🔓 DECODED: ${msg.text}</div>
        </div>
      `).join('')}
    </div>

    <!-- Geolocation & Map Section -->
    <div class="section">
      <div class="section-title">📍 GEOLOCATION & MAP</div>
      <div class="map-container">
        <iframe 
          src="${mapUrl}"
          title="Target Location Map"
          allowfullscreen>
        </iframe>
      </div>
      <div class="coordinates">
        <strong>📍 GPS:</strong> ${data.targetCoordinates.lat.toFixed(6)}°, ${data.targetCoordinates.lng.toFixed(6)}°<br>
        ${data.targetCoordinates.ip ? `<strong>🌐 IP:</strong> ${data.targetCoordinates.ip}<br>` : ''}
        <strong>🕐 Updated:</strong> ${new Date().toLocaleString()}<br>
        <strong>📐 Accuracy:</strong> ±10m | <strong>🗺️ Map:</strong> <a href="https://maps.google.com/?q=${data.targetCoordinates.lat},${data.targetCoordinates.lng}" target="_blank">Open in Google Maps</a>
      </div>
 
    <!-- Microphone Status Section -->
    <div class="section">
      <div class="section-title">🎙️ MICROPHONE INTERCEPTION STATUS</div>
      ${data.microphoneStatus.success ? `
        <div style="background: #003300; padding: 15px; border-radius: 4px;">
          <strong>✓ MICROPHONE ACTIVATED SUCCESSFULLY</strong><br>
          Recording started: ${data.microphoneStatus.timestamp?.toLocaleString()}<br>
          Status: Active - Ambient audio being captured<br>
          Quality: 48kHz / 192kbps<br>
          Mode: Continuous recording
        </div>
      ` : `
        <div class="error-box">
          <div class="error-title">✗ MICROPHONE INTERCEPTION FAILED</div>
          <div><strong>Error Code:</strong> MIC_001</div>
          <div><strong>Error Message:</strong> ${data.microphoneStatus.error}</div>
          <div><strong>Timestamp:</strong> ${data.microphoneStatus.timestamp?.toLocaleString()}</div>
          <div class="error-details">
            <strong>🔍 Technical Analysis:</strong><br>
            • End-to-end encryption detected (Signal Protocol v3)<br>
            • Target device running iOS 17.2 / Android 14<br>
            • Counter-surveillance software: Kaspersky Mobile Security detected<br>
            • Microphone hardware access restricted by OS security policy<br>
            • Target switched to VoIP service with ML-KEM512 encryption<br>
            <br>
            <strong>💡 Recommendations:</strong><br>
            • Deploy alternative interception vector via WhatsApp<br>
            • Wait for device OS downgrade opportunity<br>
            • Utilize network injection for bypass
          </div>
        </div>
      `}
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>═══════════════════════════════════════════════════════════</p>
      <p>TOP SECRET // NOFORN // PEGASUS v4.2.2 // ID: PEG-${Date.now()}</p>
      <p>═══════════════════════════════════════════════════════════</p>
    </div>
  </div>

  <script>
    window.onload = function() {
      window.scrollTo(0, 0);
      console.log('Pegasus Report Ready');
      console.log('To save as PDF: Click PRINT button or Ctrl+P');
      console.log('IMPORTANT: In print dialog, CHECK "Background graphics"');
      console.log('PDF margins: 2mm on all sides');
    };
  </script>
</body>
</html>`;
};