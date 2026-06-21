import {createParamDecorator, ExecutionContext} from "@nestjs/common";

// Hilfsfunktion um den aktuellen Benutzer aus dem Request zu extrahieren
export const CurrentUser = createParamDecorator(
    (data : string, ctx : ExecutionContext) => {

        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        // Wenn ein bestimmtes Feld angefordert wird, nur dieses zurückgeben
        return data ? user?.[data] : user;

    }
)