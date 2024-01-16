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
        const { name, category_id } = body
        

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        } 

        if (!name) {
            return new NextResponse("name Required", { status: 400 })
        }

        if (!category_id) {
            return new NextResponse("Category ID Required", { status: 400 })
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

        const subCategory = await prismadb.subCategory.create({
            data: {
                name,
                category_id,
                store_id: params.store_id,
            }
        });

        return NextResponse.json(subCategory);

    } catch(error) {
        console.log("SUB_CATEGORIES_POST", error);
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

        const subCategories = await prismadb.subCategory.findMany({
            where: {
                store_id: params.store_id
            }
        });

        return NextResponse.json(subCategories);

    } catch(error) {
        console.log("SUB_CATEGORIES_GET", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}