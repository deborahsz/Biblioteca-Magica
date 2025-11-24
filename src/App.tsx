import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Details from './pages/Details';
import Sobre from "./pages/Sobre";

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box
} from '@mui/material';

function App() {
  return (
    <Router>
      {/* LAYOUT PRINCIPAL */}
      <Box sx={{ minHeight: '100vh', bgcolor: '#f7f7f7' }}>
        
        {/* HEADER COM MUI */}
        <AppBar position="static" color="primary" elevation={3}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              ✨ Biblioteca Mágica ✨
            </Typography>

            {/* Navegação */}
            <Box>
              <Button
                component={Link}
                to="/"
                color="inherit"
                sx={{ mr: 2 }}
              >
                Início
              </Button>

              <Button
                component={Link}
                to="/sobre"
                color="inherit"
              >
                Sobre
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* CONTEÚDO PRINCIPAL */}
        <Container sx={{ py: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book/:id" element={<Details />} />
            <Route path="/sobre" element={<Sobre />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
