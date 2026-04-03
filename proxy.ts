import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  console.log("Middleware exécuté pour : ", req.nextUrl.pathname);

  return NextResponse.next();
}

export const config = {
  matcher: [],
};