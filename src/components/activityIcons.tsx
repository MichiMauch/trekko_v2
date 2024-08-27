import React from 'react';
import { FaHiking, FaRunning, FaBiking } from 'react-icons/fa';

// Definiere die Standardgröße der Icons als Konstante
const defaultIconSize = 36;

export const getIconForActivity = (type: string, size: number = defaultIconSize) => {
  switch (type) {
    case 'hiking':
      return <FaHiking size={size} />;
    case 'running':
      return <FaRunning size={size} />;
    case 'cycling':
      return <FaBiking size={size} />;
    // Weitere Aktivitätstypen und ihre entsprechenden Icons
    default:
      return null;
  }
};
