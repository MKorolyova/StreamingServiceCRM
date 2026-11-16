import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { formatCount } from "@/lib/format";

type SubscribersPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
};

function pageHref(page: number) {
  return page === 1 ? "/subscribers" : `/subscribers?page=${page}`;
}

export function SubscribersPagination({ page, pageSize, total }: SubscribersPaginationProps) {
  const pageCount = Math.max(Math.ceil(total / pageSize), 1);
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground tabular-nums">
        Showing {formatCount(first)}–{formatCount(last)} of {formatCount(total)}
      </p>

      {pageCount > 1 && (
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                disabled={page <= 1}
                nativeButton={false}
                render={page <= 1 ? <span aria-disabled /> : <Link href={pageHref(page - 1)} rel="prev" />}
              >
                <ChevronLeft data-icon="inline-start" aria-hidden />
                Previous
              </Button>
            </PaginationItem>
            <PaginationItem className="px-3 font-mono text-xs tracking-wider text-muted-foreground uppercase tabular-nums">
              Page {page} of {pageCount}
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                disabled={page >= pageCount}
                nativeButton={false}
                render={page >= pageCount ? <span aria-disabled /> : <Link href={pageHref(page + 1)} rel="next" />}
              >
                Next
                <ChevronRight data-icon="inline-end" aria-hidden />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
