import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [todo, setTodo] = useState([]);
  const [completed, setCompleted] = useState([]);

  
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDate, setEditingDate] = useState("");

  const startEdit = (task) => {
  setEditingTaskId(task.id);
  setEditingTitle(task.title);
  setEditingDate(task.date);
};

  useEffect(() => {
    const storedTodo = JSON.parse(localStorage.getItem("todo")) || [];
    const storedCompleted = JSON.parse(localStorage.getItem("completed")) || [];
    setTodo(storedTodo);
    setCompleted(storedCompleted);
  }, []);

  useEffect(() => {
    localStorage.setItem("todo", JSON.stringify(todo));
    localStorage.setItem("completed", JSON.stringify(completed));
  }, [todo, completed]);

 const handleAdd = async () => {
  if (!title.trim() || !date) return;

  let formattedDate = date;
  if (date.includes("/")) {
    const [month, day, year] = date.split("/");
    formattedDate = `${year}-${month.padStart(2,"0")}-${day.padStart(2,"0")}`;
  }

  const newTask = {
    title,
    date: formattedDate,
    completed: false
  };

  try {
    const response = await fetch("http://localhost:8080/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask)
    });

    if (!response.ok) throw new Error("Failed to add task");

    const savedTask = await response.json();
    setTodo([...todo, { 
      id: savedTask.id, 
      title: savedTask.title, 
      date: formattedDate, 
      completed: false
    }]);
    
    setTitle("");
    setDate("");
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

  const handleDelete = (id, type) => {
    if (type === "todo") setTodo(todo.filter((t) => t.id !== id));
    else setCompleted(completed.filter((t) => t.id !== id));
  };

  const handleDone = async (id) => {
  const doneTask = todo.find((t) => t.id === id);
  if (!doneTask) return;

  try {
    await fetch(`http://localhost:8080/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: doneTask.title,
        date: doneTask.date,
        completed: true 
      }),
    });

    setTodo(todo.filter((t) => t.id !== id));
    setCompleted([...completed, { ...doneTask, completed: true }]);
  } catch (error) {
    console.error("Error marking task as done:", error);
  }
};

const saveEdit = async (id) => {
  try {
    const updatedTask = {
      title: editingTitle,
      date: editingDate,
      completed: false, 
    };
    await fetch(`http://localhost:8080/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });
    setTodo(
      todo.map((t) =>
        t.id === id ? { ...t, title: editingTitle, date: editingDate } : t
      )
    );

    setEditingTaskId(null);
    setEditingTitle("");
    setEditingDate("");
  } catch (error) {
    console.error("Error updating task:", error);
  }
};
  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingTitle("");
    setEditingDate("");
  };
  const today = new Date().toISOString().split("T")[0];
  const overdue = todo.filter((t) => t.date < today);
  const dueToday = todo.filter((t) => t.date === today);
  const remaining = todo.filter((t) => t.date > today);

  const renderTaskItem = (t) => (
    <li key={t.id} className={styles.todoItem}>
      {editingTaskId === t.id ? (
        <>
          <input
            type="text"
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
          />
          <input
            type="date"
            value={editingDate}
            onChange={(e) => setEditingDate(e.target.value)}
          />
          <button onClick={() => saveEdit(t.id)} className={styles.doneButton}>
            Save
          </button>
          <button onClick={cancelEdit} className={styles.deleteButton}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <span>{t.title} <small>({t.date})</small></span>
          <div className={styles.actions}>
            <span onClick={() => startEdit(t)} className={styles.editButton}>
              ✏️
            </span>
            <button onClick={() => handleDone(t.id)} className={styles.doneButton}>
              Mark as Done
            </button>
            <button onClick={() => handleDelete(t.id, "todo")} className={styles.deleteButton}>
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>To-Do List</h1>

      {}
      <div className={styles.addTask}>
        <input
          type="text"
          placeholder="Enter a task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.taskInput}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ backgroundColor: "#222222ff", color: "rgb(207, 207, 207)" }}
        />
        <button onClick={handleAdd} className={styles.addButton}>
          Add
        </button>
      </div>

      {/* Lists Section */}
      <div className={styles.lists}>
        {/* Overdue */}
        <div className={`${styles.listBox} ${styles.overdueBox}`}>
          <h2>Overdue</h2>
          {overdue.length === 0 && <p className={styles.empty}>No overdue tasks</p>}
          <ul className={styles.ul}>{overdue.map(renderTaskItem)}</ul>
        </div>

        {/* Due Today */}
        <div className={`${styles.listBox} ${styles.dueTodayBox}`}>
          <h2>Due Today</h2>
          {dueToday.length === 0 && <p className={styles.empty}>No tasks for today</p>}
          <ul className={styles.ul}>{dueToday.map(renderTaskItem)}</ul>
        </div>

        {/* Upcoming */}
        <div className={`${styles.listBox} ${styles.todoBox}`}>
          <h2>To Do</h2>
          {remaining.length === 0 && <p className={styles.empty}>No upcoming tasks</p>}
          <ul className={styles.ul}>{remaining.map(renderTaskItem)}</ul>
        </div>

        {/* Completed */}
        <div className={`${styles.listBox} ${styles.completedBox}`}>
          <h2>Completed</h2>
          {completed.length === 0 && <p className={styles.empty}>No completed tasks</p>}
          <ul className={styles.ul}>
            {completed.map((t) => (
              <li key={t.id} className={styles.completedItem}>
                <span className={styles.strike}>
                  {t.title} <small>({t.date})</small>
                </span>
                <button
                  onClick={() => handleDelete(t.id, "completed")}
                  className={styles.completedDeleteButton}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
