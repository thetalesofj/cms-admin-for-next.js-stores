import prismadb from "@/lib/prismadb";
import SubCategoryForm from "./components/SubCategoryForm";

const SubCategoryPage = async ({
  params,
}: {
  params: { subcategory_id: string; store_id: string; style_id: string };
}) => {
  const subCategory = await prismadb.subCategory.findUnique({
    where: {
      id: params.subcategory_id,
    },
    include: {
      styles: true,
    },
  });

  {
    /*const style = await prismadb.style.findUnique({
        where: {
            id: params.style_id
        },
        include: {
            subCategory: true
        }
    })*/
  }
  {
    /*styleData={style}*/
  }

  const categories = await prismadb.category.findMany({
    where: {
      store_id: params.store_id,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubCategoryForm categories={categories} initialData={subCategory} />
      </div>
    </div>
  );
};

export default SubCategoryPage;
