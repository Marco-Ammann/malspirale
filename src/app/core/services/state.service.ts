import { Injectable, signal } from '@angular/core';
import { Workshop } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private _selectedWorkshop = signal<Workshop | null>(null);

  get selectedWorkshop() {
    return this._selectedWorkshop.asReadonly();
  }

  setSelectedWorkshop(workshop: Workshop) {
    this._selectedWorkshop.set(workshop);
  }

  clearSelectedWorkshop() {
    this._selectedWorkshop.set(null);
  }
}
