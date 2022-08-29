import React, { useState } from 'react';
import {
  Icon,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Button,
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import * as songApi from '../../services/song';

function SongSearch({ setSongsList }) {
  const [localQuery, setLocalQuery] = useState('');

  const searchSongs = async query => {
    const response = await songApi.search(query);
    // const finalResponse = { query, videos: response?.data?.videos ?? [] };
    const songs = response?.data?.videos ?? [];

    setSongsList(songs);
  };

  const handleEnter = e => {
    if (e.key === 'Enter') {
      searchSongs(e.target.value);
    }
  };

  const handleClickSearch = () => {
    searchSongs(localQuery);
  };

  return (
    <InputGroup mt='50px' mb='50px'>
      <InputLeftElement
        pointerEvents='none'
        children={<Icon as={FaSearch} color='#8F8F8F' />}
      />
      <Input
        value={localQuery}
        onChange={e => setLocalQuery(e.target.value)}
        onKeyDown={handleEnter}
        placeholder='Search for songs on YouTube.'
        _placeholder={{ color: 'white' }}
      />
      <InputRightElement width='5.5rem'>
        <Button
          colorScheme='blue'
          h='2rem'
          size='sm'
          onClick={handleClickSearch}>
          Search
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

export default SongSearch;
