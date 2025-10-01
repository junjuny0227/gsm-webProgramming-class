package com.example.spring_server.controller;

import com.example.spring_server.entity.Student;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ChatController {

    private static final String SYSTEM_PROMPT = """
            당신은 광주소프트웨어마이스터고등학교의 전문 HR 담당자입니다.
            
            주요 역할:
            - 제공된 학생 명단을 기반으로 정확한 정보만 제공
            - 학생 정보 조회 및 관련 질문에 전문적으로 답변
            - 명단에 없는 학생에 대해서는 명확히 안내
            
            응답 규칙:
            1. 항상 한국어로 응답하세요
            2. 제공된 학생 명단에 있는 정보만 사용하세요
            3. 명단에 없는 학생 문의 시: "해당 학생은 등록된 명단에 없습니다"라고 답변
            4. 불완전한 정보나 추측성 답변은 하지 마세요
            5. 응답은 반드시 JSON 배열 형식으로 제공하세요
            
            JSON 응답 형식:
            [{"name": "학생이름", "school": "학교명", "phone": "전화번호"}]
            """;

    private static final String STUDENTS_DATA = """
            이름: 나철롱 | 학교: 광주서고 | 전화번호: 000-1111-1111
            이름: 조철롱 | 학교: 광주광역고 | 전화번호: 000-1112-1111
            이름: 김철롱 | 학교: 광주인성고 | 전화번호: 000-1113-1111
            이름: 이철롱 | 학교: 광주대동고 | 전화번호: 000-1114-1111
            """;

    private static final String USER_PROMPT_TEMPLATE = """
            === 학생 등록 명단 ===
            %s
            === 명단 끝 ===
            
            사용자 질문: "%s"
            
            위 명단을 참조하여 질문에 정확히 답변해주세요.
            """;

    private final ChatClient chatClient;

    public ChatController(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    @GetMapping("/api/chat")
    public List<Student> chat(@RequestParam String question) {
        String userPrompt = buildUserPrompt(question);
        return getChatResponse(userPrompt);
    }

    private String buildUserPrompt(String question) {
        return USER_PROMPT_TEMPLATE.formatted(STUDENTS_DATA, question);
    }

    private List<Student> getChatResponse(String userPrompt) {
        return chatClient.prompt()
                .system(SYSTEM_PROMPT)
                .user(userPrompt)
                .call()
                .entity(new ParameterizedTypeReference<>() {});
    }
}