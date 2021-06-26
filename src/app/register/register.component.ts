import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signupForm: FormGroup;
  form: any = {
    username: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  isSubmitted = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const signupForm = new FormGroup({});
    signupForm.addControl('username',new FormControl(null, [Validators.required]))
    signupForm.addControl('password', new FormControl(null, [Validators.required, Validators.minLength(6)]));
    signupForm.addControl('email', new FormControl(null, [Validators.required, Validators.email]));
    signupForm.addControl('userCode', new FormControl(null, [Validators.required,Validators.minLength(6)]));
    this.signupForm = signupForm;
  }

  onSubmit(): void {
    this.isSubmitted = true;
    const payload = this.signupForm.value;
    const { username, password,email,userCode } = payload;

    this.authService.register(username, email, password,userCode).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
}
