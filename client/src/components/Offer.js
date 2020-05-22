import React, { useEffect, useState, useCallback } from "react";
import api from "../utils/api";
import socket from "../utils/socket";
function Offer({ message, user }) {

    //todo : timeout

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
        socket.on("state_changed",()=>getCurrentState())
    },[getCurrentState]);

    let buttons = document.getElementsByClassName("offer-control-btn");

    function disableButtons() {
        let i;
        for(i = 0; i < buttons.length; i++){
            buttons[i].disabled = true;
        }
    };

    function notifyWidhdraw() {
        socket.emit("message", { content: `${user.id} has canceled offer`, receiver: message.receiver, sender: user.id, type: "NOTIFICATION" });
    };

    function notifyAccept() {
        socket.emit("message", { content: `${user.id} has accepted offer`, receiver: message.sender, sender: user.id, type: "NOTIFICATION" });
    };

    function notifyConfirm() {
        socket.emit("message", { content: `${user.id} has confirmed offer`, receiver: message.receiver, sender: user.id, type: "NOTIFICATION" });
    };

    function notifyErrandRunning() {
        socket.emit("message", { content: `Now errand is in running mode`, receiver: message.receiver, sender: user.id, type: "NOTIFICATION" });
    };

    function withdrawOffer() {
        disableButtons();
        api.stateTransition.createNewTransition({ object_id: message.id, new_state: "canceled" }).then(res => {
            if(res.status===200)
                notifyWidhdraw();
            // what to do if there is error?
        });
    };

    function accecptOffer() {
        disableButtons();
        api.stateTransition.createNewTransition({ object_id: message.id, new_state: "accepted" }).then(res => {
            if(res.status===200)
                notifyAccept();
        });
    };

    function confirmOffer() {
        disableButtons();
        api.stateTransition.createNewTransition({ object_id: message.id, new_state: "confirmed" }).then(res => {
            if(res.status===200)
                notifyConfirm();
        });
        api.stateTransition.createNewTransition({ object_id: message.errand, new_state: "running" }).then(res => {
            if(res.status===200)
            {
                notifyErrandRunning();
            }
        });
        api.errand.updateErrandToRunningMode({errand:message.errand, runner:user.id, fee:message.fee}).then(res=>{
            // if errand has updated correctly
            // maybe notifyErrandRunning here
        })
    };

    if (offerState === "initial")
        return (
            <>
                {message.sender} : {message.content} {message.createdAt} Fee : {message.fee}
                {message.sender === user.id ? <button className="offer-control-btn" onClick={() => withdrawOffer()}>Withdraw</button> :
                    <button className="offer-control-btn" onClick={() => accecptOffer()}>Accept</button>}
            </>
        );

    else if (offerState === "accepted")
        return (
            <>
                {message.sender} : {message.content} {message.createdAt} Fee : {message.fee}
                {message.sender === user.id ? <div>
                    <button className="offer-control-btn"  onClick={() => confirmOffer()}>Confirm</button>
                    <button className="offer-control-btn"  onClick={() => withdrawOffer()}>WithDraw</button>
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