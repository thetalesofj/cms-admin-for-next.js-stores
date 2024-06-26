import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params } : { params: { size_id: string } }
) {
    try {
        if (!params.size_id) {
            return new NextResponse("Size ID Required", { status : 400})
        }

        const size = await prismadb.size.findUnique({
            where: {
                id: params.size_id,
            }
        });

        return NextResponse.json(size)
        
    } catch (error) {
        console.log('[SIZE_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH (
    req: Request,
    { params } : { params: { store_id: string , size_id: string} }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, value } = body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status : 403})
        }
        if (!name) {
            return new NextResponse("Name Required", { status : 400})
        }
        if (!value) {
            return new NextResponse("Value Required", { status : 400})
        }
        if (!params.size_id) {
            return new NextResponse("Size ID Required", { status : 400})
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
        

        const size = await prismadb.size.updateMany({
            where: {
                id: params.size_id,
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(size)

    } catch (error) {
        console.log('[SIZE_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE (
    req: Request,
    { params } : { params: { store_id: string, size_id: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status : 401 })
        }
        if (!params.size_id) {
            return new NextResponse("Size ID Required", { status : 400})
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

        const size = await prismadb.size.deleteMany({
            where: {
                id: params.size_id,
            }
        });

        return NextResponse.json(size)
        
    } catch (error) {
        console.log('[SIZE_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}