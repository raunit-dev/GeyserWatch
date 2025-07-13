
import { CommitmentLevel } from "@triton-one/yellowstone-grpc";


const PUMP_FUN_MINT_AUTHORITY_DOG = process.env.PUMP_FUN_MINT_AUTHORITY_DOG;
const PUMP_FUN_MINT_AUTHORITY_BTK = process.env.PUMP_FUN_MINT_AUTHORITY_BTK;
const PUMP_FUN_MINT_AUTHORITY_LOST = process.env.PUMP_FUN_MINT_AUTHORITY_LOST;
const PUMP_FUN_MINT_AUTHORITY_GROWTH = process.env.PUMP_FUN_MINT_AUTHORITY_GROWTH;
const PUMP_FUN_MINT_AUTHORITY_STANDARD = process.env.PUMP_FUN_MINT_AUTHORITY_STANDARD;
export const PUMP_PROGRAM_ID = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
// export const PUMP_FUN_CREATE_IX_DISCRIMINATOR = Buffer.from([
//   24, 30, 200, 40, 5, 28, 7, 119,
// ]);
export const PUMP_FUN_BUY_IX_DISCRIMINATOR = Buffer.from([
  102, 6, 61, 18, 1, 218, 235, 234,
]);
export const PUMP_FUN_SELL_IX_DISCRIMINATOR = Buffer.from([
  51, 230, 133, 164, 1, 127, 131, 173,
]);

export const COMMITMENT = CommitmentLevel.FINALIZED;

export const MINT_AUTHORITIES = [
  PUMP_FUN_MINT_AUTHORITY_DOG,
  PUMP_FUN_MINT_AUTHORITY_BTK,
  PUMP_FUN_MINT_AUTHORITY_LOST,
  PUMP_FUN_MINT_AUTHORITY_GROWTH,
  PUMP_FUN_MINT_AUTHORITY_STANDARD,
];

export const FILTER_CONFIG = {
  programIds: [PUMP_PROGRAM_ID],
  requiredAccounts: [
    PUMP_PROGRAM_ID,
    ...MINT_AUTHORITIES,
  ],
  instructionDiscriminators: [
    PUMP_FUN_BUY_IX_DISCRIMINATOR,
    PUMP_FUN_SELL_IX_DISCRIMINATOR,
    // PUMP_FUN_COLLECT_CREATOR_FEE_IX_DISCRIMINATOR,
  ],
};

export const ACCOUNTS_TO_INCLUDE: Record<
  string,
  { name: string; index: number }[]
> = {
  // [PUMP_FUN_CREATE_IX_DISCRIMINATOR.toString("hex")]: [
  //   { name: "mint", index: 0 },
  //   { name: "mint_authority", index: 1 },
  //   { name: "bonding_curve", index: 2 },
  //   { name: "associated_bonding_curve", index: 3 },
  //   { name: "user", index: 7 },
  // ],
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
    // [PUMP_FUN_CREATE_IX_DISCRIMINATOR.toString("hex")]: [
    //   { name: "name", type: "string" },
    //   { name: "symbol", type: "string" },
    //   { name: "uri", type: "string" },
    //   { name: "creator", type: "pubkey" },
    // ],
    [PUMP_FUN_BUY_IX_DISCRIMINATOR.toString("hex")]: [
      { name: "amount", type: "u64" },
      { name: "max_sol_cost", type: "u64" },
    ],
    [PUMP_FUN_SELL_IX_DISCRIMINATOR.toString("hex")]: [
      { name: "amount", type: "u64" },
      { name: "min_sol_output", type: "u64" },
    ],
    // [PUMP_FUN_COLLECT_CREATOR_FEE_IX_DISCRIMINATOR.toString("hex")]: [],
  };

export const GATEWAYS = [
  "https://dweb.link/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
  "https://ipfs.io/ipfs/",
];







// [PUMP_FUN_COLLECT_CREATOR_FEE_IX_DISCRIMINATOR.toString("hex")]: [
//     { name: "creator", index: 0 },
//     { name: "creator_vault", index: 1 },
//     { name: "system_program", index: 2 },
//     { name: "event_authority", index: 3 },
//     { name: "program", index: 4 },
//   ],

// export const PUMP_FUN_COLLECT_CREATOR_FEE = Buffer.from([
//   20, 22, 86, 123, 198, 28, 219, 132
// ]);
