import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { ZamadminComponent } from './zamadmin/zamadmin.component';

const routes: Routes = [
  {
    path: 'zamadmin',
    component: ZamadminComponent,
  },
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
