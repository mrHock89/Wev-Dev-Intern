document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById("todo-input");
    const addTaskButton = document.getElementById("add-task-btn");
    const todoList = document.getElementById("todo-list");
  
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => renderTask(task));
  
    addTaskButton.addEventListener('click', () => {
      const taskText = todoInput.value.trim();
      if (taskText === "") return;
  
      const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
      };
  
      tasks.push(newTask);
      renderTask(newTask);
      saveTasks();
      todoInput.value = "";
    });
  
    function renderTask(task) {
      const li = document.createElement("li");
      li.setAttribute("data-id", task.id);
      if (task.completed) li.classList.add("completed");
  
      const span = document.createElement("span");
      span.textContent = task.text;
  
      span.addEventListener("click", () => {
        task.completed = !task.completed;
        li.classList.toggle("completed");
        saveTasks();
      });
  
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "edit-btn";
  
      editBtn.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = task.text;
        input.className = "edit-input";
  
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.className = "save-btn";
  
        li.innerHTML = "";
        li.appendChild(input);
        li.appendChild(saveBtn);
  
        // Save button after editing the task
        saveBtn.addEventListener("click", () => {
          const updatedText = input.value.trim();
          if (updatedText !== "") {
            task.text = updatedText;
            saveTasks();
            li.innerHTML = "";
            renderTask(task);
            li.replaceWith(todoList.lastChild); // prevent duplication
          }
        });
      });
  
      // Deleter button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-btn";
  
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        tasks = tasks.filter(t => t.id !== task.id);
        li.remove();
        saveTasks();
      });
  
      const buttonContainer = document.createElement("div");
      buttonContainer.className = "task-buttons";
      buttonContainer.appendChild(editBtn);
      buttonContainer.appendChild(deleteBtn);
  
      li.appendChild(span);
      li.appendChild(buttonContainer);
  
      todoList.appendChild(li);
    }
  
    function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  });
  