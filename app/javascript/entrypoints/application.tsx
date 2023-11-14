import {PlayersList} from "../players";

declare global {
  interface Window {
    reactApps: {},
  }
}
window.reactApps = {
  'PlayersList': PlayersList,
}