import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("url");
    const filename = searchParams.get("filename") || "HUTRI81_RW10_Foto.jpg";

    if (!imageUrl) {
      return NextResponse.json({ error: "URL gambar tidak ditemukan" }, { status: 400 });
    }

    // Server Node.js kita mengambil file gambar eksternal (Bebas dari blokir CORS Browser)
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Gagal mengambil gambar dari server asal" }, { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();

    // Kembalikan ke browser dengan header rakitan 'attachment' agar file LANGSUNG didownload!
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kendala pada server unduh" }, { status: 500 });
  }
}
