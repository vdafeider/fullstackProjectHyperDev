import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    // fetch to send login data
    const login = async () => {
        await fetch(`http://localhost:3001/api/login/`,
            {
                headers: {
                'Content-Type': 'application/json',
                },
                method: "POST",
                body: JSON.stringify({mail: email, password: password})
            })
            .then((res) =>res.json())
            .then(myJson=> {
                if (myJson.token){
                    localStorage.setItem('JWT', myJson.token);
                    navigate("/todo");
                } else {
                    alert(myJson.err)
                }
            })
    }

    return (
        <div >
            <form className="login__form">
                <h2 className="">Log In</h2>
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
                <button className='' onClick={(e) => { e.preventDefault(); login() }}>Log in</button>
                <h3 className='link' onClick={() => navigate("/reg")}>New user? Register.</h3>
            </form>
        </div>
    );
}