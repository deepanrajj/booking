import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PlaceService} from '../../services/place.service';
import {AuthService} from '../../../auth/services/auth.service';
import {Place} from '../../models/place.model';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  newOfferForm: FormGroup;
  constructor(private readonly placeService: PlaceService,
              private readonly authService: AuthService,
              private readonly router: Router,
              private readonly loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.newOfferForm = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onCreateOffer(): void {
    if (!this.newOfferForm.valid) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Creating place...'
    }).then(loadingEl => {
      loadingEl.present();
      const newPlace: Place = {
        id: `place${Math.random()}`,
        title: this.newOfferForm.value.title,
        description: this.newOfferForm.value.description,
        imageUrl: 'https://i.picsum.photos/id/1037/400/300.jpg',
        availableFrom: new Date(this.newOfferForm.value.dateFrom),
        availableTo: new Date(this.newOfferForm.value.dateTo),
        price: +this.newOfferForm.value.price,
        userId: this.authService.getUserId
      };
      console.log(newPlace);
      this.placeService.addPlace(newPlace).subscribe(() => {
        this.loadingCtrl.dismiss();
        this.newOfferForm.reset();
        this.router.navigate(['places/tabs/offers']);
      });
    });
  }
}
