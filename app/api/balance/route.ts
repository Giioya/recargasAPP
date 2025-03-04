import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get("wallet");

    if (!wallet) {
        return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
    }

    try {
        const res = await fetch(`https://api.worldcoin.com/v1/balance/${wallet}`);
        const data = await res.json();

        if (!data || !data.balance) {
        return NextResponse.json({ error: "No balance found" }, { status: 404 });
        }

        return NextResponse.json({ balance: data.balance });
    } catch (error) {
        console.error("Error fetching balance:", error);
        return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 });
    }
}

