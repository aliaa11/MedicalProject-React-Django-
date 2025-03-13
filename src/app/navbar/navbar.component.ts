import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  notifications: any[] = []; 
  hasNewNotifications: boolean = false; 
  showNotifications: boolean = false; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications() {
    this.http.get<any>('assets/Data.json').subscribe(data => {
      this.notifications = data.notifcation; 
      this.hasNewNotifications = this.notifications.some(notification => !notification.read);
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.markNotificationsAsRead();
    }
  }

  markNotificationsAsRead() {
    this.notifications.forEach(notification => notification.read = true);
    this.hasNewNotifications = false;
  }
}