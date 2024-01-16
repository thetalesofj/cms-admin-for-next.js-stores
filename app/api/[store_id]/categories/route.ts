import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params } : { params: { store_id: string } }
) {
    try {

        const body = await req.json()
        const { userId } = auth();
        const { name, billboard_id } = body
        

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        } 

        if (!name) {
            return new NextResponse("name Required", { status: 400 })
        }

        if (!billboard_id) {
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

        const category = await prismadb.category.create({
            data: {
                name,
                billboard_id,
                store_id: params.store_id
            }
        });

        return NextResponse.json(category);

    } catch(error) {
        console.log("CATEGORIES_POST", error);
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

        const categories = await prismadb.category.findMany({
            where: {
                store_id: params.store_id
            }
        });

        return NextResponse.json(categories);

    } catch(error) {
        console.log("CATEGORIES_GET", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}