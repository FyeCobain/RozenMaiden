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
  private readonly SIZE_REGEXP: RegExp = /(?<value>\d+(?:\.\d+)?)(?<unit>.+)/;
  private readonly VIEWBOX_ATTRIBUTE_REGEXP: RegExp = /(?<=viewBox=["']).+?(?=['"])/i;
  private readonly VIEWBOX_SINGLE_VALUE_ATTRIBUTE_REGEX: RegExp = /^(?<value>\d+(?:\.\d+)?)$/;
  private readonly VIEWBOX_DOUBLE_VALUE_ATTRIBUTE_REGEX: RegExp = /^(?<value1>\d+(?:\.\d+)?) +(?<value2>\d+(?:\.\d+)?)$/;
  private readonly VIEWBOX_ALL_VALUES_ATTRIBUTE_REGEX: RegExp =
    /^(\d+(?:\.\d+)?) +(\d+(?:\.\d+)?) +(\d+(?:\.\d+)?) +(\d+(?:\.\d+)?)$/;

  // DI
  private readonly sanitizer = inject(DomSanitizer);

  // Inputs
  readonly name = input.required<IconName>();
  readonly color = input<string | null, string | null>(null, {
    transform: v => {
      if (!v) return v;
      v = v.trim();
      if (v.startsWith('--')) v = `var(${v})`;
      return v;
    },
  });
  readonly keepAspectRatio = input<boolean>(true);
  readonly scale = input<number>(1);
  readonly width = input<string | null>(null);
  readonly height = input<string | null>(null);
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
      width: this.getWidth(icon),
      height: this.getHeight(icon),
    };
  });
  protected readonly svgCode = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.icon().code));
  protected readonly widthStyle = computed(() => `${this.icon().width}`);
  protected readonly heightStyle = computed(() => `${this.icon().height}`);

  // Ensures that the specified size has a unit (by default px)
  private ensureSizeUnit(size: string | number): string {
    size = String(size).trim();
    if (/^\d+(?:\.\d+)?$/.test(size)) size = `${size}px`;

    return size;
  }

  // Returns an object with the size, unit and a calculate function for the size specified
  private getSizeAndUnitObject(size: string | number): { value: number; unit: string; calc: (scale: number) => string } {
    const match = this.ensureSizeUnit(size).match(this.SIZE_REGEXP);
    return {
      value: Number(match && match.groups ? match.groups['value'] : 0),
      unit: match && match.groups ? match.groups['unit'] : 'px',
      calc: function (scale) {
        return scale === 1 ? `${this.value}${this.unit}` : `calc(${this.value}${this.unit} * ${scale})`;
      },
    };
  }

  // Calculates and returns the width value
  private getWidth(icon: IconType): string {
    // Getting defaul width
    let widthObject = this.getSizeAndUnitObject(icon.width);

    // Getting input width
    const inputWidth = this.width();
    if (inputWidth !== null) widthObject = this.getSizeAndUnitObject(inputWidth);
    else if (this.keepAspectRatio()) {
      const inputHeight = this.height();
      if (inputHeight !== null)
        widthObject.value = (this.getSizeAndUnitObject(inputHeight).value / icon.height) * icon.width;
    }

    return widthObject.calc(this.scale());
  }

  // Calculates and returns the height value
  private getHeight(icon: IconType): string {
    // Getting defaul height
    let heightObject = this.getSizeAndUnitObject(icon.height);

    // Getting input height
    const inputHeight = this.height();
    if (inputHeight !== null) heightObject = this.getSizeAndUnitObject(inputHeight);
    else if (this.keepAspectRatio()) {
      const inputWidth = this.width();
      if (inputWidth !== null) heightObject.value = (this.getSizeAndUnitObject(inputWidth).value / icon.width) * icon.height;
    }

    return heightObject.calc(this.scale());
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
