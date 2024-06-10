import prismadb from "@/lib/prismadb";
import StyleForm from "./components/style-form";

const SubCategoryPage = async ({
  params,
}: {
  params: { style_id: string; store_id: string };
}) => {
  
  const style = await prismadb.style.findUnique({
    where: {
      id: params.style_id,
    },
  });
  const subcategories = await prismadb.subCategory.findMany({
    where: {
      store_id: params.store_id,
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
        <StyleForm categories={categories} subcategories={subcategories} initialData={style} />
      </div>
    </div>
  );
};

export default SubCategoryPage;
