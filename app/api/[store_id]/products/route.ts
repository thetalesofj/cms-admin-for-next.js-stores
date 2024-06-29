import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params } : { params: { store_id: string } }
) {
    try {
        const body = await req.json();
        const { userId } = auth();
        const { name, price, discount_rate, category_id, colour_id, subcategory_id, brand_id, images, is_featured, is_discounted, is_archived, sizeQuantities } = body;

        if (!userId || !name || !price || !category_id || !brand_id || !images?.length || !sizeQuantities?.length || !colour_id || !params.store_id) {
            return new NextResponse("All fields are required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.store_id,
                userId,
            },
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorised", { status: 403 });
        }

        const product = await prismadb.product.create({
            data: {
                name, 
                price, 
                discount_rate,
                category_id, 
                colour_id, 
                subcategory_id,
                brand_id,
                is_featured, 
                is_archived,
                is_discounted,
                store_id: params.store_id,
                images: {
                    createMany: {
                        data: images.map((image: { url: string }) => image),
                    },
                },
                product_sizes: {
                    createMany: {
                        data: sizeQuantities.map((sizeQuantity: { size_id: string, quantity: number }) => ({
                            size_id: sizeQuantity.size_id,
                            quantity: sizeQuantity.quantity,
                        })),
                    },
                },
            },
        });

        return NextResponse.json(product);

    } catch(error) {
        console.log("[PRODUCTS_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params } : { params: { store_id: string } },
) {
    try {

        const { searchParams } = new URL(req.url);
        const category_id = searchParams.get("category_id") ?? undefined;
        const colour_id = searchParams.get("colour_id") ?? undefined;
        const brand_id = searchParams.get("brand_id") ?? undefined;
        const is_featured = searchParams.get("is_featured");
        const is_discounted = searchParams.get("is_discounted");

        if (!params.store_id) {
            return new NextResponse("Store ID Required", { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: {
                store_id: params.store_id,
                category_id,
                colour_id,
                brand_id,
                is_featured: is_featured ? true : undefined,
                is_discounted: is_discounted ? true : undefined,
                is_archived: false,
            },
            include : {
                images: true,
                category: true,
                colour: true,
                Size: {
                    include: {
                        productSize: true,
                    }
                },
                brand: true,

            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(products);

    } catch(error) {
        console.log("[PRODUCTS_GET]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}