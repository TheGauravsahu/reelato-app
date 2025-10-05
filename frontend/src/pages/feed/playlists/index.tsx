import Loader from "@/components/general/Loader";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreatePlaylist, usePlaylistList } from "@/hooks/usePlaylist";
import type { IPlaylist } from "@/types";
import { ListMusic, Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import LoadingButton from "@/components/general/LoadingButton";
import { Link } from "react-router-dom";
import PlaylistOptions from "./PlaylistOptions";

const PlaylistsPage = () => {
  const { isPending, isError, data } = usePlaylistList();

  if (isPending) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        An error ocurred
      </div>
    );
  }

  if (!isPending && data.length === 0) {
    return (
      <div className="w-full">
        <PlaylistPageHeader />
        <div className="flex items-center justify-center mt-10">
          <span className="text-muted-foreground">No playlists.</span>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full pt-3 md:pt-0 md:px-0 px-4">
      <PlaylistPageHeader />

      <div className="flex items-center justify-center md:justify-normal  flex-wrap gap-2 md:gap-4 pt-12 md:pt-4">
        {data?.map((p, i) => {
          return <PlaylistCard playlist={p} key={i} />;
        })}
      </div>
    </div>
  );
};

const PlaylistCard = ({ playlist }: { playlist: IPlaylist }) => {
  return (
    <div className="w-[320px] h-[280px] flex flex-col gap-4">
      <div className="relative rounded-lg p-2 h-[90%] w-full  bg-secondary hover:bg-black/20 cursor-pointer">
        <div className="overflow-hidden h-full w-full flex items-center justify-center">
          <img src="/reelato-light.svg" className="w-16" alt="" />
        </div>
        <div className=" absolute top-2 right-2">
          <PlaylistOptions playlistId={playlist._id} />
        </div>
        <div className="h-7 w-20 gap-1 flex items-center justify-center absolute bottom-2 right-2 text-xs bg-black/45 p-1 rounded-sm">
          <ListMusic size={12} className="xs" />
          {playlist.foodIds.length} videos
        </div>
      </div>
      <div className="px-2 py-1 flex justify-between items-center">
        <h2 className="mb-1">{playlist.title}</h2>
        <Link
          to={"/feed/playlists/"}
          className={buttonVariants({ variant: "secondary" })}
        >
          View full playlist
        </Link>
      </div>
    </div>
  );
};

const PlaylistPageHeader = () => {
  const AddToPlaylistFormSchema = z.object({
    title: z
      .string()
      .min(2, "Title is must be atleast of 2 characters")
      .max(255, "Title cannot be more tha 255 characters"),
  });

  type AddToPlaylistFormSchema = z.infer<typeof AddToPlaylistFormSchema>;

  const { isPending, mutate } = useCreatePlaylist();

  const form = useForm({
    resolver: zodResolver(AddToPlaylistFormSchema),
    defaultValues: {
      title: "",
    },
  });

  function onSubmit(input: AddToPlaylistFormSchema) {
    mutate(input);
    form.reset();
  }

  return (
    <div className="flex items-center justify-between w-full mb-4 px-3">
      <h1 className="text-2xl font-bold">Playlists</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            Create Playlist
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a new playlist</DialogTitle>
            <DialogDescription>
              Create a playlist to save your favorite videos.
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
                      loadingText="Creating"
                      className="w-full"
                    >
                      Create
                    </LoadingButton>
                  </div>
                </DialogClose>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlaylistsPage;
