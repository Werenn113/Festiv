import { Request, Response } from "express";

export function addAccessTokenToResponse(request: Request, response: Response, content: any) {

    let access_token: string | null
    // console.log("Was access token re-issued ? ", request.headers['authorization'] ? "yes" : "no")

    // Check if authorization header is present in the request
    // If it is, it means it has been updated
    // Otherwise, it means it was not updated,
    // so no need to send it back in the response.
    if (request.headers['authorization']) {
        access_token = request.headers['authorization']
    }

    // Check if data is an error
    const isError = content instanceof Error;

    // Return response with status 200 and JSON content
    if (isError) {
        // we retrieve the code
        const errorCode = (content as any).response?.statusCode || 500;
        // If content is an error, return response with status 401 and error message
        return response.status(errorCode).json({ error: content.message, access_token });
    } else {
        // If content is not an error, return response with status 200 and content
        return response.status(200).json({ content, access_token });
    }
}