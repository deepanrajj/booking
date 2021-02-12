import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit {
  @ViewChild('googleMap', { static: false }) googleMapElRef: ElementRef;
  isLoaded = false;
  constructor(private readonly modalCtrl: ModalController,
              private readonly renderer: Renderer2) { }

  ngOnInit() {
    this.isLoaded = false;
  }

  onCancel(): void {
    this.modalCtrl.dismiss();
  }

  ngAfterViewInit() {
    this.getGoogleMaps().then(googleMaps => {
      const googleMapEl = this.googleMapElRef.nativeElement;
      const googleMap = new googleMaps.Map(googleMapEl, {
        center: { lat: -34.397, lng: 150.644},
        zoom: 16
      });
      googleMaps.event.addListenerOnce(googleMap, 'idle', () => {
        this.renderer.addClass(googleMapEl, 'visible');
      });
      this.isLoaded = true;
    }).catch(err => {
      console.log('error', err);
    });
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise(((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'testmapurl';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google Map SDK not found');
        }
      };
    }));
  }
}
