import { useState, useEffect } from "react"
import Task from "../components/Task"
import TaskForm from "../components/TaskForm"
import TaskCount from "../components/TaskCount"
import api from "../api"
import "../styles/Home.css"
import "../styles/Task.css"
import { useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar"


function Home({ user, setUser }) {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await api.post("/api/auth/logout/");
            setUser(null);
            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
            setError("Failed to log out.");
        }
    };

    const getTasks = async () => {
        try {
            const res = await api.get("/api/tasks/");
            setTasks(res.data);
            setError("");
        } catch (err) {
            console.error("Failed to fetch tasks:", err);
            setError("Failed to load tasks.");
        }
    };

    useEffect(() => { 
        getTasks(); 
    }, []);

    const deleteTask = async (id) => {
        try {
            const res = await api.delete(`/api/tasks/delete/${id}/`);
            if (res.status === 204) {
                await getTasks();
            } else {
                setError("Failed to delete task.");
            }
        } catch (err) {
            console.error("Failed to delete task:", err);
            setError("Failed to delete task.");
        }
    };

    const handleCreateTask = async ({ title, content }) => {
        try {
            const res = await api.post("/api/tasks/", { title, content });
            if (res.status === 201) {
                await getTasks();
                return true;
            } else {
                setError("Failed to create task.");
                return false;
            }
        } catch (err) {
            console.error("Failed to create task:", err);
            setError("Failed to create task.");
            return false;
        }
    };

    const updateTaskStatus = async (id, newStatus) => {
        try {
            const res = await api.patch(`/api/tasks/${id}/`, { status: newStatus });
            if (res.status === 200) {
                await getTasks();
            } else {
                setError("Failed to update status.");
            }
        } catch (err) {
            console.error("Error updating status:", err);
            setError("Failed to update status.");
        }
    };

    return (
        <div className="home-container">
            <NavBar user={user} onLogout={handleLogout} />

            <div className="home-header">
                <div className="home-header-top">
                    <h1>My Tasks</h1>
                    {error && <p className="error-message">{error}</p>}
                </div>
                <TaskCount tasks={tasks} />
            </div>
            <div className="task-container">
                <div className="tasks-section">
                    {tasks.length === 0 && <p className="no-tasks">No tasks yet.</p>}
                    {tasks.map((task) => (
                        <Task
                            key={task.id}
                            task={task}
                            onDelete={deleteTask}
                            onStatusChange={updateTaskStatus}
                        />
                    ))}
                </div>
                <div className="taskform-container">
                    <TaskForm onSubmit={handleCreateTask} />
                </div>
            </div>
        </div>            
    );
}

export default Home