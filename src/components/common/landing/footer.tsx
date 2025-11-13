"use client";

import Image from "next/image";

export const Footer: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-2 sm:px-10">
          <div className="border rounded-2xl mt-12 grid grid-cols-1 md:grid-cols-3">
            <div className="flex items-center gap-4 p-6 border-b md:border-b-0 md:border-r">
              <Image
                src="https://res.cloudinary.com/dohpngcuj/image/upload/v1750791315/CSIcon_efq9ko.png"
                alt="Pusat Bantuan"
                width={80}
                height={80}
              />
              <div>
                <p className="text-sm text-gray-600">Pusat Bantuan</p>
                <p className="text-lg font-bold text-gray-800">
                  +62 811 688 888
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 border-b md:border-b-0 md:border-r">
              <Image
                src="https://res.cloudinary.com/dohpngcuj/image/upload/v1750791315/EmailIcon_biuzhm.png"
                alt="Email Kami"
                width={80}
                height={80}
              />
              <div>
                <p className="text-sm text-gray-600">Email Kami</p>
                <p className="text-lg font-bold text-gray-800">
                  cs@pariaman.com
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6">
              <Image
                src="https://res.cloudinary.com/dohpngcuj/image/upload/v1750791279/WhatsappIcon_dw2epe.png"
                alt="WhatsApp Kami"
                width={80}
                height={80}
              />
              <div>
                <p className="text-sm text-gray-600">WhatsApp Kami</p>
                <p className="text-lg font-bold text-gray-800">
                  +62 851 555 232
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-12">
          <div className="container mx-auto px-4 py-6 text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Go Pariaman. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
