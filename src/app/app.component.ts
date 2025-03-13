import { Component } from '@angular/core';
import { BaseUserComponent } from './base-user/base-user.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./base-user.component.css'],
  imports: [BaseUserComponent] // إزالة RouterOutlet لأنه غير مستخدم
})
export class AppComponent {
  title = 'school-system';
}
