"use client";

import { useId, useState, useTransition, type FormEvent } from "react";
import { Loader2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { ROLE_LABELS, type UserRole } from "@/constants/constants";
import { ROLE_PERMISSIONS } from "@/constants/permissions";
import { userRoleEnum } from "@/db/schema";
import type { User } from "@/types/users";

import { updateUserAccessAction } from "../actions";

type AccessTarget = Pick<User, "userId" | "name" | "status" | "role">;

const ROLE_ITEMS = userRoleEnum.enumValues.map((role) => ({ value: role, label: ROLE_LABELS[role] }));

/** Approve, change role, or reset buttons for one user. Each opens a dialog before anything is saved. */
export function UserAccessActions({ user }: { user: AccessTarget }) {
  if (user.status === "PENDING") return <RoleDialog user={user} mode="approve" />;

  return (
    <div className="flex justify-end gap-1">
      <RoleDialog user={user} mode="change" />
      <ResetAccessDialog user={user} />
    </div>
  );
}

type RoleDialogProps = {
  user: AccessTarget;
  /** "approve" gives a pending user their first role; "change" swaps an approved user's role. */
  mode: "approve" | "change";
};

function RoleDialog({ user, mode }: RoleDialogProps) {
  const selectId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<UserRole | null>(user.role);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isApprove = mode === "approve";
  const isUnchanged = !isApprove && role === user.role;

  function changeOpen(nextOpen: boolean) {
    // Keep the dialog up while saving, so the result is never missed.
    if (isPending) return;
    setIsOpen(nextOpen);
    if (nextOpen) {
      setRole(user.role);
      setRoleError(null);
    }
  }

  function submitRole(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!role) {
      setRoleError("Choose a role to approve this user.");
      return;
    }

    startTransition(async () => {
      const result = await updateUserAccessAction({ userId: user.userId, status: "APPROVED", role });

      if (result.ok) {
        setIsOpen(false);
        toast.add({
          type: "success",
          title: isApprove ? `${user.name} is approved` : `${user.name}'s role changed`,
          description: `They now have the ${ROLE_LABELS[role]} role.`,
        });
        return;
      }

      const fieldError = result.error.fieldErrors?.role?.[0];
      if (fieldError) {
        setRoleError(fieldError);
        return;
      }

      toast.add({
        type: "error",
        title: isApprove ? "Couldn't approve this user" : "Couldn't change the role",
        description: result.error.message,
      });
    });
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={changeOpen}>
      <AlertDialogTrigger render={<Button size="sm" variant={isApprove ? "default" : "outline"} />}>
        {isApprove ? "Approve" : "Change role"}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <form onSubmit={submitRole} className="grid gap-4">
          <AlertDialogHeader>
            <AlertDialogTitle>{isApprove ? `Approve ${user.name}` : `Change ${user.name}'s role`}</AlertDialogTitle>
            <AlertDialogDescription>
              {isApprove
                ? "Pick a role. They can use the CRM as soon as you approve them, with that role's permissions."
                : "The new role applies the next time they open a page."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Field data-invalid={roleError ? true : undefined}>
            <FieldLabel htmlFor={selectId}>Role</FieldLabel>
            <Select
              items={ROLE_ITEMS}
              value={role}
              onValueChange={(nextRole) => {
                setRole(nextRole);
                setRoleError(null);
              }}
              disabled={isPending}
            >
              <SelectTrigger id={selectId} className="w-full" aria-invalid={roleError ? true : undefined}>
                <SelectValue placeholder="Choose a role" />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} align="start">
                <SelectGroup>
                  {ROLE_ITEMS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {role && !roleError && (
              <FieldDescription>{ROLE_PERMISSIONS[role].length} permissions</FieldDescription>
            )}
            <FieldError>{roleError}</FieldError>
          </Field>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={isPending || isUnchanged}>
              {isPending && <Loader2Icon data-icon="inline-start" aria-hidden className="animate-spin" />}
              {isPending ? "Saving…" : isApprove ? "Approve" : "Save role"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ResetAccessDialog({ user }: { user: AccessTarget }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function resetAccess() {
    startTransition(async () => {
      const result = await updateUserAccessAction({ userId: user.userId, status: "PENDING" });

      if (result.ok) {
        setIsOpen(false);
        toast.add({
          type: "success",
          title: `${user.name} is back to pending`,
          description: "They can't use the CRM until an admin approves them again.",
        });
        return;
      }

      toast.add({ type: "error", title: "Couldn't reset access", description: result.error.message });
    });
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(nextOpen) => !isPending && setIsOpen(nextOpen)}>
      <AlertDialogTrigger render={<Button size="sm" variant="ghost" />}>Reset</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset {user.name} to pending?</AlertDialogTitle>
          <AlertDialogDescription>
            They lose the {user.role ? ROLE_LABELS[user.role] : "current"} role and can&apos;t open any CRM page until an
            admin approves them again.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button variant="destructive" disabled={isPending} onClick={resetAccess}>
            {isPending && <Loader2Icon data-icon="inline-start" aria-hidden className="animate-spin" />}
            {isPending ? "Resetting…" : "Reset access"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
