import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params } : { params: { product_id: string } }
) {
    try {
        if (!params.product_id) {
            return new NextResponse("Product ID Required", { status : 400})
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: params.product_id,
            },
            include: {
                images: true,
                category: true,
                size: {
                    include: {
                        productSize: true,
                    }
                },
                colour: true,
                brand: true,
            }
        });

        return NextResponse.json(product)
        
    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH (
    req: Request,
    { params } : { params: { store_id: string , product_id: string} }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, brand_id, price, discount_rate, category_id, colour_id, subcategory_id, images, is_featured, is_discounted, is_archived, sizeQuantities } = body;

        if (!userId || !name || !brand_id || !price || !category_id || !images?.length || !sizeQuantities?.length || !colour_id || !params.product_id) {
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

        const product = await prismadb.product.update({
            where: {
                id: params.product_id,
            },
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
                images: {
                    deleteMany: {},
                    createMany: {
                        data: images.map((image: { url: string }) => image),
                    },
                },
                product_sizes: {
                    deleteMany: {},
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

    } catch (error) {
        console.log('[PRODUCT_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


export async function DELETE (
    req: Request,
    { params } : { params: { store_id: string, product_id: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status : 401 })
        }
        if (!params.product_id) {
            return new NextResponse("Product ID Required", { status : 400})
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

        const product = await prismadb.product.delete({
            where: {
                id: params.product_id,
            }
        });

        return NextResponse.json(product)
        
    } catch (error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}