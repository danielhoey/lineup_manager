import React from "react";
import { StrictMode } from "react"
import ReactDOM from "react-dom/client";
import * as _ from "lodash";

export const renderReactApp = (elementId:string, reactApp:React.ElementType) => {
  const FN = reactApp;
  let element = document.getElementById(elementId) as HTMLElement;
  ReactDOM.createRoot(element).render(<StrictMode><FN /></StrictMode>);
}

export const post = (url:string, data:Object):Promise<Response> => fetchJSON(url, 'POST', data);
export const put = (url:string, data:Object):Promise<Response> => fetchJSON(url, 'PUT', data);
export const http_delete = (url:string):Promise<Response> => fetchJSON(url, 'DELETE');

function fetchJSON(url:string, method:string, data?:Object):Promise<Response> {
  const csrf = getCsrfToken();
  let httpParams = {method: method, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-Token': csrf }};
  // @ts-ignore
  if (data) { httpParams.body = JSON.stringify(data); }
  return fetch(url, httpParams).then(response => {
            if (response.ok) { return response.json(); }
            throw new FetchError(response);
          });

}

function getCsrfToken(){
  const element = document.querySelector("meta[name='csrf-token']") as HTMLElement;
  return element.getAttribute("content") || '';
}

class FetchError extends Error {
  private response: Response;
  constructor(response:Response) {
    super(`Fetch() failed with HTTP error ${response.status}`);
    this.response = response;
  }
}

//@ts-ignore
export function updateElement(element, elementsArray, setElementsFn, newData){
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
