import { Font, Html, Head, Tailwind, Button } from '@react-email/components';

export default function MagicLinkEmail({ url }: { url: string }) {
  return (
    <Html lang="en">
      <Head>
        <title>Sign in to Hyrox Tracker</title>
      </Head>
      <Font
        fontFamily="Arial"
        fallbackFontFamily="Arial"
        webFont={{
          url: 'https://assets.pandy.dev/fonts/BrutalType-Medium.woff2',
          format: 'woff2',
        }}
        fontWeight={500}
        fontStyle="normal"
      />
      <Tailwind>
        <div className="flex flex-col justify-center p-6 text-center">
          <h1 className="mb-2 text-xl font-semibold text-gray-900">Sign in to Hyrox Tracker</h1>
          <p className="mb-4 text-sm text-gray-600">
            Click the button below to securely sign in. This link will expire soon.
          </p>
          <Button
            href={url}
            className="place-content-center rounded-md border border-gray-900 bg-gray-900 px-4 py-3 text-base font-semibold text-white no-underline"
          >
            Sign in
          </Button>
          <p className="mt-4 text-xs text-gray-500">
            If you didn’t request this, you can safely ignore this email.
          </p>
        </div>
      </Tailwind>
    </Html>
  );
}
