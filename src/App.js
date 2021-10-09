import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Notes from './pages/Notes';
import Create from './pages/Create';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { fontWeight } from '@mui/system';

const theme = createTheme({
  typography: {
    fontFamily: 'Quicksand',
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },

  palette: {
    primary: {
      main: '#fefefe',
    },
    secondary: purple,
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path='/'>
            <Notes />
          </Route>
          <Route path='/create'>
            <Create />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
