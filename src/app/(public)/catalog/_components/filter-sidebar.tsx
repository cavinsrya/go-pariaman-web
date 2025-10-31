"use client";

import { useState, useEffect, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getVillagesBySubDistrict } from "../action";

interface FilterSidebarProps {
  categories: Array<{ id: number; name: string }>;
  subDistricts: Array<{ id: number; name: string }>;
  selectedCategories: number[];
  selectedSubDistrict: number | null;
  selectedVillage: number | null;
  priceSort: "asc" | "desc";
  onCategoryChange: (categoryId: number, checked: boolean) => void;
  onSubDistrictChange: (subDistrictId: number | null) => void;
  onVillageChange: (villageId: number | null) => void;
  onPriceSortChange: (sort: "asc" | "desc") => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function FilterSidebar({
  categories,
  subDistricts,
  selectedCategories,
  selectedSubDistrict,
  selectedVillage,
  priceSort,
  onCategoryChange,
  onSubDistrictChange,
  onVillageChange,
  onPriceSortChange,
  isOpen = true,
  onClose,
}: FilterSidebarProps) {
  const [villages, setVillages] = useState<Array<{ id: number; name: string }>>(
    []
  );
  const [isLoadingVillages, setIsLoadingVillages] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    subDistrict: true,
    village: true,
    price: true,
  });

  // ✅ Fetch villages when sub_district changes
  useEffect(() => {
    if (selectedSubDistrict) {
      setIsLoadingVillages(true);
      getVillagesBySubDistrict(selectedSubDistrict).then((data) => {
        setVillages(data);
        setIsLoadingVillages(false);
      });
    } else {
      setVillages([]);
      onVillageChange(null);
    }
  }, [selectedSubDistrict, onVillageChange]);

  // ✅ Memoized toggle function
  const toggleSection = useCallback(
    (section: keyof typeof expandedSections) => {
      setExpandedSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    },
    []
  );

  const sidebarContent = (
    <div className="space-y-6">
      {/* Kategori Filter */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-sm">Kategori</h3>
          {expandedSections.category ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.category && (
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) =>
                    onCategoryChange(category.id, checked as boolean)
                  }
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="text-sm cursor-pointer"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Kecamatan Filter */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection("subDistrict")}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-sm">Kecamatan</h3>
          {expandedSections.subDistrict ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.subDistrict && (
          <div className="space-y-2">
            {subDistricts.map((subDistrict) => (
              <div key={subDistrict.id} className="flex items-center gap-2">
                <Checkbox
                  id={`subdistrict-${subDistrict.id}`}
                  checked={selectedSubDistrict === subDistrict.id}
                  onCheckedChange={(checked) =>
                    onSubDistrictChange(checked ? subDistrict.id : null)
                  }
                />
                <label
                  htmlFor={`subdistrict-${subDistrict.id}`}
                  className="text-sm cursor-pointer"
                >
                  {subDistrict.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desa Filter */}
      <div className="border-b pb-4">
        <button
          onClick={() => toggleSection("village")}
          className="flex items-center justify-between w-full mb-3"
          disabled={!selectedSubDistrict}
        >
          <h3 className="font-semibold text-sm">Desa</h3>
          {expandedSections.village ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.village && (
          <div className="space-y-2">
            {!selectedSubDistrict ? (
              <p className="text-xs text-muted-foreground">
                Pilih Kecamatan Dulu
              </p>
            ) : isLoadingVillages ? (
              <p className="text-xs text-muted-foreground">Loading...</p>
            ) : villages.length > 0 ? (
              villages.map((village) => (
                <div key={village.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`village-${village.id}`}
                    checked={selectedVillage === village.id}
                    onCheckedChange={(checked) =>
                      onVillageChange(checked ? village.id : null)
                    }
                  />
                  <label
                    htmlFor={`village-${village.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {village.name}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">
                Tidak ada desa tersedia
              </p>
            )}
          </div>
        )}
      </div>

      {/* Harga Filter */}
      <div>
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-sm">Harga</h3>
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.price && (
          <Select
            value={priceSort}
            onValueChange={(value) =>
              onPriceSortChange(value as "asc" | "desc")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Terendah ke Tertinggi</SelectItem>
              <SelectItem value="desc">Tertinggi ke Terendah</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white border-r p-6 h-fit sticky top-20">
        <h2 className="font-bold text-lg mb-6">Filter Produk</h2>
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
        )}
        <div
          className={`fixed left-0 top-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 overflow-y-auto ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">Filter Produk</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden"
              >
                ✕
              </Button>
            </div>
            {sidebarContent}
          </div>
        </div>
      </div>
    </>
  );
}
