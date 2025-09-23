package com.example.spring_server.config;

import jakarta.annotation.PostConstruct;
import org.springframework.ai.document.Document;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.simple.JdbcClient;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class HotelLoader {
    private final VectorStore vectorStore;
    private final JdbcClient jdbcClient;

    public HotelLoader(VectorStore vectorStore, JdbcClient jdbcClient) {
        this.vectorStore = vectorStore;
        this.jdbcClient = jdbcClient;
    }

    @Value("classpath:/hotel.txt")
    private Resource resource;

    @PostConstruct
    public void hotelDataLoader() throws Exception {
        Integer count = jdbcClient
                .sql("select count(*) from hotel_store")
                .query(Integer.class).single();
        if (count == null || count == 0) {
            try (BufferedReader br = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
                List<Document> documents = br.lines()
                        .map(Document::new)
                        .collect(Collectors.toList());
                // this(800, 350, 5, 10000, true);
                TokenTextSplitter splitter = new TokenTextSplitter(800, 200, 10, 5000, true);
                for (Document doc : documents) {
                    List<Document> chunks = splitter.split(doc);
                    vectorStore.accept(chunks); // 임베딩, 저장
                    Thread.sleep(200);
                }
            }
            System.out.println("임베딩 완료");
        }
    }
}