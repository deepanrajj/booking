import {Component, OnDestroy, OnInit} from '@angular/core';
import {Place} from '../models/place.model';
import {PlaceService} from '../services/place.service';
import {IonItemSliding, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  private placeSub: Subscription;
  loadedOffers: Place[];
  isLoaded = false;
  constructor(private readonly placeService: PlaceService,
              private readonly router: Router,
              private readonly loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.isLoaded = false;
    this.placeSub = this.placeService.allPlaces.subscribe(places => {
      this.loadedOffers = places;
    });
  }

  ionViewWillEnter(): void {
    this.loadingCtrl.create({
      message: 'Loading offers...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placeService.fetchPlaces().subscribe(() => {
        this.isLoaded = true;
        loadingEl.dismiss();
      });
    });
  }

  onEdit(offerId: string, slidingItem: IonItemSliding): void {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }

  ngOnDestroy(): void {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
