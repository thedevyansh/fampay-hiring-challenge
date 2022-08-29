import React from 'react';
import {
  Flex,
  Text,
  Image,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { FaYoutube } from 'react-icons/fa';
import he from 'he';

function Song({ data }) {
  const { title, thumbnails, channelTitle } = data;
  return (
    <Flex
      bg='#3e3d53'
      px={4}
      py={2}
      justify='space-between'
      alignItems='center'
      borderRadius='0.375rem'>
      <Flex alignItems='center'>
        <Image
          src={thumbnails.default.url}
          w='120px'
          h='90px'
          fallbackSrc='https://via.placeholder.com/120x90'
          alt='thumbnail'
        />
        <Flex ml='4' flexDir='column'>
          <Text fontWeight='bold'>{he.decode(title)}</Text>
          <HStack>
            <Icon as={FaYoutube} />
            <Text fontSize='sm'>{he.decode(channelTitle)}</Text>
          </HStack>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Song;
