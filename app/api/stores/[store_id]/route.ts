import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH (
    req: Request,
    { params } : { params: { store_id: string} }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name } = body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status : 403})
        }
        if (!name) {
            return new NextResponse("Name is Required", { status : 400})
        }
        if (!params.store_id) {
            return new NextResponse("Store ID is Required", { status : 400})
        }

        const store = await prismadb.store.updateMany({
            where: {
                id: params.store_id,
                userId,
            },
            data: {
                name
            }
        })

        return NextResponse.json(store)

    } catch (error) {
        console.log('[STORE_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE (
    req: Request,
    { params } : { params: { store_id: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status : 403 })
        }
        if (!params.store_id) {
            return new NextResponse("Store ID is Required", { status : 400})
        }

        const store = await prismadb.store.deleteMany({
            where: {
                id: params.store_id,
                userId
            }
        });

        return NextResponse.json(store)
        
    } catch (error) {
        console.log('[STORE_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}