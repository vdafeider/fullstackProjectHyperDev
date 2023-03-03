import './App.css';
import Registration from './features/components/registration';
import Login from './features/components/login';
import NewToDo from './features/components/newtodo';
import ToDoList from './features/components/todolist';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import { Context } from "./context.js";


function App() {

  // Context hook to unite components state (rerender one child component by request of another child)
  const [askRerender, setAskRerender] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    const user=localStorage.getItem('JWT');
    user&&navigate("/todo");
  },[]);

  return (
    <div className="App">
      <Routes>
        <Route exact path="/reg" element={<Registration/>} />
        <Route exact path="/" element={<Login/>} />
          <Route path="/todo" element={
            <Context.Provider value={[askRerender, setAskRerender]}>
              <NewToDo/>
              <ToDoList/>
            </Context.Provider>
          } />
      </Routes>
    </div>
  );
}

export default App;
