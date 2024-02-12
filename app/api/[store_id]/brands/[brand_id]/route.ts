import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params } : { params: { brand_id: string } }
) {
    try {
        if (!params.brand_id) {
            return new NextResponse("Brand ID Required", { status : 400})
        }

        const brand = await prismadb.brand.findUnique({
            where: {
                id: params.brand_id,
            }
        });

        return NextResponse.json(brand)
        
    } catch (error) {
        console.log('[BRAND_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH (
    req: Request,
    { params } : { params: { store_id: string , brand_id: string} }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name } = body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status : 403})
        }
        
        if (!name) {
            return new NextResponse("Name Required", { status : 400})
        }
       
        if (!params.brand_id) {
            return new NextResponse("Brand ID Required", { status : 400})
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
        

        const brand = await prismadb.brand.updateMany({
            where: {
                id: params.brand_id,
            },
            data: {
                name
            }
        })

        return NextResponse.json(brand)

    } catch (error) {
        console.log('[BRAND_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE (
    req: Request,
    { params } : { params: { store_id: string, brand_id: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status : 401 })
        }
        if (!params.brand_id) {
            return new NextResponse("Brand ID Required", { status : 400})
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

        const brand = await prismadb.brand.deleteMany({
            where: {
                id: params.brand_id,
            }
        });

        return NextResponse.json(brand)
        
    } catch (error) {
        console.log('[BRAND_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}