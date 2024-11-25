interface ColorScheme {
  [key: string]: string;
}

interface Schemes {
  light: ColorScheme;
}

interface ColorExport {
  description: string;
  seed: string;
  coreColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    error: string;
    neutral: string;
    neutralVariant: string;
  };
  extendedColors: any[];
  schemes: Schemes;
}

// スタイル名のマッピングを定義
const lightSchemeMapping = {
  primary: 'M3/sys/light/primary',
  surfaceTint: 'M3/sys/light/surface-tint',
  onPrimary: 'M3/sys/light/on-primary',
  primaryContainer: 'M3/sys/light/primary-container',
  onPrimaryContainer: 'M3/sys/light/on-primary-container',
  secondary: 'M3/sys/light/secondary',
  onSecondary: 'M3/sys/light/on-secondary',
  secondaryContainer: 'M3/sys/light/secondary-container',
  onSecondaryContainer: 'M3/sys/light/on-secondary-container',
  tertiary: 'M3/sys/light/tertiary',
  onTertiary: 'M3/sys/light/on-tertiary',
  tertiaryContainer: 'M3/sys/light/tertiary-container',
  onTertiaryContainer: 'M3/sys/light/on-tertiary-container',
  error: 'M3/sys/light/error',
  onError: 'M3/sys/light/on-error',
  errorContainer: 'M3/sys/light/error-container',
  onErrorContainer: 'M3/sys/light/on-error-container',
  background: 'M3/sys/light/background',
  onBackground: 'M3/sys/light/on-background',
  surface: 'M3/sys/light/surface',
  onSurface: 'M3/sys/light/on-surface',
  surfaceVariant: 'M3/sys/light/surface-variant',
  onSurfaceVariant: 'M3/sys/light/on-surface-variant',
  outline: 'M3/sys/light/outline',
  outlineVariant: 'M3/sys/light/outline-variant',
  shadow: 'M3/sys/light/shadow',
  scrim: 'M3/sys/light/scrim',
  inverseSurface: 'M3/sys/light/inverse-surface',
  inverseOnSurface: 'M3/sys/light/inverse-on-surface',
  inversePrimary: 'M3/sys/light/inverse-primary',
  primaryFixed: 'M3/sys/light/primary-fixed',
  onPrimaryFixed: 'M3/sys/light/on-primary-fixed',
  primaryFixedDim: 'M3/sys/light/primary-fixed-dim',
  onPrimaryFixedVariant: 'M3/sys/light/on-primary-fixed-variant',
  secondaryFixed: 'M3/sys/light/secondary-fixed',
  onSecondaryFixed: 'M3/sys/light/on-secondary-fixed',
  secondaryFixedDim: 'M3/sys/light/secondary-fixed-dim',
  onSecondaryFixedVariant: 'M3/sys/light/on-secondary-fixed-variant',
  tertiaryFixed: 'M3/sys/light/tertiary-fixed',
  onTertiaryFixed: 'M3/sys/light/on-tertiary-fixed',
  tertiaryFixedDim: 'M3/sys/light/tertiary-fixed-dim',
  onTertiaryFixedVariant: 'M3/sys/light/on-tertiary-fixed-variant',
  surfaceDim: 'M3/sys/light/surface-dim',
  surfaceBright: 'M3/sys/light/surface-bright',
  surfaceContainerLowest: 'M3/sys/light/surface-container-lowest',
  surfaceContainerLow: 'M3/sys/light/surface-container-low',
  surfaceContainer: 'M3/sys/light/surface-container',
  surfaceContainerHigh: 'M3/sys/light/surface-container-high',
  surfaceContainerHighest: 'M3/sys/light/surface-container-highest'
};

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

function getColorByStyleName(styles: PaintStyle[], targetName: string): string {
  const style = styles.find(s => s.name === targetName);
  if (style && style.paints[0].type === 'SOLID') {
    const paint = style.paints[0] as SolidPaint;
    return rgbToHex(paint.color.r, paint.color.g, paint.color.b);
  }
  return '#000000'; // デフォルト値
}

figma.showUI(__html__, { width: 500, height: 600 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'export-styles') {
    const localStyles = figma.getLocalPaintStyles();
    
    const primaryColor = getColorByStyleName(localStyles, 'M3/sys/light/primary');

    const colorExport: ColorExport = {
      description: "Material Theme JSON",
      seed: primaryColor,
      coreColors: {
        primary: getColorByStyleName(localStyles, 'M3/sys/light/primary'),
        secondary: getColorByStyleName(localStyles, 'M3/sys/light/secondary'),
        tertiary: getColorByStyleName(localStyles, 'M3/sys/light/tertiary'),
        error: getColorByStyleName(localStyles, 'M3/sys/light/error'),
        neutral: getColorByStyleName(localStyles, 'M3/ref/neutral/neutral40'),
        neutralVariant: getColorByStyleName(localStyles, 'M3/ref/neutral-variant/neutral-variant40')
      },
      extendedColors: [],
      schemes: {
        light: {}
      }
    };

    // lightスキームの処理
    Object.entries(lightSchemeMapping).forEach(([key, styleName]) => {
      colorExport.schemes.light[key] = getColorByStyleName(localStyles, styleName);
    });

    figma.ui.postMessage({
      type: 'export-complete',
      data: JSON.stringify(colorExport, null, 2)
    });
  }
};