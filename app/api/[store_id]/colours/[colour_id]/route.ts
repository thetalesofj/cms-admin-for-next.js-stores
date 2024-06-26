import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params } : { params: { colour_id: string } }
) {
    try {
        if (!params.colour_id) {
            return new NextResponse("Colour ID Required", { status : 400})
        }

        const colour = await prismadb.colour.findUnique({
            where: {
                id: params.colour_id,
            }
        });

        return NextResponse.json(colour)
        
    } catch (error) {
        console.log('[COLOUR_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH (
    req: Request,
    { params } : { params: { store_id: string , colour_id: string} }
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
        if (!params.colour_id) {
            return new NextResponse("Colour ID Required", { status : 400})
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
        

        const colour = await prismadb.colour.updateMany({
            where: {
                id: params.colour_id,
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(colour)

    } catch (error) {
        console.log('[COLOUR_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE (
    req: Request,
    { params } : { params: { store_id: string, colour_id: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status : 401 })
        }
        if (!params.colour_id) {
            return new NextResponse("Colour ID Required", { status : 400})
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

        const colour = await prismadb.colour.deleteMany({
            where: {
                id: params.colour_id,
            }
        });

        return NextResponse.json(colour)
        
    } catch (error) {
        console.log('[COLOUR_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}