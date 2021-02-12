import {Component, OnDestroy, OnInit} from '@angular/core';
import {Place} from '../../models/place.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {PlaceService} from '../../services/place.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  private placeSub: Subscription;
  place: Place;
  editOfferForm: FormGroup;
  placeId: string;
  isLoaded = false;
  constructor(private readonly route: ActivatedRoute,
              private readonly navCtrl: NavController,
              private readonly placeService: PlaceService,
              private readonly loadingCtrl: LoadingController,
              private readonly router: Router,
              private readonly alertCtrl: AlertController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.isLoaded = false;
      this.placeId = paramMap.get('placeId');
      this.placeSub = this.placeService.getPlace(this.placeId).subscribe(place => {
        this.place = place;
        this.editOfferForm = new FormGroup({
          title: new FormControl(this.place.title, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          description: new FormControl(this.place.description, {
            updateOn: 'blur',
            validators: [Validators.required,
              Validators.maxLength(180)]
          })
        });
        this.isLoaded = true;
      }, (error) => {
        this.alertCtrl.create({
          header: 'An error occurred',
          message: 'Place does not exist. Please try again later.',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.router.navigate(['/places/tabs/offers']);
              }
            }
          ]
        }).then(alertEl => {
          alertEl.present();
        });
      });
    });
  }

  onEditOffer(): void {
    if (!this.editOfferForm.valid) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Updating place...'
    }).then(loadingEl => {
      loadingEl.present();
      const updatedPlace: Place = {
        id: this.place.id,
        title: this.editOfferForm.value.title,
        description: this.editOfferForm.value.description,
        imageUrl: this.place.imageUrl,
        price: this.place.price,
        availableFrom: this.place.availableFrom,
        availableTo: this.place.availableTo,
        userId: this.place.userId
      };
      this.placeService.updatePlace(updatedPlace).subscribe(() => {
        this.loadingCtrl.dismiss();
        this.editOfferForm.reset();
        this.router.navigate(['/places/tabs/offers']);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
