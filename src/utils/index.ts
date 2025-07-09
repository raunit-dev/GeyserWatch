
import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import axios from "axios";
import { Message, FormattedTransactionData, CompiledInstruction } from "../types";
import {
  ACCOUNTS_TO_INCLUDE,
  FILTER_CONFIG,
  GATEWAYS,
  INSTRUCTION_ARGS,
  PUMP_FUN_BUY_IX_DISCRIMINATOR,
  PUMP_FUN_CREATE_IX_DISCRIMINATOR,
  PUMP_FUN_SELL_IX_DISCRIMINATOR,
} from "../config";

export async function decodeInstructionArgs(
  instructionData: Uint8Array
): Promise<Record<string, any>> {
  const discriminator = Buffer.from(instructionData.slice(0, 8));
  if (discriminator.equals(PUMP_FUN_CREATE_IX_DISCRIMINATOR)) {
    return decodeCreateInstructionArgs(instructionData);
  } else if (discriminator.equals(PUMP_FUN_BUY_IX_DISCRIMINATOR)) {
    return decodeBuyInstructionArgs(instructionData);
  } else if (discriminator.equals(PUMP_FUN_SELL_IX_DISCRIMINATOR)) {
    return decodeSellInstructionArgs(instructionData);
  }
  return {};
}

export async function decodeCreateInstructionArgs(
  instructionData: Uint8Array
): Promise<Record<string, any>> {
  try {
    let offset = 8;
    const args: Record<string, any> = {};
    const buffer = Buffer.from(instructionData);

    const nameLength = buffer.readUInt32LE(offset);
    offset += 4;
    const nameBytes = buffer.subarray(offset, offset + nameLength);
    args.name = nameBytes.toString("utf-8");
    offset += nameLength;

    const symbolLength = buffer.readUInt32LE(offset);
    offset += 4;
    const symbolBytes = buffer.subarray(offset, offset + symbolLength);
    args.symbol = symbolBytes.toString("utf-8");
    offset += symbolLength;

    const uriLength = buffer.readUInt32LE(offset);
    offset += 4;
    const uriBytes = buffer.subarray(offset, offset + uriLength);
    args.uri = uriBytes.toString("utf-8");
    offset += uriLength;

    args.image = await getImageUri(args.uri);

    const creatorBytes = buffer.subarray(offset, offset + 32);
    args.creator = new PublicKey(creatorBytes).toBase58();

    return args;
  } catch (error) {
    console.error("Error decoding instruction args:", error);
    return {};
  }
}

export function decodeBuyInstructionArgs(
  instructionData: Uint8Array
): Record<string, any> {
  try {
    let offset = 8;
    const args: Record<string, any> = {};
    const buffer = Buffer.from(instructionData);

    args.amount = buffer.readBigUInt64LE(offset).toString();
    offset += 8;

    args.max_sol_cost = buffer.readBigUInt64LE(offset).toString();

    return args;
  } catch (error) {
    console.error("Error decoding instruction args:", error);
    return {};
  }
}

export function decodeSellInstructionArgs(
  instructionData: Uint8Array
): Record<string, any> {
  try {
    let offset = 8;
    const args: Record<string, any> = {};
    const buffer = Buffer.from(instructionData);

    args.amount = buffer.readBigUInt64LE(offset).toString();
    offset += 8;

    args.min_sol_output = buffer.readBigUInt64LE(offset).toString();

    return args;
  } catch (error) {
    console.error("Error decoding instruction args:", error);
    return {};
  }
}

export async function getImageUri(metadataUri: string): Promise<string> {
  if (!metadataUri || metadataUri === "invalid uri") {
    return "invalid uri";
  }
  const cid = metadataUri.split("/").pop();
  for (const gateway of GATEWAYS) {
    const gatewayUrl = `${gateway}${cid}`;
    try {
      const response = await axios.get(gatewayUrl, {
        headers: { Accept: "application/json" },
        timeout: 5000,
      });
      if (response?.data?.image) {
        console.log(`Success from ${gateway}`);
        return resolveIpfsImageUri(response.data.image);
      }
    } catch (err) {
      console.warn(
        `Failed to fetch from ${gateway}:`,
        err.response?.status || err.message
      );
      continue;
    }
  }
  return "invalid uri";
}

export function resolveIpfsImageUri(ipfsUri: string): string {
  if (ipfsUri.startsWith("ipfs://")) {
    const cid = ipfsUri.replace("ipfs://", "");
    return `https://cloudflare-ipfs.com/ipfs/${cid}`;
  }
  return ipfsUri;
}

export async function formatData(
  message: Message,
  signature: string,
  slot: string
): Promise<FormattedTransactionData | undefined> {
  const matchingInstruction = message.instructions.find(
    matchesInstructionDiscriminator
  );
  if (!matchingInstruction) {
    return undefined;
  }

  const discriminator = Buffer.from(matchingInstruction.data.slice(0, 8));
  const discriminatorHex = discriminator.toString("hex");

  let instructionType: "create" | "buy" | "sell";
  if (discriminator.equals(PUMP_FUN_CREATE_IX_DISCRIMINATOR)) {
    instructionType = "create";
  } else if (discriminator.equals(PUMP_FUN_BUY_IX_DISCRIMINATOR)) {
    instructionType = "buy";
  } else {
    instructionType = "sell";
  }

  const accountKeys = message.accountKeys;
  const includeAccounts = ACCOUNTS_TO_INCLUDE[discriminatorHex].reduce<
    Record<string, string>
  >((acc, { name, index }) => {
    const accountIndex = matchingInstruction.accounts[index];
    const publicKey = accountKeys[accountIndex];
    acc[name] = new PublicKey(publicKey).toBase58();
    return acc;
  }, {});

  const instructionArgs = await decodeInstructionArgs(matchingInstruction.data);

  return {
    signature,
    slot,
    instructionType,
    ...includeAccounts,
    ...instructionArgs,
  };
}

export function convertSignature(signature: Uint8Array): { base58: string } {
  return { base58: bs58.encode(Buffer.from(signature)) };
}

export function matchesInstructionDiscriminator(
  ix: CompiledInstruction
): boolean {
  const matches =
    ix?.data &&
    FILTER_CONFIG.instructionDiscriminators.some((discriminator) =>
      Buffer.from(discriminator).equals(ix.data.slice(0, 8))
    );
  return matches;
}
