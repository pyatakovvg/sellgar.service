
import sharp, { RGBA, Sharp, Metadata } from 'sharp';


interface IImage {
  metadata(): Promise<Metadata>;
  resize(width: number, height?: number | null): IImage;
  background(color: string | RGBA): IImage;
  toJpeg(quality: number): IImage;
  toWebp(quality: number): IImage;
  toBuffer(): Promise<Buffer>;
}


class Image implements IImage {
  private instance: Sharp;

  constructor(buffer: Buffer) {
    this.instance = sharp(buffer);
  }

  async metadata(): Promise<Metadata> {
    return await this.instance.metadata();
  }

  resize(width: number, height?: number | null): IImage {
    this.instance.resize(width, height || null, {
      kernel: sharp.kernel.cubic,
      fit: sharp.fit.contain,
      withoutEnlargement: true,
      position: sharp.strategy.entropy,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    });
    return this;
  }

  background(color: string | RGBA): IImage {
    this.instance.flatten({
      background: color,
    });
    return this;
  }

  toJpeg(quality: number = 80) {
    this.instance.jpeg({ quality });
    return this;
  }

  toWebp(quality: number = 80) {
    this.instance.webp({ quality });
    return this;
  }

  async toBuffer(): Promise<Buffer> {
    return await this.instance.toBuffer();
  }
}

export default Image;
