import { useFoodList, useLikeVideo, useSaveVideo } from "@/hooks/useFood";
import type { IFood } from "@/types";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Heart, Bookmark } from "lucide-react";

const ReelsFeed = () => {
  const { data: foods } = useFoodList();

  return (
    <div className="bg-background min-h-screen text-foreground scroll-hide overflow-y-scroll snap-y snap-mandatory scroll-smooth h-screen">
      {foods?.map((food) => (
        <ReelCard key={food._id} food={food} />
      ))}
    </div>
  );
};

const ReelCard = ({ food }: { food: IFood }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
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
      observer.unobserve(videoEl);
    };
  }, []);

  return (
    <div className="h-screen snap-start relative w-full md:w-fit mx-auto bg-black/20">
      <video
        ref={videoRef}
        src={food.videoUrl}
        className="w-full h-full object-cover"
        muted
        loop
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
  const { mutate: likeVideo } = useLikeVideo();
  const { mutate: saveVideo } = useSaveVideo();

  return (
    <div className="absolute bottom-26 right-0">
      <div className="flex flex-col items-center space-y-4 p-4">
        <button className="bg-black/50 p-2 rounded-full hover:bg-black/70">
          <Heart
            onClick={() => likeVideo(food._id)}
            className={`w-6 h-6 ${
              food.isLiked ? "fill-white text-white" : "text-white"
            }`}
          />
          <span className="text-xs">{food.likesCount}</span>
        </button>
        <button className="bg-black/50 p-2 rounded-full hover:bg-black/70">
          <Bookmark
            onClick={() => saveVideo(food._id)}
            className={`w-6 h-6 ${
              food.isSaved ? "fill-white text-white" : "text-white"
            }`}
          />
          <span className="text-xs">{food.savesCount}</span>
        </button>
      </div>
    </div>
  );
};

export default ReelsFeed;
