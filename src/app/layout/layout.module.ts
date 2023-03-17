import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './components/header/header.component';
import { AngularMaterialModule } from '../shared/angular-material/angular-material.module';

@NgModule({
  declarations: [
    LayoutComponent, 
    HeaderComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    AngularMaterialModule
  ]
})
export class LayoutModule { }
