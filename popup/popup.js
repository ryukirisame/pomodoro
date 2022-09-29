const addTaskBtn = document.getElementById("add-task-btn");
const tasksContainer = document.getElementById("task-container");
const startTimerBtn = document.getElementById("start-timer-btn");
const resetTimerBtn = document.getElementById("reset-timer-btn");
const time = document.getElementById("time");

//TIMER LOGIC

function updateTime() {
  chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
    startTimerBtn.textContent = res.isRunning ? "Pause Timer" : "Start Timer";

    const minutes = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(
      2,
      "0"
    );
    let seconds = "00";
    if (res.timer % 60) {
      seconds = `${60 - (res.timer % 60)}`.padStart(2, "0");
    }

    time.textContent = `${minutes}:${seconds}`;
  });
}

updateTime();
setInterval(updateTime, 1000);

startTimerBtn.onclick = () => {
  chrome.storage.local.get(["isRunning"], (res) => {
    // if the timer is not running then run it and show "pause timer"
    chrome.storage.local.set(
      {
        isRunning: !res.isRunning,
      },
      () => {
        startTimerBtn.textContent =
          res.isRunning == false ? "Pause Timer" : "Start Timer";
      }
    );
  });
};

resetTimerBtn.onclick = () => {
  chrome.storage.local.set(
    {
      timer: 0,
      isRunning: false,
    },
    () => {
      startTimerBtn.textContent = "Start Timer";
    }
  );
};

//TASKS LOGIC

let tasks = [];

chrome.storage.sync.get(["tasks"], (res) => {
  tasks = res.tasks ?? [];
  renderTasks();
});

function saveTasks() {
  chrome.storage.sync.set({
    tasks,
  });
}

addTaskBtn.onclick = addTask;

function renderTask(taskNum) {
  const taskRow = document.createElement("div");
  taskRow.className = "task-row";

  const text = document.createElement("input");
  text.type = "text";
  text.placeholder = "Enter a task...";
  text.value = tasks[taskNum];
  text.className = "task-input";
  text.onchange = () => {
    tasks[taskNum] = text.value;
    saveTasks();
    // console.log(tasks);
  };

  const deleteBtn = document.createElement("span");
  deleteBtn.textContent = "close";
  deleteBtn.className = "material-symbols-rounded close";
  deleteBtn.onclick = () => {
    deleteTask(taskNum);
  };

  taskRow.appendChild(text);
  taskRow.appendChild(deleteBtn);

  tasksContainer.appendChild(taskRow);
}

function addTask() {
  const taskNum = tasks.length;
  tasks[taskNum] = "";
  saveTasks();
  renderTask(taskNum);
}

function deleteTask(taskNum) {
  tasks.splice(taskNum, 1);
  saveTasks();
  renderTasks();
}

function renderTasks() {
  tasksContainer.textContent = "";
  tasks.forEach((taskText, taskNum) => {
    renderTask(taskNum);
  });
}
