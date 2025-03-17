'use client';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Image from 'next/image';

interface StoryUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File, caption: string) => Promise<void>;
}

export default function StoryUploadDialog({ open, onClose, onUpload }: StoryUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsLoading(true);
      setError(null);
      await onUpload(selectedFile, caption);
      handleClose();
    } catch (err) {
      console.error('Error uploading story:', err);
      setError('Nepodarilo sa nahrať príbeh. Skúste to znova.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setCaption('');
    setError(null);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          Pridať príbeh
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box
          sx={{
            width: '100%',
            aspectRatio: '9/16',
            bgcolor: 'grey.100',
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            mb: 2
          }}
        >
          {preview ? (
            <Image
              src={preview}
              alt="Story preview"
              fill
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <Button
              variant="outlined"
              startIcon={<AddPhotoAlternateIcon />}
              onClick={() => fileInputRef.current?.click()}
            >
              Vybrať obrázok
            </Button>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
        </Box>

        <TextField
          fullWidth
          label="Popis príbehu"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          multiline
          rows={2}
          sx={{ mb: 2 }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Zrušiť
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Zdieľať príbeh'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 