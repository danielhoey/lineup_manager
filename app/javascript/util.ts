import ReactDOM from "react-dom/client";

export const renderReactApp = (elementId:string, app:Function) => {
    let element = document.getElementById(elementId) as HTMLElement;
    ReactDOM.createRoot(element).render(app);
}
