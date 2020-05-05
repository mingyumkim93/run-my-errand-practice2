import React, { useState } from "react";
import API from "../utils/API";
import history from "../history";

export default function SignIn(props) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    return (
        <div>
            <input placeholder="ID" onChange={(e) => setEmail(e.target.value)}></input>
            <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)}></input>
            <button onClick={() => API.auth.login({ email, password }).then((res) => {
                if(res.status ===200 ){
                    let user = res.data;
                    props.setUser(user);
                    history.push("/")}}).catch(err => console.log("err"))}>Sign in</button>
            <button onClick={() => {
                window.open("http://localhost:5000/auth/google", "_self");
            }}>login with google</button>
            <div>First time? Create your account <button onClick={()=>history.push("/signup")}>here</button></div>
        </div>
    );
};