import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import {  FormsModule } from '@angular/forms';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { SharedModule } from '../shared/shared.module';

const appRoutes: Routes = [
    { path: 'shopping-list', component: ShoppingListComponent },
  ];

@NgModule({
    declarations: [
        ShoppingListComponent,
        ShoppingEditComponent,
    ],
    imports: [
        FormsModule,
        SharedModule,
        RouterModule.forChild(appRoutes)
    ]
})
export class ShoppingListModule {

}