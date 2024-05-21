"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { db } from "@/libs/firebaseConfig";
import { collection, addDoc, getDocs, query, setDoc, doc, where, getDoc } from "firebase/firestore";
import { Dialog } from '@headlessui/react';
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Suspense } from 'react'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Pricing from "@/components/Pricing";
import BetterIcon from "@/components/BetterIcon";
import { ClipLoader } from "react-spinners";
import apiClient from "@/libs/api";


const Home = () => {

  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pricingDialog, setPricingDialog] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', url: '' });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState(null);
  const [planName, setPlanName] = useState(null);

  const closeDialog = () => setIsDialogOpen(false);
  const openPricingDialog = () => setPricingDialog(true)

  function transformUrlForId(url) {
    // Remove protocol, www, and trailing slashes
    let cleanUrl = url.replace(/^(?:https?:\/\/)?(?:www\.)?/, "").replace(/\/+$/, "");
    // Replace remaining slashes with underscores to prevent any directory-like structures in IDs
    cleanUrl = cleanUrl.replace(/\//g, '_');
    // Encode the string to ensure it is a safe Firestore document ID
    return encodeURIComponent(cleanUrl);
  }
  const checkUserAccess = async (currUser) => {
    if (!currUser) {
      setHasAccess(false);
      return;
    }

    const userDocRef = doc(db, "users", currUser.uid);
    setLoading(true)
    try {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists() && docSnap.data().hasAccess) {
        setHasAccess(true);
        setPlanName(docSnap.data().planName);
      } else {
        setHasAccess(false);
        setPricingDialog(true)
      }
    } catch (error) {
      console.error('Error checking access:', error);
      setHasAccess(false);
    } finally {
      setLoading(false)
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.url || !newProject.name) {
      return toast.error('Please enter the name and url.')
    }
    const url = transformUrlForId(newProject.url);

    if (planName === 'Starter' && projects.length >= 1) {
      toast.error('Upgrade your plan to add more projects. Redirecting to the billing portal...');
      // Redirect to customer portal for upgrading the plan
      try {
        const { url } = await apiClient.post("/stripe/create-portal", {
          returnUrl: window.location.href,
          customerId,
        });
  
        window.location.href = url;
      } catch (error) {
        console.error("Error creating portal session: ", error);
        toast.error('Failed to redirect to the billing portal.');
      }
      return;
    }
    try {
      // Add a new document in collection "projects"
      const docRef = await addDoc(collection(db, "projects"), {
        name: newProject.name,
        url,
        uid: user.uid,
        stripeRestrictedApiKey: '',
        backgroundColor: '#FFFFFF',
        accentColor: '#02ad78',
        borderColor: '#E0E0E0',
        textColor: '#374151',
        popupPosition: 'bottom-left',
        status: 'Incomplete',
        actionText: 'ordered',
        updatedAt: new Date(),
        createdAt: new Date()  // Store the creation date
      });
      await setDoc(doc(db, "websites", url), {
        url,
        createdAt: new Date(),
      }, { merge: true });
      setIsDialogOpen(false);
      router.push(`/p/${docRef.id}`)
    } catch (e) {
      console.error("Error adding document: ", e);
      toast.error('Failed to create the project. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  async function fetchProjects(currUser) {
    try {
      console.log('users', currUser)
      const q = query(collection(db, "projects"), where("uid", "==", currUser.uid));
      const querySnapshot = await getDocs(q);
      const projectsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsArray);
      console.log('Projects fetched:', projectsArray);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }



  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('User is signed in', user);
        setUser(user);
        await fetchProjects(user)
        await checkUserAccess(user)

        const uid = user.uid;
        const userDoc = doc(db, 'users', uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setCustomerId(userData.customerId);
        } else {
          console.log('No such document!');
        }
      } else {
        // User is signed out 
        console.log('User is signed out');
        toast.error('You are not loggedin')
        router.push('/')
        setUser(null);
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [router]);



  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <ClipLoader color="#111" size={50} />
    </div>;
  }

  return (
    <Suspense>
      <section className="">
        <Header home user={user} hasAccess={hasAccess} openPricingDialog={openPricingDialog} customerId={customerId} />
        <Toaster
          toastOptions={{
            duration: 3000,
          }}
        />
        <div className="bg-gray-100 min-h-screen ">
          <div className="container mx-auto p-4">

            <button onClick={async () => {
                if (!hasAccess) {
                  setPricingDialog(true);
                  return;
                }
                if (planName === 'Starter' && projects.length >= 1) {
                  toast.error('Upgrade your plan to add more projects. Redirecting to the billing portal...');
                  // Redirect to customer portal for upgrading the plan
                  try {
                    const { url } = await apiClient.post("/stripe/create-portal", {
                      returnUrl: window.location.href,
                      customerId,
                    });
              
                    window.location.href = url;
                  } catch (error) {
                    console.error("Error creating portal session: ", error);
                    toast.error('Failed to redirect to the billing portal.');
                  }
                  return;
                }
                setIsDialogOpen(true);
            }} className="w-full border-[#02ad78] border-[1px] text-[#02ad78] p-3 rounded hover:bg-[#02ad78] hover:text-white my-6 mb-8">
              Create a new project
            </button>
            <div className="space-y-4">
              {projects.map(project => (
                <Link key={project.id} href={`/p/${project.id}`}
                  className="flex justify-between items-center bg-white p-5 shadow rounded cursor-pointer">
                  <div>
                    <h3 className="font-semibold  text-[18px] ">{project.name}</h3>
                    <p className="text-gray-500 text-[12px]">{project.url}</p>
                  </div>
                  <span className={`${(project.status == 'Active') ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"} text-xs font-bold px-2 py-1 rounded-full`}>
                    {project.status}
                  </span>
                </Link>
              ))}
            </div>

            {isDialogOpen && (
              <Dialog open={isDialogOpen} onClose={closeDialog} className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen fixed inset-0 bg-black bg-opacity-60">
                  <Dialog.Panel className="max-w-md p-4 bg-white rounded shadow mx-8">
                    <Dialog.Title className="text-lg font-bold text-center mb-4">New Project</Dialog.Title>
                    <input
                      className="mt-2 w-full p-2 border rounded"
                      placeholder="Project Name"
                      value={newProject.name}
                      onChange={handleInputChange}
                      name="name"
                    />
                    <input
                      className="mt-2 w-full p-2 border rounded"
                      placeholder="Project URL"
                      value={newProject.url}
                      onChange={handleInputChange}
                      required
                      name="url"
                    />
                    <div className="flex justify-end space-x-2 mt-4">
                      <button onClick={closeDialog} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                      <button onClick={handleCreateProject} className="bg-[#02ad78] text-white px-4 py-2 rounded">Create</button>
                    </div>
                  </Dialog.Panel>
                </div>
              </Dialog>
            )}
          </div>
        </div>
        {pricingDialog && (
          <Dialog open={pricingDialog} onClose={() => setPricingDialog(false)} className="fixed inset-0 z-[20] bg-black bg-opacity-60 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen ">
              <Dialog.Panel className="bg-[#e9f5f0] rounded shadow">
                <Dialog.Title>
                  <BetterIcon onClick={() => setPricingDialog(false)}>
                    <div className="text-slate-500">X</div>
                  </BetterIcon>
                </Dialog.Title>
                <Dialog.Description className="flex items-center justify-center px-[32px]">

                  <Pricing user={user} dialog={true} />
                </Dialog.Description>
                {/* Subscription handling elements go here */}
              </Dialog.Panel>
            </div>
          </Dialog>

        )}
      </section>
    </Suspense>
  );

};

export default Home;
