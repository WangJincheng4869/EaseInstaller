import { BrowserWindow } from 'electron';

export class WindowCache {
  private static mainWindow: BrowserWindow | null = null;

  static getMainWindow(): BrowserWindow {
    return this.mainWindow!;
  }

  static setMainWindow(window: BrowserWindow): void {
    this.mainWindow = window;
  }
}
