import React, { useEffect, useState } from "react";
import history from "../history";
import API from "../utils/api";

export default function ErrandDetail() {

    const [errand, setErrand] = useState(null);
    function fetchErrand(){
        API.errand.fetchAErrand(window.location.pathname).then(res=>{
           if(res.data.length===0)
               {alert("Not Found!"); history.push("/search")}
            setErrand(res.data[0])}).catch(err=>alert("Something went wrong!", err));
    };
    
    useEffect(() => {
        fetchErrand();
    },[]);


    if (!errand) return( <div> loading...</div>);
    return (
        <div>
            <div>ErrandDetail</div>
            <div>{errand.id}</div>
            <div>{errand.title}</div>
            <div>{errand.description}</div>
            {/* prevent user change url to whatever number && only authenticated user can send message */}
            <div onClick={()=>history.push(`/message/${errand.poster}`)}>Contact host</div>
        </div>
    );
};