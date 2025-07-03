import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { RouterLink } from "@angular/router";

declare var bootstrap: any;

@Component({
    selector: 'app-sidebar',
    imports: [RouterLink, CommonModule],
    template: `
    <aside class="bg-dark text-white vh-100 p-2" [class.collapsed]="isCollapsed">
  <button class="menu-btn d-flex align-items-center w-100">
    <img src="assets/dashboard.png" style="width: 24px;height: 24px;" />
    <span class="menu-label" style="margin-left:9px;">Dashboard</span>
  </button>
  <div class="divider"></div>

  <button class="menu-btn d-flex align-items-center justify-content-between w-100"
    data-bs-toggle="collapse" data-bs-target="#masterMenu"
    aria-expanded="false" aria-controls="masterMenu">
    <img src="assets/Master.png" class="menu-icon" />
    <span class="menu-label">Master</span>
    <i class="bi bi-caret-right-fill arrow"></i>
  </button>
  <div class="collapse submenu-container" id="masterMenu">
    <nav class="submenu-items">
      <a routerLink="/Mainlayout/department/list" routerLinkActive="active">Department</a>
      <a routerLink="/Mainlayout/area/create" routerLinkActive="active">Area</a>
      <a routerLink="/Mainlayout/designation/list" routerLinkActive="active">Designation</a>
      <a routerLink="/Mainlayout/employee/list" routerLinkActive="active">Empoloyee</a>
      <a routerLink="/Mainlayout/enquiry-list" routerLinkActive="active">Enquery Source</a>
      <a routerLink="/Mainlayout/product-list" routerLinkActive="active">Product</a>
      <a routerLink="/Mainlayout/competetor-create" routerLinkActive="active">Competitor Product</a>
    </nav>
  </div>
<div class="divider"></div>
  <button class="menu-btn d-flex align-items-center justify-content-between w-100"
    data-bs-toggle="collapse" data-bs-target="#saleMenu"
    aria-expanded="false" aria-controls="saleMenu">
    <i class="bi bi-cart-plus me-2"></i>
    <span class="menu-label">Sale</span>
    <i class="bi bi-caret-right-fill arrow"></i>
  </button>
  <div class="collapse submenu-container" id="saleMenu">
    <nav class="submenu-items">
      <a routerLink="/Mainlayout/leadcreate" routerLinkActive="active">Lead</a>
      <a routerLink="/sale-list">Order</a>
      <a routerLink="/sale-list">Payment</a>
    </nav>
  </div>
  <div class="divider"></div>

  <button class="menu-btn d-flex align-items-center justify-content-between w-100"
    data-bs-toggle="collapse" data-bs-target="#commissionMenu"
    aria-expanded="false" aria-controls="commissionMenu">
    <i class="bi bi-bullseye me-2"></i>
    <span class="menu-label">Commission & Target</span>
    <i class="bi bi-caret-right-fill arrow"></i>
  </button>
  <div class="collapse submenu-container" id="commissionMenu">
    <nav class="submenu-items">
      <a routerLink="/commission-lead">Lead</a>
      <a routerLink="/commission-incentive">Incentive</a>
      <a routerLink="/commission-payment">Payment</a>
    </nav>
  </div>
  <div class="divider"></div>

  <button class="menu-btn d-flex align-items-center justify-content-between w-100"
    data-bs-toggle="collapse" data-bs-target="#travelMenu"
    aria-expanded="false" aria-controls="travelMenu">
    <i class="bi bi-suitcase me-2"></i>
    <span class="menu-label">Travelling Allowance</span>
    <i class="bi bi-caret-right-fill arrow"></i>
  </button>
  <div class="collapse submenu-container" id="travelMenu">
    <nav class="submenu-items">
      <a routerLink="/travel-lead">Lead</a>
      <a routerLink="/travel-cost">Travelling Cost</a>
      <a routerLink="/travel-allowance">Allowance</a>
    </nav>
  </div>
  <div class="divider"></div>
</aside>

    `,
    styles: [`
    aside {
      width: 250px;
      transition: width 0.3s;
      overflow: hidden;
      /* Ensure it takes full height, vh-100 from Bootstrap handles this for most cases */
      /* If vh-100 isn't working as expected, you might explicitly set: */
      /* height: 100vh; */
      overflow-x: hidden;
      overflow-y: auto; /* Allows scrolling if content exceeds viewport height */
    }
    aside.collapsed {
      width: 60px;
    }
      aside.collapsed .arrow {
  opacity: 0;
  width: 0;
  padding: 0;
  margin: 0;
  overflow: hidden;
  transition: opacity 0.2s, width 0.2s;
}

    .menu-btn {
      background: none;
      border: none;
      padding: 0.5rem;
      color: white;
      cursor: pointer;
      width: 100%;
  text-align: left;
      display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative; 
    }
    .menu-icon {
      width: 24px;
      height: 24px;
      margin-right: 0.5rem;
      filter: brightness(0) invert(1); /* white icon */
    }
    .menu-label {
        flex: 1;
  white-space: nowrap;
  overflow: hidden;
  transition: opacity 0.3s, width 0.3s;
    }
    aside.collapsed .menu-label,
    aside.collapsed .submenu-container {
      opacity: 0;
      width: 0;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }
      aside.collapsed .menu-label {
  opacity: 0;
  width: 0;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
    .arrow {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      transition: transform 0.2s;    
    }
    button[aria-expanded="true"] .arrow {
      transform: rotate(90deg);
    }
    .submenu-container {
      /* Keep padding and margin as they are */
      margin-left: 1rem;
      padding-left: 0.8rem;
      position: relative; /* Essential for positioning the pseudo-element */
    }

    /* This is where we define the vertical line */
    .submenu-container::before {
      content: "";
      position: absolute;
      left: 0; /* Aligns the line with the start of the submenu items */
      top: 0;
      height: 100%; /* Make the height dynamically adjust to the content */
      width: 2px; /* Your line thickness */
      background: rgba(250, 241, 241, 0.93); /* Your line color */
      z-index: -1; /* Ensures the line is behind the text/links */
    }

    .submenu-items a {
      position: relative;
      display: block;
      padding: 0.2rem 0 0.2rem 1.2rem;
      color: rgba(224, 224, 224, 0.98);
      text-decoration: none;
      font-size: 0.9rem;
    }
    .submenu-items a::before {
      content: "›";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      color: #aaa;
    }
    .submenu-items a::after {
      content: "";
      position: absolute;
      left: -0.8rem;
      top: 50%;
      width: 0.8rem;
      height: 1px;
      background: rgba(255, 255, 255, 0.3);
    }
    .submenu-items a:hover {
      color: #fff;
    }
    .submenu-items a:hover::before {
      color: #fff;
    }
    .submenu-items a:hover::after {
      background: #fff;
    }
      .menu-btn img,
.menu-btn i {
  width: 24px;
  min-width: 24px;
  height: 24px;
  flex-shrink: 0;
  text-align: center;
}
  
aside.collapsed .menu-label,
    aside.collapsed .submenu-container {
      opacity: 0;
      width: 0;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }
      aside.collapsed .menu-label {
  opacity: 0;
  width: 0;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
    .arrow {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      transition: transform 0.2s;   
    }
    button[aria-expanded="true"] .arrow {
      transform: rotate(90deg);
    }
    .submenu-container {
      border-left: 2px solid rgba(250, 241, 241, 0.93); /* vertical guideline */
      margin-left: 1rem;
      padding-left: 0.8rem;
    }
    .submenu-items a {
      position: relative;
      display: block;
      padding: 0.2rem 0 0.2rem 1.2rem;
      color: rgba(224, 224, 224, 0.98);
      text-decoration: none;
      font-size: 0.9rem;
    }
    .submenu-items a::before {
      content: "›";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      color: #aaa;
    }
    .submenu-items a::after {
      content: "";
      position: absolute;
      left: -0.8rem;
      top: 50%;
      width: 0.8rem;
      height: 1px;
      background: rgba(255, 255, 255, 0.3);
    }
    .submenu-items a:hover {
      color: #fff;
    }
    .submenu-items a:hover::before {
      color: #fff;
    }
    .submenu-items a:hover::after {
      background: #fff;
    }
      .menu-btn img,
.menu-btn i {
  width: 24px;
  min-width: 24px;
  height: 24px;
  flex-shrink: 0;
  text-align: center;
}
  .divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 0.5rem -0.5rem; /* Negative margin to compensate for parent padding */
  width: calc(100% + 1rem); /* Compensate for parent padding on both sides */
}

aside.collapsed .divider {
  display: none;
}
    `]
})
export class SidebarComponent implements OnChanges {
    @Input() isCollapsed = false;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isCollapsed'] && this.isCollapsed) {
            // Close all currently opened collapse menus
            const openMenus = document.querySelectorAll('.collapse.show');
            openMenus.forEach(menu => {
                const bsCollapse = bootstrap.Collapse.getOrCreateInstance(menu as Element, { toggle: false });
                bsCollapse.hide();
            });
        }
    }
}