"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { db } from "@/libs/firebaseConfig";
import { collection, addDoc, getDocs, query, setDoc, doc } from "firebase/firestore";
import { Dialog } from '@headlessui/react';
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const Home = () => {

  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', url: '' });

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  function transformUrlForId(url) {
    // Remove protocol, www, and trailing slashes
    let cleanUrl = url.replace(/^(?:https?:\/\/)?(?:www\.)?/, "").replace(/\/+$/, "");
    // Replace remaining slashes with underscores to prevent any directory-like structures in IDs
    cleanUrl = cleanUrl.replace(/\//g, '_');
    // Encode the string to ensure it is a safe Firestore document ID
    return encodeURIComponent(cleanUrl);
  }

  const handleCreateProject = async () => {
    if (!newProject.url || !newProject.name) {
      return toast.error('Please enter the name and url.')
    }
    const url = transformUrlForId(newProject.url);

    try {
      // Add a new document in collection "projects"
      const docRef = await addDoc(collection(db, "projects"), {
        name: newProject.name,
        url,
        uid: '',
        stripeRestrictedApiKey: '',
        backgroundColor: '#FFFFFF',
        accentColor: '#02ad78',
        borderColor: '#E0E0E0',
        textColor: '#374151',
        popupPosition: 'bottom-left',
        status: 'Incomplete',
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

  useEffect(() => {
    let isActive = true; // flag to check if the component is still mounted
  
    async function fetchProjects() {
      try {
        const querySnapshot = await getDocs(query(collection(db, "projects")));
        const projectsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        if (isActive) {
          setProjects(projectsArray);
          console.log('Projects fetched:', projectsArray);
        }
      } catch (error) {
        if (isActive) {
          console.error('Error fetching projects:', error);
        }
      }
    }
  
    fetchProjects().then(() => {
      if (isActive) {
        console.log('Projects fetch attempt completed');
      }
    }).catch(error => {
      if (isActive) {
        console.error('Error after fetching projects:', error);
      }
    });
  
    return () => {
      isActive = false; // Ensure the flag is updated when the component unmounts
    };
  }, []);

  // List display in the Home component
  return (
    <section className="">
      <Header home />
      <Toaster
        toastOptions={{
          duration: 3000,
        }}
      />
      <div className="bg-gray-100 min-h-screen ">
        <div className="container mx-auto p-4">

          <button onClick={openDialog} className="w-full border-[#02ad78] border-[1px] text-[#02ad78] p-3 rounded hover:bg-[#02ad78] hover:text-white my-6 mb-8">
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
    </section>
  );

};

export default Home;
