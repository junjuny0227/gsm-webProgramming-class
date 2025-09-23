package com.example.spring_server.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HotelController {
    private final VectorStore vectorStore;
    private final ChatClient chatClient;

    public HotelController(VectorStore vectorStore, ChatClient.Builder chatClient) {
        this.vectorStore = vectorStore;
        this.chatClient = chatClient.build();
    }
    // http://localhost:8080/api/hotel
    // POST : { "question" : "질문" }

    @PostMapping("/hotel")
    public String hotel(@RequestBody Map<String, String> question) {
        String ask = question.get("question");
        // 유사도 검색을 수행후에 결과를 가져오는 부분
        // ollama pull nomic-embed-text:latest
        List<Document> results = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(ask)
                        .similarityThreshold(0.5)
                        .topK(2)
                        .build()
        );

        String template = """
                당신은 LuxeStay Hotel의 고객지원 직원입니다.
                한국어로 정중하고 간결하게 응답해주세요.
                컨텍스트(context)에 답이 없으면 "모르겠습니다." 라고 응답해주세요.
                
                컨텍스트
                {context}
                
                질문
                {ask}
                """;

        return chatClient.prompt()
                .user(u -> u.text(template)
                        .param("context", results)
                        .param("ask", ask)
                )
                .call()
                .content();
    }
}