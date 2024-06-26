'use client';
import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import SetupAvatar from '../ui/SetupAvatar';
import { generateThumbnail } from '../utils/generateThumbnail';

export default function Page() {
  const { address } = useAccount();
  const [avatar, setAvatar] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [glbUrl, setGlbUrl] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const router = useRouter();

  const handleOnAvatarExported = (url: string) => {
    setGlbUrl(url);
  };

  const handleCreateAvatar = async () => {
    if (!glbUrl || !address) return;
    setLoading(true);

    try {
      const generatedImageUrl = await generateThumbnail(glbUrl);
      setImageUrl(generatedImageUrl);
      await finalizeCreation(generatedImageUrl);
    } catch (error) {
      console.error('Error creating avatar:', error);
    } finally {
      setLoading(false);
    }
  };

  const finalizeCreation = useCallback(async (imageUrl: string) => {
    if (!imageUrl || !glbUrl || !address) return;

    const attributes = await generateAttributes();

    const { data, error } = await supabase
      .from('avatars')
      .insert([{ owner: address, attributes, glb_url: glbUrl, image_url: imageUrl }]);

    if (error) {
      console.error(error);
    } else {
      setAvatar(data && data[0]);
    }
  }, [glbUrl, address]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg p-4 bg-white rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center mb-4 text-primary-dark">Create Your Avatar</h1>
        <SetupAvatar onAvatarExported={handleOnAvatarExported} />
        <button
          onClick={handleCreateAvatar}
          disabled={!glbUrl || loading}
          className="bg-secondary text-primary-dark py-2 px-4 rounded mb-4 flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-3 text-primary-dark"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Creating...
            </>
          ) : (
            'Create Avatar'
          )}
        </button>
      </motion.div>
      {avatar && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center w-full max-w-lg p-4 bg-white rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-bold mb-2">Avatar Created</h2>
          <Image
            src={avatar.image_url}
            alt="Avatar"
            sizes="500px"
            style={{ width: '100%', height: 'auto' }}
            width={200}
            height={200}
            className="rounded-md mb-4"
          />
          <pre className="text-left bg-gray-100 p-2 rounded-md">{JSON.stringify(avatar.attributes, null, 2)}</pre>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-primary-dark text-primary-light py-2 px-4 rounded mt-4"
          >
            Go to Dashboard
          </button>
        </motion.div>
      )}
    </div>
  );
}

async function generateAttributes() {
  return { hair: 'brown', eyes: 'blue', outfit: 'casual' };
}
