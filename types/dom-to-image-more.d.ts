// types/dom-to-image-more.d.ts

declare module 'dom-to-image-more' {
  export interface Options {
    /**
     * A function that will be called for every node in the DOM tree
     * Return false to exclude the node from the output
     */
    filter?: (node: Node) => boolean;

    /**
     * Background color for the image, any valid CSS color value
     */
    bgcolor?: string;

    /**
     * Width of the output image in pixels
     */
    width?: number;

    /**
     * Height of the output image in pixels
     */
    height?: number;

    /**
     * CSS styles to apply to the node
     */
    style?: Record<string, string>;

    /**
     * Quality of the output image (0-1)
     */
    quality?: number;

    /**
     * Image format (default: 'image/png')
     */
    imagePlaceholder?: string;

    /**
     * Whether to use cache (default: true)
     */
    cacheBust?: boolean;
  }

  /**
   * Generate a PNG image from a DOM node
   */
  export function toPng(
    node: Node,
    options?: Options
  ): Promise<string>;

  /**
   * Generate a JPEG image from a DOM node
   */
  export function toJpeg(
    node: Node,
    options?: Options
  ): Promise<string>;

  /**
   * Generate an SVG image from a DOM node
   */
  export function toSvg(
    node: Node,
    options?: Options
  ): Promise<string>;

  /**
   * Generate a Blob from a DOM node
   */
  export function toBlob(
    node: Node,
    options?: Options
  ): Promise<Blob>;

  /**
   * Generate a pixel data array from a DOM node
   */
  export function toPixelData(
    node: Node,
    options?: Options
  ): Promise<Uint8ClampedArray>;

  /**
   * Generate a canvas element from a DOM node
   */
  export function toCanvas(
    node: Node,
    options?: Options
  ): Promise<HTMLCanvasElement>;
}