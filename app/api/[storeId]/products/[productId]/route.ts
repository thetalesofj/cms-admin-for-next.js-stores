import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    { params } : { params: { productId: string } }
) {
    try {
        if (!params.productId) {
            return new NextResponse("Product ID Required", { status : 400})
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                size: true,
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
    { params } : { params: { storeId: string , productId: string} }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { name, brandId, price, discountRate, categoryId, colourId, sizeId, images, isFeatured, isDiscounted, isArchived } = body

        if (!userId) {
            return new NextResponse("Unauthenticated", { status : 403})
        }
        if (!name) {
            return new NextResponse("Name Required", { status: 400 })
        }
        if (!brandId) {
            return new NextResponse("Brand Required", { status: 400 })
        }
        if (!price) {
            return new NextResponse("Price Required", { status: 400 })
        }
        if (!categoryId) {
            return new NextResponse("Category ID Required", { status: 400 })
        }
        if (!images?.length) {
            return new NextResponse("Images Required", { status: 400 })
        }
        if (!sizeId) {
            return new NextResponse("Size ID Required", { status: 400 })
        }
        if (!colourId) {
            return new NextResponse("Colour ID Required", { status: 400 })
        }
        if (!params.productId) {
            return new NextResponse("product ID Required", { status : 400})
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
        
        const updateData: Record<string, any> = {
            name,
            price,
            categoryId,
            colourId,
            brandId,
            sizeId,
            images: {
              deleteMany: {},
            },
            isFeatured,
            isArchived,
            isDiscounted,
          };
      
          // Only add discountRate to updateData if it is provided
          if (typeof discountRate !== 'undefined') {
            updateData.discountRate = discountRate;
            console.log('discountRate before update:', discountRate);
          } 

        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: updateData,
        });

        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string}) => image),
                        ]
                    } 
                }
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUCT_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function DELETE (
    req: Request,
    { params } : { params: { storeId: string, productId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status : 401 })
        }
        if (!params.productId) {
            return new NextResponse("Product ID Required", { status : 400})
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

        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            }
        });

        return NextResponse.json(product)
        
    } catch (error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}