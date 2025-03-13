import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./base-user.component.css'],
 
  imports: [RouterModule]
})
export class AppComponent {
  title = 'school-system';
}
