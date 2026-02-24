export interface Market {
  id: string;
  question: string;
  description: string;
  outcomes: string[];
  outcomePrices: string[];
  volume: string;
  image?: string;
}

/**
 * Fetches active trending markets from Polymarket Gamma API
 * Maps question to overlay and outcomePrices to odds
 */
export async function fetchTrendingMarkets(): Promise<Market[]> {
  try {
    const response = await fetch("https://gamma-api.polymarket.com/markets?active=true&limit=20&order=volume24hr&dir=desc");
    const data = await response.json();
    
    return data.map((m: any) => {
      let prices = ["0.5", "0.5"];
      try {
        if (m.outcomePrices) {
          prices = JSON.parse(m.outcomePrices);
        }
      } catch (e) {
        // Fallback if parsing fails
      }

      return {
        id: m.id,
        question: m.question,
        description: m.description,
        outcomes: m.outcomes ? JSON.parse(m.outcomes) : ["Yes", "No"],
        outcomePrices: prices,
        volume: m.volume,
        image: m.image || m.icon
      };
    });
  } catch (error) {
    console.error("Error fetching markets:", error);
    return [];
  }
}

