import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the title', () => {
    fixture.detectChanges();
    const h1: HTMLHeadingElement | null = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent).toContain('Las Doncellas de Rozen');
  });

  it('should render the logo with alt', () => {
    fixture.detectChanges();
    const img: HTMLImageElement | null = fixture.nativeElement.querySelector('a.logo img');
    expect(img).toBeTruthy();
    expect(img?.alt).toBe('Rozen Maiden Logo');
  });

  it('should navigate to / when clicked', async () => {
    // Arrange
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/');
    fixture.detectChanges();

    const link = fixture.debugElement.query(By.css('a.logo'));
    link.nativeElement.click();

    await fixture.whenStable();
    expect(router.url).toBe('/');
  });
});
