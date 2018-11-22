import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Firebase data
  firebaseToken;
  userEmail;

  // This data is linked from our server. 
  userID;

  constructor(private angularFireAuth: AngularFireAuth, private generalService: GeneralService) { }

  doGoogleAuthentication() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      console.log('Were trying here...');
      this.angularFireAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        this.firebaseToken = res.credential['idToken'];
        this.saveTokenAndID(res)
        resolve(res);
      });
    });
  }

  saveTokenAndID(firebaseResponse) {
    this.firebaseToken = firebaseResponse.credential.idToken;
    this.userEmail = firebaseResponse.user.email;

    this.generalService.apiGet('api/login/' + this.userEmail, (data) => {
      this.userID = data[0].id;
    });
  }
}
