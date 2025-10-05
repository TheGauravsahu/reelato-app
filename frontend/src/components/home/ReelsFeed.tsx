import {
  useFoodList,
  useLikeVideo,
  useSaveVideo,
  useWatchFood,
} from "@/hooks/useFood";
import type { IFood } from "@/types";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Heart, Bookmark } from "lucide-react";
import AddToPlaylistDialog from "./AddToPlaylistDialog";

const ReelsFeed = () => {
  const { isPending, data: foods } = useFoodList();

  if ((!isPending && !Array.isArray(foods)) || foods?.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold text-muted-foreground">
          No videos available
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-foreground scroll-hide overflow-y-scroll snap-y snap-mandatory scroll-smooth h-screen">
      {foods?.map((food) => (
        <div key={food._id} className="h-screen w-full md:w-fit mx-auto">
          <ReelCard food={food} />
        </div>
      ))}
    </div>
  );
};

export const ReelCard = ({ food }: { food: IFood }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { mutate: watchFood } = useWatchFood();

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const handleTimeUpdate = () => {
      if (videoEl.currentTime >= videoEl.duration - 0.5) {
        watchFood(food._id); // mark watched
        videoEl.removeEventListener("timeupdate", handleTimeUpdate); // fire only once
      }
    };

    videoEl.addEventListener("timeupdate", handleTimeUpdate);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!videoEl.src) {
              videoEl.src = videoEl.dataset.src || "";
            }
            videoEl.play();
          } else {
            videoEl.pause();
          }
        });
      },
      { threshold: 0.75 }
    );

    observer.observe(videoEl);

    return () => {
      videoEl.removeEventListener("timeupdate", handleTimeUpdate);
      observer.unobserve(videoEl);
    };
  }, [food._id, watchFood]);

  return (
    <div className="h-full w-full snap-start relative  bg-black/20">
      <video
        ref={videoRef}
        data-src={food.videoUrl} // 👈 lazy-load
        className="w-full h-full object-cover"
        preload="none"
        loop
        muted
      />
      <ReelInfo food={food} />
      <ReelAction food={food} />
    </div>
  );
};

const ReelInfo = ({ food }: { food: IFood }) => {
  return (
    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent text-white p-4">
      <Link to={`/food-partner/${food.foodPartner._id}`} className="mb-1 block">
        <h2 className="font-bold text-2xl leading-tight w-fit">
          {food.foodPartner.fullName}
        </h2>
      </Link>
      <div className="leading-tight space-y-0">
        <h3 className="text-xl font-semibold w-fit">{food.name}</h3>
        <h4 className="mt-0 w-fit">{food.description.substring(0, 200)}...</h4>
      </div>
    </div>
  );
};

const ReelAction = ({ food }: { food: IFood }) => {
  const { mutate: likeVideo } = useLikeVideo(food.foodPartner._id);
  const { mutate: saveVideo } = useSaveVideo(food.foodPartner._id);

  return (
    <div className="absolute bottom-26 right-0">
      <div className="flex flex-col items-center space-y-4 p-4">
        <button className="bg-black/50 p-2 rounded-full hover:bg-black/70 cursor-pointer">
          <Heart
            onClick={() => likeVideo(food._id)}
            className={`w-6 h-6 ${
              food.isLiked ? "fill-primary text-primary" : "text-white"
            }`}
          />
          <span className="text-xs text-white">{food.likesCount}</span>
        </button>
        <button className="bg-black/50 p-2 rounded-full hover:bg-black/70 cursor-pointer">
          <Bookmark
            onClick={() => saveVideo(food._id)}
            className={`w-6 h-6 ${
              food.isSaved ? "fill-primary text-primary" : "text-white"
            }`}
          />
          <span className="text-xs  text-white">{food.savesCount}</span>
        </button>
        <AddToPlaylistDialog foodId={food._id} />
      </div>
    </div>
  );
};

export default ReelsFeed;
