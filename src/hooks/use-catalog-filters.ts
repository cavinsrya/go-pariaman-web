import { useState, useCallback } from "react";

export interface UseCatalogFiltersReturn {
  // State
  selectedCategories: number[];
  selectedSubDistrict: number | null;
  selectedVillage: number | null;
  priceSort: "asc" | "desc";
  search: string;
  page: number;

  // Actions
  handleCategoryChange: (categoryId: number, checked: boolean) => void;
  handleSubDistrictChange: (subDistrictId: number | null) => void;
  handleVillageChange: (villageId: number | null) => void;
  handlePriceSortChange: (sort: "asc" | "desc") => void;
  handleSearchChange: (value: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export function useCatalogFilters(): UseCatalogFiltersReturn {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<number | null>(
    null
  );
  const [selectedVillage, setSelectedVillage] = useState<number | null>(null);
  const [priceSort, setPriceSort] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const handleCategoryChange = useCallback(
    (categoryId: number, checked: boolean) => {
      setSelectedCategories((prev) =>
        checked ? [...prev, categoryId] : prev.filter((id) => id !== categoryId)
      );
      setPage(1); 
    },
    []
  );

  const handleSubDistrictChange = useCallback(
    (subDistrictId: number | null) => {
      setSelectedSubDistrict(subDistrictId);
      setSelectedVillage(null); 
      setPage(1);
    },
    []
  );

  const handleVillageChange = useCallback((villageId: number | null) => {
    setSelectedVillage(villageId);
    setPage(1);
  }, []);

  const handlePriceSortChange = useCallback((sort: "asc" | "desc") => {
    setPriceSort(sort);
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedSubDistrict(null);
    setSelectedVillage(null);
    setPriceSort("asc");
    setSearch("");
    setPage(1);
  }, []);

  return {
    selectedCategories,
    selectedSubDistrict,
    selectedVillage,
    priceSort,
    search,
    page,
    handleCategoryChange,
    handleSubDistrictChange,
    handleVillageChange,
    handlePriceSortChange,
    handleSearchChange,
    setPage,
    resetFilters,
  };
}
