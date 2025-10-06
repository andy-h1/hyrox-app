import * as React from 'react';
import { Html, Button } from '@react-email/components';

export default function MagicLinkEmail({ url }: { url: string }) {
  return (
    <Html lang="en">
      <div
        style={{
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <h2 style={{ color: '#111827' }}>Sign in</h2>
        <Button
          href={url}
          style={{
            display: 'inline-block',
            fontSize: 16,
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 6,
            padding: '10px 16px',
            border: '1px solid #111827',
            backgroundColor: '#111827',
            fontWeight: 600,
          }}
        >
          Sign in
        </Button>
      </div>
    </Html>
  );
}
