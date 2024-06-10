import { NextResponse, NextRequest } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file: File | null = form.get("file") as unknown as File;
    form.append("file", file);
    form.append("pinataMetadata", JSON.stringify({ name: file.name }));
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.PINATA_JWT}` },
      body: form,
    });
    const { IpfsHash } = await res.json();
    return NextResponse.json(
      {
        url: `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${IpfsHash}`,
        cid: IpfsHash,
      },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
