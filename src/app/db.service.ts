import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShoppingItem } from './models/shoppingItem';
import { User } from './models/user';
import { Balance } from './models/balance';
import { Payment } from './models/payment';

const httpOptions = {
  headers: new HttpHeaders()
};

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private apiUrl: string = 'http://bema5.zapto.org:81/bemaapi.php/';
  //private apiUrl: string = 'http://192.168.1.4:81/bemaapi.php/';

  private _users: string = 'users';
  private _payments: string = 'payments';
  private _shoppingItems: string = 'items';
  private _balances: string = 'balances';
  private _addShoppingItem: string = 'addItem/';
  private _addPayment: string = 'addPayment/';
  private _removeShoppingItem: string = 'removeItem/';
  
  private headers: Headers = new Headers();

  constructor(private _http: HttpClient) {
  }

   getShoppingItems (): Observable<ShoppingItem[]> {
    return this._http.get<ShoppingItem[]>(this.apiUrl+this._shoppingItems)
      .pipe(
        map((res: Response) => res)  
      );
  }

  getUsers (): Observable<User[]> {
    return this._http.get<User[]>(this.apiUrl+this._users)
      .pipe(
        map((res: Response) => res)  
      );
  }

  getPayments (): Observable<Payment[]> {
    return this._http.get<User[]>(this.apiUrl+this._payments)
      .pipe(
        map((res: Response) => res)  
      );
  }

  getBalances (): Observable<Payment[]> {
    return this._http.get<User[]>(this.apiUrl+this._balances)
      .pipe(
        map((res: Response) => res)  
      );
  }

  addShoppingItem (item: ShoppingItem): Observable<ShoppingItem> {
    return this._http.post<ShoppingItem>(this.apiUrl+this._addShoppingItem, JSON.stringify(item), httpOptions)
      .pipe(
        map((res: Response) => res)
      );
  }

  removeShoppingItem(Id: number): Observable<ShoppingItem> {
    return this._http.post<ShoppingItem>(this.apiUrl+this._removeShoppingItem+Id, "", httpOptions)
      .pipe(
        map((res: Response) => res)
      );
  }

  addPayment (item: Payment): Observable<Payment> {
    return this._http.post<Payment>(this.apiUrl+this._addPayment, JSON.stringify(item), httpOptions)
      .pipe(
        map((res: Response) => res)
      );
  }
}

