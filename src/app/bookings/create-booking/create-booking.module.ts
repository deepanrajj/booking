import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import {CreateBookingComponent} from './create-booking.component';
import {FormsModule} from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    declarations: [CreateBookingComponent],
    entryComponents: [CreateBookingComponent]
})
export class CreateBookingModule {}
