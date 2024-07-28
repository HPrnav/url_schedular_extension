// chrome.alarms.onAlarm.addListener((alarm) => {

//     const url = alarm.name.slice(6);
//     chrome.tabs.create({ url: 'https://' + url });
//   });

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('Alarm triggered:', alarm);

  const url = 'https://' + alarm.name.slice(6);

  chrome.tabs.create({ url: url }, (tab) => {
    const listener = (tabId, changeInfo) => {
      if (tabId === tab.id && changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        chrome.storage.local.set({ playAlarm: true, alarmText: 'Alarm triggered!' });
      }
    };
    chrome.tabs.onUpdated.addListener(listener);
  });
});

