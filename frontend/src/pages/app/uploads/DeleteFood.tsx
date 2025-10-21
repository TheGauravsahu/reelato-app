import LoadingButton from "@/components/general/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteFood } from "@/hooks/useFood";
import { Trash } from "lucide-react";

const DeleteFood = ({ foodId }: { foodId: string }) => {
  const { mutate: deleteFood, isPending } = useDeleteFood();
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="destructive" className="cursor-pointer">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <LoadingButton
              type="submit"
              className="cursor-pointer"
              loadingText="Deleting"
              isPending={isPending}
              onClick={() => deleteFood(foodId)}
            >
              Confirm
            </LoadingButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFood;
