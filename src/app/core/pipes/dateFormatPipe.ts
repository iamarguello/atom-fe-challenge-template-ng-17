import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "DateFormat",
    standalone: true
})

export class DateFormat implements PipeTransform { 
    transform(value: Timestamp | Date | string | null | undefined): Date | null {
    if (!value) return null;
    console.log('value', value);

    if (value instanceof Date) return value;

    if (typeof value === 'object' && '_seconds' in value) {
      return new Date(value._seconds * 1000);
    }

    if (typeof value === 'string') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    }

    return null;
  }
}

interface Timestamp {
  _seconds: number;
  _nanoseconds: number;
}