import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { Context } from '../../context';

export default function NewToDo() {
    const [askRerender, setAskRerender] = useContext(Context);
    const navigate = useNavigate();
    const [todo, setTodo] = useState('')

    useEffect(() => {
        const user=localStorage.getItem('JWT');
        !user&&navigate("/");
      },[]);

    // fetch to send new todo info
    const handleAddTodo = async(event) => {
        if (todo!=='') {
            event.preventDefault();
                if (todo.length<141) {
                    await fetch(`http://localhost:3001/api/todo/?todo=${todo}`,
                    {
                        headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/json',
                        'token':`${localStorage.getItem('JWT')}`
                        },
                        method: "POST",
                    })
                        .then((res) =>res.json())
                        .then(myJson=> {
                            if (myJson.err){
                                alert(myJson.err)
                            } else {
                                setAskRerender(!askRerender)
                            }
                        })
                    setTodo('');
                } else {
                    alert ('The input length exceed 140 characters')
                }
        } else {
            event.preventDefault();
            alert ('The input field is empty.')}
    };

    return (
        <div className="newTodo__wrapper">
            <h3 className="logout" onClick={()=> {localStorage.clear(); navigate("/")}}>Log Out</h3>
                <form className='newTodo'>
                <label>ADD NEW TASK:
                    <input type="text"
                    className='addnewtask__form-input'
                    name="value" 
                    onChange={(e) => setTodo(e.target.value)} value={todo}/>
                <span className='note'>Maximum 140 characters</span>
                </label>
                <button className='addnewtask__form-addbtn' onClick={handleAddTodo}>Add</button>
            </form>
        </div>
    );
}