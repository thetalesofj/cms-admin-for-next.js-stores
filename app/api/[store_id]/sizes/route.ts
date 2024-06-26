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
        const { name, value } = body
        

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        } 

        if (!name) {
            return new NextResponse("Name Required", { status: 400 })
        }

        if (!value) {
            return new NextResponse("Value Required", { status: 400 })
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

        const  size = await prismadb.size.create({
            data: {
                name,
                value,
                store_id: params.store_id
            }
        });

        return NextResponse.json(size);

    } catch(error) {
        console.log("SIZES_POST", error);
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

        const sizes = await prismadb.size.findMany({
            where: {
                store_id: params.store_id
            }
        });

        return NextResponse.json(sizes);

    } catch(error) {
        console.log("SIZES_GET", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}