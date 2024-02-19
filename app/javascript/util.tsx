import React from "react";
import { StrictMode } from "react"
import ReactDOM from "react-dom/client";
import * as _ from "lodash";

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



//@ts-ignore
export function updateElement(element, elementsArray, setElementsFn, newData){
  const i = elementsArray.indexOf(element);
  for (const [key,value] of Object.entries(newData)) {
    // @ts-ignore
    element[key] = value;
  }
  setElementsFn(Array.from(elementsArray));
}

// @ts-ignore
export function makeTableHeading(sortField, label, sortData, elements, setElementsFn) {
  function handleClick() {
    if (sortData.field == sortField) {
      sortData.dir = sortData.dir * -1;
    } else {
      sortData.field = sortField;
      sortData.dir = 1;
    }

    let newElements = _.sortBy(elements, sortField);
    if (sortData.dir == -1) { newElements.reverse(); }
    setElementsFn(newElements);
  }

  let selected = sortData.field == sortField;
  let descending = false;
  if (selected && sortData.dir == -1) {
    descending = true;
  }
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
