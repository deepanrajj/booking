import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlaceService} from '../services/place.service';
import {Place} from '../models/place.model';
import {SegmentChangeEventDetail} from '@ionic/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/services/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  private placeSub: Subscription;
  loadedPlaces: Place[];
  relevantPlaces: Place[];
  isLoaded = false;
  constructor(private readonly placeService: PlaceService,
              private readonly authService: AuthService) { }

  ngOnInit() {
    this.isLoaded = false;
    this.placeSub = this.placeService.allPlaces.subscribe(places => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
    });
  }

  ionViewWillEnter(): void {
    this.placeService.fetchPlaces().subscribe(() => {
      this.isLoaded = true;
    });
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>): void {
    console.log(event);
    if (event.detail.value === 'all') {
      this.relevantPlaces = this.loadedPlaces;
    } else {
      this.relevantPlaces = this.loadedPlaces.filter(place => place.userId !== this.authService.getUserId);
    }
  }

  ngOnDestroy(): void {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
