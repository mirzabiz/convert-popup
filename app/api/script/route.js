import { NextResponse } from "next/server";
import { minify } from 'terser';
import fs from 'fs/promises';
import path from 'path';
import Stripe from 'stripe';
import { db } from "../../../libs/firebaseConfig"
import { doc, getDoc } from "firebase/firestore";

import countries from 'i18n-iso-countries';
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

// This route serves minified JavaScript code to clients

function getCountryNameOrCode(countryCode) {
  const manualOverrides = {
    'US': 'USA',
  };

  // Check if there's a manual override first
  if (manualOverrides[countryCode]) {
    return manualOverrides[countryCode];
  }
  // Attempt to get the country name using the alias option
  const aliasName = countries.getName(countryCode, "en", { select: "alias" });

  // Check if the aliasName contains spaces, indicating it's more than one word
  if (aliasName && !aliasName.includes(' ')) {
    return aliasName; // Return the alias if it's a single word
  }

  // If the alias is not a single word, return the original ISO country code
  return countryCode;
}
export async function GET(req) {
  const projectId = req.nextUrl.searchParams.get('projectId');
  console.log('Project ID:', projectId);

  let configDic = {};

  try {
    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return new NextResponse(null, { status: 404, statusText: 'Project Not Found' });
    }

    configDic = docSnap.data();
  } catch (error) {
    console.error('Error fetching project data:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  console.log(configDic)
  if (!configDic) return
  const stripe = new Stripe(configDic.stripeRestrictedApiKey);

  let transactionData = [];
  try {
    const charges = await stripe.charges.list({ limit: 15 });
    transactionData = charges.data.map(charge => ({
      message: `Someone in ${getCountryNameOrCode(charge.billing_details.address.country)} ${configDic.actionText}`,
      timeAgo: charge.created, // You'll convert this on client-side to "time ago" format
      verified: charge.paid,
    }));
  } catch (error) {
    console.error('Error fetching transactions from Stripe:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch transactions' }), { status: 500 });
  }

  

  const dataToPass = {
    transactionData,
    configDic
  }
  // Set the path to the file you want to serve
  const filePath = path.join(process.cwd(), 'public', 'scripts', 'NotificationPopup.min.js');

  try {
    // Read the file content asynchronously
    const fileContent = await fs.readFile(filePath, 'utf8');

    // Embed transaction data into the JavaScript
    const modifiedJs = `var dataToPass = ${JSON.stringify(dataToPass)};\n${fileContent}`;

    // console.log(modifiedJs)
    // Minify the content using Terser
    const minifiedResult = await minify(modifiedJs, {
      format: {
        semicolons: false, // optional, remove semicolons to reduce size
      },
    });

    // Create a NextResponse object and set the appropriate headers
    const response = new NextResponse(minifiedResult.code, {
      headers: {
        'Content-Type': 'application/javascript'
      }
    });

    return response;
  } catch (error) {
    console.error('Error minifying JavaScript:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
