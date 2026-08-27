import { NextResponse } from "next/server";

type WorldBankObservation = {
  countryiso3code: string;
  date: string;
  value: number | null;
};

const regions = [
  { code: "USA", label: "United States" },
  { code: "CHN", label: "China" },
  { code: "IND", label: "India" },
  { code: "JPN", label: "Japan" },
  { code: "DEU", label: "Germany" }
] as const;

async function latestIndicator(country: string, indicator: string) {
  const url = `https://api.worldbank.org/v2/country/${country}/indicator/${indicator}?format=json&per_page=12&mrnev=12`;
  const response = await fetch(url, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(7000) });
  if (!response.ok) throw new Error(`World Bank request failed with ${response.status}`);
  const payload = (await response.json()) as [unknown, WorldBankObservation[] | undefined];
  return payload[1]?.find((observation) => observation.value !== null) ?? null;
}

export async function GET() {
  try {
    const values = await Promise.all(
      regions.map(async (region) => {
        const [gdp, inflation] = await Promise.all([
          latestIndicator(region.code, "NY.GDP.MKTP.CD"),
          latestIndicator(region.code, "FP.CPI.TOTL.ZG")
        ]);
        return {
          ...region,
          gdp: gdp?.value ?? null,
          gdpYear: gdp?.date ?? null,
          inflation: inflation?.value ?? null,
          inflationYear: inflation?.date ?? null
        };
      })
    );

    return NextResponse.json({ source: "World Bank Open Data", status: "live", updatedAt: new Date().toISOString(), values });
  } catch (error) {
    return NextResponse.json(
      {
        source: "World Bank Open Data",
        status: "unavailable",
        message: error instanceof Error ? error.message : "Live data is temporarily unavailable",
        values: []
      },
      { status: 503 }
    );
  }
}

