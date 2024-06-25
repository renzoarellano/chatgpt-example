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
      icon: FiSun,
      name: "Consultar",
      list: [
        "¿Cuáles son las normas de seguridad?",
        "¿Cuáles son los identificativos personales?",
      ],
    },
    {
      icon: FiZap,
      name: "Refinar",
      list: [
        "La idea de mi proyecto es la siguiente,",
        "Quiero implementar tarjeta biométrica en el banco, ¿qué consideraciones debo tener en cuenta?",
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
      <Heading size="lg" marginY={8}>
        GenIA
      </Heading>
      <Stack direction={["column", "column", "row"]}>
        {introdution.map(({ icon, list, name }, key) => {
          return (
            <Stack key={key} alignItems="center">
              <Icon as={icon} />
              <Heading size="sm">{name}</Heading>
              {list.map((text, key) => (
                <Button
                  key={`${key}-${text.length}-${key}`}
                  maxWidth={64}
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
