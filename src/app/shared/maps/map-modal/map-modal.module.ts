import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import {MapModalComponent} from './map-modal.component';
import {GoogleMapsModule} from '@angular/google-maps';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    GoogleMapsModule
  ],
    declarations: [MapModalComponent],
    entryComponents: [MapModalComponent]
})
export class MapModalModule {}
