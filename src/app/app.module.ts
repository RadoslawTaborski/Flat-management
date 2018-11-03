import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import {DeviceDetectorModule} from 'ngx-device-detector';

import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ShoppingComponent } from './shopping/shopping.component';
import { PaymentComponent } from './payment/payment.component';
import { BalancesComponent } from './balances/balances.component';
import { ContactComponent } from './contact/contact.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CleaningComponent } from './cleaning/cleaning.component';
import { AdvertsComponent } from './adverts/adverts.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavBarComponent,
    ShoppingComponent,
    PaymentComponent,
    BalancesComponent,
    ContactComponent,
    CleaningComponent,
    AdvertsComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    DeviceDetectorModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
