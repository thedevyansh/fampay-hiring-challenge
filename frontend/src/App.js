import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Center,
  ChakraProvider,
  Flex,
  SimpleGrid,
  Text,
  useToast,
} from '@chakra-ui/react';
import theme from './theme';
import SongSearch from './components/SongSearch';
import Song from './components/SongCard';
import * as songApi from './services/song';

function App() {
  const [songsList, setSongsList] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  const toast = useToast();

  const getPaginatedResponse = useCallback(async page => {
    const response = await songApi.paginatedSearch(page);
    const songs = response?.data?.videos ?? [];

    if (songs.length === 0) {
      toast({
        description: 'No more videos available.',
        status: 'error',
        duration: 10000,
      });
    }
    setSongsList(songs);
  }, [toast]);

  useEffect(() => {
    if (pageNumber > 0) {
      getPaginatedResponse(pageNumber);
    }
  }, [pageNumber, getPaginatedResponse]);

  const decrement = () => {
    setPageNumber(prevPage => prevPage - 1);
  };

  const increment = () => {
    setPageNumber(prevPage => prevPage + 1);
  };

  return (
    <ChakraProvider theme={theme}>
      <Center>
        <Box w='70%' m={4}>
          <Center>
            <Text fontSize='4xl'>FamPay Backend Challenge</Text>
          </Center>
          <SongSearch pageNumber={pageNumber} setPageNumber={setPageNumber} />
          <Flex mb={4} justify='end'>
            {pageNumber > 1 && (
              <Button
                colorScheme='blue'
                mr={3}
                size='sm'
                onClick={decrement}
                variant='outline'>
                Prev
              </Button>
            )}
            {songsList.length > 0 && (
              <Button
                colorScheme='blue'
                size='sm'
                onClick={increment}
                variant='outline'>
                Next
              </Button>
            )}
          </Flex>
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
