import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params } : { params: { billboard_id: string } }
) {
    try {
        if (!params.billboard_id) {
            return new NextResponse("Billboard ID Required", { status : 400})
        }

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboard_id,
            }
        });

        return NextResponse.json(billboard)
        
    } catch (error) {
        console.log('[BILLBOARD_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH (
    req: Request,
    { params } : { params: { store_id: string , billboard_id: string} }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { label, image_url } = body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status : 403})
        }
        if (!label) {
            return new NextResponse("Label Required", { status : 400})
        }
        if (!image_url) {
            return new NextResponse("Image URL Required", { status : 400})
        }
        if (!params.billboard_id) {
            return new NextResponse("Billboard ID Required", { status : 400})
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
        

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboard_id,
            },
            data: {
                label,
                image_url
            }
        })

        return NextResponse.json(billboard)

    } catch (error) {
        console.log('[BILLBOARD_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE (
    req: Request,
    { params } : { params: { store_id: string, billboard_id: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status : 401 })
        }
        if (!params.billboard_id) {
            return new NextResponse("Billboard ID Required", { status : 400})
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

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboard_id,
            }
        });

        return NextResponse.json(billboard)
        
    } catch (error) {
        console.log('[BILLBOARD_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}