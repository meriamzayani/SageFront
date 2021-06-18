import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = 'user not found';
  roles: string[] = [];

  isSubmitted = false;

  constructor(private authService: AuthService,
     private tokenStorage: TokenStorageService,
     private router : Router
     ) { }

  ngOnInit(): void {
    const loginForm = new FormGroup({});
    loginForm.addControl('username', new FormControl(null, [Validators.required]));
    loginForm.addControl('password', new FormControl(null, [Validators.required, Validators.minLength(6)]));

    this.loginForm = loginForm;

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;
    const payload = this.loginForm.value;
    const { username, password } = payload;
    this.authService.login(username, password).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.goto();
        window.location.reload();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
}
goto(){
  this.router.navigate(['/home'])
}
}
