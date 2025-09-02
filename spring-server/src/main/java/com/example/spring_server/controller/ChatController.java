package com.example.spring_server.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatController {
    private final ChatClient chatClient;

    public ChatController(ChatClient.Builder chatClient) {
        this.chatClient = chatClient.build();
    }

    @GetMapping("/chat")
    public String chat(String req) {
        String systemPrompt = "Always respond in Korean.";
//        String userPrompt = "I am attending Gwangju Software Meister High School and majoring in front end. {req}";

        String students = """
                이름: 전준연 | 학교: 광주소프트웨어마이스터고등학교
                이름: 신희성 | 학교: 부산소프트웨어마이스터고등학교
                """;

        String userPrompt = """
                [학생목록 시작]
                %s
                [학생목록 끝]
                질문: %s
                """.formatted(students, req);

        return chatClient.prompt()
                .system(systemPrompt)
                .user(userPrompt)
                .call()
                .content();
    }
}

//"I am attending Gwangju Software Meister High School and majoring in front end. {req}"