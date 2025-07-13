import { Prisma, PrismaClient } from "@prisma/client";
import { SubscribeUpdate } from "@triton-one/yellowstone-grpc";
import {
    formatData,
    convertSignature,
    matchesInstructionDiscriminator,
} from "../utils";

const client = new PrismaClient();

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

    if (formattedData.instructionType == 'buy') {
        const type = formattedData.instructionType.toUpperCase();
        const mint = formattedData.mint;
        const amount = formattedData.amount ? (BigInt(formattedData.amount) / BigInt(1000000)).toString() : 'N/A';

        const maxSol = formattedData.max_sol_cost ? (BigInt(formattedData.max_sol_cost) / BigInt(1000000000)).toString() : 'N/A';

        await client.buyTransaction.create({
                data: {
                    signature: formattedSignature.base58,
                    mint,
                    amount,
                    maxSolCost: maxSol,
                    slot: data?.transaction?.slot?.toString() || '',
                    mintAuthority,
                },
            });

    }

    if (formattedData.instructionType == 'sell') {
        const type = formattedData.instructionType.toUpperCase();
        const mint = formattedData.mint;
        const amount = formattedData.amount ? (BigInt(formattedData.amount) / BigInt(1000000)).toString() : 'N/A';

       const minSol = formattedData.min_sol_output ? (BigInt(formattedData.min_sol_output) / BigInt(1000000000)).toString() : 'N/A';


        await client.sellTransaction.create({
                data: {
                    signature: formattedSignature.base58,
                    mint,
                    amount,
                    minSolOutput: minSol,
                    slot: data?.transaction?.slot?.toString() || '',
                    mintAuthority,
                },
            });
    }
}