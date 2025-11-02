/// <reference types="node" />
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

declare const process: {
  env: {
    R2_ACCESS_KEY_ID?: string;
    R2_SECRET_ACCESS_KEY?: string;
    R2_ACCOUNT_ID?: string;
    R2_ENDPOINT?: string;
  };
};

export default {
  async fetch(request: Request) {
    const url = new URL(request.url);
    console.log(`[presigned-url] ${request.method} ${request.url}`);
    
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Support both GET (query params) and POST (JSON body)
    if (request.method !== "POST") {
      console.log(`[presigned-url] Method not allowed: ${request.method}`);
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      let bucketKey: string | null = null;

      // Try POST with JSON body
      if (request.method === "POST" && !bucketKey) {
        try {
          const body = await request.json();
          bucketKey = body.url;
          console.log(`[presigned-url] POST - Body:`, body);
          console.log(`[presigned-url] POST - Object key from body:`, bucketKey);
        } catch (e) {
          console.error(`[presigned-url] Failed to parse POST body:`, e);
        }
      }

      console.log(`[presigned-url] Final Object URL:`, bucketKey);

      if (!bucketKey) {
        console.log(`[presigned-url] Missing URL parameter`);
        return new Response(
          JSON.stringify({ error: "Missing 'url' parameter" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }


      // Get credentials from environment variables
      const accessKeyId = process.env.R2_ACCESS_KEY_ID;
      const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
      const accountId = process.env.R2_ACCOUNT_ID;
      const endpoint = process.env.R2_ENDPOINT
      console.log(`[presigned-url] Endpoint: ${endpoint}`);

      console.log(`[presigned-url] Has accessKeyId: ${!!accessKeyId}, Has secretAccessKey: ${!!secretAccessKey}`);
      console.log(`[presigned-url] AccountId: ${accountId}, Endpoint: ${endpoint}`);

      if (!accessKeyId || !secretAccessKey) {
        console.error(`[presigned-url] Missing credentials`);
        return new Response(
          JSON.stringify({ error: "R2 credentials not configured. Please set R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY environment variables." }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (!endpoint) {
        console.error(`[presigned-url] Missing endpoint`);
        return new Response(
          JSON.stringify({ error: "R2 endpoint not configured. Please set R2_ACCOUNT_ID or R2_ENDPOINT environment variable." }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Create S3 client configured for Cloudflare R2
      const s3Client = new S3Client({
        region: "auto",
        endpoint: endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        forcePathStyle: false, // Use virtual-hosted-style URLs
      });

      // Generate presigned URL (valid for 1 hour)
      const command = new GetObjectCommand({
        Bucket: 'books',
        Key: bucketKey,
      });

      console.log(`[presigned-url] Generating presigned URL...`);
      console.log("--------------------------------");
      console.log(`[presigned-url] Bucket: books, Key: ${bucketKey}`);
      console.log("--------------------------------");
      const presignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600, // 1 hour
      });

      console.log(`[presigned-url] Success! Presigned URL generated`);
      return new Response(
        JSON.stringify({ presignedUrl }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } catch (error) {
      console.error("[presigned-url] Error generating presigned URL:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to generate presigned URL",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  },
};

