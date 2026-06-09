import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  const wait = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));
  const dispatchTransitionEnd = (element: HTMLElement, propertyName: string) => {
    const event = new Event('transitionend');
    Object.defineProperty(event, 'propertyName', { value: propertyName });
    element.dispatchEvent(event);
  };
  const dispatchAnimationEnd = (element: HTMLElement, animationName: string) => {
    const event = new Event('animationend');
    Object.defineProperty(event, 'animationName', { value: animationName });
    element.dispatchEvent(event);
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render header and footer components', () => {
    fixture.detectChanges();

    const header: HTMLElement | null = fixture.nativeElement.querySelector('rm-header');
    const footer: HTMLElement | null = fixture.nativeElement.querySelector('rm-footer');

    expect(header).toBeTruthy();
    expect(footer).toBeTruthy();
  });

  it('should render the artificial spirit as an accessible button', () => {
    fixture.detectChanges();

    const artificialSpirit: HTMLButtonElement | null = fixture.nativeElement.querySelector('.artificial-spirit');

    expect(artificialSpirit).toBeTruthy();
    expect(artificialSpirit?.type).toBe('button');
    expect(artificialSpirit?.getAttribute('aria-label')).toBe('Volver arriba');
  });

  it('should show the artificial spirit after initialization', async () => {
    fixture.detectChanges();

    const artificialSpirit: HTMLButtonElement = fixture.nativeElement.querySelector('.artificial-spirit');

    expect(artificialSpirit.classList.contains('is-visible')).toBe(false);

    await wait();
    fixture.detectChanges();

    expect(artificialSpirit.classList.contains('is-visible')).toBe(true);
  });

  it('should start floating after the visible transition ends', async () => {
    fixture.detectChanges();
    await wait();
    fixture.detectChanges();

    const artificialSpirit = fixture.debugElement.query(By.css('.artificial-spirit'));

    dispatchTransitionEnd(artificialSpirit.nativeElement, 'left');
    fixture.detectChanges();

    expect(artificialSpirit.nativeElement.classList.contains('float')).toBe(true);
  });

  it('should try to fly when clicked at the top of the page', async () => {
    fixture.detectChanges();
    await wait();
    fixture.detectChanges();

    const artificialSpirit = fixture.debugElement.query(By.css('.artificial-spirit'));

    dispatchTransitionEnd(artificialSpirit.nativeElement, 'left');
    fixture.detectChanges();
    expect(artificialSpirit.nativeElement.classList.contains('float')).toBe(true);

    artificialSpirit.nativeElement.click();
    fixture.detectChanges();

    expect(artificialSpirit.nativeElement.classList.contains('float')).toBe(false);
    expect(artificialSpirit.nativeElement.classList.contains('try')).toBe(true);
  });

  it('should return to floating after fly or try animation ends', async () => {
    fixture.detectChanges();
    await wait();
    fixture.detectChanges();

    const artificialSpirit = fixture.debugElement.query(By.css('.artificial-spirit'));

    artificialSpirit.nativeElement.click();
    fixture.detectChanges();
    expect(artificialSpirit.nativeElement.classList.contains('try')).toBe(true);

    dispatchAnimationEnd(artificialSpirit.nativeElement, 'artificial-spirit-try');
    fixture.detectChanges();

    expect(artificialSpirit.nativeElement.classList.contains('try')).toBe(false);
    expect(artificialSpirit.nativeElement.classList.contains('float')).toBe(true);
  });

  it('should scroll to the top when clicked away from the top of the page', async () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    const scrollYDescriptor = Object.getOwnPropertyDescriptor(window, 'scrollY');
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      get: () => 100,
    });

    try {
      fixture.detectChanges();
      await wait();
      fixture.detectChanges();

      const artificialSpirit: HTMLButtonElement = fixture.nativeElement.querySelector('.artificial-spirit');

      artificialSpirit.click();

      expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    } finally {
      scrollToSpy.mockRestore();

      if (scrollYDescriptor) {
        Object.defineProperty(window, 'scrollY', scrollYDescriptor);
      }
    }
  });

  it('should remove and restore glow around hover', async () => {
    fixture.detectChanges();

    const artificialSpirit = fixture.debugElement.query(By.css('.artificial-spirit'));

    expect(artificialSpirit.nativeElement.classList.contains('glow')).toBe(true);

    artificialSpirit.triggerEventHandler('mouseenter');
    fixture.detectChanges();
    expect(artificialSpirit.nativeElement.classList.contains('glow')).toBe(false);

    artificialSpirit.triggerEventHandler('mouseleave');
    await wait(299);
    fixture.detectChanges();
    expect(artificialSpirit.nativeElement.classList.contains('glow')).toBe(false);

    await wait(1);
    fixture.detectChanges();
    expect(artificialSpirit.nativeElement.classList.contains('glow')).toBe(true);
  });
});
