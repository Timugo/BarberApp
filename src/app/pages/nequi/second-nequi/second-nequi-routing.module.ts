import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecondNequiPage } from './second-nequi.page';

const routes: Routes = [
  {
    path: '',
    component: SecondNequiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecondNequiPageRoutingModule {}
