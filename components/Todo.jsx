import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

function App() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [hasStateChange, setStateChange] = useState(false);
  const [highestPriorityTask, setHighestPriorityTask] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    let todoString = localStorage.getItem('todos');
    if (todoString) {
      let todos = JSON.parse(todoString);
      setTodos(todos);
    }
  }, []);

  useEffect(() => {
    if (hasStateChange) {
      saveToLS();
    }
    setStateChange(false);
  }, [hasStateChange]);

  useEffect(() => {
    const sortedTodos = [...todos].filter(t => t.dueDate).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    if (sortedTodos.length > 0) {
      setHighestPriorityTask(sortedTodos[0]);
    } else {
      setHighestPriorityTask(null);
    }
  }, [todos]);

  useEffect(() => {
    if (highestPriorityTask) {
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [highestPriorityTask]);

  const updateTimer = () => {
    if (!highestPriorityTask) return;
    const now = new Date();
    const dueDate = new Date(highestPriorityTask.dueDate);
    const diffMs = dueDate - now;
    if (diffMs <= 0) {
      setTimeLeft('Time expired!');
    } else {
      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      if (hours >= 24) {
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        setTimeLeft(`${days} days ${remainingHours} hours left`);
      } else {
        setTimeLeft(`${hours} hrs ${minutes} mins ${seconds} secs left`);
      }
    }
  };

  const saveToLS = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
  };

  const handleAdd = () => {
    if (!dueDate) return alert('Please select a due date!');
    setTodos([...todos, { id: uuidv4(), todo, dueDate }]);
    setTodo('');
    setDueDate('');
    setStateChange(true);
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(t => t.id !== id));
    setStateChange(true);
  };

  const handleEdit = (id) => {
    let taskToEdit = todos.find(t => t.id === id);
    if (taskToEdit) {
      setTodo(taskToEdit.todo);
      setDueDate(taskToEdit.dueDate);
      setTodos(todos.filter(t => t.id !== id));
      setStateChange(true);
    }
  };

  const getPriorityLevel = (dueDate) => {
    const now = new Date();
    const taskDueDate = new Date(dueDate);
    const diffMs = taskDueDate - now;

    if (diffMs <= 0) return '🔴 Overdue';
    if (diffMs < 86400000) return '🔴 High'; // Less than 1 day
    if (diffMs < 259200000) return '🟠 Medium'; // Less than 3 days
    return '🟢 Low'; // 3+ days
  };

  return (
    <>
      <div className="flex md:container mx-auto my-5 gap-5">
        <div className="w-1/2 bg-violet-100 p-5 rounded-xl">
          <h1 className="font-bold my-5 text-3xl text-center">iTask - Manage your todos</h1>
          <div className="addTodo flex flex-col">
            <h2 className="text-lg font-bold">Add a Todo</h2>
            <div className="flex flex-col gap-2">
              <input onChange={e => setTodo(e.target.value)} value={todo} className="rounded-full px-5" type="text" placeholder="Enter task" />
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="border p-2 rounded-md" />
              <button disabled={todo.length <= 3} onClick={handleAdd} className="bg-violet-800 hover:bg-violet-950 font-bold text-white rounded-md p-2 py-1 mx-2">Save</button>
            </div>
          </div>
          <div className="h-[1px] bg-black opacity-15 mx-auto w-[90%] my-2"></div>
          <h2 className="text-lg font-bold">Your Todos</h2>
          <div className="todos">
            {todos.length === 0 && <div className="m-5">No Todos to display</div>}
            {todos.map(item => (
              <div key={item.id} className="todo flex my-3 justify-between">
                <div className="gap-5 flex">
                  <div>{item.todo} ({item.dueDate}) - Priority: {getPriorityLevel(item.dueDate)}</div>
                </div>
                <div className="buttons flex h-full">
                  <button className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1" onClick={() => handleEdit(item.id)}><FaEdit /></button>
                  <button className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1" onClick={() => handleDelete(item.id)}><MdDelete /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/2 bg-red-100 p-5 rounded-xl">
          <h2 className="text-lg font-bold text-red-600">Priority Tasks</h2>
          {highestPriorityTask ? (
            <div className="p-3 bg-red-300 rounded-md mt-3">
              <h3 className="font-bold">{highestPriorityTask.todo}</h3>
              <p>Due: {highestPriorityTask.dueDate}</p>
              <p className="text-xl font-bold">⏳ {timeLeft}</p>
            </div>
          ) : <p>No priority tasks</p>}
        </div>
      </div>
    </>
  );
}

export default App;
