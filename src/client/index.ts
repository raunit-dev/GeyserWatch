import Client,{
  SubscribeRequest,
  SubscribeUpdate,
  CommitmentLevel,
} from "@triton-one/yellowstone-grpc";
import { MINT_AUTHORITIES } from "../config";
import { PUMP_PROGRAM_ID } from "../config";
import { ClientDuplexStream } from "@grpc/grpc-js";
import {
  formatData,
  convertSignature,
  matchesInstructionDiscriminator,
} from "../utils";
import { FILTER_CONFIG, COMMITMENT } from "../config";

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


function createSubscribeRequestForMint(mintAuthority: string): SubscribeRequest {
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


async function handleData(data: SubscribeUpdate, mintAuthority: string): Promise<void> {
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
  
  // if (formattedData) {
  //   printCleanTransaction(formattedData, mintAuthority);
  // }

  if (formattedData) {
    printCompactTransaction(formattedData,mintAuthority);
  }
}

function printCleanTransaction(data: any, mintAuthority: string): void {
  const transactionType = data.instructionType.toUpperCase();
  const mint = data.mint;
  
  // Format amounts (convert from lamports/smallest unit)
  const amount = data.amount ? (BigInt(data.amount) / BigInt(1000000)).toString() : 'N/A';
  
  let additionalInfo = '';
  if (data.instructionType === 'buy') {
    const maxSolCost = data.max_sol_cost ? (BigInt(data.max_sol_cost) / BigInt(1000000000)).toString() : 'N/A';
    additionalInfo = `Max SOL Cost: ${maxSolCost} SOL`;
  } else if (data.instructionType === 'sell') {
    const minSolOutput = data.min_sol_output ? (BigInt(data.min_sol_output) / BigInt(1000000000)).toString() : 'N/A';
    additionalInfo = `Min SOL Output: ${minSolOutput} SOL`;
  }
  
  console.log(`🔥 ${transactionType} Transaction`);
  console.log(`💰 Mint: ${mint}`);
  console.log(`📊 Amount: ${amount} tokens`);
  console.log(`⚡ ${additionalInfo}`);
  console.log(`🔗 Signature: ${data.signature}`);
  console.log(`📦 Slot: ${data.slot}`);
  console.log('─'.repeat(60));
}

function printCompactTransaction(data: any, mintAuthority: string): void {
  const type = data.instructionType.toUpperCase();
  const mint = data.mint.substring(0, 8) + '...'; // Truncate mint for readability
  const amount = data.amount ? (BigInt(data.amount) / BigInt(1000000)).toString() : 'N/A';
  
  let extraInfo = '';
  if (data.instructionType === 'buy') {
    const maxSol = data.max_sol_cost ? (BigInt(data.max_sol_cost) / BigInt(1000000000)).toString() : 'N/A';
    extraInfo = `Max SOL: ${maxSol}`;
  } else {
    const minSol = data.min_sol_output ? (BigInt(data.min_sol_output) / BigInt(1000000000)).toString() : 'N/A';
    extraInfo = `Min SOL: ${minSol}`;
  }
  
  console.log(`${type === 'BUY' ? '🟢' : '🔴'} ${type} | Mint: ${mint} | Amount: ${amount} | ${extraInfo}`);
}



