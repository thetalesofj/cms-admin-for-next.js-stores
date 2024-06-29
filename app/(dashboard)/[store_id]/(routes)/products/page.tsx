import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const ProductsPage = async ({ params }: { params: { store_id: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      store_id: params.store_id,
    },
    include: {
      category: true,
      subCategory: true,
      colour: true,
      brand: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedProducts: ProductColumn[] = products.map((item) => {
    const discountRateValue =
      item.discount_rate.toNumber() !== null
        ? formatter.format(
            (item.price.toNumber() / 100) *
              (100 - item.discount_rate.toNumber())
          )
        : null;
    return {
      id: item.id,
      name: item.name,
      brand: item.brand.name,
      is_featured: item.is_featured,
      is_archived: item.is_archived,
      is_discounted: item.is_discounted,
      category: item.category.name,
      subcategory: item.subCategory.name,
      style: item.subCategory.styles,
      price: formatter.format(item.price.toNumber()),
      discount_rate: discountRateValue,
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
