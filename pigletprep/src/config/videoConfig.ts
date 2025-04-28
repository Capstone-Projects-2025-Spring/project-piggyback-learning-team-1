interface VideoInteractions {
  MCQtimes: number[];
  ObjectTimes: number[];
  objectTargets?: Record<number, string>; // Maps timestamps to target objects
}

// Map of video IDs to their interaction timestamps
const videoConfigurations: Record<string, VideoInteractions> = {
  // Video about tigers
  'tigers': {
    MCQtimes: [36, 65, 84, 128, 163],
    ObjectTimes: [47, 106],
    objectTargets: {
      47: 'tiger',
      106: 'tiger'
    }
  },
  
  // Video about pandas
  'giant_pandas': {
    MCQtimes: [27, 50, 70, 101, 135, 149, 190, 234, 251],
    ObjectTimes: [86],
    objectTargets: {
        86: 'panda',
    }
  },
  
  
  'husky': {
    MCQtimes: [20, 60, 95, 120, 150, 180, 203],
    ObjectTimes: [27, 72],
    objectTargets: {
        27: 'dog',
        72: 'cat',
    }
  },

  'our_sun': {
    MCQtimes: [26, 49, 74, 102, 120],
    ObjectTimes: [35],
    objectTargets: {
        35: 'airplane',
    }
  },

  'australia': {
    MCQtimes: [29, 55, 75, 90],
    ObjectTimes: [44],
    objectTargets: {
        44: 'person',
    }
  },


  // Default configuration (fallback)
  'default': {
    MCQtimes: [20, 60, 120],
    ObjectTimes: [],
    objectTargets: {
    }
  }
};

// Function to get the configuration for a specific video
export function getVideoConfig(videoId: string): VideoInteractions {
  // Extract video name from the URL or path if needed
  const extractVideoName = (url: string): string => {
    try {
      // Try to get just the filename without extension
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1].split('?')[0];
      return lastPart.replace(/\.[^/.]+$/, ""); // Remove file extension if present
    } catch (error) {
        console.log("Error extracting video name:", error);
      return url;
    }
  };

  const videoName = extractVideoName(videoId);
  
  // Look for exact matches first
  for (const key of Object.keys(videoConfigurations)) {
    if (videoName.includes(key)) {
      return videoConfigurations[key];
    }
  }
  
  // Return default if no match found
  return videoConfigurations['default'];
}

export default videoConfigurations;