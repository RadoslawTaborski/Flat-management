import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShoppingItem, DalShoppingItem, ShoppingItemMapper } from './models/shoppingItem';
import { User } from './models/user';
import { Balance } from './models/balance';
import { Payment, DalPayment, PaymentMapper } from './models/payment';
import { CleaningMapper, DalCleaning } from './models/cleaning';

const httpOptions = {
  headers: new HttpHeaders()
};

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private apiUrl: string = 'http://bema5.zapto.org:81/bemaapi.php/';
  //private apiUrl: string = 'http://192.168.1.4:81/bemaapi.php/';

  private _shoppingItems: string = 'items';
  private _users: string = 'users';
  private _payments: string = 'payments';
  private _balances: string = 'balances';
  private _cleaners: string = 'cleaners';
  private _cleanings: string = 'cleanings';
  private _lastCleaning: string = 'lastcleaning';
  private _paymentAction: string = 'paymentaction';

  private _addShoppingItem: string = 'addItem/';
  private _addPayment: string = 'addPayment/';
  private _addCleaning: string = 'addCleaning/';
  private _removeShoppingItem: string = 'removeItem/';
  private _rollbackAction: string = 'rollbackAction/';
  
  private headers: Headers = new Headers();

  constructor(private _http: HttpClient) {
  }

   getShoppingItems (): Observable<any[]> {
    return this._http.get<any[]>(this.apiUrl+this._shoppingItems)
      .pipe(
        map((res: Response) => res)  
      );
  }

  getUsers (): Observable<any[]> {
    return this._http.get<any[]>(this.apiUrl+this._users)
      .pipe(
        map((res: Response) => res)  
      );
  }

  getPayments (): Observable<any[]> {
    return this._http.get<any[]>(this.apiUrl+this._payments)
      .pipe(
        map((res: Response) => res)  
      );
  }

  getBalances (): Observable<any[]> {
    return this._http.get<any[]>(this.apiUrl+this._balances)
      .pipe(
        map((res: Response) => res)  
      );
  }

  getCleaners (): Observable<any[]> {
    return this._http.get<any[]>(this.apiUrl+this._cleaners)
      .pipe(
        map((res: Response) => res)  
      );
  }

  getCleaning (): Observable<any[]> {
    return this._http.get<any[]>(this.apiUrl+this._cleanings)
      .pipe(
        map((res: Response) => res)  
      );
  }

  getLastCleaningDate (): Observable<any[]> {
    return this._http.get<any[]>(this.apiUrl+this._lastCleaning)
      .pipe(
        map((res: Response) => res)  
      );
  }

  getLastActionNumber (): Observable<any[]> {
    return this._http.get<any[]>(this.apiUrl+this._paymentAction)
      .pipe(
        map((res: Response) => res)  
      );
  }

  addShoppingItem (item: DalShoppingItem): Observable<any> {
    let json = ShoppingItemMapper.ConvertToJSONFromDAL(item);
    //console.log(json);
    return this._http.post<any>(this.apiUrl+this._addShoppingItem, json, httpOptions)
      .pipe(
        map((res: Response) => res)
      );
  }

  removeShoppingItem(Id: number): Observable<any> {
    return this._http.post<any>(this.apiUrl+this._removeShoppingItem+Id, "", httpOptions)
      .pipe(
        map((res: Response) => res)
      );
  }

  rollbackAction(Id: number): Observable<any> {
    return this._http.post<any>(this.apiUrl+this._rollbackAction+Id, "", httpOptions)
      .pipe(
        map((res: Response) => res)
      );
  }

  addPayment (item: DalPayment): Observable<any> {
    let json = PaymentMapper.ConvertToJSONFromDAL(item);
    //console.log(json);
    return this._http.post<any>(this.apiUrl+this._addPayment, json, httpOptions)
      .pipe(
        map((res: Response) => res)
      );
  }

  addCleaning (item: DalCleaning): Observable<any> {
    let json = CleaningMapper.ConvertToJSONFromDAL(item);
    //console.log(json);
    return this._http.post<any>(this.apiUrl+this._addCleaning, json , httpOptions)
      .pipe(
        map((res: Response) => res)
      );
  }
}

