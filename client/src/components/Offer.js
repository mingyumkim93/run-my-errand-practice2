import React, { useEffect, useState, useCallback } from "react";
import api from "../utils/api";
import socket from "../utils/socket";
function Offer({ message, user }) {

    const [offerState, setOfferState] = useState(null);

    const getCurrentState = useCallback(()=> {
        api.stateTransition.getCurrentState(message.id).then(res => {
            if (res.data.length === 0) setOfferState("initial");
            else setOfferState(res.data[0].new_state);
        });
    }, [message]);

    useEffect(() => {
        getCurrentState()
    }, [message, getCurrentState]);

    useEffect(()=>{
        socket.on("offer-state-changed",()=>getCurrentState())
    },[getCurrentState]);

    let buttons = document.getElementsByClassName("offer-control-btn");

    function disableButtons() {
        let i;
        for(i = 0; i < buttons.length; i++){
            buttons[i].disabled = true;
        }
    };

    function changeOfferState(new_state){
        disableButtons();
        socket.emit("offer-state-transition",{object_id: message.id, new_state})
    };

    if (offerState === "initial")
        return (
            <>
                {message.sender} : {message.content} {message.createdAt} Fee : {message.fee}
                {message.sender === user.id ? <button className="offer-control-btn" onClick={() => changeOfferState("canceled")}>Withdraw</button> :
                    <button className="offer-control-btn" onClick={() => changeOfferState("accepted")}>Accept</button>}
            </>
        );

    else if (offerState === "accepted")
        return (
            <>
                {message.sender} : {message.content} {message.createdAt} Fee : {message.fee}
                {message.sender === user.id ? <div>
                    <button className="offer-control-btn"  onClick={() => changeOfferState("confirmed")}>Confirm</button>
                    <button className="offer-control-btn"  onClick={() => changeOfferState("canceled")}>WithDraw</button>
                </div> : <></>}
            </>
        );

    else if (offerState === "canceled")
        return (
            <>
                (Canceled) {message.sender} : {message.content} {message.createdAt} Fee : {message.fee}
            </>
        );
    else if (offerState === "confirmed")
        return (
            <>
                (confirmed) {message.sender} : {message.content} {message.createdAt} Fee : {message.fee}
            </>
        );

    else
        return (
            <>
                <p>Getting offer state</p>
            </>
        );
};

export default Offer;