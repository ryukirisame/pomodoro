chrome.alarms.create("pomodoroAlarm", {
  periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pomodoroAlarm") {
    chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
      if (res.isRunning) {
        let timer = res.timer + 1;
        let isRunning = true;

        if (timer === res.timeOption * 60) {
          this.registration.showNotification("Pomodoro Timer", {
            body: `${res.timeOption} minutes has passed!`,
            icon: "icon.png",
          });
          timer = 0;
          isRunning = false;
        }

        chrome.storage.local.set({
          timer,
          isRunning,
        });
      }
    });
  }
});

chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
  chrome.storage.local.set({
    timer: "timer" in res ? res.timer : 0,
    isRunning: "isRunning" in res ? res.isRunning : false,
    timeOption: "timeOption" in res ? res.timeOption : 25,
  });
});
