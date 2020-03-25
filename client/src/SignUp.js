import React from 'react';
import axios from 'axios';

export default function SignUp() {

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");

    return(
        <div>
            <input placeholder="ID" onChange={(e)=>setUsername(e.target.value)}></input>
            <input placeholder="Password" type="password" onChange={(e)=>setPassword(e.target.value)}></input>
            <input placeholder="First Name" onChange={(e)=>setFirstName(e.target.value)}></input>
            <input placeholder="Last Name" onChange={(e)=>setLastName(e.target.value)}></input>
            <button onClick={()=>axios.post("/api/user",{username,password, firstName, lastName}).then((res)=>console.log(res))}>Sign up</button> 
        </div>
    )

}