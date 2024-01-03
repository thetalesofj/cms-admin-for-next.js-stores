import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params } : { params: { subCategoryId: string } }
) {
    try {
        if (!params.subCategoryId) {
            return new NextResponse("Sub-Category ID Required", { status : 400})
        }

        const subCategory = await prismadb.subCategory.findUnique({
            where: {
                id: params.subCategoryId,
            }
        });

        return NextResponse.json(subCategory)
        
    } catch (error) {
        console.log('[SUB_CATEGORY_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH (
    req: Request,
    { params } : { params: { storeId: string , subCategoryId: string} }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, categoryId } = body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status : 403})
        }
        if (!name) {
            return new NextResponse("Name Required", { status : 400})
        }
        if (!categoryId) {
            return new NextResponse("Category ID Required", { status : 400})
        }
        if (!params.subCategoryId) {
            return new NextResponse("Sub-Category ID Required", { status : 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorised", { status: 403 })
        }
        

        const subCategory = await prismadb.subCategory.updateMany({
            where: {
                id: params.subCategoryId,
            },
            data: {
                name,
                categoryId
            }
        })

        return NextResponse.json(subCategory)

    } catch (error) {
        console.log('[SUB_CATEGORY_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE (
    req: Request,
    { params } : { params: { storeId: string, subCategoryId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status : 401 })
        }
        if (!params.subCategoryId) {
            return new NextResponse("Sub-Category ID Required", { status : 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorised", { status: 403 })
        }

        const subCategory = await prismadb.category.deleteMany({
            where: {
                id: params.subCategoryId,
            }
        });

        return NextResponse.json(subCategory)
        
    } catch (error) {
        console.log('[SUB_CATEGORY_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}