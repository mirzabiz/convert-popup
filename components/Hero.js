import Image from "next/image";
import config from "@/config";
import Link from "next/link";

const Hero = () => {
  return (
    <main className="text-center py-[140px] bg-[#e9f5f0]">
      <div className="mb-4 ">
        <span className="flex items-center justify-center text-xs text-gray-400 mb-2">
          Powered by
          <Image className="inline-block ml-[1px]" src="/stripe_long.webp" width={50} height={25} alt="Stripe" />
        </span>
      </div>
      <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center">

        <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4 max-w-[830px]">
          Give your visitors a reason to buy today,
          <span className="bg-[#02ad78] text-neutral-content px-2 md:px-4 ml-1 md:ml-1.5 leading-relaxed whitespace-nowrap">
            not tomorrow
          </span>
        </h1>
        <p className="text-lg opacity-80 leading-relaxed">
          {/* Let your customers generate, edit, and download Stripe<br />invoices, so you don’t have to. */}
          Increase your sales easily by showing recent transactions in<br /> a popup users will trust — It's the fastest way to boost your sales!

        </p>
        <Link href="/#pricing" className="btn btn-wide bg-[#02ad78] text-white rounded-[64px] hover:bg-[#02ad77c3] flex items-center justify-center">
          <svg data-v-e8d572f6="" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="icon mr-1" width="1.3em" height="1.3em" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8z" clipRule="evenodd"></path>
          </svg>
          Get {config.appName}
        </Link>
        {/* <TestimonialsAvatars priority /> */}
      </div>

      <div className="flex text-sm items-center text-gray-500 justify-center pt-[24px]">
          <i className="fas fa-gift text-green-500 mr-2"></i>
          <span className="text-green-500 font-bold">$50 off</span>
          <span className="ml-1">for the first 49 customers</span>
          {/* <span className="ml-1">(10 left)</span> */}
        </div>
    </main>
  );
};

export default Hero;
