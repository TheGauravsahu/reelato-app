import Loader from "@/components/general/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMyFoodsList } from "@/hooks/useFood";
import { formatDateWithTime } from "@/lib/utils";
import DeleteFood from "./DeleteFood";
import EditFood from "./EditFood";

const AllUploadsPage = () => {
  const { data: foods, isPending } = useMyFoodsList();

  if (isPending) return <Loader />;

  if (!isPending && !foods?.length) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <span className="text-muted-foreground">No foods found.</span>
      </div>
    );
  }
  return (
    <Table className="border-separate border-spacing-y-3">
      <TableHeader className="bg-secondary rounded-lg">
        <TableRow>
          <TableHead className="w-64">Thumbnail</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Uploaded At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {foods.map((food) => (
          <TableRow
            key={food?._id}
            className="overflow-hidden w-full *:cursor-pointer"
          >
            <TableCell>
              <div className="overflow-hidden">
                <img
                  src={food.thumbnailUrl || "/placeholder.svg"}
                  alt={food.name}
                  className="object-cover h-18 w-26"
                />
              </div>
            </TableCell>
            <TableCell>{food.name}</TableCell>
            <TableCell className="text-muted-foreground">
              {food.description}
            </TableCell>
            <TableCell>
              <p className="text-muted-foreground text-xs">
                {formatDateWithTime(food.createdAt)}
              </p>
            </TableCell>
            <TableCell className="text-right flex items-start gap-4">
              <DeleteFood foodId={food._id} />
              <EditFood foodId={food._id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AllUploadsPage;
