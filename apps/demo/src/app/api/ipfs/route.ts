import { NextResponse, NextRequest } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const blob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    const file = new File([blob], "metadata.json");

    const form = new FormData();
    form.append("file", file);
    form.append("pinataMetadata", JSON.stringify({ name: data.name }));
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.PINATA_JWT}` },
      body: form,
    });
    const { IpfsHash, ...rest } = await res.json();
    console.log(rest);
    return NextResponse.json(
      { url: `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${IpfsHash}` },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
