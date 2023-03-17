import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/service/auth.guard';

const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () =>
            import('./auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: 'app',
        loadChildren: () =>
            import('./layout/layout.module').then((m) => m.LayoutModule), canActivate: [AuthGuard]
    },
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
