import React, {useState} from 'react';
import axios from 'axios';
import history from './history';

export default function SignUp() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const validationEmail = (email) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return (true)
        }
        alert("You have entered an invalid email address!")
        return (false)
    }
    
    return(
        <div>
            <input placeholder="ID" onChange={(e)=>setEmail(e.target.value)}></input>
            <input placeholder="Password" type="password" onChange={(e)=>setPassword(e.target.value)}></input>
            <input placeholder="First Name" onChange={(e)=>setFirstName(e.target.value)}></input>
            <input placeholder="Last Name" onChange={(e)=>setLastName(e.target.value)}></input>
            <button onClick={()=>{
                if(validationEmail(email))
                axios.post("/api/user",{email,password, firstName, lastName, authMethod:'internal'}).then((res)=>console.log(res));
                history.push('/');
                }}>Sign up</button>
        </div>
    )

}