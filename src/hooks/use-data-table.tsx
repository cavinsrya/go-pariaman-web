import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/constants/data-table.constant";
import { useState } from "react";
import useDebounce from "./use-debounce";

type UseDataTableProps = {
  defaultLimit?: number;
};

export default function useDataTable(props?: UseDataTableProps) {
  const [currentPage, setCurrrentPage] = useState(DEFAULT_PAGE);
  const [currentLimit, setCurrrentLimit] = useState(
    props?.defaultLimit ?? DEFAULT_LIMIT
  );
  const [currentSearch, setCurrentSearch] = useState("");
  const debounce = useDebounce();

  const handleChangePage = (page: number) => {
    setCurrrentPage(page);
  };

  const handleChangeLimit = (limit: number) => {
    setCurrrentLimit(limit);
    setCurrrentPage(DEFAULT_PAGE);
  };

  const handleChangeSearch = (search: string) => {
    debounce(() => {
      setCurrentSearch(search);
      setCurrrentPage(DEFAULT_PAGE);
    }, 500);
  };

  return {
    currentPage,
    handleChangePage,
    currentLimit,
    handleChangeLimit,
    currentSearch,
    handleChangeSearch,
  };
}
