import themes from "daisyui/src/theming/themes";

const config = {
  // REQUIRED
  appName: "ConvertPopup",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Popups that increase your conversion rate",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "convertpopup.co",
  appColor: '#02ad78',
  stripe: {
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    plans: [
      {
        // REQUIRED — we use this to find the plan in the webhook (for instance if you want to update the user's credits based on the plan)
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1PE0GiKNCmrJ2pYgHz8sHyRW" // real prouction price 
            : "price_1PIh8PKNCmrJ2pYgciDNNgqn",
        //  REQUIRED - Name of the plan, displayed on the pricing page
        name: "Starter",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "Perfect for one website",
        // The price you want to display, the one user will be charged on Stripe.
        price: 29,
        // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
        priceAnchor: 79,
        features: [
          {
            name: "One year of access",
          },
          { name: "1 website" },
          { name: "Customize popups" },
        ],
      },
      {
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: true,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1PIcwiKNCmrJ2pYgqZ2Re3QW"
            : "price_1PIh8SKNCmrJ2pYgyAhIhHkc",
        name: "All-in",
        description: "Ideal for multiple sites",
        price: 47,
        priceAnchor: 97,
        features: [
          {
            name: "One year of access",
          },
          { name: "Unlimited websites" },
          { name: "Customize popups" },
        ],
      },
    ],
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "assets-786",
    bucketUrl: `https://assets-786.s3.amazonaws.com/convert-popup/`,
    cdn: "https://diw3djro0uevn.cloudfront.net/convert-popup/",
  },
  mailgun: {
    supportEmail: "mirzabiz2000@gmail.com",
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you any other theme than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
    theme: "emerald",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
    main: themes["emerald"]["primary"],
    
  },
  auth: {
    callbackUrl: '/home'
  }
};

export default config;
