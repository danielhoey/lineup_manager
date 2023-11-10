import React from "react";
import {renderReactApp} from "./util"

export const PlayersList = () => {
    let PlayerListApp = () => <h1>Hello from React!</h1>;

    return {
        render: (elementId:string) => renderReactApp(elementId, PlayerListApp),
    }
}
