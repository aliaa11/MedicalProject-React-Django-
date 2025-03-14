import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from "./navbar/navbar.component";
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, NavbarComponent,RouterModule],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'school-system';
}
