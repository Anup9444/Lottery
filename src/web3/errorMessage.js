export const errorMessages = (error) => {
  if (error === null || error === undefined) {
    // Handle the case when error is null or undefined
    return "Unexpected error. Please try again later.";
  }

  const walletError = error;
  if (walletError["reason"]) {
    // runs when SmartContract reverts the transactions, when the connected user rejects the transaction from wallet and when arguments passed are incorrect
    const error = walletError.reason.replace("execution reverted: ", "");

    return error.charAt(0).toUpperCase() + error.slice(1);
  }

  if (
    walletError.data &&
    walletError.data.message &&
    walletError.data.code === "-32000"
  ) {
    // runs when connected user do not have enough gas fees to pay (Mostly occurs when payment is done through Native tokens)
    return "Insufficient Balance";
  }

  if (walletError.data && walletError.data.message) {
    console.log(3);

    return walletError.data.message;
  }

  if (walletError.code === "-32603") {
    return "Transaction underpriced. Increase gas limit and try again";
  }

  if (error && error.message) {
    return error.message;
  }

  return "Unexpected error. Please try again later.";
};

export default errorMessages;
