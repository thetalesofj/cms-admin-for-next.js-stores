import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface SubCategory {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  store_id: string;
  category_id: string;
  styles: { name: string }[];
}

interface SubCategoryRequest {
  name: string;
  category_id: string;
  styles: string[];
}

export async function GET(
    req: Request, 
    { params }: { params: { subcategory_id: string } }
    ) {
  try {
    if (!params.subcategory_id) {
      return new NextResponse("Sub-Category ID Required", { status: 400 });
    }

    const subCategory = await prismadb.subCategory.findUnique({
      where: {
        id: params.subcategory_id,
      },
      include: {
        styles: true,
      },
    });

    return NextResponse.json(subCategory);
  } catch (error) {
    console.log('[SUBCATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
    req: Request, 
    { params }: { params: { store_id: string, subcategory_id: string } }
    ) {
  try {
    const { userId } = auth();
    const body: SubCategoryRequest = await req.json();
    const { name, category_id, styles } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }
    if (!name) {
      return new NextResponse("Name Required", { status: 400 });
    }
    if (!category_id) {
      return new NextResponse("Category ID Required", { status: 400 });
    }
    if (!params.subcategory_id) {
      return new NextResponse("Sub-Category ID Required", { status: 400 });
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

const updatedSubCategory = await prismadb.subCategory.updateMany({
    where: {
      id: params.subcategory_id,
    },
    data: {
      name,
      category_id,
    }
  });

  const updatedStyles = await Promise.all(styles.map(async (styleName: string) => {
    // Find the style by name and subcategory_id
    const existingStyle = await prismadb.style.findFirst({
      where: {
        name: styleName,
        subcategory_id: params.subcategory_id,
      },
    });
  
    if (existingStyle) {
      // Style exists, update it
      return prismadb.style.update({
        where: {
          id: existingStyle.id,
        },
        data: {
          name: styleName,
          store_id: params.store_id,
        },
      });
    } else {
      // Style doesn't exist, create it
      return prismadb.style.create({
        data: {
          name: styleName,
          store_id: params.store_id,
          subcategory_id: params.subcategory_id,
        },
      });
    }
  }));
  
  // Now updatedStyles will contain the updated or created styles
  
  
  const subCategoryWithStyles = {
    ...updatedSubCategory,
    styles: updatedStyles,
  };
    return NextResponse.json(subCategoryWithStyles);
  } catch (error) {
    console.log('[SUBCATEGORY_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
    req: Request, 
    { params }: { params: { store_id: string, subcategory_id: string } }
    ) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!params.subcategory_id) {
      return new NextResponse("Sub-Category ID Required", { status: 400 });
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

    const subCategory = await prismadb.subCategory.deleteMany({
      where: {
        id: params.subcategory_id,
      },
    });

    return NextResponse.json(subCategory);
  } catch (error) {
    console.log('[SUBCATEGORY_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
