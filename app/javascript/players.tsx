import React from "react";
import {renderReactApp} from "./util";
import {ErrorMessage, Field, Form, Formik, FormikHelpers, FormikState} from "formik";

export const PlayersList = () => {

  const App = () => {
    let players = [{id: 1, first_name: "John", last_name: "Doe", number: 13}];
    let fields = ['name_and_number', 'full_forward', 'half_forward', 'center', 'half_back', 'full_back', 'bench', 'absent'];

    // @ts-ignore
    players.forEach((p) => p.name_and_number = `${p.first_name} ${p.last_name} - #${p.number}`);

    //@ts-ignore
    const playerCells = (p) => fields.map((f,i) => <td key={i}>{p[f]}</td>);

    let addPlayer = (values:any, formikBag:FormikHelpers<any>) => {
      setTimeout(() => {
        //alert(JSON.stringify(values, null, 2));
        formikBag.setErrors({first_name: "bad name"});
        formikBag.setSubmitting(false);
      }, 100)
    };

    return (
      <div>

      <table className="table">
        <thead>
          <tr>
            <th>Player</th>
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

        <Formik initialValues={{first_name: '', last_name:'', number:null}} onSubmit={addPlayer}>
          {( a:FormikState<any> ) => {
            return (
              <Form>
                <div className="d-flex flex-row">
                    <div className="p-2">
                      <Field className="form-control" type="text" name="first_name"/> <ErrorMessage className="error" name="first_name" component="div"/>
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
