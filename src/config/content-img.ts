// types for image media
export type SlideInput = string | { cldId: string; alt?: string };
export type MediaItem = { cldId: string; alt?: string };
export type ImageMediaConfig = {
  hero01: MediaItem;
  hero01Carousel?: SlideInput[];
  hero02: MediaItem;
};


export const ImageMedia = {
  mainlogo: { cldId: "v1760430546/mainlogo_z9im0h.png" },
  hero01: { cldId: "v1759831356/hero-01_hcexbd.png" },
  hero02: { cldId: "v1759831356/hero-02_d3t7ne.png" },
  hero01Carousel: [
    { cldId: "v1759831356/hero-01_hcexbd.png", alt: "Bundaran ikon Pariaman" },
    { cldId: "v1762978109/hero_carousel_crny7z.png", alt: "Ilustrasi 1" },
    { cldId: "v1762979900/hero_carousel3_h8jaf4.png", alt: "Foto Umkm" },
  ],
  sec02img01: { cldId: "v1759909070/sec02-img01_jyrnn1.png" },
  sec02img02: { cldId: "v1762967889/hero_3_px0nom.png" }, 
  sec04img01: { cldId: "v1760345477/sec04-img01_hhtsoy.png" },
};
