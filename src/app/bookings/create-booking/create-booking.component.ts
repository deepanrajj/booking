import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Place} from '../../places/models/place.model';
import {ModalController} from '@ionic/angular';
import {BookingMode} from '../models/booking.model';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: BookingMode;
  @ViewChild('createBookingForm', { static: true }) createBookingForm: NgForm;
  startDate: string;
  endDate: string;
  constructor(private readonly mdlCtrl: ModalController) { }

  ngOnInit() {
    if (this.selectedMode === 'random') {
      const availableFrom = new Date(this.selectedPlace.availableFrom);
      const availableTo = new Date(this.selectedPlace.availableTo);
      this.startDate = new Date(availableFrom.getTime()
          + Math.random() * (availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - availableFrom.getTime())).toISOString();
      this.endDate = new Date(new Date(this.startDate).getTime()
          + Math.random() * (new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime()))
          .toISOString();
    }
  }

  onBookPlace(): void {
    if (!this.createBookingForm.valid) {
      return;
    }
    this.mdlCtrl.dismiss({
      bookingData: {
        firstName: this.createBookingForm.value['first-name'],
        lastName: this.createBookingForm.value['last-name'],
        guestNumber: this.createBookingForm.value['guest-number'],
        startDate: this.createBookingForm.value['date-from'],
        endDate: this.createBookingForm.value['date-to']
      }
    }, 'confirm', 'booking_modal');
  }

  onCancel(): void {
    this.mdlCtrl.dismiss(null, 'cancel', 'booking_modal');
  }

  datesValid(): boolean {
    const startDate = new Date(this.createBookingForm.value['date-from']);
    const endDate = new Date(this.createBookingForm.value['date-to']);

    return endDate > startDate;
  }
}
