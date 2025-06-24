import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface NotificationMessage {
  type: 'success' | 'error';
  text: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationSubject = new Subject<NotificationMessage>();

  notification$ = this.notificationSubject.asObservable();

  success(message: string) {
    this.notificationSubject.next({ type: 'success', text: message });
  }

  error(message: string) {
    this.notificationSubject.next({ type: 'error', text: message });
  }
}
