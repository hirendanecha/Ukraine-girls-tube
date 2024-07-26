import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FavoriteProfileService {
  private baseUrl = environment.serverUrl + 'favorites';

  customerObs: Subject<any> = new Subject<any>();
  favoriteProfileListSubject = new Subject<any[]>();
  constructor(private http: HttpClient) {}

  addFavoriteProfile(data: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}/add`, data);
  }

  removeFavoriteProfile(id, profileId): Observable<Object> {
    return this.http.delete(`${this.baseUrl}/${id}?profileId=${profileId}`);
  }

  getFavoriteProfile(id): Observable<Object> {
    return this.http.get<Object>(`${this.baseUrl}/${id}?q=${Date.now()}`);
  }

  fetchFavoriteProfiles(): void {
    const profileId = +localStorage.getItem('profileId');
    this.getFavoriteProfile(profileId).pipe(
      tap((res: any) => {
        this.favoriteProfileListSubject.next(res.data);
      })
    ).subscribe({
      error: (error) => {
        console.log(error);
      }
    });
  }
}
