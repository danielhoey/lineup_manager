import React from "react";
import { StrictMode } from "react"
import ReactDOM from "react-dom/client";

export const renderReactApp = (elementId:string, reactApp:React.ElementType) => {
  const FN = reactApp;
  let element = document.getElementById(elementId) as HTMLElement;
  ReactDOM.createRoot(element).render(<StrictMode><FN /></StrictMode>);
}
