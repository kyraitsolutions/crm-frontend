import type { ITeam } from "@/types/teams.type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface ITeamsStoreState {
  teams: ITeam[];
  totalTeams: number | null;
}

export const useTeamsStore = create<ITeamsStoreState>()(
  immer<ITeamsStoreState>(() => ({
    teams: [],
    totalTeams: null,
  })),
);

export class TeamsStoreManager {
  private store = useTeamsStore;

  constructor() {
    this.store = useTeamsStore;
  }

  /** Set all teams */
  setTeams(teams: ITeam[]) {
    this.store.setState(() => ({
      teams: [...teams],
      totalTeams: teams.length,
    }));
  }

  /** Push a new team to the top */
  setTeamsTop(team: Partial<ITeam>) {
    this.store.setState((state) => ({
      teams: [team, ...state.teams],
      totalTeams: (state.totalTeams ?? 0) + 1,
    }));
  }

  /** Update existing team */
  updateTeam(updatedTeam: Partial<ITeam>) {
    this.store.setState((state) => {
      const index = state.teams.findIndex(
        (t) => t.userId === updatedTeam.userId,
      );
      if (index !== -1) {
        state.teams[index] = { ...state.teams[index], ...updatedTeam };
      }
    });
  }
  /** Optimistic update + rollback */
  updateTeamOptimistic(updatedTeam: Partial<ITeam>) {
    console.log(updatedTeam);
    const prevTeams = this.store.getState().teams;

    // update immediately
    this.updateTeam(updatedTeam);

    // return rollback function
    return () => {
      this.store.setState(() => ({
        teams: prevTeams,
      }));
    };
  }

  deleteTeam(teamId: string) {
    this.store.setState((state) => ({
      teams: state.teams.filter((team) => team.userId !== teamId),
      totalTeams: state.totalTeams! - 1,
    }));
  }

  deleteTeamsByIds(teamIds: string[]) {
    this.store.setState((state) => ({
      teams: state.teams.filter((team) => !teamIds.includes(team.userId)),
      totalTeams: state.totalTeams! - teamIds.length,
    }));
  }

  deleteTeamOptimistic(teamsIds: string[]) {
    const prevTeams = this.store.getState().teams;
    const prevTotal = this.store.getState().totalTeams;

    // optimistic update
    this.deleteTeamsByIds(teamsIds);

    // rollback function
    return () => {
      this.store.setState(() => ({
        teams: prevTeams,
        totalTeams: prevTotal,
      }));
    };
  }
}
