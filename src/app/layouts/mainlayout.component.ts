import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
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

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

}
