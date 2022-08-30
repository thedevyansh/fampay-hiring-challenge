import React from 'react';
import { Button, Flex, Text } from '@chakra-ui/react';

function SongSearch({ pageNumber, setPageNumber }) {
  const handleClick = () => {
    setPageNumber(1);
  };

  return (
    <Flex mt='50px' mb='30px' alignItems='center'>
      <Button colorScheme='blue' onClick={handleClick}>
        GET /
      </Button>
      {pageNumber > 0 && (
        <Text
          ml={4}
          fontSize='lg'>{`/api/song/paginatedSearch?page=${pageNumber}`}</Text>
      )}
    </Flex>
  );
}

export default SongSearch;
