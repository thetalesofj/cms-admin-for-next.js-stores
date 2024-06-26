import prismadb from "@/lib/prismadb";
import SubCategoryForm from "./components/subcategory-form";

const SubCategoryPage = async ({
  params,
}: {
  params: { subcategory_id: string; store_id: string };
}) => {
  const subcategory = await prismadb.subCategory.findUnique({
    where: {
      id: params.subcategory_id,
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      store_id: params.store_id,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubCategoryForm categories={categories} initialData={subcategory} />
      </div>
    </div>
  );
};

export default SubCategoryPage;
