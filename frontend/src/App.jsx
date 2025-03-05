import React from 'react';
import {Box, createTheme, CssBaseline, GlobalStyles, ThemeProvider} from "@mui/material";
import {Toaster} from "react-hot-toast";
import {Route, Routes} from "react-router-dom";
import Protected from "./service/Protected";
import {Login} from "./pages";
import Headers from "./components/Headers.jsx";
import useAuthStore from "./state/authStore.js";
import {Register} from "./pages/";
import Projects from "./pages/Projects/Projects.jsx";


const App = () => {
    const theme = createTheme({});
    const isAuthenticated = useAuthStore((state)=>state.isAuthenticated);
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles styles={{ html: { scrollBehavior: 'smooth' } }} />
            <Toaster />
            <CssBaseline />
            {isAuthenticated && <Headers />}
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
                    <Routes>
                        <Route path="/" element={<Protected />}>
                            <Route path="/" element={<Projects/>} />
                        </Route>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default App;