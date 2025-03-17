// robertweb/src/app/pridat/page.tsx

'use client';

import { useState, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { createPost } from '@/app/actions/posts';

export default function AddPostPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/prihlasenie');
    return null;
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Súbor je príliš veľký. Maximálna veľkosť je 5MB.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Prosím vyberte obrázok.');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Prosím vyberte obrázok.');
      return;
    }

    if (!session?.user?.id) {
      setError('Musíte byť prihlásený.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('caption', caption);
      formData.append('userId', session.user.id);

      const post = await createPost(formData);
      router.push('/prispevok'); // Just redirect to /prispevok without the second redirect
      router.refresh();
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Nepodarilo sa nahrať príspevok. Skúste to znova.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (status === 'loading') {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Pridať nový príspevok
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 3,
              mb: 3,
              textAlign: 'center',
              position: 'relative'
            }}
          >
            {preview ? (
              <Box sx={{ position: 'relative' }}>
                <Image
                  src={preview}
                  alt="Preview"
                  width={400}
                  height={400}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                />
                <IconButton
                  onClick={handleClearFile}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'background.paper'
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                />
                <Button
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Vybrať obrázok
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Podporované formáty: JPG, PNG, GIF (max. 5MB)
                </Typography>
              </>
            )}
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Popis"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              'Zdieľať príspevok'
            )}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}