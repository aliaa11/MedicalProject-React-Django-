import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-statistics-cards',
  standalone: true,
  templateUrl: './statistics-cards.component.html',
  styleUrls: ['./statistics-cards.component.css']
})
export class StatisticsCardsComponent implements OnInit {
  stats: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.http.get<any>('assets/Data.json').subscribe(data => {
      this.stats = data.stats;
    });
  }
}