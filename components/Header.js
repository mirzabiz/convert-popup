"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "@/app/icon.png";
import config from "@/config";
import ButtonAccount from "./ButtonAccount";
import LoginDialog from "./LoginDialog";
import ButtonGradient from "./ButtonGradient";
import AppsumoDialog from "./AppsumoDialog";

const links = [
  {
    href: "/#pricing",
    label: "Pricing",
  },
  {
    href: "/#faq",
    label: "FAQ",
  },
];




// A header with a logo on the left, links in the center (like Pricing, etc...), and a CTA (like Get Started or Login) on the right.
// The header is responsive, and on mobile, the links are hidden behind a burger button.
const Header = ({ home, user, hasAccess, openPricingDialog, landing, customerId }) => {

  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [loginDialog, setLoginDialog] = useState(false)
  const [appsumoDialog, setAppsumoDialog] = useState(false);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    // router.push('/home')
    window.location.assign(href)
  };


  // setIsOpen(false) when the route changes (i.e: when the user clicks on a link on mobile)
  const cta = user ? <div className='bg-[#02ad78] px-5 py-1 rounded-md text-white hover:bg-[#02ad77e9] hover:text-white cursor-pointer'>
    <div onClick={(e) => handleLinkClick(e, '/home')}> Your Projects </div>
  </div> : <div onClick={() => setLoginDialog(true)}
    className='border-[#02ad78] border-[1px] px-5 py-1 rounded-md text-[#02ad78] hover:bg-[#02ad78] hover:text-white cursor-pointer'>
    Login
  </div>;
  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  return (
    <header className={`${landing && 'bg-[#e9f5f0]'}`}>
      <nav
        className="container flex items-center justify-between px-8 py-4 mx-auto"
        aria-label="Global"
      >
        <LoginDialog isOpen={loginDialog}
          onClose={() => setLoginDialog(false)} />
        <AppsumoDialog isOpen={appsumoDialog} onClose={() => setAppsumoDialog(false)} />

        {/* Your logo/name on large screens */}
        <div className="flex lg:flex-1">
          <Link
            className="flex items-center gap-2 shrink-0 "
            href="/"
            title={`${config.appName} hompage`}
          >
            <Image
              src={logo}
              alt={`${config.appName} logo`}
              className="w-8"
              placeholder="blur"
              priority={true}
              width={32}
              height={32}
            />
            <span className="font-extrabold text-lg">{config.appName}</span>
          </Link>
        </div>
        {/* Burger button to open menu on mobile */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setIsOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-base-content"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        {/* Your links on large screens */}
        {!home && <div className="hidden lg:flex lg:justify-center lg:gap-12 lg:items-center">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="link link-hover"
              title={link.label}
            >
              {link.label}
            </Link>
          ))}
        </div>}

        {/* CTA on large screens */}
        {!home ? <div className="hidden lg:flex lg:justify-end lg:flex-1">{cta}</div>
          : <div className="hidden lg:flex lg:justify-end lg:flex-1">
            {!hasAccess && <div onClick={() => setAppsumoDialog(true)} className="hidden lg:flex lg:justify-end lg:mr-8 cursor-pointer items-center hover:underline">Appsumo code</div>}
            {hasAccess ? <Link href="/home" className="hidden lg:flex lg:justify-end lg:mr-8 cursor-pointer items-center hover:underline">Projects</Link>
              : <ButtonGradient styles="mr-4" title="Upgrade" onClick={openPricingDialog} />}
            {/* <div className="hidden lg:flex lg:justify-end lg:mr-8 cursor-pointer hover:underline">Settings</div> */}
            <ButtonAccount user={user} hasAccess={hasAccess} customerId={customerId} />
          </div>}
      </nav>

      {/* Mobile menu, show/hide based on menu state. */}
      <div className={`relative z-50 ${isOpen ? "" : "hidden"}`}>
        <div
          className={`fixed inset-y-0 right-0 z-10 w-full px-8 py-4 overflow-y-auto bg-base-200 sm:max-w-sm sm:ring-1 sm:ring-neutral/10 transform origin-right transition ease-in-out duration-300`}
        >
          {/* Your logo/name on small screens */}
          <div className="flex items-center justify-between">
            <Link
              className="flex items-center gap-2 shrink-0 "
              title={`${config.appName} hompage`}
              href="/"
            >
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                className="w-8"
                placeholder="blur"
                priority={true}
                width={32}
                height={32}
              />
              <span className="font-extrabold text-lg">{config.appName}</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5"
              onClick={() => setIsOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Your links on small screens */}
          {!home ? <div className="flow-root mt-6">
            <div className="py-4">
              <div className="flex flex-col gap-y-4 items-start">
                {links.map((link) => (
                  <Link
                    href={link.href}
                    key={link.href}
                    className="link link-hover"
                    title={link.label}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="divider"></div>
            {/* Your CTA on small screens */}
            <div className="flex flex-col">{cta}</div>
          </div> : <div className="flow-root mt-6">
            <div className="py-4">
              {!hasAccess && <div onClick={() => setAppsumoDialog(true)} className="flex flex-col gap-y-4 items-start cursor-pointer hover:underline pt-4">Appsumo code</div>}
              <Link href={"/home"} className="flex flex-col gap-y-4 items-start cursor-pointer hover:underline py-4">Projects</Link>
              <ButtonAccount user={user} hasAccess={hasAccess} customerId={customerId} />
              {/* <div className="flex flex-col gap-y-4 mt-4 items-start cursor-pointer hover:underline">Settings</div> */}
            </div>
            <div className="divider"></div>
          </div>}


        </div>
      </div>
    </header>
  );
};

export default Header;
