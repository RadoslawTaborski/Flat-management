import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {
  static AppName="Beeema"
  static ApiUrl="http://webapp.zapto.org:81/bemaapi.php/";
  static FooterText="© Beeema - Radosław Taborski - 2018"

  //static TitleName="Bema";
  //static theme="united" //both of this parameters can to change in index.html head

  //also it is necessary clone php api and database.sql script (change databese name in both)

  constructor() { }
}
