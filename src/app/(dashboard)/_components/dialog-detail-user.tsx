"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, User } from "lucide-react";
import Image from "next/image";
import { StoreTableRow } from "../admin/dashboard/action";

// --- Props Komponen ---
interface StoreDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store?: StoreTableRow | null;
}

export default function DialogStoreDetail({
  open,
  onOpenChange,
  store,
}: StoreDetailDialogProps) {
  if (!store) return null;

  const owner = store.users;
  const location = {
    subDistrict: store.sub_districts?.name || null,
    village: store.villages?.name || null,
  };
  const socialLinks = store.store_social_links || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{store.name}</DialogTitle>
          <DialogDescription>Informasi lengkap toko</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Cover */}
          {store.cover_url && (
            <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={store.cover_url} // Hapus fallback jika tidak perlu
                alt={store.name}
                layout="fill" // Gunakan fill/cover
                objectFit="cover"
              />
            </div>
          )}

          {/* Info Dasar (Termasuk Logo & Pemilik) */}
          <div className="flex items-start gap-4">
            {/* --- Logo Toko --- */}
            <div className="relative w-20 h-20 mt-1 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border">
              <Image
                src={store.logo_url || "/placeholder.svg"} // Fallback
                alt={store.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            {/* --- End Logo Toko --- */}

            <div className="grid gap-4 flex-1">
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Nama Toko
                </label>
                <p className="text-base font-medium">{store.name}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Pemilik
                </label>
                {/* --- Foto Profil Pemilik --- */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                    <Image
                      src={owner?.avatar_url || "/placeholder.svg"} // Fallback
                      alt={owner?.name || "Pemilik"}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <p className="text-base">{owner?.name || "-"}</p>
                </div>
                {/* --- End Foto Profil Pemilik --- */}
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Deskripsi
            </label>
            <p className="text-base text-gray-700">
              {store.description || "-"}
            </p>
          </div>

          {/* Info Kontak & Alamat */}
          <div className="grid gap-3 border-t pt-4">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-500" />
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Telepon
                </label>
                <p className="text-base">{store.phone || "-"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-500 mt-1" />
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Alamat
                </label>
                <p className="text-base">{store.address || "-"}</p>
              </div>
            </div>
          </div>

          {/* Info Lokasi */}
          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Kecamatan
              </label>
              <p className="text-base">{location.subDistrict || "-"}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Desa/Kelurahan
              </label>
              <p className="text-base">{location.village || "-"}</p>
            </div>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="border-t pt-4">
              <label className="text-sm font-semibold text-gray-600 block mb-3">
                Media Sosial
              </label>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <Badge key={link.platform} variant="secondary">
                    {link.platform}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
