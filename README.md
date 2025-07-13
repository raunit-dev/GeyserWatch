# Pump.fun Real-Time Transaction Monitor

This project provides a real-time monitoring solution for transactions on the Pump.fun platform, leveraging the power of Triton One's Yellowstone Geyser plugin for Solana. It allows users to subscribe to and decode buy and sell transactions for any token listed on Pump.fun, providing a live feed of token activity.

## Features

- **Real-Time Monitoring:** Utilizes gRPC streams to receive live transaction data from a Solana Geyser plugin.
- **Targeted Filtering:** Filters transactions to specifically capture buy and sell events related to pre-configured mint authorities on the Pump.fun platform.
- **Data Decoding:** Decodes raw transaction data to extract meaningful information, including instruction types, token amounts, and associated accounts.
- **Structured Output:** Presents the decoded transaction data in a clean, readable format.
- **Scalable Architecture:** The codebase is structured into modular components for clarity and maintainability, separating concerns for client interaction, stream management, data handling, and configuration.

## Tech Stack

- **Node.js & TypeScript:** The core application is built on the Node.js runtime with TypeScript for type safety and improved developer experience.
- **gRPC:** Communication with the Yellowstone Geyser plugin is handled through gRPC, enabling efficient, high-performance data streaming.
- **@triton-one/yellowstone-grpc:** The official client library for interacting with the Yellowstone Geyser gRPC interface.
- **@solana/web3.js:** Used for interacting with Solana-specific data structures and converting public keys.

## How It Works

The application establishes a gRPC connection to a Solana node equipped with the Yellowstone Geyser plugin. It then subscribes to a stream of transaction updates, with filters applied to only receive transactions relevant to the Pump.fun program and a specified list of mint authorities.

When a new transaction is received, the application performs the following steps:

1.  **Filters by Instruction:** It inspects the transaction's instructions to identify whether it's a buy or sell event by matching instruction discriminators.
2.  **Decodes Data:** The raw instruction data is decoded to extract arguments like the amount of tokens being bought or sold and the corresponding SOL cost or output.
3.  **Formats and Prints:** The decoded information is then formatted into a compact, human-readable output and printed to the console, providing a real-time feed of activity.

## Future Development: Migrating to Rust

To achieve even greater performance and reliability, this project will soon be migrated to Rust. The move to Rust will offer several advantages:

-   **Enhanced Speed:** Rust's performance characteristics are ideal for high-throughput data processing, which is critical when dealing with real-time blockchain data.
-   **Memory Safety:** Rust's ownership model guarantees memory safety without the need for a garbage collector, reducing the likelihood of bugs and security vulnerabilities.
-   **Concurrency:** Rust provides robust support for concurrent programming, allowing for more efficient handling of multiple data streams.

This transition will ensure the project remains a powerful and reliable tool for monitoring the fast-paced environment of the Pump.fun platform.

## Project Setup

To get the project up and running, follow these steps:

1.  **Clone the Repository:**

    ```bash
    git clone <repository-url>
    cd pump-fun-data-parsing-yellostone-gRPC
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Set Up Environment Variables:**

    Create a `.env` file in the root of the project by copying the example file:

    ```bash
    cp .env.example .env
    ```

    Open the `.env` file and add the following environment variables:

    ```
    ENDPOINT="your-geyser-endpoint-url"
    PUMP_FUN_MINT_AUTHORITY_DOG="your-dog-mint-authority-pubkey"
    PUMP_FUN_MINT_AUTHORITY_BTK="your-btk-mint-authority-pubkey"
    PUMP_FUN_MINT_AUTHORITY_LOST="your-lost-mint-authority-pubkey"
    PUMP_FUN_MINT_AUTHORITY_GROWTH="your-growth-mint-authority-pubkey"
    PUMP_FUN_MINT_AUTHORITY_STANDARD="your-standard-mint-authority-pubkey"
    ```

    Replace the placeholder values with your actual Geyser endpoint and the public keys of the mint authorities you want to monitor.

4.  **Build the Project:**

    ```bash
    npm run build
    ```

5.  **Run the Application:**

    ```bash
    npm start
    ```

Once running, the application will start printing real-time buy and sell transactions to the console for the configured mint authorities.