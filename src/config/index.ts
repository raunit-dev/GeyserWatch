
import { CommitmentLevel } from "@triton-one/yellowstone-grpc";

export const PUMP_PROGRAM_ID = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
export const PUMP_FUN_CREATE_IX_DISCRIMINATOR = Buffer.from([
  24, 30, 200, 40, 5, 28, 7, 119,
]);
export const PUMP_FUN_BUY_IX_DISCRIMINATOR = Buffer.from([
  102, 6, 61, 18, 1, 218, 235, 234,
]);
export const PUMP_FUN_SELL_IX_DISCRIMINATOR = Buffer.from([
  51, 230, 133, 164, 1, 127, 131, 173,
]);

export const COMMITMENT = CommitmentLevel.FINALIZED;

export const FILTER_CONFIG = {
  programIds: [PUMP_PROGRAM_ID],
  instructionDiscriminators: [
    PUMP_FUN_CREATE_IX_DISCRIMINATOR,
    PUMP_FUN_BUY_IX_DISCRIMINATOR,
    PUMP_FUN_SELL_IX_DISCRIMINATOR,
  ],
};

export const ACCOUNTS_TO_INCLUDE: Record<
  string,
  { name: string; index: number }[]
> = {
  [PUMP_FUN_CREATE_IX_DISCRIMINATOR.toString("hex")]: [
    { name: "mint", index: 0 },
    { name: "mint_authority", index: 1 },
    { name: "bonding_curve", index: 2 },
    { name: "associated_bonding_curve", index: 3 },
    { name: "user", index: 7 },
  ],
  [PUMP_FUN_BUY_IX_DISCRIMINATOR.toString("hex")]: [
    { name: "global", index: 0 },
    { name: "fee_recipient", index: 1 },
    { name: "mint", index: 2 },
    { name: "bonding_curve", index: 3 },
    { name: "associated_bonding_curve", index: 4 },
  ],
  [PUMP_FUN_SELL_IX_DISCRIMINATOR.toString("hex")]: [
    { name: "global", index: 0 },
    { name: "fee_recipient", index: 1 },
    { name: "mint", index: 2 },
    { name: "bonding_curve", index: 3 },
    { name: "associated_bonding_curve", index: 4 },
  ],
};

export const INSTRUCTION_ARGS: Record<string, { name: string; type: string }[]> =
  {
    [PUMP_FUN_CREATE_IX_DISCRIMINATOR.toString("hex")]: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "uri", type: "string" },
      { name: "creator", type: "pubkey" },
    ],
    [PUMP_FUN_BUY_IX_DISCRIMINATOR.toString("hex")]: [
      { name: "amount", type: "u64" },
      { name: "max_sol_cost", type: "u64" },
    ],
    [PUMP_FUN_SELL_IX_DISCRIMINATOR.toString("hex")]: [
      { name: "amount", type: "u64" },
      { name: "min_sol_output", type: "u64" },
    ],
  };

export const GATEWAYS = [
  "https://dweb.link/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
  "https://ipfs.io/ipfs/",
];
