
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import {Trash, Edit, MoreHorizontal } from "lucide-react";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import {useDeleteAccount} from "@/features/accounts/api/use-delete-account"
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
  id: string;
};

export function Actions({ id }: Props) {
const [ConfirmDilog, confirm] = useConfirm(
  "Are you sure?",
  "you are about delete this transaction"
)

  const { onOpen } = useOpenAccount();
  const deletMutation = useDeleteAccount()

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
    deletMutation.mutate(id);
    }
  }

  return (
    <>
    <ConfirmDilog/>
    <DropdownMenu>
     <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-md p-0 hover:bg-accent">
  <MoreHorizontal className="size-4" />
</DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem 
        disabled={deletMutation.isPending}
        onClick={() => onOpen(id)}>
          <Edit className="mr-2 size-4" />
          Edit
        </DropdownMenuItem>
         <DropdownMenuItem 
         disabled={deletMutation.isPending}
         onClick={handleDelete}>
          <Trash className="mr-2 size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  );
}