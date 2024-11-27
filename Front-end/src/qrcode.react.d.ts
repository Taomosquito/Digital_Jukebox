
// src/qrcode.react.d.ts

declare module 'qrcode.react' {
  import * as React from 'react';

  export interface QRCodeProps {
    value: string;
    size?: number;
    fgColor?: string;
    bgColor?: string;
    includeMargin?: boolean;
    renderAs?: 'svg' | 'canvas';
    level?: 'L' | 'M' | 'Q' | 'H';
    imageSettings?: {
      src: string;
      height: number;
      width: number;
      excavate: boolean;
    };
  }

  // Export QRCode as a named export
  export const QRCode: React.FC<QRCodeProps>;
}
