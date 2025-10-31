"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/common/dashboard/data-table";
import DropdownAction from "@/components/common/dashboard/dropdown-action";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HEADER_TABLE_STORES } from "@/constants/store-constant";
import useDataTable from "@/hooks/use-data-table";
import {
  getStoresData,
  getSubDistrictsWithCount,
  getVillagesBySubDistrict,
  getStoreDetail,
  StoresDataResult,
  StoreTableRow,
} from "../admin/dashboard/action";
import { Eye, ExternalLink } from "lucide-react";
import DialogStoreDetail from "./dialog-detail-user";
import { toast } from "sonner";
import { StoreProfile } from "@/types/auth";

type SubDistrictOption = { id: number; name: string; stores: { id: number }[] }; // Tipe dari getSubDistrictsWithCount
type VillageOption = { id: number; name: string };

export default function StoresTable() {
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangeLimit,
    handleChangePage,
    handleChangeSearch,
  } = useDataTable();

  const [selectedSubDistrict, setSelectedSubDistrict] = useState<
    number | undefined
  >();
  const [selectedVillage, setSelectedVillage] = useState<number | undefined>();
  const [selectedStore, setSelectedStore] = useState<StoreTableRow | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch sub districts
  const { data: subDistrictsData } = useQuery<SubDistrictOption[]>({
    queryKey: ["sub_districts"],
    queryFn: async () => {
      const result = await getSubDistrictsWithCount();
      return result.data || [];
    },
  });

  // Fetch villages based on selected sub district
  const { data: villagesData } = useQuery<VillageOption[]>({
    queryKey: ["villages", selectedSubDistrict],
    queryFn: async () => {
      if (!selectedSubDistrict) return [];
      const result = await getVillagesBySubDistrict(selectedSubDistrict);
      return result.data || [];
    },
    enabled: !!selectedSubDistrict,
  });

  // Fetch stores
  const {
    data: storesData,
    isLoading,
    refetch,
  } = useQuery<StoresDataResult>({
    queryKey: [
      "stores",
      currentPage,
      currentLimit,
      currentSearch,
      selectedSubDistrict,
      selectedVillage,
    ],
    queryFn: async () => {
      const result = await getStoresData(
        selectedSubDistrict,
        selectedVillage,
        currentSearch,
        currentLimit,
        (currentPage - 1) * currentLimit
      );
      return result;
    },
  });

  // Fetch store detail when dialog opens
  useEffect(() => {
    if (!dialogOpen || !selectedStore) return;

    let alive = true;
    (async () => {
      const result = await getStoreDetail(selectedStore.id);
      if (!alive) return;

      if (result.error || !result.data) {
        toast.error("Failed to load store details");
      } else {
        setSelectedStore(result.data); // ⬅️ sudah ter-normalisasi
      }
    })();

    return () => {
      alive = false;
    };
  }, [dialogOpen, selectedStore?.id]);

  const filteredData = useMemo(() => {
    return (storesData?.data || []).map((store: StoreTableRow, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        store.name,
        store.sub_districts?.name || "-",
        store.users?.name || "-",
        store.phone || "-",
        store.address ? store.address.substring(0, 50) + "..." : "-",
        <DropdownAction
          key={store.id} // Added key prop
          menu={[
            {
              label: (
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Kunjungi Profile
                </span>
              ),
              action: () => {
                window.open(`/store/${store.id}`, "_blank");
              },
            },
            {
              label: (
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Lihat Data
                </span>
              ),
              action: () => {
                setSelectedStore(store);
                setDialogOpen(true);
              },
            },
          ]}
        />,
      ];
    });
  }, [storesData, currentPage, currentLimit]);

  const totalPages = useMemo(() => {
    return storesData && storesData.count !== null
      ? Math.ceil(storesData.count / currentLimit)
      : 0;
  }, [currentLimit, storesData]);

  const handleSubDistrictChange = (value: string) => {
    setSelectedSubDistrict(value ? Number(value) : undefined);
    setSelectedVillage(undefined);
    handleChangePage(1);
  };

  const handleVillageChange = (value: string) => {
    setSelectedVillage(value ? Number(value) : undefined);
    handleChangePage(1);
  };

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Cari Toko</label>
          <Input
            placeholder="Cari nama toko..."
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
        </div>

        <div className="w-full lg:w-48">
          <label className="text-sm font-medium mb-2 block">Kecamatan</label>
          <Select
            value={selectedSubDistrict?.toString() || "all"}
            onValueChange={handleSubDistrictChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Kecamatan" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Kecamatan</SelectLabel>
                <SelectItem value="all">Semua Kecamatan</SelectItem>
                {subDistrictsData?.map((sd: SubDistrictOption) => (
                  <SelectItem key={sd.id} value={sd.id.toString()}>
                    {sd.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full lg:w-48">
          <label className="text-sm font-medium mb-2 block">
            Desa/Kelurahan
          </label>
          <Select
            value={selectedVillage?.toString() || "all"}
            onValueChange={handleVillageChange}
            disabled={!selectedSubDistrict}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Desa/Kelurahan" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Desa/Kelurahan</SelectLabel>
                <SelectItem value="all">Semua Desa/Kelurahan</SelectItem>
                {villagesData?.map((village: VillageOption) => (
                  <SelectItem key={village.id} value={village.id.toString()}>
                    {village.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <DataTable
        header={HEADER_TABLE_STORES}
        data={filteredData}
        isLoading={isLoading}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />

      {/* Dialog */}
      <DialogStoreDetail
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        store={selectedStore}
      />
    </div>
  );
}
