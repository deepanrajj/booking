import { Injectable } from '@angular/core';
import {FirebasePlaceData, FirebaseResponse, Place} from '../models/place.model';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private firebaseUrl = 'firebaseTestUrl';
  private places = new BehaviorSubject<Place[]>([]);
  constructor(private readonly http: HttpClient) { }

  get allPlaces(): Observable<Place[]> {

    return this.places.asObservable();
  }

  fetchPlaces(): Observable<Place[]> {

    return this.http.get<{[key: string]: FirebasePlaceData}>
    (`${this.firebaseUrl}offered-places.json`).pipe(map(resData => {
        const places: Place[] = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            const place: Place = {
              id: key,
              title: resData[key].title,
              description: resData[key].description,
              imageUrl: resData[key].imageUrl,
              price: resData[key].price,
              availableFrom: new Date(resData[key].availableFrom),
              availableTo: new Date(resData[key].availableTo),
              userId: resData[key].userId
            };
            places.push(place);
          }
        }
        return places;
      }), tap(places => {
        this.places.next(places);
      })
    );
  }

  getPlace(placeId: string): Observable<Place> {

    return this.http.get<FirebasePlaceData>(`${this.firebaseUrl}offered-places/${placeId}.json`).pipe(
      map(firebasePlaceData => {

        return {
          id: placeId,
          title: firebasePlaceData.title,
          description: firebasePlaceData.description,
          imageUrl: firebasePlaceData.imageUrl,
          price: firebasePlaceData.price,
          availableFrom: new Date(firebasePlaceData.availableFrom),
          availableTo: new Date(firebasePlaceData.availableTo),
          userId: firebasePlaceData.userId
        };
      })
    );
  }

  /*deletePlace(placeId: string): void {
    this.places = this.places.filter(recipe => recipe.id !== placeId);
  }*/

  addPlace(place: Place): Observable<Place[]> {
    let generatedId = null;

    return this.http.post<FirebaseResponse>(`${this.firebaseUrl}offered-places.json`,
      {...place, id: null }).pipe(switchMap(resData => {
        generatedId = resData.name;
        return this.places;
    }), take(1), tap(places => {
      place.id = generatedId;
      this.places.next(places.concat(place));
    }));
  }

  updatePlace(updatedPlace: Place) {
    let updatedPlaces: Place[] = [];

    return this.places.pipe(take(1),
      switchMap(places => {
        if (!places || places.length === 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }), switchMap(places => {
      const updatedIndex = places.findIndex(pl => pl.id === updatedPlace.id);
      places[updatedIndex] = updatedPlace;
      updatedPlaces = places;
      return this.http.put(`${this.firebaseUrl}offered-places/${updatedPlace.id}.json`,
        { ...updatedPlace, id: null });
    }), tap(() => {
      this.places.next(updatedPlaces);
    }));
  }
}
