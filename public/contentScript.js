chrome.storage.local.get(['playAlarm', 'alarmText'], (result) => {
  if (result.playAlarm) {
    alert(`${result.alarmText}!! you scheduled this tab . `);
    // Logic to play the audio
    chrome.storage.local.remove(['playAlarm', 'alarmText']);
  }
});
