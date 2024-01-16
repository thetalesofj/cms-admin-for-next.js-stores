import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params } : { params: { category_id: string } }
) {
    try {
        if (!params.category_id) {
            return new NextResponse("Category ID Required", { status : 400})
        }

        const category = await prismadb.category.findUnique({
            where: {
                id: params.category_id,
            }
        });

        return NextResponse.json(category)
        
    } catch (error) {
        console.log('[CATEGORY_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH (
    req: Request,
    { params } : { params: { store_id: string , category_id: string} }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, billboard_id } = body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status : 403})
        }
        if (!name) {
            return new NextResponse("Name Required", { status : 400})
        }
        if (!billboard_id) {
            return new NextResponse("Billboard ID Required", { status : 400})
        }
        if (!params.category_id) {
            return new NextResponse("Category ID Required", { status : 400})
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
        

        const category = await prismadb.category.updateMany({
            where: {
                id: params.category_id,
            },
            data: {
                name,
                billboard_id
            }
        })

        return NextResponse.json(category)

    } catch (error) {
        console.log('[CATEGORY_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE (
    req: Request,
    { params } : { params: { store_id: string, category_id: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status : 401 })
        }
        if (!params.category_id) {
            return new NextResponse("Category ID Required", { status : 400})
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

        const category = await prismadb.category.deleteMany({
            where: {
                id: params.category_id,
            }
        });

        return NextResponse.json(category)
        
    } catch (error) {
        console.log('[CATEGORY_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}