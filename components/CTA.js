import Image from "next/image";
import config from "@/config";

const CTA = () => {
  return (
    <section className="relative hero overflow-hidden pb-32 pt-32">
      <div className="relative hero-content text-center text-neutral-content md:py-16 bg-[#02ad78] md:px-24 px-8 mx-4 rounded-3xl">
        <div className="flex flex-col items-center max-w-xl p-8 md:p-0">
          <h2 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 md:mb-6">
            Increase your conversion rate instantly
          </h2>
          <p className="text-lg opacity-80 mb-12">
          Don't let your visitors leave without taking action.
          </p>

          <button className="btn btn-white btn-wide">
            Get {config.appName}
            <svg data-v-e8d572f6="" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="icon mr-1" width="1.3em" height="1.3em" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8z" clipRule="evenodd"></path>
          </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
