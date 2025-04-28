import DetectLabels from "./DetectLabels";

export default function VideoToMCQPage() {
  const defaultPreferences = {
    enableOD: true,
    subjects: ["Animals"],
    penaltyOption: "rewind"
  };

  return <DetectLabels videoSrc="/path-to-video.mp4" preferences={defaultPreferences} />;
}
