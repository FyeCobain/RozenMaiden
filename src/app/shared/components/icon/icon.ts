import { Component, computed, inject, input } from '@angular/core';
import { IconName, icons, type Icon as IconType } from '../../../icons';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'rm-icon',
  imports: [],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  // constants
  private readonly COLOR_ATTRIBUTE_REGEXP: RegExp = /(?<=fill=["']).+?(?=["'])|(?<=fill:).+?(?=["'])/gi;
  private readonly VIEWBOX_ATTRIBUTE_REGEXP: RegExp = /(?<=viewBox=["']).+?(?=['"])/i;
  private readonly VIEWBOX_SINGLE_VALUE_ATTRIBUTE_REGEX: RegExp = /^(?<value>\d+(?:\.\d+)?)$/;
  private readonly VIEWBOX_DOUBLE_VALUE_ATTRIBUTE_REGEX: RegExp = /^(?<value1>\d+(?:\.\d+)?) +(?<value2>\d+(?:\.\d+)?)$/;
  private readonly VIEWBOX_ALL_VALUES_ATTRIBUTE_REGEX: RegExp =
    /^(\d+(?:\.\d+)?) +(\d+(?:\.\d+)?) +(\d+(?:\.\d+)?) +(\d+(?:\.\d+)?)$/;

  // DI
  private readonly sanitizer = inject(DomSanitizer);

  // Inputs
  readonly name = input.required<IconName>();
  readonly width = input<number | null>(null);
  readonly height = input<number | null>(null);
  readonly scale = input<number>(1);
  readonly color = input<string | null, string | null>(null, {
    transform: v => {
      if (!v) return v;
      v = v.trim();
      if (v.startsWith('--')) v = `var(${v})`;
      return v;
    },
  });
  readonly viewBox = input<string | null, string | null>(null, {
    transform: v => {
      if (v === null) return v;

      v = v.trim();
      const matchSingleValue = v.match(this.VIEWBOX_SINGLE_VALUE_ATTRIBUTE_REGEX);
      const matchDoubleValue = v.match(this.VIEWBOX_DOUBLE_VALUE_ATTRIBUTE_REGEX);
      const matchAllValues = v.match(this.VIEWBOX_ALL_VALUES_ATTRIBUTE_REGEX);
      if (!matchSingleValue && !matchDoubleValue && !matchAllValues)
        throw Error(`viewBox value "${v}" is not valid in the "${this.name()}" icon.`);

      if (matchSingleValue?.groups)
        return `${matchSingleValue.groups['value']} ${matchSingleValue.groups['value']} ${matchSingleValue.groups['value']} ${matchSingleValue.groups['value']}`;
      else if (matchDoubleValue?.groups)
        return `${matchDoubleValue.groups['value1']} ${matchDoubleValue.groups['value1']} ${matchDoubleValue.groups['value2']} ${matchDoubleValue.groups['value2']}`;
      else if (matchAllValues?.groups)
        return `${matchAllValues.groups['value1']} ${matchAllValues.groups['value2']} ${matchAllValues.groups['value3']} ${matchAllValues.groups['value4']}`;

      return v;
    },
  });

  // Computed signals
  protected readonly icon = computed(() => {
    const icon = icons[this.name()];
    return {
      code: this.parseCode(icon.code),
      width: this.getWidth(icon) * this.scale(),
      height: this.getHeight(icon) * this.scale(),
    };
  });
  protected readonly svgCode = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.icon().code));
  protected readonly widthStyle = computed(() => `${this.icon().width}px`);
  protected readonly heightStyle = computed(() => `${this.icon().height}px`);

  // Calculates and returns the width value
  private getWidth(icon: IconType): number {
    const inputWidth = this.width();
    if (inputWidth !== null) return inputWidth;

    const inputHeight = this.height();
    if (inputHeight !== null) return (inputHeight / icon.height) * icon.width;

    return icon.width;
  }

  // Calculates and returns the height value
  private getHeight(icon: IconType): number {
    const inputHeight = this.height();
    if (inputHeight !== null) return inputHeight;

    const inputWidth = this.width();
    if (inputWidth !== null) return (inputWidth / icon.width) * icon.height;

    return icon.height;
  }

  // Sets the custom color and / or viewbox value
  private parseCode(code: string): string {
    const color = this.color();
    if (color) code = code.replace(this.COLOR_ATTRIBUTE_REGEXP, color);

    const viewBoxValue = this.viewBox();
    if (viewBoxValue) code = code.replace(this.VIEWBOX_ATTRIBUTE_REGEXP, viewBoxValue);

    return code;
  }
}
