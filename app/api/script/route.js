import { NextResponse } from "next/server";
import { minify } from 'terser';
import fs from 'fs/promises';
import path from 'path';
import Stripe from 'stripe';
import { db } from "../../../libs/firebaseConfig"
import { doc, getDoc } from "firebase/firestore";

import countries from 'i18n-iso-countries';
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

function getCountryNameOrCode(countryCode) {
  const manualOverrides = {
    'US': 'USA',
  };
  if (manualOverrides[countryCode]) {
    return manualOverrides[countryCode];
  }
  const aliasName = countries.getName(countryCode, "en", { select: "alias" });

  if (aliasName && !aliasName.includes(' ')) {
    return aliasName; 
  }
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
  // console.log(configDic);
  
  if (!configDic) return
  const stripe = new Stripe(configDic.stripeRestrictedApiKey);

  let transactionData = [];
  try {
    const charges = await stripe.charges.list({ limit: 15 });
    transactionData = charges.data.map(charge => ({
      message: `Someone in ${getCountryNameOrCode(charge.billing_details.address.country)} ${configDic.actionText}`,
      timeAgo: charge.created,
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
  const filePath = path.join(process.cwd(), 'public', 'scripts', 'NotificationPopup.min.js');

  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const modifiedJs = `var dataToPass = ${JSON.stringify(dataToPass)};\n${fileContent}`;

    // console.log(modifiedJs)
    const minifiedResult = await minify(modifiedJs, {
      format: {
        semicolons: false, 
      },
    });
    // const currentTime = new Date();
    // const updatedAt = configDic.updatedAt ? new Date(configDic.updatedAt.toMillis()) : null;
    // const timeDifference = updatedAt ? (currentTime - updatedAt) / (1000 * 60) : null; // Time difference in minutes

    const headers = {
      'Content-Type': 'application/javascript'
    };

    // if (timeDifference < 20) {
    //   headers['Cache-Control'] = 'public, max-age=0, must-revalidate';
    //   headers['Pragma'] = 'no-cache'
    // } else {
    //   headers['Cache-Control'] = 'public, s-maxage=3600, stale-while-revalidate=59';
    // }

    const response = new NextResponse(minifiedResult.code, { headers });

    return response;
  } catch (error) {
    console.error('Error minifying JavaScript:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
