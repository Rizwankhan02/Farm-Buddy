import React from 'react';
import { 
  Container, 
  Alert, 
  AlertTitle, 
  Button, 
  Box, 
  Typography 
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

class ProfileErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('Profile component error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            <AlertTitle>Profile Loading Error</AlertTitle>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Something went wrong while loading the profile page.
            </Typography>
            
            {process.env.NODE_ENV === 'development' && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 1 }}>
                <Typography variant="caption" component="pre" sx={{ fontSize: '0.75rem' }}>
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </Typography>
              </Box>
            )}
            
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={this.handleRetry}
              sx={{ mt: 2 }}
            >
              Retry
            </Button>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ProfileErrorBoundary;
