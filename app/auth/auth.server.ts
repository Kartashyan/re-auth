import { Authenticator } from "remix-auth";
import { JwtStrategy } from "./jwt-strategy";
import { sessionStorage } from "./session.server";


export let authenticator = new Authenticator<{ requestname: string }>(
  sessionStorage
);

authenticator.use(
    new JwtStrategy({
        secret: "s3cr3t",
        algorithms: ["HS256"],
    }, async ({ form, context, request, jwt }) => {
        const userCredentials = {} as any;
        userCredentials["name"] = form.get("email")!;
        userCredentials["password"] = form.get("password")!;
        const token = jwt.sign(userCredentials);
        request.headers.set("Authorization", `Bearer ${token}`);
        return userCredentials;
    })
);