import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params } : { params: { subcategory_id: string } }
) {
    try {
        console.log('GET request received for subcategory_id:', params.subcategory_id);
        if (!params.subcategory_id) {
            return new NextResponse("Sub-Category ID Required", { status : 400})
        }

        const subcategory = await prismadb.subCategory.findUnique({
            where: {
                id: params.subcategory_id,
            }
        });

        console.log('Sub-category retrieved:', subcategory);

        return NextResponse.json(subcategory)
        
    } catch (error) {
        console.log('[SUBCATEGORY_GET]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH (
    req: Request,
    { params } : { params: { store_id: string , subcategory_id: string} }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, styles } = body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status : 403})
        }
        if (!name || !styles || !params.subcategory_id) {
            return new NextResponse("All Fields Are Required", { status : 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.store_id,
                userId
            },
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorised", { status: 403 })
        }

        const updatedSubCategory = await prismadb.subCategory.updateMany({
            where: {
                id: params.subcategory_id,
            },
            data: {
                name,
                styles
            },
        });

        return NextResponse.json(updatedSubCategory)
    } catch (error) {
        console.log('[SUBCATEGORY_PATCH]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE (
    req: Request,
    { params } : { params: { store_id: string, subcategory_id: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status : 401 })
        }
        if (!params.subcategory_id) {
            return new NextResponse("Sub-Category ID Required", { status : 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.store_id,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorised", { status: 403 })
        }

        const subcategory = await prismadb.subCategory.delete({
            where: {
                id: params.subcategory_id,
            }
        });

        return NextResponse.json(subcategory)
    } catch (error) {
        console.log('[SUBCATEGORY_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}