import { ClientDuplexStream } from "@grpc/grpc-js";
import {
  SubscribeRequest,
  SubscribeUpdate,
} from "@triton-one/yellowstone-grpc";
import { PUMP_PROGRAM_ID, COMMITMENT } from "../config";
import { handleData } from "./handlers";

export function createSubscribeRequestForMint(mintAuthority: string): SubscribeRequest {
  return {
    accounts: {},
    slots: {},
    transactions: {
      pumpFun: {
        accountInclude: [],
        accountExclude: [],
        accountRequired: [PUMP_PROGRAM_ID, mintAuthority], // Only this specific mint
      },
    },
    transactionsStatus: {},
    entry: {},
    blocks: {},
    blocksMeta: {},
    commitment: COMMITMENT,
    accountsDataSlice: [],
    ping: undefined,
  };
}

export function sendSubscribeRequest(
  stream: ClientDuplexStream<SubscribeRequest, SubscribeUpdate>,
  request: SubscribeRequest
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    stream.write(request, (err: Error | null) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function handleStreamEvents(
  stream: ClientDuplexStream<SubscribeRequest, SubscribeUpdate>,
  mintAuthority: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    stream.on("data", (data) => handleData(data, mintAuthority));
    stream.on("error", (error: Error) => {
      console.error(`Stream error for ${mintAuthority}:`, error);
      reject(error);
      stream.end();
    });
    stream.on("end", () => {
      console.log(`Stream ended for ${mintAuthority}`);
      resolve();
    });
    stream.on("close", () => {
      console.log(`Stream closed for ${mintAuthority}`);
      resolve();
    });
  });
}
