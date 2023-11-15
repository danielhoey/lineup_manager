import React from "react";
import {renderReactApp} from "./util";
import {ErrorMessage, Field, Form, Formik, FormikBag, FormikHelpers, FormikState, FormikValues} from "formik";

export const PlayersList = () => {

  const App = () => {
    let players = [{id: 1, first_name: "John", last_name: "Doe", number: 13}];
    let fields = ['first_name', 'last_name', 'number', 'full_forward', 'half_forward', 'center', 'half_back', 'full_back', 'bench', 'absent'];

    //@ts-ignore
    const playerCells = (p) => fields.map((f,i) => <td key={i}>{p[f]}</td>);

    let addPlayer = (values:any, formikBag:FormikHelpers<any>) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        formikBag.setSubmitting(false);
      }, 1000)
    };

    return (
      <div>

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

        <Formik initialValues={{first_name: '', last_name:'', number:null}} onSubmit={addPlayer}>
          {( a:FormikState<any> ) => {
            return (
              <Form>
                <Field type="text" name="first_name"/> <ErrorMessage name="first_name" component="div"/>
                <Field type="text" name="last_name"/> <ErrorMessage name="last_name" component="div"/>
                <Field type="number" name="number"/> <ErrorMessage name="number" component="div"/>
                <button type="submit" disabled={a.isSubmitting}>Submit</button>
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
