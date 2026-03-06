package com.fedf.integrations;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class RemotiveJobClient {

    private final RestTemplateBuilder restTemplateBuilder;

    public List<RemotiveJob> searchJobs(String query) {
        if (query == null || query.isBlank()) {
            return Collections.emptyList();
        }

        RestTemplate restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(8))
                .build();

        String url = "https://remotive.com/api/remote-jobs?search={query}";
        RemotiveResponse response = restTemplate.getForObject(url, RemotiveResponse.class, query);
        if (response == null || response.jobs == null) {
            return Collections.emptyList();
        }
        return response.jobs;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RemotiveResponse {
        @JsonProperty("jobs")
        public List<RemotiveJob> jobs;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RemotiveJob {
        @JsonProperty("title")
        public String title;

        @JsonProperty("company_name")
        public String companyName;

        @JsonProperty("salary")
        public String salary;

        @JsonProperty("url")
        public String url;

        @JsonProperty("category")
        public String category;
    }
}
