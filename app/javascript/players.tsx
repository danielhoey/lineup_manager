import React from "react";
import {renderReactApp} from "./util";

export const PlayersList = () => {
  const App = () => (
    <table>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Number</th>
          <th>FF</th>
          <th>HF</th>
          <th>C</th>
          <th>HB</th>
          <th>FB</th>
          <th>Bench</th>
          <th>Absent</th>
        </tr>
      </thead>
    </table>
  );

  return {
    render: (elementId:string) => { renderReactApp(elementId, App); }
  }
}
