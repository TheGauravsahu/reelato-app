import ReelatoLoader from "@/components/general/ReelatoLoader";
import { ReelCard } from "@/components/home/ReelsFeed";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFoodPartnerFoodsList } from "@/hooks/useFood";
import { DialogClose } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const FoodPartnerStorePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useFoodPartnerFoodsList(id!);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);

  // console.log(data,"FOOD_DATA")

  if (isLoading) {
    return <ReelatoLoader />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        An error ocurred
      </div>
    );
  }
  const partner = data && data[0].foodPartner;

  return (
    <div className="md:max-w-2xl max-w-lg mx-auto flex flex-col gap-4 px-4 md:px-8 md:pt-20 pt-28">
      <div className="flex flex-col gap-4 justify-center items-center">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-foreground">
            {partner?.fullName}
          </h1>
          <p>
            Store id: <span className="text-muted-foreground">{id}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p>
            Address :{" "}
            <span className="text-sm text-muted-foreground">
              {partner?.address}
            </span>
          </p>
          <p>
            Contact :{" "}
            <span className="text-sm text-muted-foreground">
              {partner?.phone}
            </span>
          </p>
          <p>
            Videos:{" "}
            <span className="text-muted-foreground">{data?.length}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t pt-4">
        {data?.map((food) => {
          return (
            <Dialog key={food._id}>
              <DialogTrigger>
                <div
                  className="relative w-[200px] h-[250px] cursor-pointer overflow-hidden rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-105"
                  onMouseEnter={() => {
                    setHoveredVideo(food._id);
                  }}
                  onMouseLeave={() => {
                    setHoveredVideo(null);
                  }}
                >
                  <video
                    autoPlay={food._id === hoveredVideo}
                    src={food.videoUrl}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover "
                  />
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {food.name}
                  </div>
                </div>
              </DialogTrigger>

              <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                showCloseButton={false}
                className="border-none shadow-none flex items-center justify-center video_dialog"
              >
                <div
                  key={food._id}
                  className="h-[600px] w-full md:w-fit mx-auto"
                >
                  <ReelCard food={food} />
                </div>

                <DialogFooter className="absolute top-2 right-2 cursor-pointer">
                  <DialogClose asChild>
                    <X size={24} className="text-white"/>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </div>
  );
};

export default FoodPartnerStorePage;
