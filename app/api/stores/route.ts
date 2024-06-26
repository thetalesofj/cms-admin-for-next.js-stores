import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
) {
    try {

        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        } 

        const body = await req.json()
        const { name } = body
        if (!name) {
            return new NextResponse("Name Required", { status: 400 })
        }

        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        });
        return NextResponse.json(store);

    } catch(error) {
        console.log("STORE_POST", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}