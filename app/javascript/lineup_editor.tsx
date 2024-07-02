import React, {JSX, ReactNode, useState} from "react";
import {makeTableHeading, put, renderReactApp, updateElement} from "./util";
import {Player} from "./players";
import * as _ from "lodash";
import {Simulate} from "react-dom/test-utils";
import play = Simulate.play;
import {upperCase} from "lodash";

export const LineupEditor = (player_data:Player[], lineup_data:any) => {

  let sortData = {field: '', dir: -1};
  const App = () => {
    const [players, setPlayers] = useState<Player[]>(player_data);
    const [selectedPlayer, setSelectedPlayer] = useState<Player|null>(null);
    const [selectedPosition, setSelectedPosition] = useState<number>(0);
    const [assignedPositions, setAssignedPositions] = useState<Player[]>(Array(15));
    const [playerPositions, setPlayerPositions] = useState<{[key:number]:number}>({});

    // @ts-ignore
    function TableHeading({sortField, label}): ReactNode {
        return makeTableHeading(sortField, label, sortData, players, setPlayers);
    }

    // @ts-ignore
    function Position({index}) {
      const p = assignedPositions[index];
      return (
        <div className="col">
          <div className={(selectedPosition == index) ? "selected position" : "position" } onClick={() => selectPosition(index)}>
            {p
              ? <p>{p.number} <br/> {p.first_name} {p.last_name?.charAt(0)}</p>
              : <p>&nbsp;</p>
            }
          </div>
        </div>
      )
    }

    function selectPosition(position:number) {
      const playerAtPosition = assignedPositions[position];
      if (selectedPosition) {
        if (selectedPosition == position) {
          setSelectedPosition(0);
          setSelectedPlayer(null);
        } else if (playerAtPosition) {
          assignPlayerToPosition(assignedPositions[selectedPosition], position);
        } else if (selectedPlayer) {
          assignPlayerToPosition(selectedPlayer, position);
        } else {
          setSelectedPosition(position);
        }
      } else if (selectedPlayer) {
        assignPlayerToPosition(selectedPlayer, position);
      } else {
        setSelectedPosition(position);
        setSelectedPlayer(playerAtPosition);
      }
    }

    function selectPlayer(p:Player) {
      if (selectedPlayer == p) {
        setSelectedPlayer(null);
      }
      else if (selectedPosition) {
        assignPlayerToPosition(p, selectedPosition);
      }
      else {
        setSelectedPlayer(p);
      }
    }

    function assignPlayerToPosition(player:Player, position:number) {
      let newAssignments = Array.from(assignedPositions);
      const existingPosition = assignedPositions.indexOf(player);
      if (existingPosition) { delete newAssignments[existingPosition]; }
      const existingPlayer = assignedPositions[position];
      if (existingPlayer) { newAssignments[selectedPosition] = existingPlayer; }
      updatePosition(newAssignments, player, position);
    }

    function updatePosition(newAssignments:Player[], player:Player, position:number) {
      newAssignments[position] = player;
      setAssignedPositions(newAssignments);
      setSelectedPosition(0);
      setSelectedPlayer(null);
    }

    function playerRowClass(p:Player) {
      let className = '';
      if (selectedPlayer == p) { className += 'selected '; }
      if (assignedPositions.indexOf(p) >= 0) { className += 'assigned '; }
      return className;
    }


    return (
      <div className="row">
        <div className="col line-up">
        <h3>Line Up</h3>
            <div className="field">
              <div className="row align-items-center">
                <div className="col-1 heading">FF</div>
                <Position index={1}/>
                <Position index={2}/>
                <Position index={3}/>
              </div>
              <div className="row">
                <div className="col-1 heading">HF</div>
                <Position index={4}/>
                <Position index={5}/>
                <Position index={6}/>
              </div>
              <div className="row">
                <div className="col-1 heading">C</div>
                <Position index={7}/>
                <Position index={8}/>
                <Position index={9}/>
              </div>
              <div className="row">
                <div className="col-1 heading">HB</div>
                <Position index={10}/>
                <Position index={11}/>
                <Position index={12}/>
              </div>
              <div className="row">
                <div className="col-1 heading">FB</div>
                <Position index={13}/>
                <Position index={14}/>
                <Position index={15}/>
              </div>
            </div>
          </div>
          <div className="col team-list">
            <h3>Team List</h3>
            <table className="table">
              <thead>
              <tr className="sortable-row">
                <TableHeading label="#" sortField="number"/>
                <TableHeading label="Player" sortField="first_name"/>
                <TableHeading label="FF" sortField="full_forward"/>
                <TableHeading label="HF" sortField="half_forward"/>
                <TableHeading label="C" sortField="center"/>
                <TableHeading label="HB" sortField="half_back"/>
                <TableHeading label="FB" sortField="full_back"/>
                <TableHeading label="Bch" sortField="bench"/>
                <TableHeading label="Abs" sortField="absent"/>
              </tr>
              </thead>
              <tbody>
              {players.map((p) =>
                <tr key={p.id} className={playerRowClass(p)} onClick={() => {selectPlayer(p)}}>
                  <td className="number">{p.number}</td>
                  <td>
                    <div className="player">
                      {p.first_name} {p.last_name?.charAt(0)}
                    </div>
                  </td>
                  <td>{p.full_forward}</td>
                  <td>{p.half_forward}</td>
                  <td>{p.center}</td>
                  <td>{p.full_back}</td>
                  <td>{p.half_back}</td>
                  <td>{p.bench}</td>
                  <td>{p.absent}</td>
                </tr>
            )}
          </tbody>
      </table>
    </div>

  </div>

  )
    ;
  };

  return {
    render: (elementId:string) => { renderReactApp(elementId, App); }
  }
}
