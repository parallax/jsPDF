/**
 * Minimal ambient typing for the optional "canvg" dependency used by
 * src/modules/svg.ts.
 *
 * The installed canvg package declares `"types": "lib/index.d.ts"`, but its
 * package.json "exports" map lacks a "types" condition, so under this
 * repository's `moduleResolution: "bundler"` the module resolves to the
 * untyped `lib/index.es.js` (TS7016). This shim declares only the surface
 * that src/modules/svg.ts actually consumes.
 */
declare module "canvg" {
  export interface CanvgRenderOptions {
    ignoreMouse?: boolean;
    ignoreAnimation?: boolean;
    ignoreDimensions?: boolean;
  }

  export interface CanvgInstance {
    render(options?: CanvgRenderOptions): Promise<void>;
  }

  export interface CanvgStatic {
    fromString(
      ctx: CanvasRenderingContext2D,
      svg: string,
      options?: CanvgRenderOptions
    ): CanvgInstance;
  }

  const Canvg: CanvgStatic;
  export default Canvg;
}
