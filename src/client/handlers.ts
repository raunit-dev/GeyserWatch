import { SubscribeUpdate } from "@triton-one/yellowstone-grpc";
import {
  formatData,
  convertSignature,
  matchesInstructionDiscriminator,
} from "../utils";
import { printCompactTransaction } from "./printing";

export async function handleData(data: SubscribeUpdate, mintAuthority: string): Promise<void> {
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
    printCompactTransaction(formattedData,mintAuthority);
  }
}
