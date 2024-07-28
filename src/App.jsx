import { useState, useEffect } from 'react';
import './App.css';
import { FiTrash } from 'react-icons/fi';


function App() {
  const [web, setweb] = useState('');
  const [datetime, setdatetime] = useState('');
  const [alarmList, setAlarmList] = useState([]); // New state to track alarms

  useEffect(() => {
    chrome.storage.local.get(['alarmList'], (result) => {
      if (result.alarmList) {
        setAlarmList(result.alarmList);
      }
    });

    // Set the initial datetime state to the current date and time
    const now = new Date();
    const formattedNow = now.toISOString().slice(0, 16);
    setdatetime(formattedNow);

  }, []);

  const calculateMinutes = (targetDate) => {
    const now = new Date(); // Get the current date and time
    const target = new Date(targetDate); // Parse the target date and time from the input
    const diffMs = target - now; // Calculate the difference in milliseconds
    return Math.max(Math.floor(diffMs / 60000), 0); // Convert milliseconds to minutes, ensuring non-negative values
  };

  const deleteAlarm = (alarmToDelete) => {
    const updatedAlarmList = alarmList.filter(alarm => !(alarm.time === alarmToDelete.time && alarm.web === alarmToDelete.web));
    setAlarmList(updatedAlarmList);
    chrome.storage.local.set({ alarmList: updatedAlarmList });
    window.location.reload();
    alert('Alarm deleted!');
  };

  const resetAlarm = () => {
    chrome.storage.local.set({ alarmList: "" });
    window.location.reload();
    alert('Alarms reset!');
  };

  const setAlarm = () => {
    const minutes = calculateMinutes(datetime);
    if (minutes > 0) {
      // Create the alarm
      chrome.alarms.create(`alarm_${web}`, { delayInMinutes: minutes });

      const newAlarm = { time: minutes, web: `${web}`, name: `Alarm at ${new Date(datetime).toLocaleString()}` };

      const updatedAlarmList = [...alarmList, newAlarm];
      setAlarmList(updatedAlarmList);

      chrome.storage.local.set({ alarmList: updatedAlarmList });

      // Optionally alert or log
      alert(`Alarm set for ${minutes} minutes from now.`);
    } else {
      alert('Please select a future date and time.');
    }
  };

  return (
    <div className="App">
      <h1>Scheduler</h1>

      <div>
        <input type="datetime-local" value={datetime} onChange={(e) => setdatetime(e.target.value)} placeholder="Select date and time" />
        <input type="text" value={web} onChange={(e) => setweb(e.target.value)} placeholder="Enter the URL" />
        <div>
          <button onClick={setAlarm}>Set Alarm</button>
          <button onClick={resetAlarm}>Reset </button>
        </div>
      </div>

      <hr />
      <div className="alarm-list">
        <h2>Alarms:</h2>
        <ul>
          {alarmList.map((alarm, index) => (
            <li key={`${alarm.time}-${alarm.web}`}>
              {alarm.name} on {alarm.web}
              <button onClick={() => deleteAlarm(alarm)}><FiTrash size={10}/></button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
