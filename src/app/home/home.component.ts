import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { BannerComponent } from "../banner/banner.component";
import { ScheduleComponent } from '../schedule/schedule.component';
import { StatisticsCardsComponent } from '../statistics-cards/statistics-cards.component';
import { MarqueeComponent } from '../marquee/marquee.component';
import { TeacherListComponent } from "../teacher-list/teacher-list.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BannerComponent, ScheduleComponent, StatisticsCardsComponent, MarqueeComponent, TeacherListComponent], // استيراد الوحدات النمطية المطلوبة هنا
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  bannerData: any = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getData().subscribe(response => {
      if (response && response.banner) { 
        this.bannerData = response;
      } else {
        console.error('No banner data found in response:', response);
      }
    });
  }
}