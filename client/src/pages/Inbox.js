import React, { useEffect, useState } from "react";
import history from "../history";
import { connect } from "react-redux";
import api from "../utils/api";

function Inbox({sortedMessages}) {

    //todo: get these from server (not here)
    const [idNameTable, setIdNameTable] = useState(null);
    useEffect(() => {
        let idAndFullName = {};
            if (sortedMessages) {
                Object.keys(sortedMessages).forEach(key => {
                    api.auth.getFullNameById(key).then(res => {
                        idAndFullName = { ...idAndFullName, [key]: res.data[0].first_name + " " + res.data[0].last_name }
                        if(Object.keys(idAndFullName).length === Object.keys(sortedMessages).length) setIdNameTable(idAndFullName);
                    });
                });
        };
    }, [sortedMessages]);

    if(idNameTable)
    return (
        <div>
            <button onClick={()=>console.log(sortedMessages)}>test</button>
            {sortedMessages && Object.keys(sortedMessages).map((person) =>
                <div onClick={() => history.push(`/message/${person}`)} key={person}>{idNameTable[person]} :  {sortedMessages[person][sortedMessages[person].length - 1].content}</div>
            )}
        </div>
    );
    else
    return ( <div>No messages</div>)
};

function mapStateToProps(state) {
    return {
        sortedMessages: state.sortedMessages
    }
};

export default connect(mapStateToProps)(Inbox);