import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params } : { params: { store_id: string, modal_id: string } }
) {
    try {

        const body = await req.json()
        const { userId } = auth();
        const { name, location, image_url, description, terms_and_conditions, link, title, isPublished, isImagePublished  } = body
        

        if (!userId) {
            return new NextResponse("Unauthenticated", { status : 403})
        }
        if (!name) {
            return new NextResponse("Name Required", { status : 400})
        }
        if (!location) {
            return new NextResponse("Location Required", { status : 400})
        }
        if (!params.store_id) {
            return new NextResponse("Store ID Required", { status : 400})
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

        const modal = await prismadb.modal.create({
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
                store_id: params.store_id
            }
        });

        return NextResponse.json(modal);

    } catch(error) {
        console.log("MODAL_POST", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function GET(
    req: Request,
    { params } : { params: { store_id: string } }
) {
    try {

        if (!params.store_id) {
            return new NextResponse("Store ID Required", { status: 400 })
        }

        const modals = await prismadb.modal.findMany({
            where: {
                store_id: params.store_id
            }
        });

        return NextResponse.json(modals);

    } catch(error) {
        console.log("MODAL_GET", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}