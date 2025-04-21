
async function loadDependencies() {
  const fs = await import('fs');
  const path = await import('path');
  const { getSubtitles } = await import('youtube-captions-scraper');
  const { decode } = await import('html-entities');

  // Get the video IDs from your HomePage
  const videos = [
    { youtubeId: "dqT-UlYlg1s", title: "giant_pandas" },
    { youtubeId: "9ZyGSgeMnm4", title: "australia" },
    { youtubeId: "sePqPIXMsAc", title: "our_sun" },
    { youtubeId: "msAnR82kydo", title: "husky" },
    { youtubeId: "dOMAT8fOr0Q", title: "tigers" }
  ];

  // Create the transcripts directory if it doesn't exist
  const transcriptsDir = path.join(process.cwd(), 'public', 'transcripts');
  if (!fs.existsSync(transcriptsDir)) {
    fs.mkdirSync(transcriptsDir, { recursive: true });
  }

  async function downloadTranscript(videoId, title) {
    try {
      console.log(`Downloading transcript for "${title}" (${videoId})...`);
      
      // Get the transcript using youtube-captions-scraper
      let transcript = await getSubtitles({
        videoID: videoId,
        lang: 'en' // language
      });
      
      // Decode HTML entities in the transcript text
      transcript = transcript.map(entry => ({
        ...entry,
        text: decode(entry.text) // Decode HTML entities
      }));
      
      // Format the transcript with timestamps
      const formattedTranscript = transcript.map(entry => {
        const start = parseFloat(entry.start);
        const minutes = Math.floor(start / 60);
        const seconds = Math.floor(start % 60);
        const timestamp = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        return `[${timestamp}] ${entry.text}`;
      }).join('\n');
      
      // Save to file
      const filePath = path.join(transcriptsDir, `${title}.txt`);
      fs.writeFileSync(filePath, formattedTranscript);
      
      // Also save a JSON version with timestamps for programmatic access
      const jsonPath = path.join(transcriptsDir, `${title}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(transcript, null, 2));
      
      console.log(`Transcript saved for "${title}"`);
    } catch (error) {
      console.error(`Error downloading transcript for ${videoId}:`, error);
    }
  }

  async function downloadAllTranscripts() {
    for (const video of videos) {
      await downloadTranscript(video.youtubeId, video.title);
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('All transcripts downloaded successfully!');
  }

  await downloadAllTranscripts();
}

// Execute the main function
loadDependencies().catch(error => {
  console.error('Failed to load dependencies:', error);
  process.exit(1);
});