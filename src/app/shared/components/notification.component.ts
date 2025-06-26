import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationMessage, NotificationService } from 'src/app/core/Service/notificationService';

@Component({
  selector: 'app-notification',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
message: { type: string; text: string } | null = null;

  private sub!: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.sub = this.notificationService.notification$.subscribe((msg) => {
      this.message = msg;
      setTimeout(() => this.message = null, 3000); // auto-hide
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
