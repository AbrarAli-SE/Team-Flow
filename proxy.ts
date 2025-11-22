import arcjet, { createMiddleware, detectBot } from "@arcjet/next";
import { getKindeServerSession, withAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextMiddleware, NextRequest, NextResponse } from "next/server";

const aj = arcjet({
    key: process.env.ARCJET_KEY!,
    rules: [
        detectBot({
            mode: "LIVE",
            allow: [
                'CATEGORY:SEARCH_ENGINE',
                "CATEGORY:PREVIEW",
                'CATEGORY:MONITOR',
                'CATEGORY:WEBHOOK'
            ]
        })
    ]
});

// // Working middleware with proper org_code handling
// async function existingMiddleware(req: NextRequest) {
//     const { getClaim } = getKindeServerSession();
//     const orgCode = await getClaim("org_code");

//     const url = req.nextUrl;

//     // Only redirect workspace routes that don't include the correct orgCode
//     if (url.pathname.startsWith("/workspace") && orgCode?.value && !url.pathname.includes(orgCode.value)) {
//         url.pathname = `/workspace/${orgCode.value}`;
//         return NextResponse.redirect(url);
//     }

//     return NextResponse.next();
// }

// export default createMiddleware(aj, existingMiddleware);



async function existingMiddleware(req: NextRequest) {
    const { getClaim } = getKindeServerSession()
    const orgCode = await getClaim("org_code");

    const url = req.nextUrl;

    if (url.pathname.startsWith("/workspace") && !url.pathname.includes(orgCode?.value || "")) {
        url.pathname = `/workspace/${orgCode?.value}`;
        return NextResponse.redirect(url);
    }


    return NextResponse.next();
}

export default createMiddleware(aj, existingMiddleware);


// async function existingMiddleware(req: NextRequest) {

//     const anyReq = req as {
//         nextUrl: NextRequest["nextUrl"];
//         kindeAuth?: { token?: any; user?: any };
//     }
//     const url = req.nextUrl;
//     const orgCode =
//         anyReq.kindeAuth?.user?.org_code ||
//         anyReq.kindeAuth?.token?.org_code ||
//         anyReq.kindeAuth?.token?.claims?.org_code;

//     if (
//         url.pathname.startsWith("/workspace") &&
//         !url.pathname.includes(orgCode?.value || "")
//     ) {
//         url.pathname = `/workspace/${orgCode}`;
//         return NextResponse.redirect(url);
//     }

//     return NextResponse.next();
// }

// export default createMiddleware(aj, withAuth(existingMiddleware, {
//     publicPathes: ["/","/api/uploadthing" ]
// }) as NextMiddleware);




export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|/rpc).*)"],
}