import Loader from "@/components/general/Loader";
import LoadingButton from "@/components/general/LoadingButton";
import { useDeleteFoodFromPlaylist, usePlaylist } from "@/hooks/usePlaylist";
import { Trash } from "lucide-react";
import { useParams } from "react-router-dom";

const PlaylistDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isPending, isError, data } = usePlaylist(id!);
  const { mutate: deletePlylist, isPending: isDeleteFoodFromPlaylistPending } =
    useDeleteFoodFromPlaylist();

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

  if (!isPending && data.foodIds.length === 0) {
    return (
      <div className="flex items-center justify-center mt-10">
        <span className="text-muted-foreground">No food video.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full pt-3 md:pt-0 md:px-0 px-4">
      {data.foodIds.map((food) => (
        <div key={food?._id} className="h-22 flex justify-between">
          <div className="flex gap-4">
            <div className="rounded-lg overflow-hidden w-[120px] bg-secondary">
              <img src="" alt="" />
            </div>
            <div className="flex flex-col gap-2">
              <h2>{food.name}</h2>
              <p className="text-muted-foreground">
                {food.foodPartner.fullName}
              </p>
            </div>
          </div>

          <div className="">
            <LoadingButton
              variant="destructive"
              loadingText="Deleting"
              onClick={() =>
                deletePlylist({ playlistId: id!, foodId: food._id! })
              }
              isPending={isDeleteFoodFromPlaylistPending}
            >
              <Trash />
              Delete
            </LoadingButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlaylistDetailsPage;
