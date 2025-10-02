import Loader from "@/components/general/Loader";
import LoadingButton from "@/components/general/LoadingButton";
import {
  useDeleteAllHistory,
  useDeleteHistoryItem,
  useHistoryList,
} from "@/hooks/useFeed";
import { useSaveVideo } from "@/hooks/useFood";
import type { IFood } from "@/types";
import { X } from "lucide-react";

const HistoryPage = () => {
  const { isPending, isError, data } = useHistoryList();
  const { mutate: deleteAllHistory, isPending: isDeleteAllHistoryPending } =
    useDeleteAllHistory();

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
      <div className="flex items-center justify-center">
        <span className="text-muted-foreground">No watch history.</span>
      </div>
    );
  }
  return (
    <div className="w-full pt-3 md:pt-0 md:px-0 px-4">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-2xl font-bold">Watch History</h1>
        <LoadingButton
          onClick={() => deleteAllHistory()}
          isPending={isDeleteAllHistoryPending}
          loadingText="Clearing All History"
        >
          Clear All History
        </LoadingButton>
      </div>

      <div className="flex items-center justify-center md:justify-normal  flex-wrap gap-2 md:gap-4 pt-12 md:pt-4">
        {data?.map((f) => {
          return <HistoryCard food={f.foodId} key={f._id} />;
        })}
      </div>
    </div>
  );
};

const HistoryCard = ({ food }: { food: IFood }) => {
  const { mutate: saveFood, isPending } = useSaveVideo(food.foodPartner._id);
  const { mutate: deleteHistoryItem, isPending: isDeleteHistoryItemPending } =
    useDeleteHistoryItem(food._id);

  return (
    <div className="relative h-[400px] w-[300px] cursor-pointer overflow-hidden rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-95">
      <video
        src={food.videoUrl}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover "
      />
      <LoadingButton
        isPending={isDeleteHistoryItemPending}
        onClick={() => deleteHistoryItem()}
        loadingText="Removing"
        variant="ghost"
        className="absolute top-1 right-1 bg-black/50 text-white hover:bg-black/70"
      >
        <X size={20} className="cursor-pointer" />
      </LoadingButton>
      <div className="absolute bottom-2 left-2 w-full px-4 flex items-center justify-between bg-black/50 text-white text-xs  py-1 rounded">
        <h2 className="text-xl">{food.name}</h2>
        <LoadingButton
          onClick={() => saveFood(food._id)}
          isPending={isPending}
          loadingText="Saving"
        >
          Save
        </LoadingButton>
      </div>
    </div>
  );
};

export default HistoryPage;
