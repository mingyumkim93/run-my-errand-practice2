import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function SignIn() {

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    
    return(
        <div>
             <input placeholder="ID" onChange={(e)=>setUsername(e.target.value)}></input>
             <input placeholder="Password" type="password" onChange={(e)=>setPassword(e.target.value)}></input>
             <button onClick={()=>axios.post('/login',{username, password}).then((res)=>console.log(res))}>Sign in</button>
             <div>First time? Create your account <Link to="/signup">here</Link></div>
        </div>
    )

}