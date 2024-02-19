import {PlayersList} from "../players";
import {LineupEditor} from "../lineup_editor";

declare global {
  interface Window {
    reactApps: {},
  }
}
window.reactApps = {
  'PlayersList': PlayersList,
  'LineupEditor': LineupEditor,
}