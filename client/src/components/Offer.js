import React, { useEffect, useState } from "react";
import api from "../utils/api";
import socket from "../utils/socket";
function Offer({ message, user }) {

    const [offerState, setOfferState] = useState(null);

    useEffect(() => {
        api.stateTransition.getCurrentState(message.id).then(res => {
            if (res.data.length === 0) setOfferState("initial");
            else setOfferState(res.data[0].new_state);
        });
    }, [message]);

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
        api.stateTransition.createNewTransition({ object_id: message.id, new_state: "canceled" }).then(res => {
            // if db has updated successfully
            notifyWidhdraw();
        });
    };

    function accecptOffer() {
        api.stateTransition.createNewTransition({ object_id: message.id, new_state: "accepted" }).then(res => {
            // if db has updated successfully
            notifyAccept();
        });
    };

    function confirmOffer() {
        api.stateTransition.createNewTransition({ object_id: message.id, new_state: "confirmed" }).then(res => {
            // if db has updated successfully
            notifyConfirm();
        });
        api.stateTransition.createNewTransition({ object_id: message.errand, new_state: "running" }).then(res => {
            // if db has updated successfully
            notifyErrandRunning();
        });
    };

    if (offerState === "initial")
        return (
            <>
                {message.sender} : {message.content} {message.createdAt}
                {message.sender === user.id ? <button onClick={() => withdrawOffer()}>Withdraw</button> :
                    <button onClick={() => accecptOffer()}>Accept</button>}
            </>
        );

    else if (offerState === "accepted")
        return (
            <>
                {message.sender} : {message.content} {message.createdAt}
                {message.sender === user.id ? <div>
                    <button onClick={() => confirmOffer()}>Confirm</button>
                    <button onClick={() => withdrawOffer()}>WithDraw</button>
                </div> : <></>}
            </>
        );

    else if (offerState === "canceled")
        return (
            <>
                (Canceled) {message.sender} : {message.content} {message.createdAt}
            </>
        );
    else if (offerState === "confirmed")
        return (
            <>
                (confirmed) {message.sender} : {message.content} {message.createdAt}
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