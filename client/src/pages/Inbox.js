import React, { useEffect, useState } from "react";
import history from "../history";
import { connect } from "react-redux";
import api from "../utils/api";

function Inbox({sortedMessages}) {

    const [idNameTable, setIdNameTable] = useState(null);
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