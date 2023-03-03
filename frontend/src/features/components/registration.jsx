import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Registration() {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // fetch to send register data for new user
    const register = async () => {
        await fetch(`http://localhost:3001/api/register/`,
            {
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
                method: "POST",
                body: JSON.stringify({name:name, mail: email, password: password})
            })
            .then((res) =>res.json())
            .then(myJson=> {
                if (myJson.err){
                    alert(myJson.err)
                } else {
                    alert("Successfully registered. Log in using your email and password.");
                    navigate("/");
                }
            })
    }

    return (
        <div >
            <form className="login__form">
                <h2 className="">Register new user</h2>
                <label htmlFor="name">Name:
                    <input
                        type="text"
                        required
                        id='name'
                        className=''
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                </label>
                <label htmlFor="email">Email:
                    <input
                        type="text"
                        required
                        id='email'
                        className=''
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label htmlFor="pass">Password:
                    <input
                        type="password"
                        required
                        id='pass'
                        className=''
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </label>
                <button className='' onClick={(e) => { e.preventDefault(); register() }}>Register</button>
                <h3 className='link' onClick={() => navigate("/")}>Already registered? LogIn.</h3>
            </form>
        </div>
    );
}