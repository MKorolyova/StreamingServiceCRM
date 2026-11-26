"use client";

import { useState, useTransition } from "react";
import { LoaderCircle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { ROLE_LABELS, type UserRole } from "@/constants/constants";

import { updateUserAction } from "../actions";

const ROLE_ITEMS = (Object.keys(ROLE_LABELS) as UserRole[]).map((role) => ({ value: role, label: ROLE_LABELS[role] }));

type UserAccessControlProps = {
  userId: string;
  name: string;
  /** Null while the account is waiting for approval. */
  role: UserRole | null;
  /** True for the viewer's own row: nobody can deactivate themselves. */
  isSelf: boolean;
};

/** Activates a waiting account with a role, or deactivates an active one after a confirmation. */
export function UserAccessControl({ userId, name, role, isSelf }: UserAccessControlProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function activate() {
    if (!selectedRole) {
      setRoleError("Choose a role first");
      return;
    }

    startTransition(async () => {
      const result = await updateUserAction({ userId, status: "APPROVED", role: selectedRole });
      if (result.ok) {
        toast.add({ type: "success", title: `${name} activated`, description: `Role: ${ROLE_LABELS[selectedRole]}.` });
      } else {
        setRoleError(result.error.fieldErrors?.role?.[0] ?? null);
        toast.add({ type: "error", title: `Couldn't activate ${name}`, description: result.error.message });
      }
    });
  }

  function deactivate() {
    startTransition(async () => {
      const result = await updateUserAction({ userId, status: "PENDING" });
      if (result.ok) {
        setIsConfirmOpen(false);
        setSelectedRole(null);
        toast.add({
          type: "success",
          title: `${name} deactivated`,
          description: "They are back to waiting for approval and can no longer open the workspace.",
        });
      } else {
        toast.add({ type: "error", title: `Couldn't deactivate ${name}`, description: result.error.message });
      }
    });
  }

  if (role === null) {
    const errorId = `role-error-${userId}`;

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Select
            items={ROLE_ITEMS}
            value={selectedRole}
            onValueChange={(nextRole) => {
              setSelectedRole(nextRole);
              setRoleError(null);
            }}
            disabled={isPending}
          >
            <SelectTrigger
              size="sm"
              className="w-40"
              aria-label={`Role for ${name}`}
              aria-invalid={roleError ? true : undefined}
              aria-describedby={roleError ? errorId : undefined}
            >
              <SelectValue placeholder="Choose a role" />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} align="start">
              {ROLE_ITEMS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={activate} disabled={isPending}>
            {isPending && <LoaderCircle data-icon="inline-start" aria-hidden className="animate-spin" />}
            Activate
          </Button>
        </div>
        {roleError && (
          <p id={errorId} role="alert" className="text-xs text-destructive">
            {roleError}
          </p>
        )}
      </div>
    );
  }

  if (isSelf) return <span className="text-muted-foreground">This is you</span>;

  return (
    // Stays open while the request runs, so the result is not missed.
    <AlertDialog open={isConfirmOpen} onOpenChange={(open) => !isPending && setIsConfirmOpen(open)}>
      <AlertDialogTrigger render={<Button variant="outline" size="sm" className="border-dashed" />}>
        Deactivate
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deactivate {name}?</AlertDialogTitle>
          <AlertDialogDescription>
            They lose access to the workspace straight away and their {ROLE_LABELS[role]} role is removed. You can
            activate them again later by choosing a role.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Keep active</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={deactivate} disabled={isPending}>
            {isPending && <LoaderCircle data-icon="inline-start" aria-hidden className="animate-spin" />}
            Deactivate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
