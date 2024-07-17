import "reflect-metadata";
import { AppLoadContext, SessionStorage } from "@remix-run/server-runtime";
import {
    AuthenticateOptions,
    Strategy,
    StrategyVerifyCallback,
} from "remix-auth";
import type { JwtPayload } from "jsonwebtoken";
import { container } from "tsyringe";
import type { Algorithm } from "jsonwebtoken";
import { jsonwebtokenModule } from "./jwt-module.di";
import { JsonwebtokenService } from "./jwt-service.port";

jsonwebtokenModule();

export type JWTAlgorithm = Algorithm;

export interface JwtStrategyOptions {

    secret: string;

    algorithms: Algorithm[];

    getToken?: (req: Request) => string | undefined | Promise<string | undefined>;
}

export interface JwtStrategyVerifyParams {
    context?: AppLoadContext;
    form: FormData;
    request: Request;
    jwt: {
        verify: (token: string) => string | JwtPayload;
        sign: (payload: string | object | Buffer) => string;
    };
}

export class JwtStrategy<User> extends Strategy<User, JwtStrategyVerifyParams> {
    name = "jwt";

    protected secret: string;
    protected algorithms: Algorithm[];
    protected jwt: JsonwebtokenService;
    protected getToken?: JwtStrategyOptions["getToken"];

    constructor(
        options: JwtStrategyOptions,
        verify: StrategyVerifyCallback<User, JwtStrategyVerifyParams>
    ) {
        super(verify);
        this.secret = options.secret;
        this.algorithms = options.algorithms;
        this.jwt = container.resolve<JsonwebtokenService>("JsonwebtokenService");

        if (options.getToken) {
            this.getToken = options.getToken;
        }
    }

    async authenticate(
        request: Request,
        sessionStorage: SessionStorage,
        options: AuthenticateOptions
    ): Promise<User> {
        let token: string | undefined;
        try {
			if (request.bodyUsed) throw new BodyUsedError();
			let form = await request.clone().formData();
            debugger;
            const user = await this.verify({
                form,
                request,
                context: options.context,
                jwt: {
                    verify: (token: string) => this.jwt.verify(token, this.secret, {
                        algorithms: this.algorithms,
                    }),
                    sign: (payload: string | object | Buffer) => this.jwt.sign(payload, this.secret),
                },
            });
            return await this.success(user, request, sessionStorage, options);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return await this.failure(
                    error.message,
                    request,
                    sessionStorage,
                    options,
                    error
                );
            }
            if (typeof error === "string") {
                return await this.failure(
                    error,
                    request,
                    sessionStorage,
                    options,
                    new Error(error)
                );
            }
            return await this.failure(
                "Unknown error",
                request,
                sessionStorage,
                options,
                new Error(JSON.stringify(error, null, 2))
            );
        }
    }
}
export class BodyUsedError extends Error {
	name = "BodyUsedError";

	constructor() {
		super(
			"Your request.body was already used. This means you called `request.formData()` or another way to read the body before using the Remix Auth's FormStrategy. Because FormStrategy needs to read the body, ensure that you either don't read it yourself by moving your logic to the strategy callback or clone the request before reading the body with `request.clone().formData()`.",
		);
	}
}