import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShoppingItem, DalShoppingItem, ShoppingItemMapper } from './models/shoppingItem';
import { User } from './models/user';
import { Balance } from './models/balance';
import { Payment, DalPayment, PaymentMapper } from './models/payment';
import { CleaningMapper, DalCleaning } from './models/cleaning';
import { DalAdvert, AdvertMapper } from './models/adverts';
import { ParametersService } from './parameters.service';

const httpOptions = {
  headers: new HttpHeaders()
};

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private apiUrl: string = ParametersService.ApiUrl;

  private _shoppingItems: string = 'items';
  private _users: string = 'users';
  private _payments: string = 'payments';
  private _balances: string = 'balances';
  private _cleaners: string = 'cleaners';
  private _cleanings: string = 'cleanings';
  private _adverts: string = 'adverts';
  private _lastCleaning: string = 'lastcleaning';
  private _paymentAction: string = 'paymentaction';

  private _addShoppingItem: string = 'addItem/';
  private _addPayment: string = 'addPayment/';
  private _addCleaning: string = 'addCleaning/';
  private _addAdvert: string = 'addAdvert/';
  private _removeShoppingItem: string = 'removeItem/';
  private _removeAdvert: string = 'removeAdvert/';
  private _rollbackAction: string = 'rollbackAction/';
  private _rollback: string = 'rollback/';

  constructor(private _http: HttpClient) {
  }

  getShoppingItems (): Promise<any[]> {
    return this._http.get<any[]>(this.apiUrl+this._shoppingItems).toPromise();
  }

  getUsers (): Promise<any[]> {
    return this._http.get<any[]>(this.apiUrl+this._users).toPromise();
  }

  getPayments (): Promise<any[]> {
    return this._http.get<any[]>(this.apiUrl+this._payments).toPromise();
  }

  getBalances (): Promise<any[]> {
    return this._http.get<any[]>(this.apiUrl+this._balances).toPromise();
  }

  getCleaners (): Promise<any[]> {
    return this._http.get<any[]>(this.apiUrl+this._cleaners).toPromise();
  }

  getAdverts (): Promise<any[]> {
    return this._http.get<any[]>(this.apiUrl+this._adverts).toPromise();
  }

  getCleaning (): Promise<any[]> {
    return this._http.get<any[]>(this.apiUrl+this._cleanings).toPromise();
  }

  getLastCleaningDate (): Promise<any[]> {
    return this._http.get<any[]>(this.apiUrl+this._lastCleaning).toPromise();
  }

  getLastActionNumber (): Promise<any[]> {
    return this._http.get<any[]>(this.apiUrl+this._paymentAction).toPromise();
  }

  addShoppingItem (item: DalShoppingItem): Promise<any> {
    let json = ShoppingItemMapper.ConvertToJSONFromDAL(item);
    //console.log(json);
    return this._http.post<any>(this.apiUrl+this._addShoppingItem, json, httpOptions).toPromise();
  }

  addPayment (item: DalPayment): Promise<any> {
    let json = PaymentMapper.ConvertToJSONFromDAL(item);
    //console.log(json);
    return this._http.post<any>(this.apiUrl+this._addPayment, json, httpOptions).toPromise();
  }

  addCleaning (item: DalCleaning): Promise<any> {
    let json = CleaningMapper.ConvertToJSONFromDAL(item);
    //console.log(json);
    return this._http.post<any>(this.apiUrl+this._addCleaning, json , httpOptions).toPromise();
  }

  addAdvert (item: DalAdvert): Promise<any> {
    let json = AdvertMapper.ConvertToJSONFromDAL(item);
    //console.log(json);
    return this._http.post<any>(this.apiUrl+this._addAdvert, json , httpOptions).toPromise();
  }
  
  removeShoppingItem(Id: number): Promise<any> {
    return this._http.post<any>(this.apiUrl+this._removeShoppingItem+Id, "", httpOptions).toPromise();
  }

  removeAdvert(Id: number): Promise<any> {
    return this._http.post<any>(this.apiUrl+this._removeAdvert+Id, "", httpOptions).toPromise();
  }

  rollbackAction(Id: number): Promise<any> {
    return this._http.post<any>(this.apiUrl+this._rollbackAction+Id, "", httpOptions).toPromise();
  }

  rollback(Id: number): Promise<any> {
    return this._http.post<any>(this.apiUrl+this._rollback+Id, "", httpOptions).toPromise();
  }
}

