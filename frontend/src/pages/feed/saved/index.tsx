import Loader from "@/components/general/Loader";
import LoadingButton from "@/components/general/LoadingButton";
import { useSavedList } from "@/hooks/useFeed";
import { useSaveVideo } from "@/hooks/useFood";
import type { IFood } from "@/types";

const SavedPage = () => {
  const { isPending, isError, data } = useSavedList();

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
        <span className="text-muted-foreground">No saved video.</span>
      </div>
    );
  }
  return (
    <div className="w-full pt-3 md:pt-0 md:px-0 px-4">
      <h1 className="text-2xl font-bold">Saved videos</h1>

      <div className="flex items-center justify-center md:justify-normal  flex-wrap gap-2 md:gap-4 pt-12 md:pt-4">
        {data?.map((f) => {
          return <SavedVideoCard food={f.foodId} key={f._id} />;
        })}
      </div>
    </div>
  );
};

const SavedVideoCard = ({ food }: { food: IFood }) => {
  const { mutate: unsaveFood, isPending } = useSaveVideo(food.foodPartner._id);

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

      <div className="absolute bottom-2 left-2 w-full px-4 flex items-center justify-between bg-black/50 text-white text-xs  py-1 rounded">
        <h2 className="text-xl">{food.name}</h2>
        <LoadingButton
          onClick={() => unsaveFood(food._id)}
          isPending={isPending}
          loadingText="Unsaving"
        >
          Usave
        </LoadingButton>
      </div>
    </div>
  );
};

export default SavedPage;
