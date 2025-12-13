import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const spreadsheetId = searchParams.get("spreadsheet_id");

  if (!spreadsheetId) {
    return NextResponse.json(
      { error: "spreadsheet_id is required" },
      { status: 400 }
    );
  }

  try {
    // Google Sheets CSV export URL
    const csvExportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=0`;

    // Fetch the CSV data
    const csvResponse = await fetch(csvExportUrl);

    if (!csvResponse.ok) {
      throw new Error(`Failed to fetch CSV: ${csvResponse.status}`);
    }

    const csvData = await csvResponse.text();

    // Return the CSV with proper headers to force download
    return new NextResponse(csvData, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="character-sheet.csv"`,
      },
    });
  } catch (error) {
    console.error("Error downloading CSV:", error);
    return NextResponse.json(
      { error: "Failed to download CSV file" },
      { status: 500 }
    );
  }
}

