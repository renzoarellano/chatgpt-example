import { Stack, Heading, Icon, Button, Text } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { FiAlertTriangle, FiSun, FiZap } from "react-icons/fi";
import { useChat } from "@/store/chat";

type Introdution = {
  icon: IconType;
  name: "Consultar" | "Refinar";
  list: string[];
};

export interface IInstructionsProps {
  onClick: (text: string) => void;
}

export const Instructions = ({ onClick }: IInstructionsProps) => {
  const { setQuestion, setQueryPerChat, selectedChat } = useChat();
  console.log("selectedChatInstruccion", selectedChat);
  const introdution: Introdution[] = [
    {
      icon: FiZap,
      name: "Refinar",
      list: [
        "La idea de mi proyecto es la siguiente,",
      ],
    },
  ];

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      height="full"
      overflow="auto"
    >
      <Heading size="2xl" marginY={8}>
        GenIA
      </Heading>
      <Heading as='h3' size='xl'>Hoy es un buen día para refinar</Heading>
      <Stack direction={["column", "row"]}>
        {introdution.map(({ icon, list, name }, key) => {
          return (
            <Stack key={key} alignItems="center">
              <Icon as={icon} />
              <Heading size="sm">{name}</Heading>
              {list.map((text, key) => (
                <Button
                  key={`${key}-${text.length}-${key}`}
                  maxWidth={80}
                  height="fit-content"
                  padding={4}
                  onClick={() => {
                    onClick(text);
                    setQuestion(true);
                    setQueryPerChat(selectedChat.id, "PROJECT REFINEMENT");
                  }}
                >
                  <Text overflow="hidden" whiteSpace="normal">
                    {text}
                  </Text>
                </Button>
              ))}
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};
