import React from 'react';
import {useState} from 'react';

interface TodoItem{
  task : string;
  isCompleted : boolean;
}

function Todo(){
    return(
      <div>
      <h1>To Do List</h1>
    </div>
    );
  }

function AddTask(){
  const [todos,setTodos] = useState<TodoItem[]>([]);
  const [task, setTask] = useState<string>('');

const handleNewTask = (event: React.ChangeEvent<HTMLInputElement>) => {
  setTask(event.target.value);
  console.log(event.target.value)
}

const handleClick = (event : React.MouseEvent<HTMLButtonElement>) => {
  if(task === '') return;
  setTodos((todos) => [...todos,{task,isCompleted:false}]);
  setTask('');
}
  return(
    <div>
        <div>
        Add Task : <input placeholder='Add New Task' value={task} onChange={handleNewTask} />
        </div>
        <div>
          <button type="submit" onClick={handleClick}>追加</button>
        </div>
        <ul>
          {todos.map((todo, index) => (
            <li key={index}>{todo.task}</li>
          ))}
        </ul>
      </div>
  )
}

function App() {
  return (
    <div>
      <header className="App-header">
        <Todo />
      </header>
      <main>
        <AddTask />
      </main>
    </div>
  );
}



export default App;
