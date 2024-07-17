import { container } from "tsyringe";
import { JsonwebtokenService } from "./jwt-service.port";
import { JsonwebtokenServiceImpl } from "./adapters/jwt-service.adapter";

export function jsonwebtokenModule() {
    container.register<JsonwebtokenService>("JsonwebtokenService", {
        useClass: JsonwebtokenServiceImpl,
    });
}
