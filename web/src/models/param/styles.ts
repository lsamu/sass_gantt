import Variables from '@/constants/vars';
import { isBoolean } from 'lodash';
import { XDate } from './date';

type Style = Record<string, string>;

export default class StyleBox {
  private __border: number = 1;
  setBorder(b: number) {
    this.__border = b;
  }

  getBorder(): Style {
    return { border: `${this.__border}px solid` };
  }

  private _borderColor: string = '#e5e5e5';
  public get borderColor(): string {
    return this._borderColor;
  }

  public set borderColor(v: string) {
    this._borderColor = v;
  }

  private __ganttColumnSize: any = 'normal';
  public set ganttColumnSize(gs: any) {
    this.__ganttColumnSize = gs;
  }

  public get ganttColumnSize(): any {
    return this.__ganttColumnSize;
  }

  private __unit: any = 'day';
  public get unit(): any {
    return this.__unit;
  }

  public set unit(v: any) {
    this.__unit = v;
  }

  private _rowHeight: number = Variables.default.rowHeight;
  public get rowHeight(): number {
    return this._rowHeight;
  }

  public set rowHeight(v: number | string) {
    if (typeof v === 'string') {
      this._rowHeight = parseInt(v);
    } else {
      this._rowHeight = v;
    }
  }

  private _showCheckbox: boolean = false;
  public get showCheckbox(): boolean {
    return this._showCheckbox;
  }

  public set showCheckbox(v: boolean) {
    this._showCheckbox = v;
  }

  private _highlightDate: boolean = false;
  public get highlightDate(): boolean {
    return this._highlightDate;
  }

  public set highlightDate(v: boolean) {
    this._highlightDate = v;
  }

  private _showExpand: boolean = true;
  public get showExpand(): boolean {
    return this._showExpand;
  }

  public set showExpand(v: boolean) {
    this._showExpand = v;
  }

  private _showToday: boolean = true;
  public get showToday(): boolean {
    return this._showToday;
  }

  public set showToday(v: boolean) {
    this._showToday = v;
  }

  private _showWeekend: boolean = true;
  public get showWeekend(): boolean {
    return this._showWeekend;
  }

  public set showWeekend(v: boolean) {
    this._showWeekend = v;
  }

  private _levelColor: string[] = [];
  public get levelColor(): string[] {
    return this._levelColor;
  }

  public set levelColor(v: string[]) {
    this._levelColor = v;
  }

  private _primaryColor: string = '#eca710';
  public get primaryColor(): string {
    return this._primaryColor;
  }

  public set primaryColor(v: string) {
    this._primaryColor = v;
  }

  private _headerStyle: any = {};
  public get headerStyle(): any {
    return this._headerStyle;
  }

  public set headerStyle(v: any) {
    this._headerStyle = v;
  }

  private _bodyStyle: any = {};
  public get bodyStyle(): any {
    return this._bodyStyle;
  }

  public set bodyStyle(v: any) {
    this._bodyStyle = v;
  }

  private _sliderIntoView: boolean = false;
  public get sliderIntoView(): boolean {
    return this._sliderIntoView;
  }

  public set sliderIntoView(v: boolean) {
    this._sliderIntoView = v;
  }

  private _draggable: any = { draggable: false, level: 'current' };
  public get draggable(): any {
    return this._draggable;
  }

  public set draggable(v: boolean | Partial<any>) {
    this._draggable = isBoolean(v)
      ? { draggable: v, level: 'current' }
      : Object.assign(this._draggable, v);
  }

  private _holidays: Array<{ date: XDate[]; color?: string }> = [];
  public get holidays(): Array<{ date: XDate[]; color?: string }> {
    return this._holidays;
  }

  public set holidays(
    v: Array<{ date: any | any[]; color?: string }>
  ) {
    const h = v.map(item => {
      if (!Array.isArray(item.date)) {
        item.date = [item.date];
      }

      return {
        date: item.date.map(d => new XDate(d)),
        color: item.color ?? this.bodyStyle?.weekendColor ?? '#ddd'
      };
    });

    this._holidays = h;
  }
}
