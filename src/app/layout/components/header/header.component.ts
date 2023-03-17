import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    username: string = '';
    userSubscription: Subscription;

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.getUsername();
    }

    private getUsername() {
       this.userSubscription = this.authService.getUser().subscribe( authState => {
            this.username = authState?.email;
        });
    }

    onClickSignOut() {
        this.authService.logout().then(() => {
            localStorage.removeItem('token');
            this.router.navigateByUrl('/auth/login');
        }, (error) => {
            if (error && error?.message) {
                this.toastr.error(error?.message, "Error!");
            } else {
                this.toastr.error("An unknown error occured", "Error!");
            }
        });
    }

    ngOnDestroy(): void {
        if(this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

}
