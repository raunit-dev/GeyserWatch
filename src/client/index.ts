import Client,{
  SubscribeRequest,
  SubscribeUpdate,
  CommitmentLevel,
} from "@triton-one/yellowstone-grpc";
import { ClientDuplexStream } from "@grpc/grpc-js";
import {
  formatData,
  convertSignature,
  matchesInstructionDiscriminator,
} from "../utils";
import { FILTER_CONFIG, COMMITMENT } from "../config";

export async function main(): Promise<void> {
  console.log("let start");
  const ENDPOINT = process.env.ENDPOINT;
  const TOKEN = process.env.TOKEN;

  // if (!ENDPOINT || !TOKEN) {
  if (!ENDPOINT) {
    console.log(ENDPOINT);
    console.log("Please provide Endpoint URL and TOken in env file");
    return;
  }
  const client = new Client(ENDPOINT,undefined, {});
  const stream = await client.subscribe();
  const request = createSubscribeRequest();
  try {
    await sendSubscribeRequest(stream, request);
    console.log("Geyser connection established - watching new Pump mints. \n");
    await handleStreamEvents(stream);
  } catch (error: any) {
    console.error("Error in subscription process:", error);
    stream.end();
  }
}

function createSubscribeRequest(): SubscribeRequest {
  return {
    accounts: {},
    slots: {},
    transactions: {
      pumpFun: {
        accountInclude: [],
        accountExclude: [],
        accountRequired: FILTER_CONFIG.requiredAccounts,
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

function sendSubscribeRequest(
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

function handleStreamEvents(
  stream: ClientDuplexStream<SubscribeRequest, SubscribeUpdate>
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    stream.on("data", handleData);
    stream.on("error", (error: Error) => {
      console.error("Stream error:", error);
      reject(error);
      stream.end();
    });
    stream.on("end", () => {
      console.log("Stream ended");
      resolve();
    });
    stream.on("close", () => {
      console.log("Stream closed");
      resolve();
    });
  });
}

async function handleData(data: SubscribeUpdate): Promise<void> {
  const transaction = data.transaction?.transaction;
  const message = transaction?.transaction?.message;
  if (!transaction || !message) {
    return;
  }
  const matchingInstruction = message.instructions.find(
    matchesInstructionDiscriminator
  );
  if (!matchingInstruction) {
    return;
  }
  const formattedSignature = convertSignature(transaction.signature);
  const formattedData = await formatData(
    message,
    formattedSignature.base58,
    data?.transaction?.slot || ""
  );
  if (formattedData) {
    console.log(
      "======================================💊 New Pump.fun Mint Detected!======================================"
    );
    console.log(formattedData);
    console.log("\n");
  }
}
