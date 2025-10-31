"use client";

import { useQuery } from "@tanstack/react-query";
import StoreCard from "../../_components/store-card";
import StoresTable from "../../_components/store-table";
import { getSubDistrictsWithCount, getTotalStores } from "./action";
import { STORE_CARD_COLORS } from "@/constants/store-constant";
import { Building2, MapPin } from "lucide-react";

type SubDistrictWithCount = {
  id: number;
  name: string;
  stores: { id: number }[];
};

export default function DashboardPage() {
  const { data: totalStores } = useQuery({
    queryKey: ["total_stores"],
    queryFn: getTotalStores,
  });

  const { data: subDistrictsData } = useQuery<SubDistrictWithCount[]>({
    queryKey: ["sub_districts_with_count"],
    queryFn: async () => {
      const result = await getSubDistrictsWithCount();
      return result.data || [];
    },
  });

  return (
    <div className="w-full space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StoreCard
          title="Total UMKM"
          count={totalStores || 0}
          icon={<Building2 />}
          bgColor={STORE_CARD_COLORS.total.bg}
          iconColor={STORE_CARD_COLORS.total.icon}
          borderColor={STORE_CARD_COLORS.total.border}
        />

        {subDistrictsData?.map((subDistrict, index: number) => {
          const colorKey = Object.keys(STORE_CARD_COLORS)[
            index + 1
          ] as keyof typeof STORE_CARD_COLORS;
          const colors =
            STORE_CARD_COLORS[colorKey] || STORE_CARD_COLORS.pariaman_selatan;

          return (
            <StoreCard
              key={subDistrict.id}
              title={subDistrict.name}
              count={subDistrict.stores?.length || 0}
              icon={<MapPin />}
              bgColor={colors.bg}
              iconColor={colors.icon}
              borderColor={colors.border}
            />
          );
        })}
      </div>

      {/* Stores Table */}
      <StoresTable />
    </div>
  );
}
