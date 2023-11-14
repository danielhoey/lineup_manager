import React from "react";
import {renderReactApp} from "./util";

export const PlayersList = () => {

  const App = () => {
    let players = [{id: 1, first_name: "John", last_name: "Doe", number: 13}];
    let fields = ['first_name', 'last_name', 'number', 'full_forward', 'half_forward', 'center', 'half_back', 'full_back', 'bench', 'absent'];

    //@ts-ignore
    const playerCells = (p) => fields.map((f,i) => <td key={i}>{p[f]}</td>);

    return (
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
        <tbody>
          {players.map((p) => <tr key={p.id}>{playerCells(p)}</tr> )}
        </tbody>
      </table>
    );
  };

  return {
    render: (elementId:string) => { renderReactApp(elementId, App); }
  }
}
