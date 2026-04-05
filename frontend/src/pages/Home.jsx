import { useState, useEffect } from "react"
import Task from "../components/Task"
import TaskForm from "../components/TaskForm"
import TaskCount from "../components/TaskCount"
import api from "../api"
import "../styles/Home.css"
import "../styles/Task.css"
import "../styles/Form.css"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import NavBar from "../components/NavBar"


function Home() {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem(ACCESS_TOKEN)
        localStorage.removeItem(REFRESH_TOKEN)
        navigate("/register")
    }

    const getTasks = async () => {
        try {
            const res = await api.get("/api/tasks/");
            const data = res.data;
            setTasks(data);
            console.log(data);
        } catch (err) {
            alert(err);
        }
    };

    useEffect(() => { getTasks(); }, []);

    const deleteTask = async (id) => {
        try {
            const res = await api.delete(`/api/tasks/delete/${id}/`);
            if (res.status === 204) {
                alert("Task deleted!");
            } else {
                alert("Failed to delete task");
            }
        } catch (error) {
            alert(error);
        } finally {
            getTasks();
        }
    };

    const handleCreateTask = async ({ title, content }) => {
        try {
            const res = await api.post("/api/tasks/", { title, content });
            if (res.status === 201) {
                await getTasks();
                return true;
            } else {
                alert("Failed to create task");
                return false;
            }
        } catch (err) {
            alert(err);
            return false;
        }
    };

    const updateTaskStatus = async (id, newStatus) => {
        try {
            const res = await api.patch(`/api/tasks/${id}/`, { status: newStatus });
            if (res.status === 200) {
                await getTasks();
            } else {
                alert("Failed to update status");
            }
        } catch (err) {
            console.error("Error updating status:", err);
            alert(err);
        }
    };

    return (
        <div className="home-container">
            <NavBar/>
            <div className="home-header">
                <div className="home-header-top">
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
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