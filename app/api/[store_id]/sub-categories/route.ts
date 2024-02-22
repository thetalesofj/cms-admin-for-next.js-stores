import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface SubCategoryRequest {
  name: string;
  category_id: string;
  styles: string[];
}

export async function POST(
    req: Request, 
    { params }: { params: { store_id: string } }
    ) {
  try {
    const body: SubCategoryRequest = await req.json();
    const { userId } = auth();
    const { name, category_id, styles } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name Required", { status: 400 });
    }
    if (!category_id) {
      return new NextResponse("Category ID Required", { status: 400 });
    }
    if (!styles) {
      return new NextResponse("Styles are Required", { status: 400 });
    }

    if (!params.store_id) {
      return new NextResponse("Store ID Required", { status: 400 });
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

    const subCategory = await prismadb.subCategory.create({
      data: {
        name,
        store_id: params.store_id,
        category_id,
        styles: {
          createMany: {
            data: styles.map((style: string) => ({ 
                name: style, 
                store_id: params.store_id 
            })),
          },
        },
      },
      include: {
        styles: true,
      },
    });

    return NextResponse.json(subCategory);
  } catch (error) {
    console.log("SUBCATEGORIES_POST", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
    req: Request, { params }: { params: { store_id: string } }
    ) {
  try {
    if (!params.store_id) {
      return new NextResponse("Store ID Required", { status: 400 });
    }

    const subCategories = await prismadb.subCategory.findMany({
      where: {
        store_id: params.store_id,
      },
    });

    return NextResponse.json(subCategories);
  } catch (error) {
    console.log("SUBCATEGORIES_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
