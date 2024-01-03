import prismadb from "@/lib/prismadb";
import SubCategoryForm from "./components/SubCategoryForm";

const SubCategoryPage = async ({
    params
} : {
    params: { subCategoryId: string, storeId: string, styleId: string }
}) => {

    const subCategory = await prismadb.subCategory.findUnique({
        where: {
            id: params.subCategoryId
        },
        include: {
            styles: true
        }
    })

    const style = await prismadb.style.findUnique({
        where: {
            id: params.styleId
        },
        include: {
            subCategory: true
        }
    })

    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId
        }
    })

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SubCategoryForm 
                    categories={categories}
                    initialData={subCategory}
                    styleData={style}
                />
            </div>
        </div>
     );
}
 
export default SubCategoryPage;