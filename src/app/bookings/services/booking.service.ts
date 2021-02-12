import { Injectable } from '@angular/core';
import {Booking, FirebaseBookingData} from '../models/booking.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {delay, map, switchMap, take, tap} from 'rxjs/operators';
import {FirebaseResponse} from '../../places/models/place.model';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../auth/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private firebaseUrl = 'firebaseTestUrl';
    private bookings = new BehaviorSubject<Booking[]>([]);
    constructor(private readonly http: HttpClient,
                private readonly authService: AuthService) { }

    getAllBookings(): Observable<Booking[]> {

        return this.bookings.asObservable();
    }

    fetchBookings(): Observable<Booking[]> {

        return this.http.get<{[key: string]: FirebaseBookingData}>
        (`${this.firebaseUrl}bookings.json?orderBy="userId"&equalTo="${this.authService.getUserId}"`)
          .pipe(map(resData => {
              const bookings: Booking[] = [];
              for (const key in resData) {
                  if (resData.hasOwnProperty(key)) {
                      const booking: Booking = {
                          id: key,
                          firstName: resData[key].firstName,
                          lastName: resData[key].lastName,
                          guestNumber: resData[key].guestNumber,
                          bookedFrom: new Date(resData[key].bookedFrom),
                          bookedTo: new Date(resData[key].bookedTo),
                          placeId: resData[key].placeId,
                          placeTitle: resData[key].placeTitle,
                          placeImage: resData[key].placeImage,
                          userId: resData[key].userId
                      };
                      bookings.push(booking);
                  }
              }
              return bookings;
          }), tap(bookings => {
              this.bookings.next(bookings);
          })
        );
    }

    getBooking(bookingId: string): Observable<Booking> {

        return this.http.get<FirebaseBookingData>(`${this.firebaseUrl}bookings/${bookingId}.json`).pipe(
          map(firebaseBookingData => {

              return {
                  id: bookingId,
                  firstName: firebaseBookingData.firstName,
                  lastName: firebaseBookingData.lastName,
                  guestNumber: firebaseBookingData.guestNumber,
                  bookedFrom: new Date(firebaseBookingData.bookedFrom),
                  bookedTo: new Date(firebaseBookingData.bookedTo),
                  placeId: firebaseBookingData.placeId,
                  placeTitle: firebaseBookingData.placeTitle,
                  placeImage: firebaseBookingData.placeImage,
                  userId: firebaseBookingData.userId
              };
          })
        );
    }

    addBooking(booking: Booking): Observable<Booking[]> {
        let generatedId = null;

        return this.http.post<FirebaseResponse>(`${this.firebaseUrl}bookings.json`,
          {...booking, id: null }).pipe(switchMap(resData => {
            generatedId = resData.name;
            return this.bookings;
        }), take(1), tap(bookings => {
            booking.id = generatedId;
            this.bookings.next(bookings.concat(booking));
        }));
    }

    deleteBooking(bookingId: string) {

        return this.http.delete(`${this.firebaseUrl}bookings/${bookingId}.json`).pipe(
          switchMap(() => {
              return this.fetchBookings();
          }), take(1), tap(bookings => {
              this.bookings.next(bookings);
          }));
    }
}
