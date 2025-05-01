import { useVisibilityProtection } from "@/hooks/use-visibility-protection";

/**
 * A component that prevents unwanted navigation when the browser window is minimized and restored
 * This is used at the App level to ensure it works for all routes
 */
const VisibilityProtection = () => {
  // Use the visibility protection hook
  useVisibilityProtection();
  
  // This component doesn't render anything
  return null;
};

export default VisibilityProtection;
