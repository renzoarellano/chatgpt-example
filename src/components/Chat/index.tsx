//Modules
import gptAvatar from "@/assets/gpt-avatar.svg";
import robot from "@/assets/robot.png";
import warning from "@/assets/warning.svg";
import user from "@/assets/user.png";
import { useRef, useState } from "react";
import { useChat } from "@/store/chat";
import { useForm } from "react-hook-form";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useMutation } from "react-query";

//Components
import { Input } from "@/components/Input";
import { FiSend, FiMail } from "react-icons/fi";
import {
  Avatar,
  IconButton,
  Spinner,
  Stack,
  Text,
  Button,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import { Instructions } from "../Layout/Instructions";
import { useAPI } from "@/store/api";
import { query } from "@/services/query";

export interface ChatProps {}

interface ChatSchema {
  input: string;
}

export const Chat = ({ ...props }: ChatProps) => {
  const { api } = useAPI();
  const {
    selectedChat,
    addMessage,
    addChat,
    editChat,
    setQuestion,
    isQuestion,
  } = useChat();
  const selectedId = selectedChat?.id,
    selectedRole = selectedChat?.role;

  const hasSelectedChat = selectedChat && selectedChat?.content.length > 0;

  const { register, setValue, handleSubmit } = useForm<ChatSchema>();

  const overflowRef = useRef<HTMLDivElement>(null);
  const updateScroll = () => {
    overflowRef.current?.scrollTo(0, overflowRef.current.scrollHeight);
  };

  const [parentRef] = useAutoAnimate();

  const { mutate, isLoading } = useMutation({
    mutationKey: "prompt",
    mutationFn: async (prompt: string) => {
      try {
        if (api) {
          const response = await fetch(api, {
            method: "post",
            body: `{ "inputText": "${prompt}",
           "sessionId": '${sessionStorage.getItem("sessionId")}',
          "queryType": '${selectedChat.query}'}`,
          });
          const data = await response.json();
          return data;
        }
        return;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleAsk = async ({ input: prompt }: ChatSchema) => {
    updateScroll();
    const sendRequest = (selectedId: string) => {
      setValue("input", "");

      addMessage(selectedId, {
        emitter: "user",
        message: prompt,
      });

      mutate(prompt, {
        onSuccess({ statusCode, body }, variable) {
          if (statusCode === 200) {
            const message = String(body);
            addMessage(selectedId, {
              emitter: "gpt",
              message,
            });

            if (
              selectedRole == "Nueva conversación" ||
              selectedRole == undefined
            ) {
              editChat(selectedId, { role: variable });
            }
          }
          updateScroll();
        },
        onError(error) {
          type Error = {
            response: {
              data: {
                error: {
                  code: "invalid_api_key" | string;
                  message: string;
                };
              };
            };
          };

          const { response } = error as Error,
            message = response.data.error.message;
          addMessage(selectedId, {
            emitter: "error",
            message,
          });
          updateScroll();
        },
      });
    };

    if (selectedId) {
      if (prompt && !isLoading) {
        sendRequest(selectedId);
      }
    } else {
      console.log("Crear nuevo chat");
      console.log("isQuestion", isQuestion);
      if (isQuestion) {
        addChat(sendRequest, "PROJECT REFINEMENT");
        setQuestion(false);
      } else {
        addChat(sendRequest);
      }
    }
  };
  function decodeUnicode(str: string) {
    return str.replace(/\\u[\dA-F]{4}/gi, function (match) {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
    });
  }

  return (
    <Stack width="full" height="full">
      <Stack
        maxWidth="1024px"
        width="full"
        marginX="auto"
        height="85%"
        overflow="auto"
        ref={overflowRef}
      >
        <Stack spacing={2} padding={2} ref={parentRef} height="full">
          {hasSelectedChat ? (
            selectedChat.content.map(({ emitter, message }, key) => {
              const getAvatar = () => {
                switch (emitter) {
                  case "gpt":
                    return robot;
                  case "error":
                    return warning;
                  default:
                    return user;
                }
              };

              return (
                <Stack
                  key={key}
                  direction="row"
                  padding={4}
                  rounded={8}
                  backgroundColor={
                    emitter == "gpt" ? "blackAlpha.200" : "transparent"
                  }
                  spacing={4}
                >
                  <Avatar name={emitter} src={getAvatar()} />
                  <Text
                    whiteSpace="pre-wrap"
                    marginTop=".75em !important"
                    overflow="hidden"
                    dangerouslySetInnerHTML={{
                      __html: decodeUnicode(message).replace(
                        /(?:\r\n|\r|\\n)/g,
                        "</br>"
                      ),
                    }}
                  ></Text>
                </Stack>
              );
            })
          ) : (
            <Instructions onClick={(text) => setValue("input", text)} />
          )}
        </Stack>
      </Stack>
      <Stack
        height="20%"
        padding={4}
        backgroundColor="blackAlpha.400"
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
      >
        <Stack maxWidth="768px" width={"100%"}>
          <Stack flexDirection={"row"}>
            <Input
              autoFocus={true}
              size={"lg"}
              variant="filled"
              inputRightAddon={
                <IconButton
                  aria-label="send_button"
                  icon={!isLoading ? <FiSend /> : <Spinner />}
                  backgroundColor="transparent"
                  onClick={handleSubmit(handleAsk)}
                ></IconButton>
              }
              {...register("input")}
              onSubmit={console.log}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  handleAsk({ input: e.currentTarget.value });
                }
              }}
            />
            <Button
              leftIcon={<FiMail size={32} />}
              borderWidth={1}
              borderColor="whiteAlpha.400"
              rounded={4}
              minHeight={"100%"}
              padding={2}
              justifyContent="flex-start"
              transition="all ease .5s"
              backgroundColor="transparent"
              _hover={{
                backgroundColor: "whiteAlpha.100",
              }}
            ></Button>
          </Stack>

          <Text textAlign="center" fontSize="sm" opacity={0.5}>
            GenIA powered by BBVA Perú
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};
