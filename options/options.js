const timeOption = document.getElementById("time-option");

timeOption.onchange = (e) => {
  const val = timeOption.value;
  if (val < 1 || val > 60) {
    timeOption.value = 25;
  }
};

const saveOptionsBtn = document.getElementById("save-options-btn");
saveOptionsBtn.onclick = () => {
  chrome.storage.local.set({
    timeOption: timeOption.value,
    isRunning: false,
    timer: 0,
  });
};

chrome.storage.local.get(["timeOption"], (res) => {
  timeOption.value = res.timeOption;
});
