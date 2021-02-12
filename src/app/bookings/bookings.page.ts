import {Component, OnDestroy, OnInit} from '@angular/core';
import {Booking} from './models/booking.model';
import {BookingService} from './services/booking.service';
import {IonItemSliding, LoadingController} from '@ionic/angular';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  bookingSub: Subscription;
  isLoaded = false;
  constructor(private readonly bookingService: BookingService,
              private readonly loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.isLoaded = false;
    this.bookingSub = this.bookingService.getAllBookings().subscribe(bookings => {
      this.loadedBookings = bookings;
    });
  }

  ionViewWillEnter() {
    this.bookingService.fetchBookings().subscribe(() => {
      this.isLoaded = true;
    });
  }

  onDelete(bookingId: string, slidingBooking: IonItemSliding): void {
    slidingBooking.close();
    this.loadingCtrl.create({
      message: 'Deleting booking...'
    }).then(loadingEl => {
      loadingEl.present();
      this.bookingService.deleteBooking(bookingId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }

  ngOnDestroy(): void {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }
}
