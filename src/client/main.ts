import Client from "@triton-one/yellowstone-grpc";
import { MINT_AUTHORITIES } from "../config";
import { createSubscribeRequestForMint, sendSubscribeRequest, handleStreamEvents } from "./stream";

export async function main(): Promise<void> {
  console.log("Starting multiple streams");
  const ENDPOINT = process.env.ENDPOINT;
  
  if (!ENDPOINT) {
    console.log("Please provide Endpoint URL in env file");
    return;
  }

  const client = new Client(ENDPOINT, undefined, {});
  
  // Create multiple streams - one for each mint authority
  const streams = MINT_AUTHORITIES.map(async (mintAuthority, index) => {
    const stream = await client.subscribe();
    const request = createSubscribeRequestForMint(mintAuthority);
    
    try {
      await sendSubscribeRequest(stream, request);
      console.log(`Stream ${index + 1} established for mint: ${mintAuthority}`);
      
      // Handle each stream independently
      handleStreamEvents(stream, mintAuthority);
      
    } catch (error: any) {
      console.error(`Error in stream ${index + 1} for mint ${mintAuthority}:`, error);
      stream.end();
    }
  });

  // Wait for all streams to be established
  await Promise.all(streams);
  console.log("All streams established - watching multiple mints\n");
}
