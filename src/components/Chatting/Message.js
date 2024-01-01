import React from "react";

const Message = ({userName, Time, Text}) => {
    return (
        <div className="Message">
            <p className="meta">
                <span>{userName}</span> <span>{Time}</span>
            </p>
            <p className="text">{Text}</p>
        </div>
    )
}

export default Message