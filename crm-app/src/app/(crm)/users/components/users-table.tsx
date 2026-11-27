import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/format";

import { SortableHead } from "../../../../components/sortable-head";

import type { UserListEntry } from "../queries";
import type { ListUsersPageQuery } from "../validators";
import { UserAccessActions } from "./user-access-actions";
import { UserRoleBadge } from "./user-role-badge";
import { UserStatusBadge } from "./user-status-badge";

/**
 * Columns: 1 User, 2 Role, 3 Joined, 4 Last changed, 5 Access.
 * Lower-priority columns drop out as the page narrows, so the table fits without scrolling.
 * Done on the table because the shared SortableHead takes no className.
 */
const RESPONSIVE_COLUMNS = [
  "[&_tr>:nth-child(2)]:hidden sm:[&_tr>:nth-child(2)]:table-cell",
  "[&_tr>:nth-child(3)]:hidden xl:[&_tr>:nth-child(3)]:table-cell",
  "[&_tr>:nth-child(4)]:hidden 2xl:[&_tr>:nth-child(4)]:table-cell",
].join(" ");

type UsersTableProps = {
  userEntries: UserListEntry[];
  currentUserId: string;
  /** Shows the approve, change role and reset buttons. */
  canManage: boolean;
  sortBy: ListUsersPageQuery["sortBy"];
  sortDir: ListUsersPageQuery["sortDir"];
};

/** Approved users show their role; pending users have none yet, so they show their status instead. */
function UserAccessBadge({ user }: { user: UserListEntry }) {
  return user.role ? <UserRoleBadge role={user.role} /> : <UserStatusBadge status={user.status} />;
}

export function UsersTable({ userEntries, currentUserId, canManage, sortBy, sortDir }: UsersTableProps) {
  return (
    <div className="border">
      <Table className={RESPONSIVE_COLUMNS}>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <SortableHead column="name" label="User" sortBy={sortBy} sortDir={sortDir} />
            <SortableHead column="role" label="Role" sortBy={sortBy} sortDir={sortDir} />
            <SortableHead column="created" label="Joined" sortBy={sortBy} sortDir={sortDir} />
            <SortableHead column="updated" label="Last changed" sortBy={sortBy} sortDir={sortDir} />
            {canManage && (
              <TableHead className="h-11 px-3 text-right font-mono text-[0.7rem] font-normal tracking-[0.14em] text-muted-foreground uppercase">
                Access
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {userEntries.map((user) => (
            <TableRow key={user.userId} className="border-dashed">
              {/* w-full + max-w-0 lets this column take the spare width and truncate instead of widening the table. */}
              <TableCell className="w-full max-w-0 px-3 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate font-medium">{user.name}</span>
                  {user.userId === currentUserId && (
                    <Badge
                      variant="secondary"
                      className="shrink-0 font-mono text-[0.65rem] font-normal tracking-wider uppercase"
                    >
                      You
                    </Badge>
                  )}
                </div>
                <p className="truncate text-xs text-muted-foreground" title={user.email}>
                  {user.email}
                </p>
                {/* The Role column is hidden on phones, so the badge moves under the email. */}
                <div className="mt-1.5 sm:hidden">
                  <UserAccessBadge user={user} />
                </div>
              </TableCell>

              <TableCell className="px-3">
                <UserAccessBadge user={user} />
              </TableCell>

              <TableCell className="px-3 tabular-nums">{formatDate(user.createdAt)}</TableCell>

              <TableCell className="px-3 tabular-nums">{formatDate(user.updatedAt)}</TableCell>

              {canManage && (
                <TableCell className="px-3 text-right">
                  {user.userId === currentUserId ? (
                    <span className="text-xs text-muted-foreground">Your account</span>
                  ) : (
                    <UserAccessActions user={user} />
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
