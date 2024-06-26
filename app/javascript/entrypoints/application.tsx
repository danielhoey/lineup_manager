import {PlayersList} from "../players";
import {LineupEditor} from "../lineup_editor";
import {MatchesList} from "../matches";

declare global {
  interface Window {
    reactApps: {},
  }
}
window.reactApps = {
  'PlayersList': PlayersList,
  'MatchesList': MatchesList,
  'LineupEditor': LineupEditor,
}