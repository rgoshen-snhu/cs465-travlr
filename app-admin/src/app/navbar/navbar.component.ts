import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void { }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public getUserName(): string {
    if (this.isLoggedIn()) {
      return this.authenticationService.getCurrentUser().name || '';
    }
    return '';
  }

  public onLogout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }
}
