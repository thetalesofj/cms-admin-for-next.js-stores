import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    req: Request, 
    { params }: { params: { style_id: string } }
    ) {
  try {
    if (!params.style_id) {
      return new NextResponse("Style ID Required", { status: 400 });
    }

    const style = await prisma.style.findUnique({
      where: {
        id: params.style_id,
      }
    });

    return NextResponse.json(style);

  } catch (error) {
    console.log('[STYLE_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
    req: Request, 
    { params }: { params: { store_id: string, style_id: string } }
    ) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, subcategory_id, styles } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }
    if (!name) {
      return new NextResponse("Name Required", { status: 400 });
    }
    if (!subcategory_id) {
      return new NextResponse("Sub-Category ID Required", { status: 400 });
    }
    if (!params.style_id) {
      return new NextResponse("Style ID Required", { status: 400 });
    }

    const storeByUserId = await prisma.store.findFirst({
        where: {
          id: params.store_id,
          userId,
        },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorised", { status: 403 });
    }
    
    const style = await prisma.style.update({
        where: {
          id: params.style_id,
        },
        data: {
          name,
          subcategory_id,
        },
    });

    return NextResponse.json(style);

  } catch (error) {
    console.log('[STYLE_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
    req: Request, 
    { params }: { params: { store_id: string, style_id: string } }
    ) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!params.style_id) {
      return new NextResponse("Style ID Required", { status: 400 });
    }

    const storeByUserId = await prisma.store.findFirst({
        where: {
            id: params.store_id,
            userId,
        },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorised", { status: 403 });
    }

    const style = await prisma.style.deleteMany({
      where: {
          id: params.style_id,
      }
  });

    return NextResponse.json(style);
    
  } catch (error) {
    console.log('[STYLE_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}