import { Component, OnInit, OnDestroy } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { subscribeOn } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{
  isAutheticate = false;
  private userSub : Subscription;

  constructor(private dataStorageService: DataStorageService, private authServices: AuthService) {}

  ngOnInit(){
    this.userSub = this.authServices.user.subscribe( userData =>{
      console.log(userData);
      this.isAutheticate = !!userData;
    });
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogOut(){
    this.authServices.logOut();
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }
}
