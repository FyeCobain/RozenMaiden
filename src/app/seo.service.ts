import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, startWith } from 'rxjs';

type RouteSeoData = {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
};

@Injectable({ providedIn: 'root' })
export class SEOService {
  private initialized = false;
  private readonly defaultTitle = 'Rozen Maiden';
  private readonly defaultDescription =
    'Rozen Maiden es una fanpage inspirada en el universo de las munecas vivientes, con estetica victoriana y enfoque en rendimiento y accesibilidad.';
  private readonly defaultImage = '/favicon/web-app-manifest-512x512.png';
  private readonly defaultType = 'website';
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        startWith(null),
      )
      .subscribe(() => {
        this.applyRouteSeo();
      });
  }

  private applyRouteSeo(): void {
    let currentRoute = this.route;

    while (currentRoute.firstChild) currentRoute = currentRoute.firstChild;

    const seo = (currentRoute.snapshot.data['seo'] as RouteSeoData | undefined) ?? {};
    const title = seo.title ?? this.defaultTitle;
    const description = seo.description ?? this.defaultDescription;
    const image = seo.image ?? this.defaultImage;
    const type = seo.type ?? this.defaultType;
    const canonicalUrl = this.getCanonicalUrl();

    this.title.setTitle(title);

    this.updateTag('name', 'description', description);
    this.updateTag('name', 'robots', 'index,follow');

    this.updateTag('property', 'og:type', type);
    this.updateTag('property', 'og:locale', 'es_MX');
    this.updateTag('property', 'og:site_name', this.defaultTitle);
    this.updateTag('property', 'og:title', title);
    this.updateTag('property', 'og:description', description);
    this.updateTag('property', 'og:url', canonicalUrl);
    this.updateTag('property', 'og:image', image);

    this.updateTag('name', 'twitter:card', 'summary_large_image');
    this.updateTag('name', 'twitter:title', title);
    this.updateTag('name', 'twitter:description', description);
    this.updateTag('name', 'twitter:image', image);

    this.updateCanonical(canonicalUrl);
  }

  private updateTag(attribute: 'name' | 'property', key: string, content: string): void {
    this.meta.updateTag({
      [attribute]: key,
      content,
    });
  }

  private updateCanonical(url: string): void {
    let linkElement = this.document.querySelector("link[rel='canonical']");

    if (!linkElement) {
      linkElement = this.document.createElement('link');
      linkElement.setAttribute('rel', 'canonical');
      this.document.head.appendChild(linkElement);
    }

    linkElement.setAttribute('href', url);
  }

  private getCanonicalUrl(): string {
    const path = this.router.url || '/';
    const origin = this.document.location?.origin ?? 'http://localhost:4200';
    return new URL(path, origin).toString();
  }
}
