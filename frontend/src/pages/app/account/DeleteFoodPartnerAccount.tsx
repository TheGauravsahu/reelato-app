import { Button } from "@/components/ui/button";
import {
  DialogClose,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoadingButton from "@/components/general/LoadingButton";
import { useDeleteFoodPartner } from "@/hooks/useAuth";

const DeleteFoodPartnerAccount = () => {
  const { isPending, mutate } = useDeleteFoodPartner();

  return (
    <div className="mt-16">
      <h1 className="text-xl font-bold">Delete account</h1>
      <h3 className="text-sm text-muted-foreground mt-1">
        Delete your account and all of its resources
      </h3>

      <div className="w-full rounded-lg bg-red-800/20 p-4 border mt-8">
        <div>
          <h1>Warning</h1>
          <p className="text-sm text-muted-foreground">
            Please proceed with cautions, this cannot be undone.
          </p>
        </div>

        <Dialog>
          <DialogTrigger>
            <Button variant="destructive" className="mt-4 cursor-pointer">
              Delete Account
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
              <LoadingButton
                type="submit"
                className="cursor-pointer"
                loadingText="Deleting"
                isPending={isPending}
                onClick={() => mutate()}
              >
                Confirm
              </LoadingButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DeleteFoodPartnerAccount;
