
"use client";

import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function useConfirm(
  title: string,
  message: string
): [() => JSX.Element, () => Promise<boolean>]{
  const[promise, setPromise]= useState<{resolve: (value:boolean) => void} | null>(null)

  const confirm = () =>
    new Promise<boolean>((resolve) => {
      setPromise({ resolve })
    });

      
  const handleClose = () => {
    promise?.resolve(false)
    setPromise(null)
  };

  const handleConfirm = () => {
    promise?.resolve(true)
    setPromise(null);
  };

  const ConfirmationDialog = () => (
    <Dialog open={!!promise} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>

          <Button onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm];
}
