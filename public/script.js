function listTasks(task_list) {
  let html = ``;
  for (let doneTask of task_list.Done) {
    html += `<div class="task">
    <input type="checkbox"  name="${doneTask}" value="${doneTask}" id="${doneTask}" class="taskmarker" onclick="$('#taskSubmit').click()" checked> 
    <i class="fa-solid fa-circle-check round-check"></i>
    <label for="${doneTask} "><s>${doneTask}</s>  </label>
    <button id='delete' value = "delete" onclick="deleteTask('Done', '${doneTask}', event)">
    <i class="fa-solid fa-trash-can"></i>
  </button>
  </div>`;
  }
  for (let notDoneTask of task_list.notDone) {
    html += `<div class="task">
    <input type="checkbox" name="${notDoneTask}" value="${notDoneTask}" id="${notDoneTask}" class="taskmarker" onclick="$('#taskSubmit').click()">
    <i class="fa-solid fa-circle-check round-check"></i>
    <label for="${notDoneTask} ">${notDoneTask}</label>
    <button id='delete' value = "delete" onclick="deleteTask('notDone', '${notDoneTask}', event)">
    <i class="fa-solid fa-trash-can"></i>
  </button>
  </div> `;
  }
  html += `<button type="submit" id="taskSubmit" style="display:none"></button>`;
  $("#tasks").html(html);
}

function deleteTask(category, element, event) {
  event.preventDefault();

  $.ajax({
    url: "/",
    method: "post",
    data: { category: category, delTaskName: element },
    success: function (res) {
      listTasks(res);
    },
  });
}

$("#addTaskForm").on("submit", function (event) {
  event.preventDefault();
  let newTaskVal = $("#newTask").val();

  $.ajax({
    url: "/",
    method: "post",
    data: { newTask: newTaskVal },
    success: function (res) {
      listTasks(res);
      $("#newTask").val("");
    },
  });
});

$("#calender").on("submit", function (event) {
  event.preventDefault();
  let day = $("#day").val();
  let month = $("#month").val();
  let year = $("#year").val();

  $.ajax({
    url: "/",
    method: "post",
    data: { newDate: `${year}-${month}-${day}` },
    success: function (res) {
      listTasks(res);
    },
  });
});

$("#tasks").on("submit", function (event) {
  event.preventDefault();
  let checkedValues = $("input:checkbox:checked")
    .map(function () {
      return this.value;
    })
    .get();
  let notCheckedValues = $("input:checkbox:not(:checked)")
    .map(function () {
      return this.value;
    })
    .get();

  $.ajax({
    url: "/",
    method: "post",
    data: { checked: checkedValues, notChecked: notCheckedValues },
    success: function (res) {
      listTasks(res);
    },
  });
});
