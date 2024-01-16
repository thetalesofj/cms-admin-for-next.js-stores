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
        const { name, price, discountRate, category_id, style_id, subcategory_id, colour_id, size_id, brandId, images, isFeatured, isDiscounted, isArchived } = body
        

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
        if (!subcategory_id) {
            return new NextResponse("Category ID Required", { status: 400 })
        }
        if (!style_id) {
            return new NextResponse("Category ID Required", { status: 400 })
        }
        if (!brandId) {
            return new NextResponse("Brand Required", { status: 400 })
        }
        if (!images?.length) {
            return new NextResponse("Image(s) Required", { status: 400 })
        }
        if (!size_id) {
            return new NextResponse("Size ID Required", { status: 400 })
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
                discountRate,
                category_id, 
                style_id,
                subcategory_id,
                colour_id, 
                size_id,
                brandId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string}) => image),
                        ]
                    }
                }, 
                isFeatured, 
                isArchived,
                isDiscounted,
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
        const subcategory_id = searchParams.get("subcategory_id") ?? undefined;
        const style_id = searchParams.get("style_id") ?? undefined;
        const size_id = searchParams.get("size_id") ?? undefined;
        const colour_id = searchParams.get("colour_id") ?? undefined;
        const brandId = searchParams.get("brandId") ?? undefined;
        const isFeatured = searchParams.get("isFeatured");
        const isDiscounted = searchParams.get("isDiscounted");

        if (!params.store_id) {
            return new NextResponse("Store ID Required", { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: {
                store_id: params.store_id,
                category_id,
                subcategory_id,
                style_id,
                colour_id,
                size_id,
                brandId,
                isFeatured: isFeatured ? true : undefined,
                isDiscounted: isDiscounted ? true : undefined,
                isArchived: false,
            },
            include : {
                images: true,
                category: true,
                colour: true,
                size: true,
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