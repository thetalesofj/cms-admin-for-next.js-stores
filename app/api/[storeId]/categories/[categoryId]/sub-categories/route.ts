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
        const { name, categoryId } = body
        

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        } 

        if (!name) {
            return new NextResponse("name Required", { status: 400 })
        }

        if (!categoryId) {
            return new NextResponse("Category ID Required", { status: 400 })
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

        const subCategory = await prismadb.subCategory.create({
            data: {
                name,
                categoryId,
                storeId: params.storeId,
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
    { params } : { params: { storeId: string } }
) {
    try {

        if (!params.storeId) {
            return new NextResponse("Store ID Required", { status: 400 })
        }

        const subCategories = await prismadb.subCategory.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(subCategories);

    } catch(error) {
        console.log("SUB_CATEGORIES_GET", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}