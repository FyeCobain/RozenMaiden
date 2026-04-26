import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SEOService } from './seo.service';
import { Header, Footer } from './core';

@Component({
  selector: 'rm-root',
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './app.html',
})
export class App {
  private readonly seoService = inject(SEOService);

  constructor() {
    this.seoService.init();
  }
}
