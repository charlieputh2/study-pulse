import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {/* Items info */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold">{startItem}</span> to{' '}
        <span className="font-semibold">{endItem}</span> of{' '}
        <span className="font-semibold">{totalItems}</span> products
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-400">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Jump to page */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">Go to page:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= totalPages) {
              onPageChange(page);
            }
          }}
          className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-gray-600">of {totalPages}</span>
      </div>
    </div>
  );
};

export default Pagination;
