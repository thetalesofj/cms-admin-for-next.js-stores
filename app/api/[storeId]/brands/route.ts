import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params } : { params: { storeId: string } }
) {
    try {

        const body = await req.json()
        const { userId } = auth();
        const { name } = body
        

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        } 

        if (!name) {
            return new NextResponse("Name Required", { status: 400 })
        }

        if (!params.storeId) {
            return new NextResponse("Store ID Required", { status: 400 })
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorised", { status: 403 })
        }

        const  brand = await prismadb.brand.create({
            data: {
                name,
                storeId: params.storeId
            }
        });

        return NextResponse.json(brand);

    } catch(error) {
        console.log("BRANDS_POST", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}
export async function GET(
    req: Request,
    { params } : { params: { storeId: string } }
) {
    try {

        if (!params.storeId) {
            return new NextResponse("Store ID Required", { status: 400 })
        }

        const brands = await prismadb.brand.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(brands);

    } catch(error) {
        console.log("BRANDS_GET", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}