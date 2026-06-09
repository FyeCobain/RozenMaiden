import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SEOService } from './seo.service';
import { Header, Footer } from './core';

@Component({
  selector: 'rm-root',
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  // DI
  private readonly seoService = inject(SEOService);

  // Signals / atributes
  protected $artificialSpiritIsVisibleClass = signal<boolean>(false);
  protected $artificialSpiritFloatClass = signal<boolean>(false);
  protected $artificialSpiritFlyClass = signal<boolean>(false);
  protected $artificialSpiritTryClass = signal<boolean>(false);
  protected $artificialSpiritGlowClass = signal<boolean>(true);
  private addGlowClassTimeout: number | null = null;

  // Constructor
  constructor() {
    this.seoService.init();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.$artificialSpiritIsVisibleClass.set(true);
    });
  }

  // Modifies the corresponding signals to add the "float" class to the artificial spirit and remove the "appear" class
  onArtificialSpiritTransitionEnd(event: TransitionEvent): void {
    if (event.propertyName !== 'left' || !this.$artificialSpiritIsVisibleClass()) return;
    this.$artificialSpiritFloatClass.set(this.$artificialSpiritIsVisibleClass());
  }

  // Handles the click on the articifial spirit
  onArtificialSpiritClick() {
    const canScroll = window.scrollY > 0;
    const $flyOrTrySignal = canScroll ? this.$artificialSpiritFlyClass : this.$artificialSpiritTryClass;
    this.$artificialSpiritFloatClass.set(false);
    $flyOrTrySignal.set(true);
    if (canScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Returns the float animation when a "fly" or "try" animation ends
  onArtificialSpiritAnimationEnd(event: AnimationEvent): void {
    if (event.animationName.endsWith('artificial-spirit-fly') || event.animationName.endsWith('artificial-spirit-try')) {
      this.$artificialSpiritFlyClass.set(false);
      this.$artificialSpiritTryClass.set(false);
      this.$artificialSpiritFloatClass.set(true);
    }
  }

  // Removes the "glow" class
  onArtificialSpiritMouseEnter() {
    if (this.addGlowClassTimeout !== null) {
      clearTimeout(this.addGlowClassTimeout);
      this.addGlowClassTimeout = null;
    }

    this.$artificialSpiritGlowClass.set(false);
  }

  // Adds the "glow" class
  onArtificialSpiritMouseLeave() {
    if (this.addGlowClassTimeout !== null) {
      clearTimeout(this.addGlowClassTimeout);
      this.addGlowClassTimeout = null;
    }

    this.addGlowClassTimeout = setTimeout(() => {
      this.addGlowClassTimeout = null;
      this.$artificialSpiritGlowClass.set(true);
    }, 300);
  }
}
