"use client";

import { useState, useRef } from "react";
import Image from "next/image";

// The features array is a list of features that will be displayed in the accordion.
// - title: The title of the feature
// - description: The description of the feature (when clicked)
// - type: The type of media (video or image)
// - path: The path to the media (for better SEO, try to use a local path)
// - format: The format of the media (if type is 'video')
// - alt: The alt text of the image (if type is 'image')
const features = [
  {
    title: "1. Customize your popup",
    description:
      "Change its colors, positon or text to fit your brand perfectly.",
    type: "video",
    path: "https://diw3djro0uevn.cloudfront.net/convert-popup/create+popup+1.mp4",
    format: "video/mp4",
    // svg: (
    //   <svg
    //     xmlns="http://www.w3.org/2000/svg"
    //     fill="none"
    //     viewBox="0 0 24 24"
    //     strokeWidth={1.5}
    //     stroke="currentColor"
    //     className="w-6 h-6"
    //   >
    //     <path
    //       strokeLinecap="round"
    //       strokeLinejoin="round"
    //       d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
    //     />
    //   </svg>
    // ),
  },
  {
    title: "2. Add to your site",
    description: "Copy and paste a small code snippet into your website. It works with any website, including WordPress, Shopify, Wix, Squarespace, and more.",
    type: "video",
    path: "https://diw3djro0uevn.cloudfront.net/convert-popup/script+video.mp4",
    format: "video/mp4",
    // svg: (
    //   <svg
    //     xmlns="http://www.w3.org/2000/svg"
    //     fill="none"
    //     viewBox="0 0 24 24"
    //     strokeWidth={1.5}
    //     stroke="currentColor"
    //     className="w-6 h-6"
    //   >
    //     <path
    //       strokeLinecap="round"
    //       strokeLinejoin="round"
    //       d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
    //     />
    //   </svg>
    // ),
  },
  {
    title: "3. Get more sales",
    description:
      "The popup will appear on your landing page and refresh every few hours, helping to significantly boost your conversion rate!",
    type: "video",
    path: "https://diw3djro0uevn.cloudfront.net/convert-popup/step3.mp4",
    format: "video/mp4",
    // svg: (
    //   <svg
    //     xmlns="http://www.w3.org/2000/svg"
    //     fill="none"
    //     viewBox="0 0 24 24"
    //     strokeWidth={1.5}
    //     stroke="currentColor"
    //     className="w-6 h-6"
    //   >
    //     <path
    //       strokeLinecap="round"
    //       strokeLinejoin="round"
    //       d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
    //     />
    //   </svg>
    // ),
  },
];

// An SEO-friendly accordion component including the title and a description (when clicked.)
const Item = ({ feature, isOpen, setFeatureSelected }) => {
  const accordion = useRef(null);
  const { title, description, svg } = feature;

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-medium text-left md:text-lg"
        onClick={(e) => {
          e.preventDefault();
          setFeatureSelected();
        }}
        aria-expanded={isOpen}
      >
        <span className={`duration-100 ${isOpen ? "text-primary" : ""}`}>
          {svg}
        </span>
        <span
          className={`flex-1 text-base-content ${isOpen ? "text-green-600 font-semibold" : ""
            }`}
        >
          <h3 className="inline">{title}</h3>
        </span>
        <span className="text-2xl">
          {isOpen ? '' : '+'}
        </span>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out text-base-content-secondary overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed pl-2">{description}</div>
      </div>
    </li>
  );
};

// A component to display the media (video or image) of the feature. If the type is not specified, it will display an empty div.
// Video are set to autoplay for best UX.
const Media = ({ feature }) => {
  const { type, path, format, alt } = feature;
  const style = "rounded-2xl w-full sm:w-[26rem] border-[1px] border-gray-100";
  const size = {
    width: 500,
    height: 500,
  };

  if (type === "video") {
    return (
      <video
        className={style}
        autoPlay
        muted
        loop
        playsInline
        controls
        width={size.width}
        height={size.height}
      >
        <source src={path} type={format} />
      </video>
    );
  } else if (type === "image") {
    return (
      <Image
        src={path}
        alt={alt}
        className={`${style} object-cover object-center`}
        width={size.width}
        height={size.height}
      />
    );
  } else {
    return <div className={`${style} !border-none`}></div>;
  }
};

// A component to display 2 to 5 features in an accordion.
// By default, the first feature is selected. When a feature is clicked, the others are closed.
const FeaturesAccordion = () => {
  const [featureSelected, setFeatureSelected] = useState(0);

  return (
    <section
      className="py-24 md:py-24 space-y-24 md:space-y-32 max-w-5xl mx-auto  "
      id="features"
    >
      <div className="px-8">
        <p className="text-lg text-bold opacity-80 leading-relaxed tracking-tight mb-3 md:mb-6 text-center text-[#02ad78]">How it works</p>
        <h2 className="font-extrabold text-2xl lg:text-4xl tracking-tight mb-12 md:mb-24 text-center">
          Increase your Sales with 3 Simple Steps
        </h2>
        <div className=" flex flex-col md:flex-row gap-12 md:gap-24">
          <div className="grid grid-cols-1 items-stretch gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
            <ul className="w-full">
              {features.map((feature, i) => (
                <Item
                  key={feature.title}
                  index={i}
                  feature={feature}
                  isOpen={featureSelected === i}
                  setFeatureSelected={() => setFeatureSelected(i)}
                />
              ))}
            </ul>

            <Media feature={features[featureSelected]} key={featureSelected} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesAccordion;
