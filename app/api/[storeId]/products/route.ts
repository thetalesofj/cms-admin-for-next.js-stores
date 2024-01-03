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
        const { name, price, discountRate, categoryId, colourId, sizeId, brandId, images, isFeatured, isDiscounted, isArchived } = body
        

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        } 
        if (!name) {
            return new NextResponse("Name Required", { status: 400 })
        }
        if (!price) {
            return new NextResponse("Price Required", { status: 400 })
        }
        if (!categoryId) {
            return new NextResponse("Category ID Required", { status: 400 })
        }
        if (!brandId) {
            return new NextResponse("Brand Required", { status: 400 })
        }
        if (!images?.length) {
            return new NextResponse("Image(s) Required", { status: 400 })
        }
        if (!sizeId) {
            return new NextResponse("Size ID Required", { status: 400 })
        }
        if (!colourId) {
            return new NextResponse("Colour ID Required", { status: 400 })
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

        const product = await prismadb.product.create({
            data: {
                name, 
                price, 
                discountRate,
                categoryId, 
                colourId, 
                sizeId,
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
                storeId: params.storeId
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
    { params } : { params: { storeId: string } },
) {
    try {

        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") ?? undefined;
        const sizeId = searchParams.get("sizeId") ?? undefined;
        const colourId = searchParams.get("colourId") ?? undefined;
        const brandId = searchParams.get("brandId") ?? undefined;
        const isFeatured = searchParams.get("isFeatured");
        const isDiscounted = searchParams.get("isDiscounted");

        if (!params.storeId) {
            return new NextResponse("Store ID Required", { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colourId,
                sizeId,
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