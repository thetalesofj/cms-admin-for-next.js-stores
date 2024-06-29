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

        console.log('POST request received');

        const { userId } = auth();
        const body: SubCategoryRequest = await req.json()

        console.log('Request body:', body);

        const { name, category_id, styles } = body
        

        if (!userId) {
            console.log('Unauthenticated request');
            return new NextResponse("Unauthenticated", { status: 401 })
        } 

        if (!name || !category_id || !styles || !params.store_id) {
            console.log('Validation failed:', { name, category_id, styles, store_id: params.store_id });
            return new NextResponse("All fields are required", { status: 400 })
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: params.store_id, userId },
        })

        if (!storeByUserId) {
            console.log('Unauthorized access attempt by user:', userId);
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
        console.log('New sub-category created:', newSubCategory);

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
            console.log('Validation failed:', { store_id: params.store_id });
            return new NextResponse("Store ID Required", { status: 400 })
        }

        const subcategories = await prismadb.subCategory.findMany({
            where: {
                store_id: params.store_id
            },
        });
        console.log('sub-category retrieved:', subcategories);
        return NextResponse.json(subcategories);
    } catch(error) {
        console.log("SUBCATEGORIES_GET", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}