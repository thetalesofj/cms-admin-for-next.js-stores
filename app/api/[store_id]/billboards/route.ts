import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params } : { params: { store_id: string } }
) {
    try {

        const body = await req.json()
        const { userId } = auth();
        const { label, image_url } = body
        

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        } 

        if (!label) {
            return new NextResponse("Label Required", { status: 400 })
        }

        if (!image_url) {
            return new NextResponse("Image URL Required", { status: 400 })
        }

        if (!params.store_id) {
            return new NextResponse("Store ID Required", { status: 400 })
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

        const  billboard = await prismadb.billboard.create({
            data: {
                label,
                image_url,
                store_id: params.store_id
            }
        });

        return NextResponse.json(billboard);

    } catch(error) {
        console.log("BILLBOARDS_POST", error);
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

        const  billboards = await prismadb.billboard.findMany({
            where: {
                store_id: params.store_id
            }
        });

        return NextResponse.json(billboards);

    } catch(error) {
        console.log("BILLBOARDS_GET", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}