import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';
import { AuthService } from '../service/auth.service';
import Swal from "sweetalert2";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-registration',
    templateUrl: './user-registration.component.html',
    styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {

    regForm: FormGroup;
    passwordMatch: boolean = true;

    isPasswordTypePassword: boolean = true;
    isConfirmPasswordTypePassword: boolean = true;

    showSpinner: boolean = false;

    constructor(
        private authService: AuthService,
        private toastr: ToastrService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.initRegForm();
    }

    private initRegForm() {
        this.regForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', Validators.required),
            confirmPassword: new FormControl('', Validators.required)
        })
    }

    onChangePassword() {
        this.passwordMatch = true;
        this.regForm.get('confirmPassword').reset();
    }

    onChangeConfirmPassword() {
        if (this.regForm.get('password').valid) {
            let password = this.regForm.get('password').value;
            let cPassword = this.regForm.get('confirmPassword').value;
            if (password === cPassword) {
                this.passwordMatch = true;
            } else {
                this.passwordMatch = false;
            }
        }
    }

    onSubmitRegForm() {
        if (this.regForm.valid) {
            this.showSpinner = true;
            let user: User = this.regForm.value;
            this.authService.registerUser(user).then((response) => {
                this.showSpinner = false;
                this.verifyEmail(response?.user);
            }, (error) => {
                this.showSpinner = false;
                if (error && error?.message) {
                    this.toastr.error(error?.message, "Error!");
                } else {
                    this.toastr.error("An unknown error occured", "Error!");
                }
            });
        } else {
            this.regForm.markAllAsTouched();
        }
    }

    private verifyEmail(user: any) {
        user.sendEmailVerification().then((response: any) => {
            Swal.fire(
                'Registered Successfully!',
                'A Link has been send to your registered email, Please click on the link to verify your email before login.',
                'success'
            );

            this.router.navigateByUrl('/auth/login');
        }, (error: any) => {
            if (error && error?.message) {
                this.toastr.error(error?.message, "Error!");
            } else {
                this.toastr.error("An unknown error occured", "Error!");
            }
        });
    }

}
