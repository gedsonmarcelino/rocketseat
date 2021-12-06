import {
  Box,
  Img,
  Link,
  Modal,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentCard, setCurrentCard] = useState<Card | null>(null);

  function handleOpenModal(card: Card): void {
    setCurrentCard(card);
    onOpen();
  }

  return (
    <>
      <SimpleGrid columns={3} spacing={10}>
        {cards.map(card => (
          <Box
            borderRadius="lg"
            backgroundColor="pGray.800"
            onClick={() => handleOpenModal(card)}
            key={card.id}
          >
            <Img
              src={card.url}
              borderTopLeftRadius="lg"
              borderTopRightRadius="lg"
              alt={card.title}
            />
            <Text as="h1" fontWeight="bold" fontSize={24} px={3} pt={2}>
              {card.title}
            </Text>
            <Text as="p" fontSize={18} px={3} pb={2}>
              {card.description}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius="lg">
          <Img
            src={currentCard && currentCard.url}
            maxW={900}
            maxH={600}
            borderTopLeftRadius="lg"
            borderTopRightRadius="lg"
          />
          <Link
            href={currentCard && currentCard.url}
            color="white"
            backgroundColor="pGray.800"
            p="2"
            target="_blank"
          >
            Abrir original
          </Link>
        </ModalContent>
      </Modal>
    </>
  );
}
