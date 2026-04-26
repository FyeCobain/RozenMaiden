import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Footer } from './footer';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the legal text', () => {
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Rozen Maiden');
    expect(text).toContain('propiedad intelectual');
    expect(text).toContain('PEACH-PIT');
  });

  it('should have the PEACH-PIT official web external link', () => {
    fixture.detectChanges();
    const link: HTMLAnchorElement | null = fixture.nativeElement.querySelector('a');
    expect(link).toBeTruthy();

    expect(link?.getAttribute('href')).toBe('https://peach-pit-official.com/');
    expect(link?.target).toBe('_blank');

    const rel = link?.rel ?? '';
    expect(rel).toContain('author');
    expect(rel).toContain('noreferrer');
    expect(rel).toContain('noopener');
  });
});
