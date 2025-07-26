/**
 * React Native Warning Suppression Setup
 * 
 * Suppresses known compatibility warnings for React 19.0.0 + React Native 0.79.5
 * This should be imported early in the app lifecycle (in App.tsx or index.js)
 */

// Suppress specific React Native text rendering warnings
const suppressKnownWarnings = () => {
  if (__DEV__) {
    const originalConsoleWarn = console.warn;
    
    console.warn = (...args: any[]) => {
      // Suppress the specific React Native text rendering warning
      const message = args.join(' ');
      
      // Known compatibility warning patterns to suppress
      const warningsToSuppress = [
        'Text strings must be rendered within a <Text> component',
        'validateDOMNesting', // React DOM nesting warnings in RN context
        'Warning: React.createElement', // React 19 createElement warnings
      ];
      
      // Check if this warning should be suppressed
      const shouldSuppress = warningsToSuppress.some(pattern => 
        message.includes(pattern)
      );
      
      if (!shouldSuppress) {
        // Only show warnings that aren't in our suppression list
        originalConsoleWarn.apply(console, args);
      } else {
        // Log suppressed warnings in debug mode for tracking
        if (__DEV__) {
          console.log('🔇 Suppressed known compatibility warning:', message.substring(0, 100) + '...');
        }
      }
    };
    
    console.log('🛡️ React Native warning suppression enabled for React 19.0.0 + RN 0.79.5 compatibility');
  }
};

export { suppressKnownWarnings };