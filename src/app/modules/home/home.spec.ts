import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a main landmark', () => {
    fixture.detectChanges();
    const main: HTMLElement | null = fixture.nativeElement.querySelector('main');
    expect(main).toBeTruthy();
  });

  it('should render non-empty content', () => {
    fixture.detectChanges();
    const text = (fixture.nativeElement.textContent as string).trim();
    expect(text.length).toBeGreaterThan(0);
  });
});
