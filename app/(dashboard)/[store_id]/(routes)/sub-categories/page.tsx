import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { SubCategoryClient } from "./components/client";
import { SubCategoryColumn } from "./components/columns";

const SubCategoriesPage = async ({
  params,
}: {
  params: { store_id: string };
}) => {
  const subCategories = await prismadb.subCategory.findMany({
    where: {
      store_id: params.store_id,
    },
    include: {
      category: true,
      styles: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSubCategories: SubCategoryColumn[] = subCategories.map(
    (item) => ({
      id: item.id,
      subcategory: item.name,
      styles: item.styles.map((style) => style.name).join(', '),
      category: item.category.name,
      createdAt: format(item.createdAt, "do MMMM yyyy"),
    })
  );
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubCategoryClient data={formattedSubCategories} />
      </div>
    </div>
  );
};

export default SubCategoriesPage;
