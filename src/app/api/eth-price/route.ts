export async function GET(req: Request) {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=myr';

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': process.env.COINGECKO_API_KEY, 
        },
    };

    try {
        const response = await fetch(url, options);
        console.log("Fetching Ethereum live price from CoinGecko...");
        console.log("Response:", response);

        // Check if the response is OK
        if (!response.ok) {
            console.error("Error fetching from CoinGecko:", response.statusText);
            return new Response(JSON.stringify({ error: "Failed to fetch from CoinGecko" }), {
                status: response.status,
                headers: { "Content-Type": "application/json" },
            });
        }

        const data = await response.json();
        console.log("Ethereum live price:", data.ethereum.myr);
        return new Response(JSON.stringify({ price: data.ethereum.myr }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching Ethereum live price:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch Ethereum live price." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}