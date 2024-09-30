const taskInput = document.getElementById('task-input');
const taskCategory = document.getElementById('task-category');
const taskDeadline = document.getElementById('task-deadline');
const taskPriority = document.getElementById('task-priority');
const taskDescription = document.getElementById('task-description');
const taskRecurring = document.getElementById('task-recurring');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const completedTasksDiv = document.getElementById('completed-tasks');
const toggleCompletedTasksButton = document.getElementById('toggle-completed-tasks');

// Variável para controlar a visibilidade das tarefas concluídas
let showCompleted = false;

// Função para adicionar tarefa
addTaskButton.addEventListener('click', () => {
    const text = taskInput.value.trim();
    const category = taskCategory.value;
    const deadline = taskDeadline.value;
    const priority = taskPriority.value;
    const description = taskDescription.value;
    const recurring = taskRecurring.value;

    if (text && category && deadline) {
        addTask(text, category, deadline, priority, description, recurring);
        clearInputFields(); // Essa parte que limpa os campos 
    } else {
        alert("Por favor, preencha todos os campos obrigatórios!");
    }
});

// Função para adicionar uma tarefa à lista
function addTask(taskText, categoryText, deadlineText, priorityText, descriptionText, recurringText) {
    const li = document.createElement('li');
    li.append(`${taskText} [${categoryText}] (Vencimento: ${deadlineText}) [Prioridade: ${priorityText}] [Descrição: ${descriptionText}] [Recorrência: ${recurringText}]`);

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Concluir';
    completeButton.classList.add('complete-button');
    completeButton.addEventListener('click', () => {
        moveToCompleted(li);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => {
        taskList.removeChild(li);
        saveTasks(); 
    });

    li.appendChild(completeButton);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
    saveTasks(); 
    showNotification("Tarefa adicionada com sucesso!");
}

// Função para mover tarefa para concluídas
function moveToCompleted(li) {
    li.classList.add('completed');
    taskList.removeChild(li); 
    updateCompletedTasks(li); 
    saveTasks(); 
}

// Função para atualizar as tarefas concluídas
function updateCompletedTasks(li) {
    const completedTask = document.createElement('div');
    completedTask.textContent = li.textContent;
    completedTask.classList.add('completed-task');
    completedTasksDiv.appendChild(completedTask);
}

// Função para salvar as tarefas no localStorage
function saveTasks() {
    const tasks = Array.from(taskList.children).map(li => ({
        text: li.childNodes[0].nodeValue,
        completed: li.classList.contains('completed')
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para carregar tarefas do localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const [text, category, deadline, priority, description, recurring] = task.text.split(/ \[|\] |\s*\(Vencimento: |\) \[Prioridade: |\] \[Descrição: |\] \[Recorrência: /);
        addTask(text, category, deadline, priority, description, recurring);
        if (task.completed) {
            const li = taskList.lastChild; 
            moveToCompleted(li); 
        }
    });
}

// Função para exibir notificações
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'notification';
    document.body.appendChild(notification);
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

//Mostrar e esconder as tarefas concluídas
toggleCompletedTasksButton.addEventListener('click', () => {
    showCompleted = !showCompleted;
    completedTasksDiv.style.display = showCompleted ? 'block' : 'none';
    toggleCompletedTasksButton.textContent = showCompleted ? 'Ocultar Tarefas Concluídas' : 'Mostrar Tarefas Concluídas';
});

loadTasks();
