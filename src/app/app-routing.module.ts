import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoppingComponent } from './shopping/shopping.component';
import { ContactComponent } from './contact/contact.component';
import { PaymentComponent } from './payment/payment.component';
import { BalancesComponent } from './balances/balances.component';
import { CleaningComponent } from './cleaning/cleaning.component';
import { AdvertsComponent } from './adverts/adverts.component';

export const routes: Routes = [
    { path: '', redirectTo: 'shopping', pathMatch: 'full' },
    { path: 'shopping', component: ShoppingComponent },
    { path: 'payment', component: PaymentComponent },
    { path: 'balances', component: BalancesComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'cleaning', component: CleaningComponent },
    { path: 'adverts', component: AdvertsComponent },
    { path: '**', redirectTo: 'shopping' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }