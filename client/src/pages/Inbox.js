import React, { useEffect, useState } from "react";
import history from "../history";
import { connect } from "react-redux";
import api from "../utils/api";

function Inbox({messages, user}) {

    const [idNameTable, setIdNameTable] = useState(null);
    const [sortedMessages, setSortedMessages] = useState(null);
    useEffect(()=>{
        if(messages && user){
            let sortedMessages = {};
            messages.forEach(message => {
                      // if the message is sent to me
                      if (message.sender !== user.id) {
                        // first message with this user
                        if (!sortedMessages[message.sender]) {
                          sortedMessages = { ...sortedMessages, [message.sender]: [message] };
                        }
                        else {
                          sortedMessages[message.sender].push(message);
                        }
                      }
                      // if the message is sent by me
                      else {
                        if (!sortedMessages[message.receiver]) {
                          sortedMessages = { ...sortedMessages, [message.receiver]: [message] };
                        }
                        else {
                          sortedMessages[message.receiver].push(message);
                        }
                      }
                    });
            setSortedMessages(sortedMessages);
    }},[messages, user]);

    useEffect(() => {
        let idAndFullName = {};
            if (sortedMessages) {
                Object.keys(sortedMessages).forEach(key => {
                    api.auth.getFullNameById(key).then(res => {
                        idAndFullName = { ...idAndFullName, [key]: res.data[0].firstname + " " + res.data[0].lastname }
                        if(Object.keys(idAndFullName).length === Object.keys(sortedMessages).length) setIdNameTable(idAndFullName);
                    });
                });
        };
    }, [sortedMessages]);

    if(idNameTable)
    return (
        <div>
            <div>Inbox Page</div>
            <button onClick={()=>console.log(idNameTable)}>asd</button>
            {sortedMessages && Object.keys(sortedMessages).map((person) =>
                <div onClick={() => history.push(`/message/${person}`)} key={person}>{idNameTable[person]} :  {sortedMessages[person][sortedMessages[person].length - 1].content}</div>
            )}
        </div>
    );
    else
    return ( <div>Loding...</div>)
};

function mapStateToProps(state) {
    return {
        messages: state.messages,
        user: state.user
    }
};

export default connect(mapStateToProps)(Inbox);