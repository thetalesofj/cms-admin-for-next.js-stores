import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params } : { params: { store_id: string; modal_id: string } }
) {
    try {
        if (!params.modal_id) {
            return new NextResponse("Modal ID Required", { status : 400})
        }

        const modal = await prismadb.modal.findUnique({
            where: {
                id: params.modal_id,
                store_id: params.store_id
            }
        });

        return NextResponse.json(modal)
        
    } catch (error) {
        console.log('[MODAL_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH (
    req: Request,
    { params } : { params: { store_id: string, modal_id: string} }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, location, image_url, description, terms_and_conditions, link, title, isPublished, isImagePublished } = body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status : 403})
        }
        if (!name) {
            return new NextResponse("Name Required", { status : 400})
        }
        if (!location) {
            return new NextResponse("Location Required", { status : 400})
        }
        if (!params.modal_id) {
            return new NextResponse("Modal ID Required", { status : 400})
        }
        if (!description) {
            return new NextResponse("Description Required", { status : 400})
        }
        if (!title) {
            return new NextResponse("Title Required", { status : 400})
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
        

        const modal = await prismadb.modal.updateMany({
            where: {
                id: params.modal_id,
            },
            data: {
                name, 
                location, 
                image_url, 
                description, 
                terms_and_conditions, 
                link, 
                title,
                isPublished, 
                isImagePublished,
            }
        })

        return NextResponse.json(modal)

    } catch (error) {
        console.log('[MODAL_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE (
    req: Request,
    { params } : { params: { store_id: string, modal_id: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status : 401 })
        }
        if (!params.modal_id) {
            return new NextResponse("Modal ID Required", { status : 400})
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

        const modal = await prismadb.modal.deleteMany({
            where: {
                id: params.modal_id,
                store_id: params.store_id,
            }
        });

        return NextResponse.json(modal)
        
    } catch (error) {
        console.log('[MODAL_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}