import Link from "next/link";
import { redirect } from "next/navigation";
import { SearchX, ShieldCheck } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLE_LABELS } from "@/constants/constants";
import { userRoleEnum, userStatusEnum } from "@/db/schema";
import { formatEnumLabel } from "@/lib/format";

import { FilterSelect } from "../../../../components/filter-select";
import { Corners } from "../../../components/landing-primitives";
import { ListPagination } from "../../../components/list-pagination";
import { SearchField } from "../../../components/search-field";

import { getUsersTotal, listUsers } from "../queries";
import type { ListUsersPageQuery } from "../validators";
import { UsersTable } from "./users-table";

function usersHref(params: Partial<ListUsersPageQuery>): string {
  const search = new URLSearchParams();

  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("pageSize", String(params.pageSize));
  if (params.sortBy) search.set("sortBy", params.sortBy);
  if (params.sortDir) search.set("sortDir", params.sortDir);
  if (params.query) search.set("query", params.query);
  if (params.role) search.set("role", params.role);
  if (params.status) search.set("status", params.status);

  return `/users?${search}`;
}

type UsersListTabProps = ListUsersPageQuery & { currentUserId: string; canManage: boolean };

export async function UsersListTab({ currentUserId, canManage, ...params }: UsersListTabProps) {
  const [userEntries, usersTotal] = await Promise.all([listUsers(params), getUsersTotal(params)]);

  // A link to a page past the end, such as after the list shrank: go to the last page instead.
  if (usersTotal > 0 && userEntries.length === 0) {
    redirect(usersHref({ ...params, page: Math.ceil(usersTotal / params.pageSize) }));
  }

  const hasFilters = Boolean(params.role || params.status);
  const hasSearch = Boolean(params.query);

  if (usersTotal === 0 && !hasFilters && !hasSearch) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="No users yet"
        description="Staff accounts appear here the first time someone signs in to the CRM."
      />
    );
  }

  const clearFiltersHref = usersHref({ pageSize: params.pageSize, sortBy: params.sortBy, sortDir: params.sortDir });

  return (
    <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
      <Card size="sm" className="relative rounded-none bg-background lg:sticky lg:top-6">
        <Corners className="text-primary" />

        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <FilterSelect
            param="role"
            label="Role"
            allLabel="All roles"
            options={userRoleEnum.enumValues.map((role) => ({ value: role, label: ROLE_LABELS[role] }))}
          />

          <FilterSelect
            param="status"
            label="Status"
            allLabel="All statuses"
            options={userStatusEnum.enumValues.map((status) => ({ value: status, label: formatEnumLabel(status) }))}
          />

          {hasFilters && (
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={usersHref({ ...params, page: undefined, role: undefined, status: undefined })} />}
            >
              Clear filters
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="flex min-w-0 flex-col gap-4">
        <SearchField label="Search by name or email" placeholder="Name or email" className="sm:max-w-none" />

        {usersTotal === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No users match"
            description={
              params.role && params.status === "PENDING"
                ? "Pending users don't have a role yet. Clear the role filter to see them."
                : "No account fits this search and these filters. Clear them to see everyone."
            }
          >
            <Button variant="outline" nativeButton={false} render={<Link href={clearFiltersHref} />}>
              Clear search and filters
            </Button>
          </EmptyState>
        ) : (
          <>
            <UsersTable
              userEntries={userEntries}
              currentUserId={currentUserId}
              canManage={canManage}
              sortBy={params.sortBy}
              sortDir={params.sortDir}
            />
            <ListPagination
              page={params.page}
              pageSize={params.pageSize}
              total={usersTotal}
              hrefForPage={(target) => usersHref({ ...params, page: target })}
            />
          </>
        )}
      </div>
    </div>
  );
}
