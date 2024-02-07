import React from "react";
import { StrictMode } from "react"
import ReactDOM from "react-dom/client";
import {FormikHelpers} from "formik";

export const renderReactApp = (elementId:string, reactApp:React.ElementType) => {
  const FN = reactApp;
  let element = document.getElementById(elementId) as HTMLElement;
  ReactDOM.createRoot(element).render(<StrictMode><FN /></StrictMode>);
}

export function post(url:string, data:Object, form:FormikHelpers<any>|null):Promise<Response> {
  const element = document.querySelector("meta[name='csrf-token']") as HTMLElement;
  const csrf = element.getAttribute("content") || '';

  const promise = fetch(url, {method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf }, body: JSON.stringify(data)});
  promise.then(response => response.json());

  if (form) {
    promise.then(() => form.resetForm());
    promise.catch(error => {
      form.setErrors(error);
      form.resetForm();
    });
  }
  return promise;
}