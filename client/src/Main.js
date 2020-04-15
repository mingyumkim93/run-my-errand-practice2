import React from 'react';
import axios from 'axios';

export default function Main() {

    return (
        <div id="main">
            Description and introduction about this application
            <button onClick={()=>axios.get('/api/auth').then((res)=>console.log(res))}>Auth Test</button>
            <button onClick={()=>{
                const utcNow = new Date().toISOString().slice(0,19).replace('T', ' ');
                axios.post("/api/messages",{sender:"test", receiver:"test", content:"this is test message", createdAt:utcNow}).then(res=>console.log(res)).catch(err=>console.log(err))
            }}>UTC</button>
        </div>
    )
}
