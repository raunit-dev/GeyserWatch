export function printCleanTransaction(data: any, mintAuthority: string): void {
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

export function printCompactTransaction(data: any, mintAuthority: string): void {
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
