import React, { useEffect, useState } from "react";
import history from "../history";
import api from "../utils/api";
import socket from "../utils/socket";
import { connect } from "react-redux";

function ErrandDetail({user}) {

    const [errand, setErrand] = useState(null);
    const [fee, setFee] = useState(null);
    const [content, setContent] = useState(null);

    useEffect(() => {
        fetchErrand();
    },[]);

    function fetchErrand(){
        api.errand.fetchAErrand(window.location.pathname).then(res=>{
           if(res.data.length===0)
               {alert("Not Found!"); history.push("/search")}
            setErrand(res.data[0])}).catch(err=>alert("Something went wrong!", err));
    };

    function sendOffer(){
        socket.emit("message", { content, fee, receiver: errand.id, sender: user.id, type:"OFFER" });
    };

    if (!errand) return( <div> loading...</div>);
    return (
        <div>
            <div>ErrandDetail</div>
            <div>{errand.id}</div>
            <div>{errand.title}</div>
            <div>{errand.description}</div>
            <div>{errand.fee}</div>
            <div>
                <h3>Create offer</h3>
                <input placeholder="fee" type="number" onChange={(e)=> setFee(e.target.value)}/>
                <input placeholder="comment to poster" onChange={(e)=> setContent(e.target.value)}/>
                <button onClick={()=>sendOffer()}>Send Offer</button>
            </div>
            {/* prevent user change url to whatever number && only authenticated user can send message */}
            <div onClick={()=>history.push(`/message/${errand.poster}`)}>Contact host</div>
        </div>
    );
};

function mapStateToProps(state){
    return{
        user: state.user
    }
};

export default connect(mapStateToProps)(ErrandDetail);