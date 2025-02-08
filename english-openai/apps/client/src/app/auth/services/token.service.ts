import { Injectable } from '@angular/core';

import { jwtDecode } from 'jwt-decode';
import { Observable, of } from 'rxjs';

import { User } from '../../core/interfaces/user.interface';

interface ITokenInfo {
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  getUserDataFromToken(): Observable<User | null> {
    let decodedToken: User | null = null;
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      decodedToken = JSON.parse(JSON.stringify(jwtDecode(accessToken)));
    }
    return of(decodedToken);
  }

  checkTokenValidity(token: string): boolean {
    try {
      const decodedToken: ITokenInfo | null = JSON.parse(JSON.stringify(jwtDecode(token))) || null;
      if (decodedToken) {
        const expDate = decodedToken.exp * 1000;
        const now = new Date().getTime();
        return expDate > now;
      }
    } catch (e) {
      console.log(e);
      return false;
    }

    return false;
  }

  // getInfoFromToken(token: string) {
  //   try {
  //     const decodedToken = JSON.parse(JSON.stringify(jwtDecode(token))) || null;
  //     console.log(decodedToken);
  //     return decodedToken;
  //   } catch (e) {
  //     console.log(e);
  //     return false;
  //   }
  //
  //   return false;
  // }
}
