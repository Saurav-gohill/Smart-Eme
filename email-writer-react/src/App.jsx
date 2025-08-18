import { useState } from 'react'
import './App.css'
import { Box, Container, FormControl, InputLabel, Select, TextField, Typography, MenuItem, Button, CircularProgress, Card, CardContent, Paper, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try{
      const response = await axios.post("http://localhost:8081/api/example/generate", {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    }catch(error){
      setError('Failed to generate reply. Please try again.');
      console.error('Error generating reply:', error);
    }finally{
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Card elevation={6} sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', boxShadow: 6 }}>
        <CardContent>
          <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ fontWeight: 700, color: '#1976d2', letterSpacing: 1 }}>
            Email Writer
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 3, color: '#555' }}>
            Generate smart email replies with your preferred tone
          </Typography>
          <Box sx={{mx: 1, my: 2}}>
            <TextField
              fullWidth
              multiline
              rows={6}
              variant='outlined'
              label='Original Email Content'
              value={emailContent || ''}
              onChange={(e) => setEmailContent(e.target.value)}
              sx={{mb: 2, background: '#fff', borderRadius: 2}}
            />
            <FormControl fullWidth sx={{mb: 2, background: '#fff', borderRadius: 2}}>
              <InputLabel> Tone (Optional)</InputLabel>
              <Select
                value={tone || ''}
                label="Tone (Optional)"
                onChange={(e) => setTone(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="funny">Funny</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!emailContent || loading}
              fullWidth
              size="large"
              sx={{ py: 1.5, fontWeight: 600, fontSize: 18, borderRadius: 2, boxShadow: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Reply'}
            </Button>
          </Box>
          {error && (
            <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
              <Alert severity="error" onClose={() => setError('')} sx={{ width: '100%' }}>
                {error}
              </Alert>
            </Snackbar>
          )}
          {generatedReply && (
            <Paper elevation={3} sx={{ mt: 4, p: 2, background: '#f9fafb', borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
                Generated Reply
              </Typography>
              <TextField 
                fullWidth
                multiline
                rows={6}
                variant='outlined'
                label='Generated Reply'
                value={generatedReply || ''}
                inputProps={{ readOnly: true }}
                sx={{ background: '#fff', borderRadius: 2 }}
              />
              <Button variant='outlined' 
                sx={{ mt: 2, borderRadius: 2, fontWeight: 600 }}
                onClick={() => navigator.clipboard.writeText(generatedReply)}
                startIcon={<span className="material-icons">content_copy</span>}
              >
                Copy to Clipboard
              </Button>
            </Paper>
          )}
        </CardContent>
      </Card>
    </Container>
  )
}

// export default App
