import { useState } from 'react';
import {
  Box,
  Center,
  ChakraProvider,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import theme from './theme';
import SongSearch from './components/SongSearch';
import Song from './components/SongCard';

function App() {
  const [loading, setLoading] = useState(false);
  const [songsList, setSongsList] = useState([]);

  return (
    <ChakraProvider theme={theme}>
      <Center>
        <Box w='70%' m={4}>
          <Center>
            <Text fontSize='4xl'>FamPay Backend Challenge</Text>
          </Center>
          <SongSearch setLoading={setLoading} setSongsList={setSongsList} />
          {loading && (
            <Text fontSize='xl' fontWeight='bold' mb='20px'>
              Loading...
            </Text>
          )}
          <SimpleGrid id='scrollable' minChildWidth='364px' spacing={5}>
            {songsList.map((song, index) => (
              <Song key={index} data={song} />
            ))}
          </SimpleGrid>
        </Box>
      </Center>
    </ChakraProvider>
  );
}

export default App;
