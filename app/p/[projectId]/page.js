"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import { ChromePicker } from 'react-color';
import NotificationUI from "@/components/NotificationUI";
import DeleteProjectDialog from "@/components/DeleteProjectDialog";
import { useParams } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/libs/firebaseConfig';
import toast, { Toaster } from "react-hot-toast";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation';
import Stripe from "stripe";
import { ClipLoader } from "react-spinners";

const ProjectDetails = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId;

  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#374151');
  const [accentColor, setAccentColor] = useState('#02ad78');
  const [borderColor, setBorderColor] = useState('#E0E0E0');
  const [popupPosition, setPopupPosition] = useState('bottom-left');
  const [actionText, setActionText] = useState('ordered');
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showPicker, setShowPicker] = useState({ bg: false, text: false, accent: false, border: false });
  const [apiKey, setApiKey] = useState('');
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeStatus, setActiveStatus] = useState(null);



  const bgRef = useRef(null);
  const textRef = useRef(null);
  const accentRef = useRef(null);
  const borderRef = useRef(null);

  const scriptUrl =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:3000/api/script?projectId=${projectId}`
      : `https://convertpopup.co/api/script?projectId=${projectId}`;

  const handleCopy = async () => {
    const baseUrl = process.env.NODE_ENV === 'production' ? 'https://convertpopup.co' : 'http://localhost:3000';
    const scriptText = `<script src="${baseUrl}/api/script?projectId=${projectId}"></script>`;
    try {
      await navigator.clipboard.writeText(scriptText);
      toast.success('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy to clipboard');
    }
  };
  // Function to toggle visibility
  const togglePicker = (color) => {
    setShowPicker({ ...showPicker, [color]: !showPicker[color] });
  };

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const toggleKeyVisibility = () => {
    setIsKeyVisible(!isKeyVisible);
  };

  const saveApiKey = async () => {
    if (!apiKey) {
      alert('Please enter your Stripe restricted API key.');
      return;
    }
    const stripe = new Stripe(apiKey)

    try {
      await stripe.balance.retrieve();
      const projectRef = doc(db, 'projects', projectId);
      await setDoc(projectRef, {
        stripeRestrictedApiKey: apiKey,
        status: 'Active'
      }, { merge: true });
      setActiveStatus('Active');
      setIsEditing(false);
      setIsKeyVisible(false);
      toast.success('API key saved successfully!')
    } catch (error) {
      if (error.type === 'StripeAuthenticationError') {
        toast.error('Invalid Stripe Restricted API Key. Please make sure the key is valid.');
      } else {
        toast.error('Failed to save API key.');
      }
      console.log(error)
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setIsKeyVisible(true); // Make key visible when editing
  };

 

  useEffect(() => {
    const fetchProjects = async (user, projectId) => {
      if (projectId) {
        setLoading(true);
        try {
          const docRef = doc(db, 'projects', projectId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const projectData = docSnap.data();
            if (projectData.uid === user.uid) {
              setProject(projectData);
              setPopupPosition(projectData.popupPosition);
              setActionText(projectData.actionText || 'ordered');
              setActiveStatus(projectData.status);
              setIsEditing(!projectData.stripeRestrictedApiKey);
              setApiKey(projectData.stripeRestrictedApiKey);
              setBackgroundColor(projectData.backgroundColor || '#ffffff');
              setTextColor(projectData.textColor || '#374151');
              setAccentColor(projectData.accentColor || '#02ad78');
              setBorderColor(projectData.borderColor || '#E0E0E0');
            } else {
              console.log('Project does not belong to user');
              toast.error('You do not have permission to view this project');
              router.push('/')
            }
            // console.log('Project data:', projectData);
          } else {
            console.log('No such project!');
          }
        } catch (error) {
          console.error('Error fetching project:', error);
  
        } finally {
          setLoading(false);
        }
      }
    }
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('User is signed in', user, projectId);
        await fetchProjects(user, projectId);
      } else {
        // User is signed out
        console.log('User is signed out');
        toast.error('You are not logged in');
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [projectId, router]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!bgRef.current.contains(event.target)) setShowPicker((prev) => ({ ...prev, bg: false }));
      if (!textRef.current.contains(event.target)) setShowPicker((prev) => ({ ...prev, text: false }));
      if (!accentRef.current.contains(event.target)) setShowPicker((prev) => ({ ...prev, accent: false }));
      if (!borderRef.current.contains(event.target)) setShowPicker((prev) => ({ ...prev, border: false }));
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  // Reset function
  const resetColors = () => {
    if (project) {
      setBackgroundColor(project.backgroundColor || '#ffffff');
      setTextColor(project.textColor || '#374151');
      setAccentColor(project.accentColor || '#02ad78');
      setBorderColor(project.borderColor || '#E0E0E0');
    }
  };
  const saveThemeSettings = async () => {
    const projectRef = doc(db, "projects", projectId); // Reference to the Firestore document

    const themeSettings = {
      backgroundColor,
      textColor,
      accentColor,
      borderColor
    };

    try {
      await setDoc(projectRef, themeSettings, { merge: true });
      toast.success("Theme settings saved successfully!");
    } catch (error) {
      console.error("Error saving theme settings:", error);
      toast.error("Failed to save theme settings.");
    }
  };
  const savePreferences = async () => {
    const projectRef = doc(db, "projects", projectId); // Reference to the Firestore document

    const preferences = {
      popupPosition,
      actionText
    };

    try {
      // Using setDoc with { merge: true } to update only the specified fields
      await setDoc(projectRef, preferences, { merge: true });
      toast.success("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <ClipLoader color="#111" size={50} />
    </div>;
  }

  if (!project) {
    return <div className="flex justify-center items-center min-h-screen">No project found :(</div>;
  }
  return (
    <section className="">
      <Header home hasAccess />
      <div className="bg-gray-100 min-h-screen ">
        <Toaster
            toastOptions={{
              duration: 3000,
            }}
          />
        <NotificationUI
          backgroundColor={backgroundColor}
          accentColor={accentColor}
          borderColor={borderColor}
          textColor={textColor}
          popupPosition={popupPosition}
          actionText={actionText}
        />
        <DeleteProjectDialog projectId={projectId} isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />

        <div className="container mx-auto max-w-3xl pt-12">
          <div className="mx-6 lg:mx-auto">
            <div className="flex justify-between items-center mb-10 ">
              <h1 className="text-3xl font-bold ">{project.url}</h1>
              <span className={`${(activeStatus == 'Active') ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"} text-xs font-bold px-2 py-1 rounded-full`}>
                {activeStatus}
              </span>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-400">Installation</h2>
              <label className="block text-sm font-bold mb-2">
                Add this script
              </label>
              <div className={apiKey ? "" : "blur-sm"}>
                <div className="md:flex items-center justify-center mb-2">
                  <div className="bg-gray-200 rounded p-2 flex-grow md:mb-0 mb-2 md:max-w-[600px] lg:max-w-[660px]">
                    <code className="text-sm block overflow-x-auto text-nowrap">&lt;script src="{scriptUrl}"&gt;&lt;/script&gt;</code>
                  </div>
                  <button onClick={apiKey ? handleCopy : null} className="text-white md:ml-2 md:mt-0 mt-2 text-sm bg-[#02ad78] hover:bg-green-500 font-bold py-2 px-4 rounded md:w-auto ">
                    Copy
                  </button>
                </div>
              </div>
              {!apiKey && (
                <p className="text-red-500 text-sm">Please add your Stripe API key in the Integrations section before proceeding.</p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-400">Integrations</h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Stripe API key
                </label>
                <input
                  type={isKeyVisible ? 'text' : 'password'}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  placeholder="Enter your Stripe restricted API key"
                  readOnly={!isEditing}
                />
              </div>
              <p className="text-gray-600 text-sm mb-6">
                Create a <a href="https://dashboard.stripe.com/apikeys/create?name=ConvertPopup&permissions%5B%5D=rak_charge_read&permissions%5B%5D=rak_balance_read" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline">Stripe restricted API key</a>. ⚠️ DO NOT change any permissions.
              </p>
              <div className="flex items-center space-x-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={toggleKeyVisibility}
                      className="bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm"
                    >
                      {isKeyVisible ? 'Hide' : 'Show'}
                    </button>
                    <button
                      className="text-white bg-[#02ad78] hover:bg-green-500 font-bold py-2 px-4 rounded text-sm"
                      onClick={saveApiKey}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={toggleKeyVisibility}
                      className="bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm"
                    >
                      {isKeyVisible ? 'Hide' : 'Show'}
                    </button>
                    <button
                      className="bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm"
                      onClick={startEditing}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Theme Section */}
            <div className="relative bg-white rounded-lg shadow-lg p-6 mt-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-400">Theme</h2>

              {/* Background Color Picker */}
              <div className="mb-4" ref={bgRef}>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Background color
                </label>
                <div className="h-10 w-full rounded mb-2 cursor-pointer border-[1px]" style={{ backgroundColor }} onClick={() => togglePicker('bg')}></div>
                {showPicker.bg && (
                  <div className="absolute">
                    <ChromePicker
                      disableAlpha={true}
                      color={backgroundColor}
                      onChangeComplete={(color) => setBackgroundColor(color.hex)}
                    />
                  </div>
                )}
              </div>

              {/* Text Color Picker */}
              <div className="mb-4" ref={textRef}>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Text color
                </label>
                <div className="h-10 w-full rounded mb-2 cursor-pointer border-[1px]" style={{ backgroundColor: textColor }} onClick={() => togglePicker('text')}></div>
                {showPicker.text && (
                  <div className="absolute">
                    <ChromePicker
                      disableAlpha={true}
                      color={textColor}
                      onChangeComplete={(color) => setTextColor(color.hex)}
                    />
                  </div>
                )}
              </div>

              {/* Accent Color Picker */}
              <div className="mb-4" ref={accentRef}>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Accent color
                </label>
                <div className="h-10 w-full rounded mb-2 cursor-pointer border-[1px]" style={{ backgroundColor: accentColor }} onClick={() => togglePicker('accent')}></div>
                {showPicker.accent && (
                  <div className="absolute">
                    <ChromePicker
                      disableAlpha={true}
                      color={accentColor}
                      onChangeComplete={(color) => setAccentColor(color.hex)}
                    />
                  </div>
                )}
              </div>

              {/* Border Color Picker */}
              <div className="mb-4" ref={borderRef}>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Border color
                </label>
                <div className="h-10 w-full rounded mb-2 cursor-pointer border-[1px]" style={{ backgroundColor: borderColor }} onClick={() => togglePicker('border')}></div>
                {showPicker.border && (
                  <div className="absolute">
                    <ChromePicker
                      disableAlpha={true}
                      color={borderColor}
                      onChangeComplete={(color) => setBorderColor(color.hex)}
                    />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <button className="text-gray-600 border rounded p-2 hover:bg-gray-100" onClick={resetColors}>
                  Reset
                </button>
                <button onClick={saveThemeSettings} className="text-white bg-[#02ad78] hover:bg-green-500 font-bold py-2 px-4 rounded">
                  Save
                </button>
              </div>
            </div>

            {/* {Prefrence section} */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6 mt-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-400">Preferences</h2>

              <div className="mb-4">
                <label htmlFor="popup-position" className="block text-sm font-bold text-gray-700 mb-2">
                  Popup position
                </label>
                <select
                  id="popup-position"
                  className="block appearance-none cursor-pointer border border-gray-300 w-full bg-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-gray-200"
                  value={popupPosition}
                  onChange={(e) => setPopupPosition(e.target.value)}
                >
                  <option value="bottom-right">Bottom-Right</option>
                  <option value="bottom-left">Bottom-Left</option>
                  <option value="top-right">Top-Right</option>
                  <option value="top-left">Top-Left</option>
                  {/* Add other positions as needed */}
                </select>
                <label htmlFor="popup-position" className="block text-sm font-bold text-gray-700 mb-2 mt-4">
                  Action
                </label>
                <select
                  className="block appearance-none cursor-pointer border border-gray-300 w-full bg-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-gray-200"
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                >
                  <option value="ordered">ordered</option>
                  <option value="subscribed">subscribed</option>
                  <option value="purchased">purchased</option>
                </select>
              </div>


              <div className="flex justify-end mt-4">
                <button onClick={savePreferences} className="text-white bg-green-500 hover:bg-green-700 font-bold py-2 px-4 rounded">
                  Save
                </button>
              </div>
            </div>
            <div
              onClick={() => setIsDialogOpen(true)}
              className="border-[1px] border-red-400 text-center text-red-400 p-2 rounded-md cursor-pointer hover:bg-gray-200">
              Delete project
            </div>


            <div className="pb-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetails;
