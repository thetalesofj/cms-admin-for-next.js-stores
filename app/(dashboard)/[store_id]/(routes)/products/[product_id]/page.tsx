import prismadb from "@/lib/prismadb";
import ProductForm from "./components/product-form";

const ProductPage = async ({
  params,
}: {
  params: { product_id: string; store_id: string };
}) => {

  const product = await prismadb.product.findUnique({
    where: {
      id: params.product_id,
    },
    include: {
      images: true,
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      store_id: params.store_id,
    },
  });

  const sizes = await prismadb.size.findMany({
    where: {
      store_id: params.store_id,
    },
  });

  const colours = await prismadb.colour.findMany({
    where: {
      store_id: params.store_id,
    },
  });

  const subcategories = await prismadb.subCategory.findMany({
    where: {
      store_id: params.store_id,
    },
  });

  const styles = subcategories.flatMap(
    subcategory => subcategory.styles
  );

  const brands = await prismadb.brand.findMany({
    where: {
      store_id: params.store_id,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          categories={categories}
          colours={colours}
          subcategories={subcategories}
          styles={styles}
          sizes={sizes}
          brands={brands}
        />
      </div>
    </div>
  );
};

export default ProductPage;
