import { useAddToPlaylist, usePlaylistList } from "@/hooks/usePlaylist";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ListMusic, Loader2 } from "lucide-react";
import LoadingButton from "../general/LoadingButton";

const AddToPlaylistDialog = ({ foodId }: { foodId: string }) => {
  const { data: playlists, isPending } = usePlaylistList();
  const { mutate: saveToPlaylist, isPending: isAddToPlaylistPending } =
    useAddToPlaylist();

  if (isPending) {
    return (
      <Dialog>
        <DialogTrigger asChild>
        <button className="bg-black/50 p-2 rounded-full hover:bg-black/70 cursor-pointer">
          <ListMusic className="w-6 h-6 text-white" />
        </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Video To</DialogTitle>
            <div className="h-full">
              <Loader2 className="animate-spin" />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (!playlists || playlists.length === 0) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button className="btn btn-primary">Add to Playlist</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Video To</DialogTitle>
            <div className="flex flex-col gap-2">
              <p>No playlists found. Create a playlist first.</p>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* button */}
        <button className="bg-black/50 p-2 rounded-full hover:bg-black/70 cursor-pointer">
          <ListMusic className="w-6 h-6 text-white" />
        </button>
      </DialogTrigger>
      <DialogContent className="w-[380px]">
        <DialogHeader>
          <DialogTitle>Save video to..</DialogTitle>
          <div className="flex flex-col gap-2 min-h-[8vh] mt-2">
            {playlists.map((playlist) => (
              <div key={playlist._id}>
                <LoadingButton
                  loadingText={`Adding to ${playlist.title}`}
                  onClick={() =>
                    saveToPlaylist({ foodId, playlistId: playlist._id })
                  }
                  isPending={isAddToPlaylistPending}
                  variant="ghost"
                  className="w-full justify-start cursor-pointer"
                >
                  {playlist.title}
                </LoadingButton>
              </div>
            ))}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddToPlaylistDialog;
