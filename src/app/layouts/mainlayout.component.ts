import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../Master/sidebar.component';

type MenuKey = 'menu1' | 'menu2';

@Component({
    imports: [CommonModule, RouterOutlet, SidebarComponent,RouterModule],
    selector: 'app-main-layout',
    templateUrl: './mainlayout.component.html',
    styleUrls: ['./mainlayout.component.scss']
})
export class MainLayoutComponent {

  isCollapsed = false;

constructor(private router: Router){}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
logout(): void {
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userMobile');
  // localStorage.clear(); // optional if no other important data
  this.router.navigate(['/login']);
}

}
