import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-marquee',
  standalone: true,
  templateUrl: './marquee.component.html',
  styleUrls: ['./marquee.component.css']
})
export class MarqueeComponent implements OnInit {
  newsTicker: string[] = []; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadNewsTicker();
  }

  loadNewsTicker() {
    this.http.get<any>('assets/Data.json').subscribe(data => {
      this.newsTicker = data.newsTicker;
    });
  }
}