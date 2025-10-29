"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAccessTokenToResponse = addAccessTokenToResponse;
function addAccessTokenToResponse(request, response, content) {
    let access_token;
    if (request.headers['authorization']) {
        access_token = request.headers['authorization'];
    }
    const isError = content instanceof Error;
    if (isError) {
        const errorCode = content.response?.statusCode || 500;
        return response.status(errorCode).json({ error: content.message, access_token });
    }
    else {
        return response.status(200).json({ content, access_token });
    }
}
//# sourceMappingURL=addAccessTokenToResponse.js.map