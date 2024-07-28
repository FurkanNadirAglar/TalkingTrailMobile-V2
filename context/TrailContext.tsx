import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types for the context values
interface TrailContextType {
  shortName: string | null;
  setShortName: React.Dispatch<React.SetStateAction<string | null>>;
  downloadedTrails: any[]; // Replace `any` with a more specific type if possible
  setDownloadedTrails: React.Dispatch<React.SetStateAction<any[]>>; // Replace `any[]` with a more specific type if possible
}

// Create the context with a default value of `undefined`
export const TrailContext = createContext<TrailContextType | undefined>(undefined);

interface TrailProviderProps {
  children: ReactNode;
}

export const TrailProvider: React.FC<TrailProviderProps> = ({ children }) => {
  const [shortName, setShortName] = useState<string | null>(null);
  const [downloadedTrails, setDownloadedTrails] = useState<any[]>([]); // Replace `any[]` with a more specific type if possible

  useEffect(() => {
    const loadDownloadedTrails = async () => {
      try {
        const savedTrails = await AsyncStorage.getItem('downloadedTrails');
        if (savedTrails) {
          setDownloadedTrails(JSON.parse(savedTrails));
        }
      } catch (error) {
        console.error('Failed to load downloaded trails:', error);
      }
    };

    loadDownloadedTrails();
  }, []);

  useEffect(() => {
    const saveDownloadedTrails = async () => {
      try {
        await AsyncStorage.setItem('downloadedTrails', JSON.stringify(downloadedTrails));
      } catch (error) {
        console.error('Failed to save downloaded trails:', error);
      }
    };

    saveDownloadedTrails();
  }, [downloadedTrails]);

  return (
    <TrailContext.Provider value={{ shortName, setShortName, downloadedTrails, setDownloadedTrails }}>
      {children}
    </TrailContext.Provider>
  );
};
