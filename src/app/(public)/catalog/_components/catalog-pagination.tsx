import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CatalogPagination({
  currentPage,
  totalPages,
  onPageChange,
}: CatalogPaginationProps) {
  const renderPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      // Always show first page, last page, and pages around current page
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => onPageChange(i)}
              isActive={i === currentPage}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (
        (i === 2 && currentPage > 3) ||
        (i === totalPages - 1 && currentPage < totalPages - 2)
      ) {
        // Show ellipsis
        pages.push(
          <PaginationItem key={`ellipsis-${i}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-center">
      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                className="cursor-pointer"
              />
            </PaginationItem>
          )}

          {/* Page Numbers */}
          {renderPageNumbers()}

          {/* Next Button */}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                className="cursor-pointer"
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
