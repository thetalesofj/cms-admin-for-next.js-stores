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
        const { name, price, discount_rate, category_id, style_id, colour_id, size_id, subcategory_id, brand_id, images, is_featured, is_discounted, is_archived, sizeQuantities } = body
        console.log('[POST Request Body]', body);

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        } 
        if (!name) {
            return new NextResponse("Name Required", { status: 400 })
        }
        if (!price) {
            return new NextResponse("Price Required", { status: 400 })
        }
        if (!category_id) {
            return new NextResponse("Category ID Required", { status: 400 })
        }
        if (!style_id) {
            return new NextResponse("Category ID Required", { status: 400 })
        }
        if (!brand_id) {
            return new NextResponse("Brand Required", { status: 400 })
        }
        if (!images?.length) {
            return new NextResponse("Image(s) Required", { status: 400 })
        }
        if (!size_id) {
            return new NextResponse("Size ID Required", { status: 400 })
        }
        if (!sizeQuantities) {
            return new NextResponse("Size ID and Quantity Required", { status: 400 })
        }
        if (!colour_id) {
            return new NextResponse("Colour ID Required", { status: 400 })
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

        const product = await prismadb.product.create({
            data: {
                name, 
                price, 
                discount_rate,
                category_id, 
                style_id,
                colour_id, 
                subcategory_id,
                size_id,
                product_size: { 
                    createMany: {
                      data: sizeQuantities.map((index: { size_id: string; quantity: number; }) => ({
                        size_id: index.size_id,
                        quantity: index.quantity,
                      })),
                    },
                  },
                brand_id,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string}) => image),
                        ]
                    }
                }, 
                is_featured, 
                is_archived,
                is_discounted,
                store_id: params.store_id
            }
        });

        return NextResponse.json(product);

    } catch(error) {
        console.log("[PRODUCTS_POST]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}
export async function GET(
    req: Request,
    { params } : { params: { store_id: string } },
) {
    try {

        const { searchParams } = new URL(req.url);
        const category_id = searchParams.get("category_id") ?? undefined;
        const style_id = searchParams.get("style_id") ?? undefined;
        const size_id = searchParams.get("size_id") ?? undefined;
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
                style_id,
                colour_id,
                size_id,
                brand_id,
                is_featured: is_featured ? true : undefined,
                is_discounted: is_discounted ? true : undefined,
                is_archived: false,
            },
            include : {
                images: true,
                category: true,
                colour: true,
                size: {
                    include: {
                        product_sizes: true,
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