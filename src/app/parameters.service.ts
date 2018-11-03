import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {
  static AppName="Bema"
  static ApiUrl="http://localhost/bemaapi.php/";
  static FooterText="© Bema - Radosław Taborski - 2018"

  //static TitleName="Bema";
  //static theme="united" //both of this parameters can to change in index.html head

  constructor() { }
}
