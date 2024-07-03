import React, {JSX, ReactNode, useState} from "react";
import {makeTableHeading, put, renderReactApp, updateElement} from "./util";
import {Player} from "./players";
import * as _ from "lodash";
import {Simulate} from "react-dom/test-utils";
import play = Simulate.play;
import {upperCase} from "lodash";

export const LineupEditor = (player_data:Player[], lineup_data:any) => {

  const five_by_three_lineup = {"FF": Array(3), "HF": Array(3), "C": Array(3), "HB": Array(3), "FB": Array(3)};

  type PositionKey = {line: string, index: number}

  let sortData = {field: '', dir: -1};
  const App = () => {
    const [players, setPlayers] = useState<Player[]>(player_data);
    const [selectedPlayer, setSelectedPlayer] = useState<Player|null>(null);
    const [selectedPosition, setSelectedPosition] = useState<number>(0);
    const [assignedPositions, setAssignedPositions] = useState<Player[]>(Array(15));

    const [selectedPosition2, setSelectedPosition2] = useState<PositionKey|null>(null);
    const [assignedPositions2, setAssignedPositions2] = useState<{[key:string]:Player[]}>(five_by_three_lineup);

    // @ts-ignore
    function TableHeading({sortField, label}): ReactNode {
        return makeTableHeading(sortField, label, sortData, players, setPlayers);
    }

    // @ts-ignore
     function Position({index, line, i2}) {
      //const p = assignedPositions[index];
      // @ts-ignore
      const p = assignedPositions2[line][i2];
      const position = {line:line, index:i2};
      return (
        <div className="col">
          <div className={(selectedPosition == index) ? "selected position" : "position" } onClick={() => selectPosition(index, position)}>
            {p
              ? <p>{p.number} <br/> {p.first_name} {p.last_name?.charAt(0)}</p>
              : <p>&nbsp;</p>
            }
          </div>
        </div>
      )
    }


    function selectPosition2(newPosition: PositionKey) {
      const prevPosition = selectedPosition2;
      const prevPlayer = selectedPlayer;
      const newPlayer = assignedPositions2[newPosition.line][newPosition.index];

      // if another position is already selected
      if (prevPosition) {
        if (prevPosition == newPosition) {
          clearSelections();
        } else if (newPlayer || prevPlayer) {
          swapPositions2(prevPosition, newPosition);
        } else {
          setSelectedPosition2(newPosition);
        }
        return;
      }

      // if we have already selected a player from the list
      if (selectedPlayer) {
        assignPosition2(selectedPlayer, newPosition);
        return;
      }

      // otherwise just selected this position and player
      setSelectedPosition2(newPosition);
      setSelectedPlayer(newPlayer);
    }


    function selectPosition(newPosition:number, newPosition2:PositionKey) {
      selectPosition2(newPosition2);
      const prevPosition = selectedPosition;
      const prevPlayer = selectedPlayer;
      const newPlayer = assignedPositions[newPosition];

      // if another position is already selected
      if (prevPosition) {
        if (prevPosition == newPosition) {
          clearSelections();
        } else if (newPlayer || prevPlayer) {
          swapPositions(prevPosition, newPosition);
        } else {
          setSelectedPosition(newPosition);
        }
        return;
      }

      // if we have already selected a player from the list
      if (selectedPlayer) {
        assignPosition(selectedPlayer, newPosition);
        return;
      }

      // otherwise just selected this position and player
      setSelectedPosition(newPosition);
      setSelectedPlayer(newPlayer);
    }

    function selectPlayer(p:Player) {
      if (isAssigned(p)) { return; }

      if (selectedPlayer == p) {
        setSelectedPlayer(null); // deselect by click player twice
      }
      else if (selectedPosition) {
        assignPosition(p, selectedPosition);
        if (selectedPosition2) { assignPosition2(p, selectedPosition2); }
      }
      else {
        setSelectedPlayer(p);
      }
    }

    function swapPositions(pos1:number, pos2:number) {
      let newAssignments = Array.from(assignedPositions);
      const player1 = assignedPositions[pos1];
      const player2 = assignedPositions[pos2];
      newAssignments[pos2] = player1;
      newAssignments[pos1] = player2;
      setAssignedPositions(newAssignments);
      clearSelections()
    }

    function swapPositions2(pos1:PositionKey, pos2:PositionKey) {
      //console.log("swapPositions2", pos1, pos2);
      let newAssignments = _.cloneDeep(assignedPositions2);
      const player1 = assignedPositions2[pos1.line][pos1.index];
      const player2 = assignedPositions2[pos2.line][pos2.index];
      //console.log("  player1", player1.first_name);
      //console.log("  player2", player2 && player2.first_name);
      newAssignments[pos2.line][pos2.index] = player1;
      newAssignments[pos1.line][pos1.index] = player2;
      setAssignedPositions2(newAssignments);
      clearSelections()
    }


    function assignPosition(player:Player, position:number) {
      let newAssignments = Array.from(assignedPositions);
      newAssignments[position] = player;
      setAssignedPositions(newAssignments);
      clearSelections()
    }

    function assignPosition2(player:Player, position:PositionKey) {
      let newAssignments = _.clone(assignedPositions2);
      newAssignments[position.line][position.index] = player;
      setAssignedPositions2(newAssignments);
      clearSelections()
    }

    function clearSelections() {
      setSelectedPosition(0);
      setSelectedPlayer(null);

      setSelectedPosition2(null);
      setSelectedPlayer(null);
    }

    function isAssigned(p:Player) {
      return ( assignedPositions.indexOf(p) >= 0 || (_.some(_.values(assignedPositions2), (players) => _.includes(players, p)) ));
    }

    function playerRowClass(p:Player) {
      let className = '';
      if (selectedPlayer == p) { className += 'selected '; }
      if (isAssigned(p)) { className += 'assigned '; }
      return className;
    }


    return (
      <div className="row">
        <div className="col line-up">
          <h3>Line Up</h3>
          <div className="field">
            <div className="row align-items-center">
              <div className="col-1 heading">FF</div>
              <Position index={1} line="FF" i2={0}/>
              <Position index={2} line="FF" i2={1}/>
              <Position index={3} line="FF" i2={2}/>
            </div>
            <div className="row">
              <div className="col-1 heading">HF</div>
              <Position index={4} line="HF" i2={0}/>
              <Position index={5} line="HF" i2={1}/>
              <Position index={6} line="HF" i2={2}/>
            </div>
            <div className="row">
              <div className="col-1 heading">C</div>
              <Position index={7} line="C" i2={0}/>
              <Position index={8} line="C" i2={1}/>
              <Position index={9} line="C" i2={2}/>
            </div>
            <div className="row">
              <div className="col-1 heading">HB</div>
              <Position index={10} line="HB" i2={0}/>
              <Position index={11} line="HB" i2={1}/>
              <Position index={12} line="HB" i2={2}/>
            </div>
            <div className="row">
              <div className="col-1 heading">FB</div>
              <Position index={13} line="FB" i2={0}/>
              <Position index={14} line="FB" i2={1}/>
              <Position index={15} line="FB" i2={2}/>
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
                <tr key={p.id} className={playerRowClass(p)} onClick={() => {
                  selectPlayer(p)
                }}>
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
    );
  };

  return {
    render: (elementId:string) => { renderReactApp(elementId, App); }
  }
}
