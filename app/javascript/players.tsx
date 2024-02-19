import React, {useInsertionEffect, useState} from "react";
import {http_delete, post, put, renderReactApp} from "./util";
import {ErrorMessage, Field, Form, Formik, FormikHelpers, FormikState} from "formik";
import * as _ from "lodash";

type Player = {
  id: bigint,
  first_name: string,
  last_name: string,
  number: number,
  full_forward: number,
  half_forward: number,
  center: number,
  half_back: number,
  full_back: number,
  bench: number,
  absent: number,
  editing: boolean,
}
export const PlayersList = (player_data:Player[]) => {

  let currentSort = {field: '', dir: -1};
  const App = () => {
    let players:Player[];
    let setPlayers:Function;
    [players, setPlayers] = useState(player_data);

    const nextNumber = Math.max(...players.map((p) => p.number))+1;

    let addPlayer = (values:any, formikBag:FormikHelpers<any>) => {
      function resetForm() {
        formikBag.resetForm();
        document.getElementById('first_name_input')?.focus();
      }

      setTimeout(() => {
        if (players.filter((p) => { return p.number == values.number}).length > 0) {
          formikBag.setErrors({number: "number already taken"});
          formikBag.setSubmitting(false);
          return;
        }

        const r = post("/players", values);
        r.then(data => setPlayers([...players, data]));
        r.then(() => resetForm());
        r.catch(error => {
          formikBag.setErrors(error);
          resetForm();
        });

      }, 100);
    };

    function sort(field:string) {
      if (currentSort.field == field) {
        currentSort.dir = currentSort.dir * -1;
      } else {
        currentSort.field = field;
        currentSort.dir = 1;
      }

      let newPlayers = _.sortBy(players, field);
      if (currentSort.dir == -1) { newPlayers.reverse(); }
      setPlayers(newPlayers);
    }

    function _delete(player:Player){
      const r = http_delete(`/players/${player.id}`);
      r.then((data:any) => {
        if (data.deleted){
          setPlayers(_.reject(players, {id: player.id}));
        } else {
          updatePlayer(player, data)
        }
      });
      r.catch(error => { alert('Unexpected Error') });
    }

    function updatePlayer(player:Player, data:any) {
      const i = players.indexOf(player);
      let playersClone = Array.from(players);
      let newPlayer = {...player};
      for (const [key,value] of Object.entries(data)) {
        // @ts-ignore
        newPlayer[key] = value;
      }
      playersClone[i] = newPlayer;
      setPlayers(playersClone);
    }

    function savePlayer() {
      const player = players.find((p) => p.editing);
      if (player) {
        updatePlayer(player, {editing: false});
        put(`/players/${player.id}`, player).
          catch(error => { alert('Unexpected Error') });
      }
    }
    function cancelEdit(){ window.location.reload(); }

    // @ts-ignore
    const TableHeading = ({sortField, label}) => {
      function handleClick(){ sort(sortField) }
      let selected = currentSort.field == sortField;
      let descending = false;
      if (selected && currentSort.dir == -1) { descending = true; }
      return (
          <th className={label.toLowerCase()} onClick={handleClick}>{label}
            <span className={selected ? 'sort selected' : 'sort'}>
              {descending
                ? <img src="/assets/sort-down.svg" alt="sort" width="20" height="20"/>
                : <img src="/assets/sort-down-alt.svg" alt="sort" width="20" height="20"/>
              }
            </span>
          </th>
      )
    }


    return (
        <div>

          <section>
            <table className="table">
              <thead>
              <tr className={"top-level-heading"}>
                <th colSpan={3}>Player</th>
                <th className={"stats"} colSpan={7}>Stats</th>
              </tr>
              <tr className="sortable-row">
                  <TableHeading label="Name" sortField="first_name"/>
                  <TableHeading label="Number" sortField="number"/>
                  <th className={"edit"}>
                  </th>
                  <TableHeading label="FF" sortField="full_forward"/>
                  <TableHeading label="HF" sortField="half_forward"/>
                  <TableHeading label="C" sortField="center"/>
                  <TableHeading label="HB" sortField="half_back"/>
                  <TableHeading label="FB" sortField="full_back"/>
                  <TableHeading label="Bench" sortField="bench"/>
                  <TableHeading label="Absent" sortField="absent"/>
                </tr>
              </thead>
              <tbody>
              {players.map((p) =>
                  <tr key={p.id}>
                    <td>
                      {p.editing
                          ? <div><input type="text" value={p.first_name} onChange={(e) => updatePlayer(p, {'first_name': e.target.value})}/> <input type="text" value={p.last_name} onChange={(e) => updatePlayer(p, {'last_name': e.target.value})}/></div>
                          : <p>{p.first_name} {p.last_name}</p>
                      }
                    </td>
                    <td>
                      {p.editing
                        ? <input type="number" value={p.number} onChange={(e) => updatePlayer(p, {'number': e.target.value})}/>
                        : <p>{p.number}</p>
                      }
                    </td>
                    <td className="actions">
                      {p.editing
                        ? <div>
                            <img title="Save" src="/assets/floppy.svg" alt="sort" width="20" height="20" onClick={savePlayer}/>
                            <img title="Cancel" src="/assets/cancel.svg" alt="sort" width="20" height="20" onClick={cancelEdit}/>
                          </div>
                          : <div>
                            <img title="Edit" src="/assets/pencil-square.svg" alt="sort" width="20" height="20" onClick={() => updatePlayer(p, {editing: true})}/>
                            <img title="Delete" src="/assets/x-square.svg" alt="sort" width="20" height="20" onClick={() => _delete(p)}/>
                          </div>
                      }
                    </td>
                    <td>{p.full_forward}</td>
                    <td>{p.half_forward}</td>
                    <td>{p.center}</td>
                    <td>{p.full_back}</td>
                    <td>{p.half_back}</td>
                    <td>{p.bench}</td>
                    <td>{p.absent}</td>
                  </tr>)}
              </tbody>
            </table>
          </section>

          <Formik initialValues={{first_name: '', last_name: '', number: ''}} onSubmit={addPlayer}>
            {( a:FormikState<any> ) => {
            return (
                <section>
                  <Form>
                    <div className="row">
                      <h5>New Player</h5>
                    </div>
                    <div className="row">
                      <div className="col-sm">
                        <Field id="first_name_input" className="form-control" type="text" name="first_name"
                               placeholder="First name"/> <ErrorMessage className="error" name="first_name"
                                                                        component="div"/>
                      </div>
                      <div className="col-sm">
                        <Field className="form-control" type="text" name="last_name" placeholder="Last name"/>
                        <ErrorMessage className="error" name="last_name" component="div"/>
                      </div>
                      <div className="col-sm">
                        <Field className="form-control" type="number" name="number" placeholder={"Number"} min={0}/> <ErrorMessage className="error"
                                                                                                    name="number"
                                                                                                    component="div"/>
                      </div>
                      <div className="col-sm">
                        <button className="btn btn-primary" type="submit" disabled={a.isSubmitting}>Submit</button>
                      </div>
                    </div>
                  </Form>
                </section>
          );
          }}
          </Formik>
          </div>

    );
  };

  return {
    render: (elementId:string) => { renderReactApp(elementId, App); }
  }
}
