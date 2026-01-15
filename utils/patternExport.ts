import { Pattern } from '../types';

/**
 * Saves a pattern with a custom name using the best available method for the platform.
 * - Mobile: Uses Web Share API for native sharing experience
 * - Desktop: Falls back to standard download
 * 
 * @param pattern - The pattern data to save
 * @param fileName - Custom filename (without .json extension)
 */
export const savePatternWithName = async (
  pattern: Pattern,
  fileName: string
): Promise<void> => {
  const dataStr = JSON.stringify(pattern, null, 2);
  const file = new File([dataStr], `${fileName}.json`, {
    type: 'application/json'
  });

  // Try Web Share API first (primarily for mobile)
  if (navigator.share && navigator.canShare) {
    try {
      const canShareFiles = await navigator.canShare({ files: [file] });
      
      if (canShareFiles) {
        await navigator.share({
          title: 'NEXUS BEAT Pattern',
          text: `Sequencer pattern: ${fileName}`,
          files: [file]
        });
        return;
      }
    } catch (error: any) {
      // User cancelled the share dialog
      if (error.name === 'AbortError') {
        return;
      }
      // For other errors, fall through to download method
      console.warn('Share API failed, falling back to download:', error);
    }
  }

  // Fallback: Standard download method (Desktop or when Share API unavailable)
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
