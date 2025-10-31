export const img = {
  cld: (publicId: string, opts = "f_auto,q_auto") =>
    `https://res.cloudinary.com/dohpngcuj/image/upload/${opts}/${publicId}`,
  supa: (publicPath: string) =>
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product_media/${publicPath}`,
};
