import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IWordResponseData } from '../../shared/interfaces/responses';


@Injectable({
  providedIn: 'root'
})
export class WordService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll(): Observable<IWordResponseData> {
    return this.http.get<IWordResponseData>(`${this.baseUrl}/api/words`).pipe(
      // map((data) => this.transformData(data))
    );
  }

  // private transformData(serverData: IWordResponseData[]): IWordTableData[] {
  //   return serverData.map(item => ({
  //     userId: item.id,
  //     fullName: item.name,
  //     status: item.isActive ? 'Active' : 'Inactive',
  //   }));
  // }
}
