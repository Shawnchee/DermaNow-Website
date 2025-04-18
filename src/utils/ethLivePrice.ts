export async function EthereumLivePrice() {
  const response = await fetch('/api/eth-price');
  const data = await response.json();
  return data.price;
}