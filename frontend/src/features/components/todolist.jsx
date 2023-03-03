import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { Context } from '../../context';

export default function ToDoList() {
    const [askRerender, setAskRerender] = useContext(Context);
    const [todoList, setTodoList] = useState([])
    const [todo, setTodo] = useState();
    const [id, setId] = useState();
    const [index, setIndex] = useState(-1);

    // fetch to rerender todo list after first pageload and after any changes made
    useEffect(() => {
        fetch(`http://localhost:3001/api/todo/`,
        {
            headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'token':`${localStorage.getItem('JWT')}`
            },
            method: "GET",
        })
            .then((res) =>res.json())
            .then(myJson=> {
                if (myJson.err){
                    alert(myJson.err);
                } else {
                  setTodoList(myJson);
                }
            })
        },
        [askRerender]);

        // fetch to delete todo by id
        function deleteTodo(event){
            fetch(`http://localhost:3001/api/todo/${event.currentTarget.id}`,
            {
                headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'token':`${localStorage.getItem('JWT')}`
                },
                method: "DELETE",
            })
                .then((res) =>res.json())
                .then(myJson=> {setAskRerender(!askRerender)})
        };

        // function to render edit mode for selected ToDo
        function editViewFn (ind, id) {
            setId(id);
            setIndex(ind);
            setTodo(todoList[ind].toDo)
            setAskRerender(!askRerender);
        }

        // fetch to send modified ToDo data by id
        const modifyTodo =(event)=>{
            if (todo.length<141) {
                fetch(`http://localhost:3001/api/todo/?id=${id}&todo=${todo}`,
                {
                    headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                    'token':`${localStorage.getItem('JWT')}`
                    },
                    method: "PUT",
                })
                .then((r) => {
                    setId(-1);
                    setIndex(-1);
                    setTodo('')
                    setAskRerender(!askRerender);
                })
            } else {
                alert ('The input length exceed 140 characters');
            }
                
        }

        // Outputs all ToDos
        const RenderList = todoList.map((element,ind) => {
            // renders edit mode for ToDo
            if (ind==index) {
                return <li key={element._id} className="listOfTodos__ul-li">
                <input type="text" value={todo} onChange={(e) => setTodo(e.target.value)}/>
                <button onClick={modifyTodo}>Save</button>
                </li>
            }else{
            // renders readonly mode for ToDo
                return <li key={element._id} className="listOfTodos__ul-li">
                {element.toDo}
                <span style={{color:'yellow', fontSize:'20px'}} onClick={() => editViewFn(ind, element._id)}>✎</span>
                <span id={element._id} onClick={deleteTodo}>❌</span>
                </li>}
        });

    return (
        <div className='todo__wrapper'>
                <h2 className="todolist__h">ToDo LIST:</h2>
                <ul className='tasklist__ul'>
                {RenderList}
                </ul>
        </div>
    );
}