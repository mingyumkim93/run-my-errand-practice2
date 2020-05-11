import React, { useEffect, useState } from "react";
import history from "../history";
import API from "../utils/API";

export default function Inbox(props) {
    // get messages via props and sort and render them

    const [idNameTable, setIdNameTable] = useState({});

    useEffect(() => {
        let idAndFullName = {};
        if (props.sortedMessages) {
            if (Object.keys(props.sortedMessages).length !== 0) {
                Object.keys(props.sortedMessages).forEach(key => {
                    API.auth.getFullNameById(key).then(res => {
                        idAndFullName = { ...idAndFullName, [key]: res.data[0].firstname + " " + res.data[0].lastname }
                        setIdNameTable(idAndFullName);
                    });
                });
            }
        }
    }, []);

    return (
        <div>
            <div>Inbox Page</div>
            {props.sortedMessages && Object.keys(props.sortedMessages).map((person) =>
                <div onClick={() => history.push(`/message/${person}`)} key={person}>{idNameTable[person]}: {props.sortedMessages[person][props.sortedMessages[person].length - 1].content}</div>
            )}
        </div>
    );
}