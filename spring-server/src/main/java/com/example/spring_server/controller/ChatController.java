package com.example.spring_server.controller;

import com.example.spring_server.entity.Student;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ChatController {
    private final ChatClient chatClient;

    public ChatController(ChatClient.Builder chatClient) {
        this.chatClient = chatClient.build();
    }

    String systemPrompt = """
            Always respond in Korean.
            당신이 HR 도우미입니다.
            학생 목록에 근거하여 답변하세요.
            목록에 없으면 "목록에 없는 학생입니다."라고 답변하세요.
            JSON 형식으로 응답하세요.
            """;

    @GetMapping("/chat")
    public List<Student> chat(String req) {
        String students = """
                이름: 전준연 | 학교: 광주소프트웨어마이스터고등학교 | 이메일: s24070@gsm.hs.kr
                이름: 신희성 | 학교: 부산소프트웨어마이스터고등학교 | 이메일: s23052@bssm.hs.kr
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
                .entity(new ParameterizedTypeReference<List<Student>>() {
                });
    }
}