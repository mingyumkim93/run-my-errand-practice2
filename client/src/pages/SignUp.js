import React, { useState } from "react";
import API from "../utils/api";
import history from "../history";

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
    };
    
    return(
        <div>
            <input placeholder="ID" onChange={(e)=>setEmail(e.target.value)}></input>
            <input placeholder="Password" type="password" onChange={(e)=>setPassword(e.target.value)}></input>
            <input placeholder="First Name" onChange={(e)=>setFirstName(e.target.value)}></input>
            <input placeholder="Last Name" onChange={(e)=>setLastName(e.target.value)}></input>
            <button onClick={()=>{
                if(validationEmail(email))
                API.auth.signUp({email, password, first_name: firstName, last_name: lastName, auth_method: "internal"}).then((res)=>console.log(res));
                history.push("/");
                }}>Sign up</button>
        </div>
    );
};