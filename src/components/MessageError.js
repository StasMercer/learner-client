import React from "react";
import { Message } from "semantic-ui-react";

export default function MessageError(props) {
    return (
        <div>
            {Object.keys(props.errors).length > 0 && (
                <Message style={{margin: '10px'}} error list={Object.values(props.errors)} />
            )}
        </div>
    );
}
