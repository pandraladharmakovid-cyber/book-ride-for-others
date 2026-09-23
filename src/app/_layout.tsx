import { useEffect } from 'react';

import { Stack, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    /*
     * Handles a RideLink URL when the app is already running.
     */
    const handleIncomingUrl = ({
      url,
    }: {
      url: string;
    }) => {
      if (!url.startsWith('ridelink://')) {
        return;
      }

      /*
       * For now, route the user to the location screen.
       *
       * The actual location extraction will be implemented
       * in the next step.
       */
      router.push('/location');
    };

    const subscription =
      Linking.addEventListener(
        'url',
        handleIncomingUrl,
      );

    /*
     * Handles a RideLink URL that launched
     * the application from a closed state.
     */
    const checkInitialUrl = async () => {
      const initialUrl =
        await Linking.getInitialURL();

      if (
        initialUrl &&
        initialUrl.startsWith(
          'ridelink://',
        )
      ) {
        router.push('/location');
      }
    };

    checkInitialUrl();

    return () => {
      subscription.remove();
    };
  }, [router]);

  return (
    <>
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false,

          contentStyle: {
            backgroundColor: '#0B0D10',
          },

          animation:
            'slide_from_right',
        }}
      />
    </>
  );
}