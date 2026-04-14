import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { TripDataService } from '../services/trip-data.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public formError: string = '';
  submitted = false;
  public credentials = { email: '', password: '' };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private tripDataService: TripDataService
  ) { }

  ngOnInit(): void { }

  public onLoginSubmit(): void {
    this.formError = '';
    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'Email and password are required.';
    } else {
      this.doLogin();
    }
  }

  private doLogin(): void {
    const user = { email: this.credentials.email } as User;
    this.tripDataService.login(user, this.credentials.password).subscribe({
      next: (response: any) => {
        if (response && response.token) {
          this.authenticationService.saveToken(response.token);
          this.router.navigate(['']);
        } else {
          this.formError = 'Login failed. Please try again.';
        }
      },
      error: () => {
        this.formError = 'Invalid email or password.';
      }
    });
  }
}
