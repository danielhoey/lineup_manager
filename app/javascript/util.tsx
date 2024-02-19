import React from "react";
import { StrictMode } from "react"
import ReactDOM from "react-dom/client";

export const renderReactApp = (elementId:string, reactApp:React.ElementType) => {
  const FN = reactApp;
  let element = document.getElementById(elementId) as HTMLElement;
  ReactDOM.createRoot(element).render(<StrictMode><FN /></StrictMode>);
}

export function post(url:string, data:Object):Promise<Response> {
  let csrf = getCsrfToken();
  let promise = fetch(url, {method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf }, body: JSON.stringify(data)});
  return promise.then(response => response.json());
}

export function put(url:string, data:Object):Promise<Response> {
  let csrf = getCsrfToken();
  let promise = fetch(url, {method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf }, body: JSON.stringify(data)});
  return promise.then(response => response.json());
}

export function http_delete(url:string):Promise<Response> {
  let csrf = getCsrfToken();
  let promise = fetch(url, {method: 'DELETE', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf }});
  return promise.then(response => response.json());
}

function getCsrfToken(){
  const element = document.querySelector("meta[name='csrf-token']") as HTMLElement;
  return element.getAttribute("content") || '';
}