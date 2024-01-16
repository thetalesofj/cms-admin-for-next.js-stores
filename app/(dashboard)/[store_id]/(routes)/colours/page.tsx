import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { ColourClient } from "./components/client";
import { ColourColumn } from "./components/columns";

const ColoursPage = async ({ params }: { params: { store_id: string } }) => {
  const colours = await prismadb.colour.findMany({
    where: {
      store_id: params.store_id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColours: ColourColumn[] = colours.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "do MMMM yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColourClient data={formattedColours} />
      </div>
    </div>
  );
};

export default ColoursPage;
