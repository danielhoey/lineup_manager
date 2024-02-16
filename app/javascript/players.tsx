import React, {useInsertionEffect, useState} from "react";
import {post, renderReactApp} from "./util";
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

    // @ts-ignore
    const TableHeading = ({sortField: sortField, label}) => {
      function handleClick(){ sort(sortField) }
      //TODO: change arrow direction depending on sortDir and indicate which column is currently being sorted
      let selectedSortField = currentSort.field == sortField;
      let descendingSort = false;
      if (selectedSortField && currentSort.dir == -1) { descendingSort = true; }
      return (
          <th data-sort={sortField} onClick={handleClick}>{label}
            <span className={selectedSortField ? 'sort selected' : 'sort'}>
              {descendingSort
                ? <img src="/assets/sort-down.svg" alt="sort" width="20" height="20"/>
                : <img src="/assets/sort-down-alt.svg" alt="sort" width="20" height="20"/>
              }
            </span>
          </th>
      )
    }


    return (
        <div>

        <table className="table">
          <thead>
          <tr className="sortable-row">
            <TableHeading label="Player" sortField="first_name" />
            <TableHeading label="Number" sortField="number" />
            <TableHeading label="FF" sortField="full_forward" />
            <TableHeading label="HF" sortField="half_forward" />
            <TableHeading label="C" sortField="center" />
            <TableHeading label="HB" sortField="half_back" />
            <TableHeading label="FB" sortField="full_back" />
            <TableHeading label="Bench" sortField="bench" />
            <TableHeading label="Absent" sortField="absent" />
          </tr>
          </thead>
          <tbody>
          {players.map((p) =>
              <tr key={p.id}>
                <td>{p.first_name} {p.last_name}</td>
                <td>{p.number}</td>
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

        <Formik initialValues={{first_name: '', last_name:'', number:nextNumber}} onSubmit={addPlayer}>
          {( a:FormikState<any> ) => {
            return (
              <Form>
                <div className="d-flex flex-row">
                    <div className="p-2">
                      <Field id="first_name_input" className="form-control" type="text" name="first_name"/> <ErrorMessage className="error" name="first_name" component="div"/>
                    </div>
                    <div className="p-2">
                      <Field className="form-control" type="text" name="last_name"/> <ErrorMessage className="error" name="last_name" component="div"/>
                    </div>
                    <div className="p-2">
                      <Field className="form-control" type="number" name="number"/> <ErrorMessage className="error" name="number" component="div"/>
                    </div>
                    <div className="p-2">
                      <button className="btn btn-primary" type="submit" disabled={a.isSubmitting}>Submit</button>
                    </div>
                </div>
              </Form>
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
