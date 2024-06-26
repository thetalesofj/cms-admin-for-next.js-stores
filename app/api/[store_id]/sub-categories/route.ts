import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface SubCategoryRequest {
    name: string;
    category_id: string;
    styles: string[];
}

export async function POST(
    req: Request,
    { params } : { params: { store_id: string } }
) {
    try {

        const { userId } = auth();
        const body: SubCategoryRequest = await req.json()
        const { name, category_id, styles } = body
        

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        } 

        if (!name || !category_id || !styles || !params.store_id) {
            return new NextResponse("All fields are required", { status: 400 })
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: params.store_id, userId },
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorised", { status: 403 })
        }

        const newSubCategory = await prismadb.subCategory.create({
            data: {
                name,
                store_id: params.store_id,
                category_id,
                styles
            }
        });

        return NextResponse.json(newSubCategory);
    } catch(error) {
        console.log("SUBCATEGORIES_POST", error);
        return new NextResponse("Internal Server Error", { status: 500 })
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

        const subcategories = await prismadb.subCategory.findMany({
            where: {
                store_id: params.store_id
            }
        });

        return NextResponse.json(subcategories);
    } catch(error) {
        console.log("SUBCATEGORIES_GET", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}