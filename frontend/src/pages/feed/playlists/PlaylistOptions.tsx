import LoadingButton from "@/components/general/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogTrigger,
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useDeletePlaylist,
  useEditPlaylist,
  usePlaylist,
} from "@/hooks/usePlaylist";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const PlaylistOptions = ({ playlistId }: { playlistId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full">
        <MoreVertical className="h-4 w-4 z-10 cursor-pointer" />
      </button>

      {isOpen && (
        <div
          className="absolute bg-card top-8 right-2 h-[90px] w-[120px] rounded-md p-2 space-y-1"
          tabIndex={-1}
        >
          <EditPlaylistDialog playlistId={playlistId} />
          <DeletePlaylistDialog playlistId={playlistId} />
        </div>
      )}
    </div>
  );
};

const DeletePlaylistDialog = ({ playlistId }: { playlistId: string }) => {
  const { mutate: deletePlaylist, isPending } = useDeletePlaylist();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="cursor-pointer w-full justify-start">
          <Trash />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            playlist and remove all songs from it.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end gap-2">
          <DialogClose>
            <Button variant="outline" onClick={() => {}}>
              Cancel
            </Button>
          </DialogClose>

          <DialogClose>
            <LoadingButton
              loadingText="Deleting"
              isPending={isPending}
              variant="destructive"
              onClick={() => deletePlaylist(playlistId)}
            >
              Delete
            </LoadingButton>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EditToPlaylistFormSchema = z.object({
  title: z
    .string()
    .min(2, "Title is must be atleast of 2 characters")
    .max(255, "Title cannot be more tha 255 characters"),
});

type EditToPlaylistFormSchema = z.infer<typeof EditToPlaylistFormSchema>;

const EditPlaylistDialog = ({ playlistId }: { playlistId: string }) => {
  const { mutate, isPending } = useEditPlaylist();
  const { data } = usePlaylist(playlistId);
  const form = useForm({
    resolver: zodResolver(EditToPlaylistFormSchema),
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    form.reset({
      title: data?.title || "",
    });
  }, [form, data?.title]);

  function onSubmit(input: EditToPlaylistFormSchema) {
    mutate({ playlistId, ...input });
    form.reset();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="cursor-pointer w-full justify-start">
          <Pencil />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit playlist</DialogTitle>
          <DialogDescription>
            Edit playlist of your favorite videos.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter playlist title"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogClose asChild>
                <div className="flex flex-col gap-3">
                  <LoadingButton
                    isPending={isPending}
                    loadingText="Saving"
                    className="w-full"
                  >
                    Save
                  </LoadingButton>
                </div>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PlaylistOptions;
