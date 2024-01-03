import prismadb from "@/lib/prismadb";
import { format } from 'date-fns';
import { SubCategoryClient } from "./components/client";
import { SubCategoryColumn } from "./components/columns";

const SubCategoriesPage = async ({
    params
}: {
    params: { categoryId: string }
}) => {
    const subCategories = await prismadb.subCategory.findMany({
        where: {
            categoryId: params.categoryId
        },
        include: {
            category: true,
            styles: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedSubCategories: SubCategoryColumn[] = subCategories.map((item) => ({
        id: item.id,
        subName: item.name,
        styleName: item.name,
        categoryName: item.category.name,
        createdAt: format(item.createdAt, "do MMMM yyyy"),
    }))
    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SubCategoryClient data={formattedSubCategories} />
            </div>
        </div>
     );
}
 
export default SubCategoriesPage;