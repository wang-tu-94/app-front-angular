import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withHooks } from '@ngrx/signals';
import { lastValueFrom } from 'rxjs';
import {JobType} from "./jobs.model";
import {JobsService} from "./jobs.service";

type JobTypeState = {
  types: JobType[];
  isLoaded: boolean;
  isLoading: boolean;
};

const initialState: JobTypeState = {
  types: [],
  isLoaded: false,
  isLoading: false,
};

export const JobTypeStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, jobsService = inject(JobsService)) => ({

    async loadAll() {
      if (store.isLoaded() || store.isLoading()) return;

      patchState(store, { isLoading: true });
      try {
        const types = await lastValueFrom(jobsService.getAvailableJobTypes());
        patchState(store, {
          types,
          isLoaded: true,
          isLoading: false
        });
      } catch (error) {
        patchState(store, { isLoading: false });
        console.error('Erreur lors du chargement des types de jobs', error);
      }
    }
  })),
  withHooks({
    onInit(store) {
      store.loadAll();
    }
  })
);
