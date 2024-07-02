import React, {ReactNode, useState} from "react";
import {http_delete, makeTableHeading, post, put, renderReactApp, updateElement} from "./util";
import {ErrorMessage, Field, Form, Formik, FormikHelpers, FormikState} from "formik";
import * as _ from "lodash";
import {Player} from "./players";

export type Match = {
  id: number,
  round: number,
  opponent: string,
  completed: boolean,
}

export const MatchesList = (match_data:Match[]) => {

  const App = () => {
    let matches:Match[];
    let setMatches:Function;
    [matches, setMatches] = useState(match_data);

    let addMatch = (values:any, formikBag:FormikHelpers<any>) => {
      values.round = nextRound();

      function resetForm() {
        formikBag.resetForm();
        document.getElementById('opponent')?.focus();
      }

      setTimeout(() => {
        const r = post("/matches", values);
        r.then(data => setMatches([...matches, data]));
        r.then(() => resetForm());
        r.catch(error => {
          formikBag.setErrors(error);
          resetForm();
        });

      }, 100);

    }

    let nextRound = () => matches.length+1;

    let _delete = (m: Match) => {
      const r = http_delete(`/matches/${m.id}`);
      r.then(() =>  setMatches(_.reject(matches, m)));
      r.catch(error => alert('Unexpected error'));
    }

    return (
      <div>
        <section>
          <table className="table">
            <thead>
            <tr>
              <th>Round</th>
              <th>Opponent</th>
              <th>Line Up Set</th>
              <th/>
            </tr>
            </thead>
            <tbody>
              {matches.map((m) =>
                <tr key={m.id}>
                  <td>{m.round.toString()}</td>
                  <td>{m.opponent}</td>
                  <td>{m.completed
                    ? <a href="/matches/#{m.round}">View Position History</a>
                    : <a href="/matches/#{m.round}">Edit Line Up</a>}
                  </td>
                  <td>
                    {m.round == matches.length
                     ? <img title="Delete" src="/assets/x-square.svg" alt="sort" width="20" height="20" onClick={() => _delete(m)}/>
                     : ""
                    }
                  </td>
                </tr>)
              }
              <Formik initialValues={{opponent: ''}} onSubmit={addMatch}>
                {(a: FormikState<any> ) => {
                  return (
                    <tr>
                      <td>{nextRound()}</td>
                      <td>
                        <Form>
                          <div className="row">
                            <div className="col-sm">
                              <Field id="opponent" className="form-control" type="text" name="opponent" placeholder="Opponent"/>
                              <ErrorMessage className="error" name="opponent" component="div"/>
                            </div>
                            <div className="col-sm">
                              <button className="btn btn-primary" type="submit" disabled={a.isSubmitting}>Submit
                              </button>
                            </div>
                          </div>
                        </Form>
                      </td>
                      <td></td>
                    </tr>
                  );
                }}
              </Formik>

            </tbody>
          </table>
        </section>
      </div>
    );
  };

  return {
    render: (elementId:string) => { renderReactApp(elementId, App); }
  }
}