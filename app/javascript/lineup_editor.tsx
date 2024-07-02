import React, {JSX, ReactNode, useState} from "react";
import {makeTableHeading, put, renderReactApp} from "./util";
import {Player} from "./players";
import * as _ from "lodash";
import {forEach} from "lodash";

export const LineupEditor = (MatchID: number, fixtureRound:number, quarter:number, playerData:Player[], lineupData:any) => {

  type PositionKey = {line: string, index: number}
  let sortData = {field: '', dir: -1};

  function conformsTo(lineup:{[key:string]:Player[]}, template:{[key:string]:Player[]}) {
    for(let k in lineup) {
      if (lineup[k].length != template[k].length) { return false; }
    }
    return true;
  }

  const fiveByThreeLineup = {"FF": Array(3), "HF": Array(3), "C": Array(3), "HB": Array(3), "FB": Array(3)};
  if (lineupData) {
    if ( !conformsTo(lineupData, fiveByThreeLineup)) {
      alert("Ignoring saved lineup data as it does not match 5 x 3 lineup.");
    } else {
      for (const line in lineupData) {
        lineupData[line].forEach((id:number, i:number) => {
          if (id > 0) {
            const player = _.find(playerData, {id: id});
            // @ts-ignore
            if (player) { fiveByThreeLineup[line][i] = player; }
          }
        });
      }
    }
  }

  const App = () => {
    const [players, setPlayers] = useState<Player[]>(playerData);
    const [selectedPlayer, setSelectedPlayer] = useState<Player|null>(null);
    const [selectedPosition, setSelectedPosition] = useState<PositionKey|null>(null);
    const [assignedPositions, setAssignedPositions] = useState<{[key:string]:Player[]}>(fiveByThreeLineup);

    // @ts-ignore
    function TableHeading({sortField, label}): ReactNode {
        return makeTableHeading(sortField, label, sortData, players, setPlayers);
    }

    // @ts-ignore
    function Position({line, index}) {
      // @ts-ignore
      const position = {line:line, index:index};
      const player = getPlayerAt(position);

      return (
        <div className="col">
          <div className={(_.isEqual(selectedPosition, position)) ? "selected position" : "position" } onClick={() => selectPosition(position)}>
            {player
              ? <p>{player.number} <br/> {player.first_name} {player.last_name?.charAt(0)}</p>
              : <p>&nbsp;</p>
            }
          </div>
        </div>
      )
    }

    function selectPosition(newPosition: PositionKey) {
      const prevPosition = selectedPosition;
      const prevPlayer = selectedPlayer;
      const newPlayer = getPlayerAt(newPosition);

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
        makeAssignments([[selectedPlayer, newPosition]]);
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
        makeAssignments([[p, selectedPosition]]);
      }
      else {
        setSelectedPlayer(p);
      }
    }

    function makeAssignments(assignments: (Player | PositionKey)[][]) {
      let newAssignments = _.cloneDeep(assignedPositions);
      assignments.forEach((p_pk) => {
        const [player,position] = p_pk;
        // @ts-ignore
        newAssignments[position.line][position.index] = player;
      });
      setAssignedPositions(newAssignments);
      clearSelections()
    }

    function swapPositions(pos1:PositionKey, pos2:PositionKey) {
      const player1 = getPlayerAt(pos1);
      const player2 = getPlayerAt(pos2);
      makeAssignments([[player1, pos2], [player2, pos1]]);
    }

    function clearSelections() {
      setSelectedPosition(null);
      setSelectedPlayer(null);
    }

    function isAssigned(p:Player) {
      const players = _.flatten(_.values(assignedPositions));
      return _.includes(_.map(players, 'id'), p.id);
    }

    function getPlayerAt(p:PositionKey) { return assignedPositions[p.line][p.index]; }

    function playerRowClass(p:Player) {
      let className = '';
      if (selectedPlayer == p) { className += 'selected '; }
      if (isAssigned(p)) { className += 'assigned '; }
      return className;
    }

    function Save(quarter?:number) {
      let quarters;
      if (quarter) { quarters = [quarter]; }
      else { quarters = [1,2,3,4]}

      let lineup:{[key:string]:(number)[]} = {};
      for (const line in assignedPositions) {
        lineup[line] = []
        assignedPositions[line].forEach((p,i) => {
          if (p) { lineup[line][i] = p.id;}
          else { lineup[line][i] = -1;}
        })
      }

      put(`/matches/${MatchID}`, {quarters: quarters, lineup: lineup}).
        then(() => {
          if (!quarter || quarter == 4) { window.location.assign("/matches"); }
          else { window.location.assign(urlForQuarter(quarter+1)); }
        }).
        catch(error => { alert('Unexpected Error') });
    }

    function urlForQuarter(quarter:number) { return `/round/${fixtureRound}/quarter/${quarter}`; }

    return (
      <div className="row">
        <div className="col line-up">
          <h3>Quarter {quarter} Lineup</h3>
          <div className="pagination">
            {quarter > 1 ? <a className="page-link" href={urlForQuarter(quarter-1)}>Prev</a> : <div/> }
            {quarter < 4 ? <a className="page-link" href={urlForQuarter(quarter+1)}>Next</a> : <div/> }
          </div>
          <section className="field">
            <div className="row align-items-center">
            <div className="col-1 heading">FF</div>
              <Position line="FF" index={0}/>
              <Position line="FF" index={1}/>
              <Position line="FF" index={2}/>
            </div>
            <div className="row">
              <div className="col-1 heading">HF</div>
              <Position line="HF" index={0}/>
              <Position line="HF" index={1}/>
              <Position line="HF" index={2}/>
            </div>
            <div className="row">
              <div className="col-1 heading">C</div>
              <Position line="C" index={0}/>
              <Position line="C" index={1}/>
              <Position line="C" index={2}/>
            </div>
            <div className="row">
              <div className="col-1 heading">HB</div>
              <Position line="HB" index={0}/>
              <Position line="HB" index={1}/>
              <Position line="HB" index={2}/>
            </div>
            <div className="row">
              <div className="col-1 heading">FB</div>
              <Position line="FB" index={0}/>
              <Position line="FB" index={1}/>
              <Position line="FB" index={2}/>
            </div>
          </section>
          <section>
            <div className="save actions">
              <button className="btn btn-primary" onClick={() => Save(quarter)}>Save - Quarter {quarter}</button>
              <button className="btn btn-secondary" onClick={() => Save()}>Save - Whole Game</button>
            </div>
          </section>
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
