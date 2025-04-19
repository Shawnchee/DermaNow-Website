import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contractAddress = searchParams.get('address');
  
  // Use server-side env variable (without NEXT_PUBLIC prefix)
  const apiKey = process.env.ETHERSCAN_API_KEY;

  console.log('API Key:', apiKey); // Log the API key for debugging (remove in production)

  
  if (!contractAddress) {
    return NextResponse.json({ error: 'Contract address is required' }, { status: 400 });
  }
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }
  
  try {
    const baseUrl = "https://api-sepolia.etherscan.io/api";
    const url = `${baseUrl}?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${apiKey}`;
    
    console.log(`Fetching transactions for ${contractAddress}`);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error(`Error response: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error(`Response body: ${text.substring(0, 200)}...`);
      return NextResponse.json({ 
        error: `Etherscan API error: ${response.status} ${response.statusText}` 
      }, { status: 500 });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from Etherscan:', error);
    return NextResponse.json({ error: 'Failed to fetch transaction data' }, { status: 500 });
  }
}