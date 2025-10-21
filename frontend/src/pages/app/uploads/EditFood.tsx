import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingButton from "@/components/general/LoadingButton";
import { useEditFood, useFoodDetials } from "@/hooks/useFood";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import Loader from "@/components/general/Loader";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(2, "Description must be at least 2 characters"),
  videoFile: z.any(),
  thumbnailFile: z.any(),
});

const EditFood = ({ foodId }: { foodId: string }) => {
  const [open, setOpen] = useState(false);
  // fetch only when dialog is open
  const { data: food, isPending } = useFoodDetials(foodId, open);

  const [uploadProgress, setUploadProgress] = useState(0);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      videoFile: undefined,
      thumbnailFile: undefined,
    },
  });

  const editFoodMutation = useEditFood({
    onUploadProgress: (progressEvent: ProgressEvent) => {
      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setUploadProgress(percent);
    },
    onSuccess: () => {
      form.reset();
      setUploadProgress(0);
      const videoFileInput = document.getElementById(
        "video-file"
      ) as HTMLInputElement;
      if (videoFileInput) videoFileInput.value = "";

      const thumbnailFileInput = document.getElementById(
        "thumbnail-file"
      ) as HTMLInputElement;
      if (thumbnailFileInput) thumbnailFileInput.value = "";
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = new FormData();
    data.append("name", values.name);
    data.append("description", values.description);
    if (values.videoFile?.[0]) data.append("video", values.videoFile[0]);
    if (values.thumbnailFile?.[0])
      data.append("thumbnail", values.thumbnailFile[0]);

    editFoodMutation.mutate({ foodId, data });
  }

  useEffect(() => {
    form.reset({
      name: food?.name,
      description: food?.description,
    });
  }, [form, food?.description, food?.name]);

  if (isPending) {
    return (
      <Dialog onOpenChange={setOpen}>
        <DialogTrigger>
          <Button variant="outline" className="cursor-pointer">
            <Pencil />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <Card className="w-full max-w-sm bg-none border-none">
            <CardHeader>
              <CardTitle className="text-lg">Edit Food Post.</CardTitle>
              <CardDescription>
                Edit details of uploaded food reel.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Loader />
            </CardContent>
            <CardFooter className="flex-col gap-2"></CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" className="cursor-pointer">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Card className="w-full max-w-sm bg-none border-none">
          <CardHeader>
            <CardTitle className="text-lg">Edit Food Post.</CardTitle>
            <CardDescription>
              Edit details of uploaded food reel.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a title" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a description" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thumbnailFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail</FormLabel>
                      <FormControl>
                        <Input
                          id="thumbnail-file"
                          type="file"
                          accept="image/*"
                          placeholder="Uplaod the thumbnail file."
                          value={undefined}
                          onChange={(e) => field.onChange(e.target.files)}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="videoFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video</FormLabel>
                      <FormControl>
                        <Input
                          id="video-file"
                          type="file"
                          accept="video/*"
                          placeholder="Uplaod the video."
                          value={undefined}
                          onChange={(e) => field.onChange(e.target.files)}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {editFoodMutation.isPending && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Uploading: {uploadProgress}%
                    </p>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <LoadingButton
                  isPending={editFoodMutation.isPending}
                  loadingText="Saving.."
                  type="submit"
                  className="w-full"
                >
                  Save
                </LoadingButton>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default EditFood;
