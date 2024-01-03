import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      colour: true,
      brand: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedProducts: ProductColumn[] = products.map((item) => {
    const discountRateValue =
      item.discountRate.toNumber() !== null
        ? formatter.format(
            (item.price.toNumber() / 100) * (100 - item.discountRate.toNumber())
          )
        : null;
    return {
      id: item.id,
      name: item.name,
      brand: item.brand.name,
      isFeatured: item.isFeatured,
      isArchived: item.isArchived,
      isDiscounted: item.isDiscounted,
      category: item.category.name,
      price: formatter.format(item.price.toNumber()),
      discountRate: discountRateValue,
      size: item.size.name,
      colour: item.colour.value,
      createdAt: format(item.createdAt, "do MMMM yyyy"),
    };
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
