import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

const appRoutes: Routes = [
  { path: 'auth', component : AuthComponent},
  { path: 'recipes', loadChildren: './recipes/recipes.module.ts'},
];

@NgModule({
    declarations:[
        AuthComponent
    ],
    imports:[
        CommonModule,
        FormsModule,
        RouterModule.forChild(appRoutes),
        SharedModule
    ],
    exports: [
        AuthComponent
    ]  
})
export class AuthMoudule{
    
}