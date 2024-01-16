import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { BrandClient } from "./components/client";
import { BrandColumn } from "./components/columns";

const BrandsPage = async ({ params }: { params: { store_id: string } }) => {
  const brands = await prismadb.brand.findMany({
    where: {
      store_id: params.store_id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBrands: BrandColumn[] = brands.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, "do MMMM yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BrandClient data={formattedBrands} />
      </div>
    </div>
  );
};

export default BrandsPage;
