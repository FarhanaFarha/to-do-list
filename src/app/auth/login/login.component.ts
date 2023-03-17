import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import Swal from "sweetalert2";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    showSpinner: boolean = false;
    isPasswordTypePassword: boolean = true;

    constructor(
        private authService: AuthService,
        private toastr: ToastrService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.initLoginForm();
    }

    private initLoginForm() {
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', Validators.required)
        });
    }

    onSubmitLogin() {
        if (this.loginForm.valid) {
            this.showSpinner = true;
            let email: string = this.loginForm.value.email;
            let password: string = this.loginForm.value.password;

            this.authService.login(email, password).then((response: any) => {
                this.showSpinner = false;
                if (response?.user?.emailVerified === true) {
                    localStorage.setItem('token', 'true');
                    this.router.navigateByUrl('/app/tasks');
                } else {
                    this.verifyEmail(response?.user);
                }
            }, (error) => {
                this.showSpinner = false;
                if (error && error?.message) {
                    this.toastr.error(error?.message, "Error!");
                } else {
                    this.toastr.error("An unknown error occured", "Error!");
                }
            });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }

    private verifyEmail(user: any) {
        user.sendEmailVerification().then((response: any) => {
            Swal.fire(
                'Your Email is not Verified!',
                'Please click on the link that send on your registered email and sign in again',
                'info'
            );
        }, (error: any) => {
            if (error && error?.message) {
                this.toastr.error(error?.message, "Error!");
            } else {
                this.toastr.error("An unknown error occured", "Error!");
            }
        });
    }

}
