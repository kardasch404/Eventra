'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/presentation/components/ui';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/events?${params.toString()}`);
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Previous
      </Button>
      
      <span className="px-4 py-2 text-sm">
        Page {currentPage} of {totalPages}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
}
