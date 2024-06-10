import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { SubCategoryClient } from "./components/client";
import { SubCategoryColumn } from "./components/columns";

const SubCategoriesPage = async ({ params }: { params: { store_id: string } }) => {
  const subcategories = await prismadb.subCategory.findMany({
    where: {
      store_id: params.store_id,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSubCategories: SubCategoryColumn[] = subcategories.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category.name,
    createdAt: format(item.createdAt, "do MMMM yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubCategoryClient data={formattedSubCategories} />
      </div>
    </div>
  );
};

export default SubCategoriesPage;
