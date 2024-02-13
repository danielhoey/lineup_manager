import React from "react";
import {useState} from "react";
import {post, renderReactApp} from "./util";
import {ErrorMessage, Field, Form, Formik, FormikHelpers, FormikState} from "formik";

type Player = {
  id: bigint,
  first_name: string,
  last_name: string,
  number: bigint,
  full_forward: bigint,
  half_forward: bigint,
  center: bigint,
  half_back: bigint,
  full_back: bigint,
  bench: bigint,
  absent: bigint,
}
export const PlayersList = (player_data:Player[]) => {

  const App = () => {
    let players:Player[];
    let setPlayers:Function;
    [players, setPlayers] = useState(player_data);

    const nextNumber = players.map((p) => p.number)

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

      }, 100)
    };

    return (
      <div>

      <table className="table">
        <thead>
          <tr>
            <th>Player</th>
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
