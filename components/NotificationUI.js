import React from 'react';

const NotificationUI = ({ backgroundColor, accentColor, borderColor, textColor, popupPosition, actionText }) => {
  

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  // Get the current position class
  const currentPositionClass = positionClasses[popupPosition] || positionClasses['bottom-right'];

  return (
    <div className={`fixed ${currentPositionClass} z-20`}>
      <div className="flex items-center justify-between border rounded-lg p-4 shadow-sm bg-white w-[270px] h-[75px]"
        style={{ backgroundColor: backgroundColor, borderColor: borderColor }}>
        <div className="flex flex-col">
          <span className="text-sm" style={{ color: accentColor }}>Someone in <span className='font-semibold'>USA</span> {actionText}</span>
          <span className="flex items-center text-[12px] text-gray-500 mt-[1px]" style={{ color: textColor }}>
            3 days ago <span className="text-[8px] mx-[3px]">|</span> <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="icon mr-1" style={{ marginRight: "2px", verticalAlign: "middle", width: "14px", height: "14px" }} viewBox="0 0 24 24" data-v-e8d572f6="">
              <path fill={accentColor} fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0a11.2 11.2 0 0 1-7.877 3.08a.75.75 0 0 0-.722.515A12.7 12.7 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348c0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08m3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094z"></path>
            </svg> Verified
            {/* by  */}
            {/* <img className="inline-block" src="/stripe_long.webp" width={40} height={15} alt="Stripe" /> */}
          </span>
        </div>
      </div>
    </div>

  );
};

export default NotificationUI;
