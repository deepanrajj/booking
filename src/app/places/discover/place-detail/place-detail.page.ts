import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActionSheetController, AlertController, LoadingController, ModalController, NavController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {PlaceService} from '../../services/place.service';
import {Place} from '../../models/place.model';
import {CreateBookingComponent} from '../../../bookings/create-booking/create-booking.component';
import {Booking, BookingMode} from '../../../bookings/models/booking.model';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../auth/services/auth.service';
import {BookingService} from '../../../bookings/services/booking.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  private placeSub: Subscription;
  place: Place;
  isLoaded = false;
  constructor(private readonly route: ActivatedRoute,
              private readonly navCtrl: NavController,
              private readonly placeService: PlaceService,
              private readonly mdlCtrl: ModalController,
              private readonly actionSheetCtrl: ActionSheetController,
              private readonly authService: AuthService,
              private readonly bookingService: BookingService,
              private readonly loadingCtrl: LoadingController,
              private readonly router: Router,
              private readonly alertCtrl: AlertController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.isLoaded = false;
      const placeId = paramMap.get('placeId');
      this.placeSub = this.placeService.getPlace(placeId).subscribe(place => {
        this.place = place;
        this.isLoaded = true;
      }, (error) => {
        this.alertCtrl.create({
          header: 'An error occurred',
          message: 'Place does not exist. Please try again later.',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.router.navigate(['/places/tabs/discover']);
              }
            }
          ]
        }).then(alertEl => {
          alertEl.present();
        });
      });
    });
  }

  onBookPlace(): void {
    this.actionSheetCtrl.create({
      header: 'Choose an action',
      buttons: [{
        text: 'Select Date',
        handler: () => {
          this.openBookModal('select');
        }
      }, {
        text: 'Random Date',
        handler: () => {
          this.openBookModal('random');
        }
      }, {
        text: 'Cancel',
        role: 'cancel'
      }]
    }).then(actionEl => {
      actionEl.present();
    });
  }

  openBookModal(mode: BookingMode): void {
    console.log(mode);
    this.mdlCtrl.create({
      id: 'booking_modal',
      component: CreateBookingComponent,
      componentProps: {
        selectedPlace: this.place,
        selectedMode: mode
      }
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resultData => {
      if (resultData.role === 'confirm') {
        this.loadingCtrl.create({
          message: 'Creating booking...'
        }).then(loadingEl => {
          loadingEl.present();
          console.log(resultData.data);
          const newBooking: Booking = {
            id: `booking_${Math.random()}`,
            firstName: resultData.data.bookingData.firstName,
            lastName: resultData.data.bookingData.lastName,
            guestNumber: +resultData.data.bookingData.guestNumber,
            bookedFrom: new Date(resultData.data.bookingData.startDate),
            bookedTo: new Date(resultData.data.bookingData.endDate),
            placeId: this.place.id,
            placeTitle: this.place.title,
            placeImage: this.place.imageUrl,
            userId: this.authService.getUserId
          };
          this.bookingService.addBooking(newBooking).subscribe(() => {
            loadingEl.dismiss();
            this.router.navigate(['/bookings']);
          });
        });
      }
    });
  }

  isBookable(): boolean {

    return this.place.userId !== this.authService.getUserId;
  }

  ngOnDestroy(): void {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
