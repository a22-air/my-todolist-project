import React from 'react';
import {useState} from 'react';

interface TodoItem{
  task : string;
  isCompleted : boolean;
}

function Todo(){
  const [todos,setTodos] = useState<TodoItem[]>([
    {
      task: 'りんご',
      isCompleted: false,
    },
  ]);
    return(
      <div>
      <h1>To Do List</h1>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo.task}</li>
        ))}
      </ul>
    </div>
    );
  }

function AddTask(){
  return(
    <>
    Add Task : <input placeholder='Add New Task' />
    </>
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
