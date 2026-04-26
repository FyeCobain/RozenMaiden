import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render header and footer components', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const header: HTMLElement | null = fixture.nativeElement.querySelector('rm-header');
    const footer: HTMLElement | null = fixture.nativeElement.querySelector('rm-footer');

    expect(header).toBeTruthy();
    expect(footer).toBeTruthy();
  });
});
