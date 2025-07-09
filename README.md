# YelloStone gRPC 

A real-time, high-performance Solana blockchain monitor that captures and parses all Pump.fun activity—including **token creation**, **buy**, **sell**, and **creator fee collection** instructions—using Yellowstone gRPC for efficient, low-latency streaming and advanced instruction decoding.

---

## 🚀 Overview

This application streams the Solana blockchain via Yellowstone gRPC, targeting the Pump.fun program to extract and format all create, buy, sell, and creator fee collection instructions. It decodes and outputs full transaction metadata, accounts, and arguments in structured JSON—ideal for analytics, dashboards, or compliance monitoring.

---

## ✨ Supported Instructions

The monitor parses and outputs **all major Pump.fun instruction types**, each with its own decoded fields and account mappings:

### 1. Create (Token Mint)
- **Discriminator:** `[24, 30, 200, 40, 5, 28, 7, 119]`
- **Arguments:**
  - `name` (string): Token name
  - `symbol` (string): Token symbol
  - `uri` (string): Metadata URI (often IPFS)
  - `creator` (pubkey): Creator public key (32 bytes)
- **Accounts:**
  - `mint` (index 0): New mint address
  - `mint_authority` (index 1)
  - `bonding_curve` (index 2)
  - `associated_bonding_curve` (index 3)
  - `user` (index 7): Transaction signer/creator

### 2. Buy
- **Discriminator:** `[102, 6, 61, 18, 1, 218, 235, 234]`
- **Arguments:**
  - `amount` (u64): Number of tokens to buy
  - `max_sol_cost` (u64): Max SOL to spend
- **Accounts:**
  - `global` (index 0)
  - `fee_recipient` (index 1)
  - `mint` (index 2)
  - `bonding_curve` (index 3)
  - `associated_bonding_curve` (index 4)

### 3. Sell
- **Discriminator:** `[51, 230, 133, 164, 1, 127, 131, 173]`
- **Arguments:**
  - `amount` (u64): Number of tokens to sell
  - `min_sol_output` (u64): Minimum SOL to receive
- **Accounts:**
  - `global` (index 0)
  - `fee_recipient` (index 1)
  - `mint` (index 2)
  - `bonding_curve` (index 3)
  - `associated_bonding_curve` (index 4)

### 4. Collect Creator Fee
- **Discriminator:** `[20, 22, 86, 123, 198, 28, 219, 132]`
- **Arguments:** (none)
- **Accounts:**
  - `creator` (index 0)
  - `creator_vault` (index 1)
  - `system_program` (index 2)
  - `event_authority` (index 3)
  - `program` (index 4)

---

## 🏗 Architecture & How It Works

1. **Connection**: Establishes a Yellowstone gRPC streaming connection to Solana.
2. **Subscription**: Filters for Pump.fun program and all supported instruction discriminators.
3. **Instruction Parsing**: Decodes the instruction type and all associated arguments using Borsh and account index mapping.
4. **Data Extraction**: Resolves program accounts using account indices for each instruction type.
5. **Output Formatting**: Emits a structured JSON object for every detected instruction.

---

## 🧑‍💻 Example Output

```json
{
  "signature": "abc123...",
  "slot": "351135729",
  "instructionType": "create",
  "mint": "E41HLfWbcrWNWf8idDk4Ac1Jghcf2vKxAnekn2Appump",
  "bonding_curve": "DxHGkWPSDyToX61WawYHqscWYaaur9Ywtdhx7Gt1q7rb",
  "associated_bonding_curve": "3QY5FNLFNZUS47KpS8ZctE7X82MS6Bd7HMh6mDg9un2V",
  "user": "A2Xe6cErqHEeW1vZTRxcsFzRhGFoWFnuHqCxoU2H3AhP",
  "name": "Bitcoin Hyper",
  "symbol": "Hyper",
  "uri": "https://ipfs.io/ipfs/QmWxqrfKkAebJmUbvd6kRV8HKfyBCyPGijmR5i3Kx7jC4y",
  "creator": "A2Xe6cErqHEeW1vZTRxcsFzRhGFoWFnuHqCxoU2H3AhP"
}
```
- The `instructionType` field will be one of: `"create"`, `"buy"`, `"sell"`, `"collect_creator_fee"`
- For buy/sell, the JSON will include all parsed arguments and relevant accounts for that instruction.

---

## ⚙️ Configuration

- **ENV Variables:**
  - `ENDPOINT`: Yellowstone gRPC endpoint URL
  - `TOKEN`: Auth token (if needed)
- **Program ID:** `6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P` (Pump.fun)
- **Commitment Level:** `FINALIZED`

---

## 🧬 Technical Details

- **Dependencies:**
  - `@triton-one/yellowstone-grpc`: Solana gRPC client
  - `@solana/web3.js`: Solana SDK
  - `bs58`: Base58 encoding
  - `dotenv`: Env management
- **Instruction decoding** is performed with custom logic for Borsh structures and account index mapping.

---

## 🛡 Error Handling & Robustness

- Handles connection drops and stream errors with auto-reconnect.
- Validates and sanitizes parsed transaction data.
- Optimized to minimize memory usage and network overhead.

---

## 📝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a PR!

---

## 📄 License

[ISC License](LICENSE)

---

## ⚠️ Disclaimer

This tool is for educational and monitoring purposes only. Ensure compliance with relevant regulations when monitoring blockchain data.

---

## 🤝 Support

For issues and questions, please open an issue on GitHub or contact the maintainers.
