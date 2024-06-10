import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { StyleClient } from "./components/client";
import { StyleColumn } from "./components/columns";

const StylePage = async ({
  params,
}: {
  params: { store_id: string };
}) => {
  const Style = await prismadb.style.findMany({
    where: {
      store_id: params.store_id,
    },
    include: {
      subcategory: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedStyle: StyleColumn[] = Style.map(
    (item) => ({
      id: item.id,
      name: item.name.map((style) => style.name).join(''),
      category: item.category.name,
      subcategory: item.subcategory.name,
      createdAt: format(item.createdAt, "do MMMM yyyy"),
    })
  );
  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <StyleClient data={formattedStyle} />
      </div>
    </div>
  );
};

export default StylePage;
